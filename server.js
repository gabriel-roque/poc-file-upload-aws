require('dotenv').config();

const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const multer = require('multer');

// Express config
const app = express();
app.use(cors());
app.use(express.json());

// Digital Ocean or AWS Config
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DO_ACCESS_SECRET_KEY,
});

// Multer Storage Memory Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload filte
app.post('/upload', upload.single('file'), (req, res) => {
  // Get extension file
  const extension = req.file.originalname.match(/\.[0-9a-z]+$/m)[0];

  var params = {
    Bucket: process.env.DO_BUCKET,
    Key: `products-images/${uuid.v4()}.${extension}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: 'public-read',
  };

  s3.putObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });

  res.json({ ...req.file });
});

app.listen(3333, () => console.log('Server listen'));
