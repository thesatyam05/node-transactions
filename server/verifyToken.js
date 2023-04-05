const jwt = require('jsonwebtoken');
const { createError } = require('./error.js');

module.exports.verifyToken = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res
			.status(401)
			.clearCookie('access_token')
			.json({ message: 'You are not authenticated!' });
	}
	jwt.verify(token, process.env.JWT, async (err, decodedToken) => {
		if (err) {
			return res
				.status(401)
				.clearCookie('access_token')
				.json({ message: 'Token is not valid!' });
		}
		req.user = decodedToken;
		next();
	});
};
