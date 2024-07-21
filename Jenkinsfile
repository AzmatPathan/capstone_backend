pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds' // Docker Hub credentials ID
        KUBERNETES_CREDENTIALS = 'kubernetes-server' // Kubernetes credentials ID
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
                    // Use Kubernetes credentials
                    withKubeConfig([credentialsId: "${KUBERNETES_CREDENTIALS}"]) {
                        sh "kubectl apply -f backend-deployment.yaml"
                        sh "kubectl apply -f backend-service.yaml"
                    }
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    withKubeConfig([credentialsId: "${KUBERNETES_CREDENTIALS}"]) {
                        sh "kubectl rollout status deployment/backend-deployment"
                        sh "kubectl get services backend-service"
                    }
                }
            }
    }
}
