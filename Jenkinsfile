pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds' // Docker Hub credentials ID
        KUBERNETES_CREDENTIALS = 'default-service-account' // Kubernetes credentials ID
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    app = docker.build("azmatpathan/backend:${env.BUILD_ID}")
                }
            }
        }
        stage('Push Docker Image') {
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
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply the deployment and service configurations
                    sh "kubectl apply -f backend-deployment.yaml"
                    sh "kubectl apply -f backend-service.yaml"
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    // Check the deployment status
                    sh "kubectl rollout status deployment/backend-deployment"
                    
                    // Check the service status
                    sh "kubectl get services backend-service"
                }
            }
        }
    }
}
