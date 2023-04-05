const mongoose = require('mongoose');
const User = require('../models/UserAccount.js');
const bcrypt = require('bcryptjs');
const { createError } = require('../error.js');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res, next) => {
	try {
		// Validating the required fields in req.body
		const requiredFields = ['accountNumber', 'name', 'email', 'password', 'pin'];
		for (const field of requiredFields) {
			if (!req.body[field]) {
				res.status(400).json({ message: `${field} is required ⛔` });
				return next(createError(400, `${field} is required ⛔`));
			}
		}
		const salt = bcrypt.genSaltSync(10);
		const passHash = bcrypt.hashSync(req.body.password, salt);
		const pinHash = bcrypt.hashSync(req.body.pin.toString(), salt);
		const newUser = new User({ ...req.body, password: passHash, pin: pinHash });

		await newUser.save();
		// res.status(200).send('User has been created!');
		res.status(200).send(newUser);
	} catch (err) {
		if (err.code === 11000) {
			res.status(400).json({ message: 'accountNumber already exists.' });
			return next(createError(400, 'accountNumber already exists.'));
		}
		next(err);
	}
};

module.exports.signin = async (req, res, next) => {
	try {
		const user = await User.findOne({ accountNumber: req.body.accountNumber });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return next(createError(404, 'User not found!'));
		}

		const isCorrect = await bcrypt.compare(req.body.password, user.password);

		if (!isCorrect) {
			res.status(404).json({ message: 'Wrong Password!' });
			return next(createError(401, 'Wrong Password!'));
		}

		const isPinCorrect = await bcrypt.compare(req.body.pin, user.pin);

		if (!isPinCorrect) {
			res.status(404).json({ message: 'Wrong Pin!' });
			return next(createError(401, 'Wrong Pin!'));
		}

		const token = jwt.sign(
			{ loggedInUserId: user.accountNumber, role: user.role },
			process.env.JWT,
			{
				expiresIn: '1h',
			}
		);

		// below I am not sending the transacrions, password and pin to the client
		const { transactions, pin, password, ...others } = user._doc;
		console.log('🟢 token: ', token);
		res.cookie('access_token', token, {
			httpOnly: true,
		})
			.status(200)
			.json(others);
	} catch (err) {
		next(err);
	}
};
