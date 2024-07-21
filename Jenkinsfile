pipeline {
    agent any // Use any available agent to run the pipeline
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds' // Credentials ID for Docker Hub (set in Jenkins)
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm // Checkout the source code from the SCM repository
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image and tag it with the BUILD_ID and "latest"
                    app = docker.build("your-dockerhub-repo/backend:${env.BUILD_ID}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker Hub and push the built image
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS}") {
                        app.push("${env.BUILD_ID}") // Push image tagged with BUILD_ID
                        app.push("latest") // Push image tagged with "latest"
                    }
                }
            }
        }
    }
}
