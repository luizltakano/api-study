const { transformedEvent, transformedBooking } = require("./merge");

const Event = require("../../models/events");
const Booking = require("../../models/bookings");

module.exports = {
	bookings: async (args, req) => {
		try {
			const bookings = await Booking.find({ user: { _id: req.userId } });
			return bookings.map((booking) => {
				return transformedBooking(booking);
			});
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async (args, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthenticated");
		}
		try {
			const event = await Event.findOne({
				_id: args.eventId,
			});
			if (!event) {
				throw new Error("Event not found.");
			}
			const booking = new Booking({
				user: req.userId,
				event: event,
			});

			const result = await booking.save();
			return transformedBooking(result);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async (args, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthenticated");
		}
		try {
			const booking = await Booking.findById(args.bookingId).populate("event");
			const event = transformedEvent(booking.event);
			await Booking.deleteOne({ _id: args.bookingId });
			return event;
		} catch (err) {
			throw err;
		}
	},
};
