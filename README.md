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


## GCP services deployment or local

1. **Go to GCP console**
2. **Create your project**
3. **Create project keys file as a `.json` extension to authenticate APIs**
4. **Add credentials to `keys.json` file in the root of the `capstone_backend` directory**

5. **Go to Vertex AI API enable steps**
   - Enable the Vertex AI API
     
6. **Similarly, enable the Cloud Vision API for your project**

6. **Add Key to system profile**
   - Open the terminal and edit your `.bashrc` file:
     ```bash
     nano ~/.bashrc
     ```
   - Add the following line:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/file/service-account-key.json"
     ```
   - Save the file and reload the shell:
     ```bash
     source ~/.bashrc
     ```

