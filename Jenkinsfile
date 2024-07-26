pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds' // Docker Hub credentials ID
        GCP_CREDENTIALS = 'gcr-credentials-file' // File credentials ID for GCP service account
        GCP_PROJECT_ID = 'capstone-430018' // Your GCP project ID
        GKE_CLUSTER_NAME = 'jenkins-cluster-1' // Your GKE cluster name
        GKE_CLUSTER_REGION = 'us-central1' // Your GKE cluster region
        K8S_NAMESPACE = 'my-namespace' // Your Kubernetes namespace
        MYSQL_IMAGE = 'gcr.io/capstone-430018/my-mysql:latest'
        RABBITMQ_IMAGE = 'gcr.io/capstone-430018/my-rabbitmq:latest'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Backend Docker Image') {
            steps {
                script {
                    // Build Docker image
                    app = docker.build("azmatpathan/backend:${env.BUILD_ID}", "docker/backend")
                }
            }
        }
        stage('Build MySQL Docker Image') {
            steps {
                script {
                    sh 'cd docker/mysql && docker build -t my-mysql:latest .'
                }
            }
        }
        stage('Build RabbitMQ Docker Image') {
            steps {
                script {
                    sh 'cd docker/rabbitmq && docker build -t my-rabbitmq:latest .'
                }
            }
        }
        stage('Push Backend Docker Image') {
            steps {
                script {
                    // Push Docker image to Docker Hub
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS}") {
                        app.push("${env.BUILD_ID}")
                        app.push("latest")
                    }
                }
            }
        }
        stage('Push MySQL Docker Image') {
            steps {
                script {
                    sh 'docker tag my-mysql:latest gcr.io/capstone-430018/my-mysql:latest'
                    sh 'docker push gcr.io/capstone-430018/my-mysql:latest'
                }
            }
        }
        stage('Push RabbitMQ Docker Image') {
            steps {
                script {
                    sh 'docker tag my-rabbitmq:latest gcr.io/capstone-430018/my-rabbitmq:latest'
                    sh 'docker push gcr.io/capstone-430018/my-rabbitmq:latest'
                }
            }
        }
        stage('Authenticate with GKE') {
            steps {
                script {
                    // Authenticate with Google Cloud
                    withCredentials([file(credentialsId: "${GCP_CREDENTIALS}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        sh "gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} --region ${GKE_CLUSTER_REGION} --project ${GCP_PROJECT_ID}"
                    }
                }
            }
        }
        stage('Create Namespace') {
            steps {
                script {
                    // Create namespace if it doesn't exist
                    sh """
                    if ! kubectl get namespace ${K8S_NAMESPACE}; then
                        kubectl create namespace ${K8S_NAMESPACE}
                    fi
                    """
                }
            }
        }
        stage('Deploy Backend to Kubernetes') {
            steps {
                script {
                    // Apply the backend deployment and service configurations
                    sh "kubectl apply -f k8s/backend/backend-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f k8s/backend/backend-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Deploy MySQL to Kubernetes') {
            steps {
                script {
                    // Apply the MySQL deployment and service configurations
                    sh "kubectl apply -f k8s/mysql/mysql-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f k8s/mysql/mysql-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Deploy RabbitMQ to Kubernetes') {
            steps {
                script {
                    // Apply the RabbitMQ deployment and service configurations
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    // Check the deployment status
                    sh "kubectl rollout status deployment/backend --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/mysql --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/rabbitmq --namespace=${K8S_NAMESPACE}"
                    
                    // Check the service status
                    sh "kubectl get services backend-service --namespace=${K8S_NAMESPACE}"
                    sh "kubectl get services mysql --namespace=${K8S_NAMESPACE}"
                    sh "kubectl get services rabbitmq --namespace=${K8S_NAMESPACE}"
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
