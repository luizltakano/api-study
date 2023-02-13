// Require bcrypt and define saltRounds
const bcrypt = require("bcrypt");
const saltRounds = 12;

const User = require("../../models/users");

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
};
