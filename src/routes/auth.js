const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/google', authController.authenticate);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

module.exports = router;