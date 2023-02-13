// Import mongoose library
const mongoose = require("mongoose");

// Get access to mongoose's Schema constructor
const Schema = mongoose.Schema;

// Define user schema with required fields
const bookingSchema = Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		event: {
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	},
	{ timestamps: true }
);

// Export the user model with the defined schema
module.exports = mongoose.model("Booking", bookingSchema);
