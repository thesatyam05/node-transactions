const mongoose = require('mongoose');
const UserAccount = require('../models/UserAccount.js');
const jwt = require('jsonwebtoken');

module.exports.sendMoney = async (req, res, next) => {
	try {
		let loggedInUserId;
		const { sender, reciever, amount } = req.query;
		const token = req.cookies.access_token;

		const decodedToken = await jwt.verify(token, process.env.JWT);
		loggedInUserId = decodedToken.loggedInUserId;
		console.log('🟢 loggedInUserId: ', loggedInUserId);

		const ress = await transferMoney(sender, reciever, parseInt(amount), loggedInUserId);
		res.send(ress);
	} catch (err) {
		next(err);
	}
};

async function transferMoney(senderAccountId, recieverAccountId, amount, loggedInUserId) {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const senderAccount = await UserAccount.findOne({ accountNumber: senderAccountId }).session(
			session
		);
		const receiverAccount = await UserAccount.findOne({
			accountNumber: recieverAccountId,
		}).session(session);

		if (!senderAccount) {
			throw new Error('Invalid sender account id');
		}
		if (!receiverAccount) {
			throw new Error('Invalid receiver account id');
		}
		if (senderAccount.balance < amount) {
			throw new Error('Insufficient funds');
		}
		if (senderAccount.accountNumber !== loggedInUserId) {
			throw new Error('You are not authorized to send money from this account');
		}
		if (amount <= 0) {
			throw new Error('Amount must be greater than zero');
		}
		if (senderAccountId === recieverAccountId) {
			throw new Error('You cannot send money to your own account');
		}

		const transactionOptions = { session };

		const updateSender = {
			$inc: { balance: -amount },
			$push: {
				transactions: {
					type: 'debit',
					fromAccount: senderAccountId,
					toAccount: recieverAccountId,
					amount: amount,
					date: new Date(),
				},
			},
		};

		const updateReceiver = {
			$inc: { balance: amount },
			$push: {
				transactions: {
					type: 'credit',
					fromAccount: senderAccountId,
					toAccount: recieverAccountId,
					amount: amount,
					date: new Date(),
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
