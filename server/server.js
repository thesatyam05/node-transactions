// importing backend packages for the server
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const winston = require('winston');

//importing routes
const authRoutes = require('./routes/auth.js');
const bankingRoutes = require('./routes/banking.js');
const adminRoutes = require('./routes/admin.js');

// initializing express app
const app = express();
dotenv.config(); //configure dotenv

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'api.log' }),
	],
});

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

app.use((req, res, next) => {
	const { method, url, body, query, params } = req;
	const start = Date.now();
	res.on('finish', () => {
		const responseTime = Date.now() - start;
		const { statusCode } = res;
		logger.info(`[${method} ${url}] ${statusCode} - ${responseTime}ms`, {
			body,
			query,
			params,
			headers: req.headers,
			ip: req.ip,
		});
	});
	next();
});

// listening to the server
app.listen(8800, () => {
	connect();
	console.log('🚀 Connected to Server');
});
