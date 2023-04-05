module.exports.checkAdminRole = (role) => {
	return (req, res, next) => {
		if (req.user.role !== role) {
			return res.status(401).json({ message: 'Only admins can acess this route' });
		}
		next();
	};
};
