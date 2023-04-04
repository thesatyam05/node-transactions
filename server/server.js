const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const UserAccount = require('./models/UserAccount.js');
const authRoutes = require('./routes/auth.js');
const transferRoutes = require('./routes/transferMoney.js');

const app = express();
dotenv.config();

const connect = async () => {
	mongoose.connect(process.env.MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true });

	try {
		// Connect to the MongoDB cluster
		// Make the appropriate DB calls
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

app.get('/users', async (req, res, next) => {
	const result = await UserAccount.find({});
	try {
		console.table(result.map((item) => item.balance));
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
});

app.get('/all', async (req, res, next) => {
	const result = await UserAccount.find({});
	let arr = [];
	try {
		result?.map((item) => {
			if (item.transactions.length > 0) {
				arr.push(item.transactions);
			}
		});
		console.table(arr[0]?.map((item) => item));
		res.status(200).send(arr);
	} catch (error) {
		next(error);
	}
});

app.listen(8800, () => {
	connect();
	console.log('🚀 Connected to Server');
});
