// Require bcrypt and define saltRounds
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");

const User = require("../../models/users");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	createUser: async (args) => {
		try {
			const email = args.userInput.email;
			const userExists = await User.findOne({ email: email });

			if (userExists) {
				throw new Error("Email already exists.");
			}

			const encryptedPassword = await bcrypt.hash(
				args.userInput.password,
				saltRounds
			);

			const user = new User({
				email: email,
				password: encryptedPassword,
			});

			const userSaved = await user.save();
			userSaved.password = null;
			userSaved._id = userSaved.id;
			return userSaved;
		} catch (err) {
			throw err;
		}
	},
	login: async ({ email, password }) => {
		try {
			const user = await User.findOne({ email: email });
			if (!user) {
				throw new Error("Invalid Credentials");
			}

			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) {
				throw new Error("Invalid Credentials");
			}

			console.log(process.env.JWT_TOKEN);

			const token = await jwt.sign(
				{ userId: user.id, email: user.email },
				process.env.JWT_TOKEN,
				{
					expiresIn: "1h",
				}
			);

			return {
				userId: user.id,
				token: token,
				tokenExpiration: 1,
			};
		} catch (err) {
			return err;
		}
	},
};
