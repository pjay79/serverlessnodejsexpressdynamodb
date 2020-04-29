
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

app.get('/users', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
  }
  dynamoDb.scan(params, (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    return res.status(200).json(data.Items);
  })
})

app.post('/users/', (req, res) => {
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
      return res.status(400).json(err);
    }
    return res.status(200).json({ userId, name });
  })
})

app.get('/users/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }
  dynamoDb.get(params, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (data.Item) {
      return res.status(200).json(data.Item);
    } else {
      return res.status(404).json(err);
    }
  })
})

app.put('/users/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
      UpdateExpression: 'set name = :newname',
      ExpressionAttributeValues: { ':newname': req.body.name }
    },
  }
  dynamoDb.update(params, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(data);
  })
})

app.delete('/users/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }
  dynamoDb.delete(params, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json({ userId: req.params.userId }); 
  })
})

module.exports.server = serverless(app);