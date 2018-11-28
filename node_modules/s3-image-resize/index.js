const sharp = require('sharp');
const AWS = require('aws-sdk');
const request = require('request').defaults({ encoding: null });

const getImageBuffer = s3Url => (
  new Promise((resolve, reject) => {
    request.get(s3Url, (err, response, buffer) => err ? reject(err) : resolve(buffer));
  })
);

const uploadToS3 = (s3, Bucket, Key, ACL, Body) => (
  new Promise((resolve, reject) => {
    const params = { Bucket, Key, ACL, Body };
    s3.putObject(params, (s3PutError, response) => s3PutError ? reject(s3PutError) : resolve());
  })
);

module.exports = (width, height, s3Url, Bucket, Key, ACL, accessKeyId, secretAccessKey) => {
  const s3 = new AWS.S3({ accessKeyId, secretAccessKey });
  return getImageBuffer(s3Url)
    .then(buffer => sharp(buffer).resize(width, height).toBuffer())
    .then(imageBuffer => uploadToS3(s3, Bucket, Key, ACL, imageBuffer))
};
