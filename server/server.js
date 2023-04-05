// importing backend packages for the server
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

//importing routes
const authRoutes = require('./routes/auth.js');
const bankingRoutes = require('./routes/banking.js');
const adminRoutes = require('./routes/admin.js');

// initializing express app
const app = express();
dotenv.config(); //configure dotenv

const connect = async () => {
	mongoose.connect(process.env.MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		console.log('🟢 session started: ');
	} finally {
		console.log('🔵 finally');
	}
};

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/banking', bankingRoutes);
app.use('/api/admin', adminRoutes);

// listening to the server
app.listen(8800, () => {
	connect();
	console.log('🚀 Connected to Server');
});
