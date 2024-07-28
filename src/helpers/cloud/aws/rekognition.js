import fs from 'fs';

import AWS from 'aws-sdk';

const ACCESS_KEY_ID = 'xxxxxxxxxx';
const SECRET_KEY_ACCESS = 'xxxxxxxxxx';
const REGION = 'xxxxxxxxxx';
const BUCKET_NAME = 'xxxxxxxxxx';

const config = new AWS.Config({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_KEY_ACCESS,
  region: REGION,
})

const client = new AWS.Rekognition(config);

export const getImageTextFromAws = async (name) => {
  const params = {
    Image: {
      S3Object: {
        Bucket: BUCKET_NAME,
        Name: name
      },
    },
  }
  
  client.detectText(params, function(err, response) {
    if (err) {
      console.log(err, err.stack); // handle error if an error occurred
    } else {
      console.log(response)
      response.TextDetections.forEach(label => {
        console.log(`Detected Text: ${label.DetectedText}`),
        console.log(`Type: ${label.Type}`),
        console.log(`ID: ${label.Id}`),
        console.log(`Parent ID: ${label.ParentId}`),
        console.log(`Confidence: ${label.Confidence}`),
        console.log(`Polygon: `)
        console.log(label.Geometry.Polygon)
      });
    }
  });
};

