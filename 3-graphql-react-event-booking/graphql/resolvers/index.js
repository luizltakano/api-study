// Require bcrypt and define saltRounds
const bcrypt = require("bcrypt");
const { create } = require("../../models/events");
const saltRounds = 12;

// Require the Event model from the './models/events' module
const Event = require("../../models/events");
const User = require("../../models/users");

// Manually access the inner properties of each type
const user = async (userId) => {
	try {
		let user = await User.findById(userId.toString());
		user = {
			...user._doc,
			_id: user.id,
			password: null,
			createdEvents: events.bind(this, user._doc.createdEvents),
		};
		return user;
	} catch (err) {
		throw err;
	}
};

const events = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map((event) => {
			return {
				...event._doc,
				_id: event.id,
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, event._doc.creator),
			};
		});
	} catch (err) {
		throw err;
	}
};

module.exports = {
	event: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return {
					...event._doc,
					_id: event.id,
					date: new Date(event._doc.date).toISOString(),
					creator: user(event._doc.creator),
				};
			});
		} catch (err) {
			throw err;
		}
	},
	createEvent: async (args) => {
		// create a new event using the input arguments
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date().toString(),
			creator: "63e6ae7573e392cfd0d68efe",
		});
		let createdEvent;

		try {
			const creator = await User.findById({
				_id: event.creator._id,
			});
			if (!creator) {
				throw new Error("User not found");
			}

			let result = await event.save();
			createdEvent = {
				...result._doc,
				_id: result.id,
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, result._doc.creator),
			};

			creator.createdEvents.push(createdEvent);
			await creator.save();

			return createdEvent;
		} catch (err) {
			// throw the error if any
			throw err;
		}
	},
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
