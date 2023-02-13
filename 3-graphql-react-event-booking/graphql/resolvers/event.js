const { stringToDate } = require("../../helpers/date");
const { transformedEvent } = require("./merge");

const User = require("../../models/users");
const Event = require("../../models/events");

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return transformedEvent(event);
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
			date: stringToDate(new Date()),
			creator: "63e6ae7573e392cfd0d68efe",
		});
		let createdEvent;

		try {
			const creator = await User.findById({
				_id: event.creator._id,
			});
			if (!creator) {
				throw new Error("User not found.");
			}

			let result = await event.save();
			createdEvent = transformedEvent(result);

			creator.createdEvents.push(createdEvent);
			await creator.save();

			return createdEvent;
		} catch (err) {
			// throw the error if any
			throw err;
		}
	},
};
