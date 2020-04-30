const express = require('express');
const router = express.Router();
const app = express();

const userController = require('../controllers/userController');

router.get('/users', userController.allUsers);
router.post('/users/', userController.createUser);
router.get('/users/:userId', userController.getUser);
router.put('/users/:userId', userController.updateUser);
router.delete('/users/:userId', userController.deleteUser);

module.exports = router;