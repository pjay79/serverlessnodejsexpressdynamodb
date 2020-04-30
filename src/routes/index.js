const express = require('express');
const router = express.Router();
const app = express();

const controller = require('../controllers');

router.get('/users', controller.allUsers);
router.post('/users/', controller.createUser);
router.get('/users/:userId', controller.getUser);
router.put('/users/:userId', controller.updateUser);
router.delete('/users/:userId', controller.deleteUser);

module.exports = router;