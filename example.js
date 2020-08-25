require('dotenv').config()

const AWS = require('aws-sdk');
const fs = require('fs')
const uuid = require('uuid')

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DO_ACCESS_SECRET_KEY,
});

const file = fs.readFileSync(`${__dirname}/cake.jpeg`)

// CREATE FILE
var params = {
  Bucket: process.env.DO_BUCKET,
  Key: `products-images/${uuid.v4()}.jpeg`,
  Body: file,
  ContentType: 'image/jpeg',
  ACL: "public-read"
};


s3.putObject(params, function (err, data) {
  if (err) console.log(err, err.stack);
  else console.log(data);
});

// LIST FILES
// var params = {
//   Bucket: process.env.DO_BUCKET,
// };

// s3.listObjects(params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   else {
//     data['Contents'].forEach(function (obj) {
//       console.log(obj['Key']);
//     })
//   };
// });

// DELETE FILE
// var params = {
//   Bucket: process.env.DO_BUCKET,
//   Key: "products-images/37a5a8f6-d584-41f2-a3cd-dba613155052.jpeg"
// };

// s3.deleteObject(params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   else console.log(data);
// });

