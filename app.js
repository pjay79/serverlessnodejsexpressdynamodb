
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => { 
 res.status(200).send('Hello Serverless!')
})

app.post('/users', function (req, res) {
  const { userId, name } = req.body;
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not create user ${name}` });
    }
    res.json({ userId, name });
  })
})

app.get('/users/:userId', function (req, res) {
  const { userId } = req.params.userId;
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: userId,
    },
  }
  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not get user ${userId}` });
    }
    if (result.Item) {
      const { userId, name } = result.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: `User ${userId} not found` });
    }
  })
})

module.exports.server = serverless(app);