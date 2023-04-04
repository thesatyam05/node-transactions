const User = require('../models/UserAccount.js');
const bcrypt = require('bcryptjs');
const { createError } = require('../error.js');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res, next) => {
	try {
		const salt = bcrypt.genSaltSync(10);
		const passHash = bcrypt.hashSync(req.body.password, salt);
		const pinHash = bcrypt.hashSync(req.body.pin.toString(), salt);
		const newUser = new User({ ...req.body, password: passHash, pin: pinHash });

		await newUser.save();
		// res.status(200).send('User has been created!');
		res.status(200).send(newUser);
	} catch (err) {
		next(err);
	}
};

module.exports.signin = async (req, res, next) => {
	try {
		const user = await User.findOne({ accountNumber: req.body.accountNumber });
		if (!user) return next(createError(404, 'User not found!'));

		const isCorrect = await bcrypt.compare(req.body.password, user.password);

		if (!isCorrect) return next(createError(400, 'Wrong Credentials!'));

		const isPinCorrect = await bcrypt.compare(req.body.pin, user.pin);

		if (!isPinCorrect) return next(createError(400, 'Wrong Pin!'));

		const token = jwt.sign({ loggedInUserId: user.accountNumber }, process.env.JWT);
		const { pin, password, ...others } = user._doc;
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
