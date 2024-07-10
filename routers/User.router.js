const express = require('express');
const UserController = require('../controllers/User.controller');

const router = express.Router();

// Delegate routing to the controller
router.use('/', UserController.router);

module.exports = router;

