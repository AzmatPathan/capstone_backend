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
        RABBITMQ_IMAGE = 'gcr.io/capstone-430018/my-rabbitmq'
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
                        sh 'gcloud auth configure-docker'
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                    }
                }
            }
        }
        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Build and push the backend Docker image
                    dir('docker/backend') {
                        sh "docker build -t ${BACKEND_IMAGE}:${GIT_COMMIT} ."
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                            sh "docker push ${BACKEND_IMAGE}:${GIT_COMMIT}"
                        }
                    }
                    // Build and push the RabbitMQ Docker image
                    dir('docker/rabbitmq') {
                        sh "docker build -t ${RABBITMQ_IMAGE}:${GIT_COMMIT} ."
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                            sh "docker push ${RABBITMQ_IMAGE}:${GIT_COMMIT}"
                        }
                    }
                }
            }
        }
        stage('Manage GKE Cluster') {
            steps {
                script {
                    def clusterExists = sh(script: "gcloud container clusters describe ${GKE_CLUSTER_NAME} --region ${GKE_CLUSTER_REGION} --project ${GCP_PROJECT_ID}", returnStatus: true) == 0
                    if (clusterExists) {
                        echo "Cluster exists. Skipping update."
                    } else {
                        echo "Cluster does not exist. Creating..."
                        sh """
                            gcloud container clusters create ${GKE_CLUSTER_NAME} \
                            --region ${GKE_CLUSTER_REGION} \
                            --enable-ip-alias \
                            --network ${VPC_NETWORK} \
                            --subnetwork ${SUBNETWORK} \
                            --machine-type n1-standard-1 \
                            --num-nodes 1 \
                            --disk-type pd-standard \
                            --disk-size 50 \
                            --project ${GCP_PROJECT_ID}
                        """
                    }
                }
            }
        }
        stage('Authenticate with GKE') {
            steps {
                script {
                    sh "gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} --region ${GKE_CLUSTER_REGION} --project ${GCP_PROJECT_ID}"
                }
            }
        }
        stage('Create Namespace') {
            steps {
                script {
                    sh "kubectl get namespace ${K8S_NAMESPACE} || kubectl create namespace ${K8S_NAMESPACE}"
                }
            }
        }
        stage('Install Ingress Controller') {
            steps {
                script {
                    sh '''
                    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
                    helm repo update
                    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx --namespace $K8S_NAMESPACE --set controller.publishService.enabled=true
                    '''
                }
            }
        }
        stage('Install Cert-Manager') {
            steps {
                script {
                    sh '''
                    kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.13.0/cert-manager.crds.yaml
                    helm repo add jetstack https://charts.jetstack.io
                    helm repo update
                    helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace
                    '''
                }
            }
        }
        stage('Create ClusterIssuer') {
            steps {
                script {
                    sh 'kubectl apply -f k8s/cluster-issuer.yaml'
                }
            }
        }
        stage('Create Certificate') {
            steps {
                script {
                    sh 'kubectl apply -f k8s/backend/backend-certificate.yaml --namespace=${K8S_NAMESPACE}'
                }
            }
        }
        stage('Deploy Backend to Kubernetes') {
            steps {
                script {
                    // Update the deployment YAML with the new Docker image tag
                    sh "sed -i 's|image: ${BACKEND_IMAGE}:latest|image: ${BACKEND_IMAGE}:${GIT_COMMIT}|' k8s/backend/backend-deployment.yaml"

                    sh "kubectl apply -f k8s/backend/backend-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f k8s/backend/backend-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Deploy RabbitMQ to Kubernetes') {
            steps {
                script {
                    // Update the deployment YAML with the new Docker image tag
                    sh "sed -i 's|image: ${RABBITMQ_IMAGE}:latest|image: ${RABBITMQ_IMAGE}:${GIT_COMMIT}|' k8s/rabbitmq/rabbitmq-deployment.yaml"
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-deployment.yaml --namespace=${K8S_NAMESPACE}"
                    sh "kubectl apply -f k8s/rabbitmq/rabbitmq-service.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Apply Ingress Configuration') {
            steps {
                script {
                    sh "kubectl apply -f k8s/backend/backend-ingress.yaml --namespace=${K8S_NAMESPACE}"
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    sh "kubectl rollout status deployment/backend-deployment --namespace=${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/rabbitmq --namespace=${K8S_NAMESPACE}"
                    sh "kubectl get services backend-service --namespace=${K8S_NAMESPACE}"
                    sh "kubectl get services rabbitmq --namespace=${K8S_NAMESPACE}"
                    sh "kubectl describe ingress backend-ingress --namespace=${K8S_NAMESPACE}"
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
            // Optional: Add cleanup or rollback steps if needed
        }
    }
}
