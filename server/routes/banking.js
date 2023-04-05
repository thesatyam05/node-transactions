const express = require('express');
const { verifyToken } = require('../verifyToken.js');
const { sendMoney, passbook } = require('../controllers/banking.js');
const router = express.Router();

router.get('/passbook', verifyToken, passbook);
router.post('/sendmoney', verifyToken, sendMoney);

module.exports = router;
