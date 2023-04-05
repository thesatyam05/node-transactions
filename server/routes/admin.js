const express = require('express');
const { verifyToken } = require('../verifyToken.js');
const router = express.Router();
const { allTransactions } = require('../controllers/allTransactions.js');
const { allUsers } = require('../controllers/allUsers.js');
const { checkAdminRole } = require('../checkAdminRole.js');

router.get('/alltransactions', verifyToken, checkAdminRole('admin'), allTransactions);
router.get('/userdata', verifyToken, checkAdminRole('admin'), allUsers);

module.exports = router;
