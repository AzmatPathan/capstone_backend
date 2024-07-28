pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'
        GCP_CREDENTIALS = 'gcr-credentials-file'
        GCP_PROJECT_ID = 'capstone-430018'
        GKE_CLUSTER_NAME = 'jenkins-cluster-1'
        GKE_CLUSTER_REGION = 'us-central1'
        K8S_NAMESPACE = 'my-namespace'
        VPC_NETWORK = 'telus-itms'
        SUBNETWORK = 'subnet-1'
        BACKEND_IMAGE = 'azmatpathan/backend'
        MYSQL_IMAGE = 'gcr.io/capstone-430018/my-mysql:latest'
        RABBITMQ_IMAGE = 'gcr.io/capstone-430018/my-rabbitmq:latest'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Authenticate with GCR') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${GCP_CREDENTIALS}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh 'gcloud auth configure-docker'
                    }
                }
            }
        }
        stage('Check GKE Cluster') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${GCP_CREDENTIALS}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        
                        def clusterExists = sh(script: "gcloud container clusters list --filter=name=${GKE_CLUSTER_NAME} --region=${GKE_CLUSTER_REGION} --format='value(name)'", returnStdout: true).trim()
                        
                        if (clusterExists) {
                            echo "Cluster exists, updating..."
                            sh """
                            gcloud container clusters update ${GKE_CLUSTER_NAME} \
                            --region ${GKE_CLUSTER_REGION} \
                            --enable-ip-alias \
                            --network ${VPC_NETWORK} \
                            --subnetwork ${SUBNETWORK} \
                            --project ${GCP_PROJECT_ID}
                            """
                        } else {
                            echo "Cluster does not exist, creating..."
                            sh """
                            gcloud container clusters create ${GKE_CLUSTER_NAME} \
                            --region ${GKE_CLUSTER_REGION} \
                            --enable-ip-alias \
                            --network ${VPC_NETWORK} \
                            --subnetwork ${SUBNETWORK} \
                            --project ${GCP_PROJECT_ID}
                            """
                        }
                    }
                }
            }
        }
        stage('Authenticate with GKE') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${GCP_CREDENTIALS}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        sh "gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} --region ${GKE_CLUSTER_REGION} --project ${GCP_PROJECT_ID}"
                    }
                }
            }
        }
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Docker Image') {
                    steps {
                        script {
                            def app = docker.build("${BACKEND_IMAGE}:${env.BUILD_ID}")
                            app.push("${env.BUILD_ID}")
                            app.push("latest")
                        }
                    }
                }
                stage('Build MySQL Docker Image') {
                    steps {
                        script {
                            def mysql = docker.build("my-mysql:latest", "docker/mysql")
                            sh 'docker tag my-mysql:latest ${MYSQL_IMAGE}'
                            sh 'docker push ${MYSQL_IMAGE}'
                        }
                    }
                }
                stage('Build RabbitMQ Docker Image') {
                    steps {
                        script {
                            def rabbitmq = docker.build("my-rabbitmq:latest", "docker/rabbitmq")
                            sh 'docker tag my-rabbitmq:latest ${RABBITMQ_IMAGE}'
                            sh 'docker push ${RABBITMQ_IMAGE}'
                        }
                    }
                }
            }
        }
        stage('Create Namespace') {
            steps {
                script {
                    sh """
                    kubectl get namespace ${K8S_NAMESPACE} || kubectl create namespace ${K8S_NAMESPACE}
                    """
                }
            }
        }
        stage('Deploy Backend to Kubernetes') {
            steps {
                script {
                    // Apply backend deployment and service configurations with rolling updates
                    sh "kubectl apply -f k8s/backend/backend-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/backend-deployment --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Deploy MySQL to Kubernetes') {
            steps {
                script {
                    // Apply MySQL deployment and service configurations with rolling updates
                    sh "kubectl apply -f k8s/mysql/mysql-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/mysql --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Deploy RabbitMQ to Kubernetes') {
            steps {
                script {
                    // Apply RabbitMQ deployment and service configurations with rolling updates
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/rabbitmq --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    sh "kubectl get services --namespace=${K8S_NAMESPACE}"
                    sh "kubectl get pods --namespace=${K8S_NAMESPACE}"
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
