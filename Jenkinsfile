pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds' // Docker Hub credentials ID
        GCP_CREDENTIALS = 'gcr-credentials' // GCP service account credentials ID
        GCP_PROJECT_ID = 'capstone-430018' // Your GCP project ID
        GKE_CLUSTER_NAME = 'jenkins-cluster-1' // Your GKE cluster name
        GKE_CLUSTER_REGION = 'us-central1' // Your GKE cluster region
        K8S_DEPLOYMENT = 'backend-deployment' // Your Kubernetes deployment name
        K8S_NAMESPACE = 'my-namespace' // Your Kubernetes namespace
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
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply the deployment and service configurations
                    sh "kubectl apply -f backend-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f backend-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    // Check the deployment status
                    sh "kubectl rollout status deployment/${K8S_DEPLOYMENT} --namespace=${K8S_NAMESPACE}"
                    
                    // Check the service status
                    sh "kubectl get services backend-service --namespace=${K8S_NAMESPACE}"
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
