// Import mongoose library
const mongoose = require("mongoose");

// Get access to mongoose's Schema constructor
const Schema = mongoose.Schema;

// Define user schema with required fields
const userSchema = Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdEvents: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
});

// Export the user model with the defined schema
module.exports = mongoose.model("User", userSchema);
