const express = require('express');
const { verifyToken } = require('../verifyToken.js');
const { sendMoney } = require('../controllers/transferMoney.js');
const { passbook } = require('../controllers/passbook.js');
const router = express.Router();

router.get('/passbook', verifyToken, passbook);
router.post('/sendmoney', verifyToken, sendMoney);

module.exports = router;
