const express = require('express');
const { signin, signup } = require('../controllers/auth.js');

const router = express.Router();

//CREATE A USER
router.post('/signup', signup);

//SIGN IN
router.post('/signin', signin);

module.exports = router;
