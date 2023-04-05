const mongoose = require('mongoose');
const UserAccount = require('../models/UserAccount.js');
const Transaction = require('../models/Transaction.js');
const jwt = require('jsonwebtoken');

module.exports.sendMoney = async (req, res, next) => {
	try {
		let loggedInUserId = req.user.loggedInUserId;
		const { reciever, amount } = req.query;
		console.log('🟢 loggedInUserId: ', loggedInUserId);
		const ress = await transferMoney(loggedInUserId, parseInt(reciever), parseInt(amount));
		res.send(ress);
	} catch (err) {
		next(err);
	}
};

async function transferMoney(senderAccountId, recieverAccountId, amount) {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		if (senderAccountId === recieverAccountId) {
			throw new Error('You cannot send money to your own account');
		}
		if (amount <= 0) {
			throw new Error('Amount must be greater than zero');
		}
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

		console.log(
			`$${amount} transferred successfully from ${senderAccount.name} to ${receiverAccount.name}`
		);
		return true;
	} catch (error) {
		await session.abortTransaction();
		console.error(error.message);
	} finally {
		session.endSession();
	}
}
