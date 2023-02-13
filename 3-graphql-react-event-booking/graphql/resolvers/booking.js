const { transformedEvent, transformedBooking } = require("./merge");

const Event = require("../../models/events");
const Booking = require("../../models/bookings");

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((booking) => {
				return transformedBooking(booking);
			});
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async (args) => {
		try {
			const event = await Event.findOne({
				_id: args.eventId,
			});
			if (!event) {
				throw new Error("Event not found.");
			}
			const booking = new Booking({
				user: "63e6ae7573e392cfd0d68efe",
				event: event,
			});

			const result = await booking.save();
			return transformedBooking(result);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async (args) => {
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
