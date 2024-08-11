pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'  // Docker Hub credentials ID in Jenkins
        DOCKERHUB_USERNAME = 'azmatpathan'
        GCP_CREDENTIALS = 'gcp-credentials'
        GCP_PROJECT_ID = 'my-first-project-431720'
        GKE_CLUSTER_NAME = 'backend-cluster'
        GKE_CLUSTER_REGION = 'us-central1'
        K8S_NAMESPACE = 'my-namespace'
        VPC_CONNECTOR = 'my-vpc-connector' // VPC connector name for Cloud Run
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/backend"
        RABBITMQ_IMAGE = "${DOCKERHUB_USERNAME}/rabbitmq"
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        RABBITMQ_URL = 'amqp://rabbitmq-service'
    }
    stages {
        // Steps to build and deploy RabbitMQ to GKE
        stage('Deploy RabbitMQ to GKE') {
            steps {
                script {
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        // Steps to build and deploy Backend to Cloud Run
        stage('Deploy Backend to Cloud Run') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // Build and push the backend Docker image to Docker Hub
                        sh "docker build --no-cache -t ${BACKEND_IMAGE}:${GIT_COMMIT} -f docker/backend/Dockerfile ."
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${BACKEND_IMAGE}:${GIT_COMMIT}"
                    }

                    // Deploy to Cloud Run
                    sh """
                    gcloud run deploy backend-service \
                        --image ${BACKEND_IMAGE}:${GIT_COMMIT} \
                        --platform managed \
                        --region ${GKE_CLUSTER_REGION} \
                        --allow-unauthenticated \
                        --vpc-connector ${VPC_CONNECTOR} \
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
