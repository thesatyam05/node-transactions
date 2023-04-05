// this is for only admin so that he can see all users transactions
const UserAccount = require('../models/UserAccount.js');

module.exports.allUsers = async (req, res, next) => {
	try {
		const result = await UserAccount.find({});
		// just printing the balance of all users below
		console.table(result.map((item) => item.balance));
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
};
