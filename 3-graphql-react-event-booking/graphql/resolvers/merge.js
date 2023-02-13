const { stringToDate } = require("../../helpers/date");

const User = require("../../models/users");
const Event = require("../../models/events");

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
			return transformedEvent(event);
		});
	} catch (err) {
		throw err;
	}
};

const singleEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId);
		return transformedEvent(event);
	} catch (err) {
		throw err;
	}
};

const transformedEvent = (event) => {
	return {
		...event._doc,
		_id: event.id,
		date: stringToDate(event._doc.date),
		creator: user.bind(this, event._doc.creator),
	};
};

const transformedBooking = (booking) => {
	return {
		...booking._doc,
		_id: booking.id,
		createdAt: stringToDate(booking._doc.createdAt),
		updatedAt: stringToDate(booking._doc.updatedAt),
		user: user.bind(this, booking._doc.user),
		event: singleEvent.bind(this, booking._doc.event),
	};
};

exports.transformedEvent = transformedEvent;
exports.transformedBooking = transformedBooking;
