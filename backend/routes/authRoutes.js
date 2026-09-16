const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/autentificacion', authController.login);

module.exports = router;
