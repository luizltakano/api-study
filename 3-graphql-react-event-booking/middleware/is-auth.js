const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		req.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, "thisisasupersecrettoken");
	} catch (err) {
		throw err;
	}
	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}
	req.isAuth = true;
	req.userId = decodedToken.userId;
	next();
};
