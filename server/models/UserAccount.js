const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
	accountNumber: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	balance: { type: Number, default: 100 },
	pin: { type: String, required: true },
	transactions: [],
});

module.exports = mongoose.model('UserAccount', userAccountSchema, 'transactionstestcollection');
