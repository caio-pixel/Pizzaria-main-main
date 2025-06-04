const express = require('express');
const { login } = require('../controllers/authenticationController');
const router = express.Router();

// Rota para login
router.post('/login', login);

module.exports = router;