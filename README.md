# Capstone Backend

## Description

This is the backend component of the Capstone project. It provides the server-side logic and API endpoints for managing inventory data.

## Installation

1. Clone the repository:
git clone https://github.com/your-username/capstone-backend.git


2. Navigate to the project directory:
cd capstone-backend


3. Install dependencies:
npm install


4. Start the server:
npm start


> NOTE: For GCP integration\
>       Please create key file from google project\
>       enable cloud vision API. Paste you keys to file keys.json.\
>       API - http://localhost:5000/api/clouds/getImageTranslation?ImageName=IMG_3035.JPG



>For GCP services deployment or local

-Step 1: Go to [GCP console](https://console.cloud.google.com/)
-Step 2: Create your project.
-Step 3: Create project keys file as json extension to authenticate apis.
-Step 4: Add credentials to keys.json file in root of [capstone_backend directory](https://github.com/AzmatPathan/capstone_backend/blob/main/keys.json)

-Step 5: Go to [vertex API enable steps](https://cloud.google.com/vertex-ai/docs/start/cloud-environment)
-Step 6: Enable the Vertex AI API
-Step 7: Similarly enable [cloud vision api](https://console.cloud.google.com/marketplace/product/google/vision.googleapis.com?) for you project
-Step 8: Add Key to system profile
    -nano ~/.bashrc
    -export GOOGLE_APPLICATION_CREDENTIALS="/path/to/file/service-account-key.json"
    -source ~/.bashrc

