pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'
        GCP_CREDENTIALS = 'gcr-credentials-file'
        GCP_PROJECT_ID = 'capstone-430018'
        GKE_CLUSTER_NAME = 'jenkins-cluster-1'
        GKE_CLUSTER_REGION = 'us-central1'
        K8S_NAMESPACE = 'my-namespace'
        VPC_NETWORK = 'capstone-vpc'
        SUBNETWORK = 'capstone-subnet'
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
        stage('Update GKE Cluster Network') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${GCP_CREDENTIALS}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        sh "gcloud container clusters update ${GKE_CLUSTER_NAME} --region ${GKE_CLUSTER_REGION} --network ${VPC_NETWORK} --subnetwork ${SUBNETWORK}"
                    }
                }
            }
        }
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Docker Image') {
                    steps {
                        script {
                            def app = docker.build("${BACKEND_IMAGE}:${env.BUILD_ID}", "-f docker/backend/Dockerfile .")
                        }
                    }
                }
                stage('Build MySQL Docker Image') {
                    steps {
                        script {
                            sh 'docker build -t my-mysql:latest docker/mysql'
                        }
                    }
                }
                stage('Build RabbitMQ Docker Image') {
                    steps {
                        script {
                            sh 'docker build -t my-rabbitmq:latest docker/rabbitmq'
                        }
                    }
                }
            }
        }
        stage('Push Docker Images') {
            parallel {
                stage('Push Backend Docker Image') {
                    steps {
                        script {
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
                            sh 'docker tag my-mysql:latest ${MYSQL_IMAGE}'
                            sh 'docker push ${MYSQL_IMAGE}'
                        }
                    }
                }
                stage('Push RabbitMQ Docker Image') {
                    steps {
                        script {
                            sh 'docker tag my-rabbitmq:latest ${RABBITMQ_IMAGE}'
                            sh 'docker push ${RABBITMQ_IMAGE}'
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
        stage('Create Namespace') {
            steps {
                script {
                    sh """
                    kubectl get namespace ${K8S_NAMESPACE} || kubectl create namespace ${K8S_NAMESPACE}
                    """
                }
            }
        }
        stage('Deploy to Kubernetes') {
            parallel {
                stage('Deploy Backend') {
                    steps {
                        script {
                            sh "kubectl apply -f k8s/backend/backend-deployment.yaml --namespace=${K8S_NAMESPACE}"
                            sh "kubectl apply -f k8s/backend/backend-service.yaml --namespace=${K8S_NAMESPACE}"
                        }
                    }
                }
                stage('Deploy MySQL') {
                    steps {
                        script {
                            sh "kubectl apply -f k8s/mysql/mysql-deployment.yaml --namespace=${K8S_NAMESPACE}"
                            sh "kubectl apply -f k8s/mysql/mysql-service.yaml --namespace=${K8S_NAMESPACE}"
                        }
                    }
                }
                stage('Deploy RabbitMQ') {
                    steps {
                        script {
                            sh "kubectl apply -f k8s/rabbitmq/rabbitmq-deployment.yaml --namespace=${K8S_NAMESPACE}"
                            sh "kubectl apply -f k8s/rabbitmq/rabbitmq-service.yaml --namespace=${K8S_NAMESPACE}"
                        }
                    }
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    sh "kubectl rollout status deployment/backend-deployment --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/mysql --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/rabbitmq --namespace=${K8S_NAMESPACE}"
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
