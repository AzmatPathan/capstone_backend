pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'  // Docker Hub credentials ID in Jenkins
        DOCKERHUB_USERNAME = 'azmatpathan'
        GCP_CREDENTIALS = 'gcp-credentials'
        GCP_PROJECT_ID = 'my-first-project-431720'
        CLOUD_RUN_SERVICE_NAME = 'backend-service'  // Cloud Run Service Name
        CLOUD_RUN_REGION = 'us-central1'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/backend"
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Authenticate with GCP') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${GCP_CREDENTIALS}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        sh "gcloud config set run/region ${CLOUD_RUN_REGION}"
                    }
                }
            }
        }
        stage('Build and Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // Build and push the backend Docker image to Docker Hub
                        sh "docker build --no-cache -t ${BACKEND_IMAGE}:${GIT_COMMIT} -f docker/backend/Dockerfile ."
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${BACKEND_IMAGE}:${GIT_COMMIT}"
                    }
                }
            }
        }
        stage('Deploy to Cloud Run') {
            steps {
                script {
                    sh '''
                    gcloud run deploy $CLOUD_RUN_SERVICE_NAME \
                        --image gcr.io/$GCP_PROJECT_ID/$BACKEND_IMAGE:$GIT_COMMIT \
                        --platform managed \
                        --region $CLOUD_RUN_REGION \
                        --allow-unauthenticated
                    '''
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    sh "gcloud run services describe $CLOUD_RUN_SERVICE_NAME --region $CLOUD_RUN_REGION --platform managed"
                }
            }
        }
    }
    post {
        success {
            echo 'Deployment to Cloud Run succeeded!'
        }
        failure {
            echo 'Deployment failed!'
            // Optional: Add cleanup or rollback steps if needed
        }
    }
}
