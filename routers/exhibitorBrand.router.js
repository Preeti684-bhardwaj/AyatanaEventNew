const express = require('express');
const exhibitorBrandController = require('../controllers/exhibitorBrand.controller');

const router = express.Router();

// Delegate routing to the controller
router.use('/', exhibitorBrandController.router);

module.exports = router;

