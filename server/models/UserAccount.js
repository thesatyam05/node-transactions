const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
	type: { type: String, enum: ['credit', 'debit'], required: true },
	fromAccount: { type: Number, required: true },
	toAccount: { type: Number, required: true },
	amount: { type: Number, required: true },
	date: { type: Date, default: Date.now },
});

const userAccountSchema = new Schema({
	accountNumber: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	balance: { type: Number, default: 100 },
	pin: { type: String, required: true },
	role: {
		type: String,
		enum: ['admin', 'user', 'guest'],
		default: 'guest',
	},
	transactions: [transactionSchema],
});

module.exports = mongoose.model('UserAccount', userAccountSchema, 'transactionstestcollection');
