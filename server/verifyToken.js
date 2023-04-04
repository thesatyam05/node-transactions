const jwt = require('jsonwebtoken');
const { createError } = require('./error.js');

module.exports.verifyToken = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) return next(createError(401, 'You are not authenticated!'));

	jwt.verify(token, process.env.JWT, async (err, decodedToken) => {
		if (err) return next(createError(403, 'Token is not valid!'));
		req.user = decodedToken;
		next();
	});
};
