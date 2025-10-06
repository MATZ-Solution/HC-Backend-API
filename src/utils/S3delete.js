const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-v2');
const config = require('../config/s3');
const s3 = new aws.S3({
  accessKeyId:config.awsAccessKeyId, 
  secretAccessKey: config.awsSecretAccessKey,
  region:config.region,
});

const deleteFromS3 = async (fileUrl) => {

    console.log(fileUrl,"fileUrl")
  if (!fileUrl) return;
  const key = fileUrl.split(".com/")[1]; // extract the object key
  try {
    await s3
      .deleteObject({
        Bucket: config.bucketName,
        Key: key,
      })
      .promise();
    console.log("Deleted old file:", key);
  } catch (err) {
    console.error("Error deleting old file:", err);
  }
};

module.exports = { deleteFromS3 };
