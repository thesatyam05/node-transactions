const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const UserAccount = require('./models/UserAccount.js');
const authRoutes = require('./routes/auth.js');
const transferRoutes = require('./routes/transferMoney.js');
const adminRoutes = require('./routes/admin.js');

const app = express();
dotenv.config();

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
app.use('/api/transfer', transferRoutes);
app.use('/api/admin', adminRoutes);

app.listen(8800, () => {
	connect();
	console.log('🚀 Connected to Server');
});
