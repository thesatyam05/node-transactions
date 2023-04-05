const UserAccount = require('../models/UserAccount.js');
const Transaction = require('../models/Transaction.js');

module.exports.passbook = async (req, res, next) => {
	const loggedInUserId = req.user.loggedInUserId;
	try {
		const user = await UserAccount.findOne({ accountNumber: loggedInUserId });
		const transactionIds = user.transactions.map((transaction) => transaction.transactionId);
		const result = await Transaction.find({ _id: { $in: transactionIds } });
		const transactionsWithTypes = result.map((transaction) => {
			const type = transaction.fromAccount === loggedInUserId ? 'debit' : 'credit';
			return { ...transaction.toObject(), type };
		});
		res.send(transactionsWithTypes);
	} catch (err) {
		next(err);
	}
};
