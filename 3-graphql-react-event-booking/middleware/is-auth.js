const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(" ")[1];
	if (!token || token === null) {
		req.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
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
