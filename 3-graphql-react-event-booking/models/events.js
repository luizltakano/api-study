// Import mongoose library
const mongoose = require("mongoose");

// Get access to mongoose's Schema constructor
const Schema = mongoose.Schema;

// Define event schema with required fields
const eventSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

// Export the event model with the defined schema
module.exports = mongoose.model("Event", eventSchema);
