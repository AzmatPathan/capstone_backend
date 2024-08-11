pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'
        DOCKERHUB_USERNAME = 'azmatpathan'
        GCP_CREDENTIALS = 'gcp-credentials'
        GCP_PROJECT_ID = 'my-first-project-431720'
        GKE_CLUSTER_NAME = 'backend-cluster'
        GKE_CLUSTER_REGION = 'us-central1'
        K8S_NAMESPACE = 'my-namespace'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/backend"
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        RABBITMQ_SERVICE_NAME = 'my-rabbitmq'
        RABBITMQ_USERNAME = 'myuser'
        RABBITMQ_PASSWORD = 'mypassword'
        RABBITMQ_ERLANG_COOKIE = 'secretcookie'
        RABBITMQ_PORT = 5672
        RABBITMQ_HOST = "${RABBITMQ_SERVICE_NAME}.${K8S_NAMESPACE}.svc.cluster.local"
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
        stage('Deploy RabbitMQ to GKE') {
            steps {
                script {
                    sh """
                    helm repo add bitnami https://charts.bitnami.com/bitnami
                    helm repo update
                    helm install ${RABBITMQ_SERVICE_NAME} bitnami/rabbitmq \
                        --set auth.username=${RABBITMQ_USERNAME} \
                        --set auth.password=${RABBITMQ_PASSWORD} \
                        --set auth.erlangCookie=${RABBITMQ_ERLANG_COOKIE} \
                        --set persistence.enabled=false \
                        --namespace ${K8S_NAMESPACE}
                    """
                }
            }
        }
        stage('Deploy Backend to Cloud Run') {
            steps {
                script {
                    // Deploy the backend service to Cloud Run with RabbitMQ environment variables
                    sh """
                    gcloud run deploy backend-service \
                        --image ${BACKEND_IMAGE}:${GIT_COMMIT} \
                        --platform managed \
                        --region ${GKE_CLUSTER_REGION} \
                        --allow-unauthenticated \
                        --set-env-vars RABBITMQ_HOST=${RABBITMQ_HOST},RABBITMQ_PORT=${RABBITMQ_PORT},RABBITMQ_USERNAME=${RABBITMQ_USERNAME},RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD}
                    """
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                script {
                    sh "kubectl get pods --namespace ${K8S_NAMESPACE}"
                    sh "gcloud run services describe backend-service --region ${GKE_CLUSTER_REGION} --platform managed"
                }
            }
        }
    }
    post {
        success {
            echo 'RabbitMQ deployed on GKE and backend service deployed to Cloud Run successfully!'
        }
        failure {
            echo 'Deployment failed!'
            // Optional: Add cleanup or rollback steps if needed
        }
    }
}
