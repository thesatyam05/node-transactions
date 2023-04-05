const express = require('express');
const { verifyToken } = require('../verifyToken.js');
const router = express.Router();
const { allTransactions } = require('../controllers/allTransactions.js');
const { allUsers } = require('../controllers/allUsers.js');

router.get('/alltransactions', verifyToken, allTransactions);
router.get('/userdata', verifyToken, allUsers);

module.exports = router;
