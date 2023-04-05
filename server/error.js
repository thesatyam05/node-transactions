module.exports.createError = (status, message) => {
	const err = new Error();
	err.status = status;
	err.message = message;
	console.log('🔴 err.message: ', err.message, '🔴 err.status: ', err.status);
	// return err;
	return;
};
