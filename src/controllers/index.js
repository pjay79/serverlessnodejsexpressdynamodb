const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const allUsers = (req, res) => {
  const params = {
    TableName: USERS_TABLE,
  }
  dynamoDb.scan(params, (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    return res.status(200).json(data.Items);
  })
}

const createUser = (req, res) => {
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
    return res.status(200).json({
      status: 200,
      message: 'User added',
      userId,
      name,
    });
  })
}

const getUser = (req, res) => {
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
      return res.status(200).json({
        status: 200,
        message: 'OK',
        data: data.Item,
      });
    } else {
      return res.status(404).json(err);
    }
  })
}

const updateUser = (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
    UpdateExpression: 'set #newname = :newname',
    ExpressionAttributeValues: {
      ':newname': req.body.name,
    },
    ExpressionAttributeNames: {
      "#newname": "name",
    }
  }
  dynamoDb.update(params, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({
      status: 200,
      message: `Update successful`,
      userId: req.params.userId,
    });
  })
}

const deleteUser = (req, res) => {
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
    return res.status(200).json({
      status: 200,
      message: `Delete successful`,
      userId: req.params.userId,
    }); 
  })
}

module.exports = {
  allUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
}