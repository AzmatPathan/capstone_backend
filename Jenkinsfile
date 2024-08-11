pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'  // Docker Hub credentials ID in Jenkins
        DOCKERHUB_USERNAME = 'azmatpathan'
        GCP_CREDENTIALS = 'gcp-credentials'
        GCP_PROJECT_ID = 'my-first-project-431720'
        REGION = 'us-central1'  // Cloud Run region
        RABBITMQ_IMAGE = "${DOCKERHUB_USERNAME}/rabbitmq"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/backend"
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        RABBITMQ_URL = "https://rabbitmq-service-${GIT_COMMIT}-${REGION}.run.app"  // Cloud Run URL for RabbitMQ
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
                    }
                }
            }
        }
        stage('Build and Push RabbitMQ Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // Build and push the RabbitMQ Docker image to Docker Hub
                        sh "docker build --no-cache -t ${RABBITMQ_IMAGE}:${GIT_COMMIT} -f docker/rabbitmq/Dockerfile ."
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${RABBITMQ_IMAGE}:${GIT_COMMIT}"
                    }

                    // Deploy RabbitMQ to Cloud Run
                    sh """
                    gcloud run deploy rabbitmq-service \
                        --image ${RABBITMQ_IMAGE}:${GIT_COMMIT} \
                        --platform managed \
                        --region ${REGION} \
                        --allow-unauthenticated
                    """
                }
            }
        }
        stage('Build and Push Backend Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // Build and push the backend Docker image to Docker Hub
                        sh "docker build --no-cache -t ${BACKEND_IMAGE}:${GIT_COMMIT} -f docker/backend/Dockerfile ."
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${BACKEND_IMAGE}:${GIT_COMMIT}"
                    }

                    // Deploy Backend to Cloud Run
                    sh """
                    gcloud run deploy backend-service \
                        --image ${BACKEND_IMAGE}:${GIT_COMMIT} \
                        --platform managed \
                        --region ${REGION} \
                        --allow-unauthenticated \
                        --set-env-vars RABBITMQ_URL=${RABBITMQ_URL}
                    """
                }
            }
        }
    }
    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
