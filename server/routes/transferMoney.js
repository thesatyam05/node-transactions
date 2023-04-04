const express = require('express');
const { verifyToken } = require('../verifyToken.js');
const { sendMoney } = require('../controllers/transferMoney.js');
const router = express.Router();

router.post('/sendmoney', verifyToken, sendMoney);

module.exports = router;
