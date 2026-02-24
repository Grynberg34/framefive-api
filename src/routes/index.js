const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.status(201).json('Welcome')
});


module.exports = router;
