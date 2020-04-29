
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', async (req, res, next) => { 
 res.status(200).send('Hello Serverless!')
})

app.post('/users/', function (req, res) {
  const { userId, name } = req.body;
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };
  dynamoDb.put(params, (err) => {
    if (err) {
      return res.status(400).json(error);
    }
    return res.status(200).json({ userId, name });
  })
})

app.get('/users/:userId', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }
  dynamoDb.get(params, (err, data) => {
    if (err) {
      return res.status(400).json(error);
    }
    if (data.Item) {
      return res.status(200).json(data.Item);
    } else {
      return res.status(404).json(error);
    }
  })
})

app.get('/users', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
  }
  dynamoDb.scan(params, (err, data) => {
    if (err) {
      return res.status(404).json(error);
    }
    return res.status(200).json(data.Items);
  })
})

module.exports.server = serverless(app);