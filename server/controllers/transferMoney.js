const mongoose = require('mongoose');
const UserAccount = require('../models/UserAccount.js');
const Transaction = require('../models/Transaction.js');
const { createError } = require('../error.js');

module.exports.sendMoney = async (req, res, next) => {
	try {
		let loggedInUserId = req.user.loggedInUserId;
		// req.query has { reciever: '1', amount: '1' } because we passed in url query
		const reciever = parseInt(req.query.reciever);
		const amount = parseInt(req.query.amount);
		if (loggedInUserId === reciever) {
			res.status(405).json({ message: 'You cannot send money to your own account' });
			return next(createError(405, 'You cannot send money to your own account'));
		}
		if (amount <= 0) {
			res.status(422).json({ message: 'Amount must be greater than zero' });
			return next(createError(422, 'Amount must be greater than zero'));
		}
		const ress = await transferMoney(loggedInUserId, reciever, amount);
		res.status(200).json({ message: ress });
	} catch (err) {
		next(err);
	}
};

async function transferMoney(senderAccountId, recieverAccountId, amount) {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		const senderAccount = await UserAccount.findOne({ accountNumber: senderAccountId }).session(
			session
		);
		const receiverAccount = await UserAccount.findOne({
			accountNumber: recieverAccountId,
		}).session(session);
		if (senderAccount.balance < amount) {
			throw new Error('Insufficient funds');
		}
		if (!receiverAccount) {
			throw new Error('Invalid receiver account id');
		}

		const transactionOptions = { session };

		const transaction = new Transaction({
			fromAccount: senderAccountId,
			toAccount: recieverAccountId,
			amount: amount,
			date: new Date(),
		});

		await transaction.save({ session });

		const updateSender = {
			$inc: { balance: -amount },
			$push: {
				transactions: {
					type: 'debit',
					transactionId: transaction._id,
				},
			},
		};

		const updateReceiver = {
			$inc: { balance: amount },
			$push: {
				transactions: {
					type: 'credit',
					transactionId: transaction._id,
				},
			},
		};

		await UserAccount.updateOne(
			{ accountNumber: senderAccountId },
			updateSender,
			transactionOptions
		);
		await UserAccount.updateOne(
			{ accountNumber: recieverAccountId },
			updateReceiver,
			transactionOptions
		);
		await session.commitTransaction();
		return `💲${amount} transferred from ${senderAccount.name} ➡️ ${receiverAccount.name}`;
	} catch (error) {
		await session.abortTransaction();
		console.error(error.message);
	} finally {
		session.endSession();
	}
}
