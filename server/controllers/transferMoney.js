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
		const recieverAccount = await UserAccount.findOne({
			accountNumber: recieverAccountId,
		}).session(session);

		console.log('🟢 loggedInUserId: ', loggedInUserId, 'senderAccountId: ', senderAccountId);
		if (senderAccount.accountNumber !== loggedInUserId) {
			throw new Error('You are not authorized to send money from this account');
		}

		if (!senderAccount) {
			throw new Error('Invalid sender account id');
		}
		if (!recieverAccount) {
			throw new Error('Invalid reciever account id');
		}
		if (senderAccount.balance < amount) {
			throw new Error('Insufficient funds');
		}

		if (amount <= 0) {
			throw new Error('amount can(t) be: ' + amount);
		}
		if (senderAccountId === recieverAccountId) {
			throw new Error('You cannot send money to your own account');
		}

		senderAccount.balance -= amount;
		recieverAccount.balance += amount;
		senderAccount.transactions.push({
			sender: senderAccount.name,
			reciever: recieverAccount.name,
			amount: amount,
			date: new Date(),
		});

		await senderAccount.save();
		await recieverAccount.save();

		await session.commitTransaction();

		console.log(
			`$${amount} transferred successfully from ${senderAccount.name} to ${recieverAccount.name}`
		);
		return true;
	} catch (error) {
		await session.abortTransaction();
		console.error(error.message);
	} finally {
		session.endSession();
	}
}
