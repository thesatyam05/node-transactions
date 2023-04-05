const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Transaction = require('./Transaction.js');

const userAccountSchema = new Schema({
	accountNumber: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	balance: { type: Number, default: 100 },
	pin: { type: String, required: true },
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
	transactions: [
		{
			type: {
				type: String,
				enum: ['credit', 'debit'],
				required: true,
			},
			transactionId: {
				// type: mongoose.Schema.Types.ObjectId,
				// ref: 'Transaction',
				type: String,
				required: true,
			},
		},
	],
});

module.exports = mongoose.model('UserAccount', userAccountSchema, 'UserAccountsCollection');
