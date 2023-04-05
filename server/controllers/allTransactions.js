// this is for only admin so that he can see all users transactions
const Transaction = require('../models/Transaction.js');

module.exports.allTransactions = async (req, res, next) => {
	try {
		const result = await Transaction.find({});
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
};
