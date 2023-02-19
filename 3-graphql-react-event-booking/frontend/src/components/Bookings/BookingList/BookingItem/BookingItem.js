import React from "react";

import "./BookingItem.css";

const BookingItem = (props) => {
	const booking = props.booking;

	return (
		<li className="booking__list-item">
			<h2>{booking.event.title}</h2>
			<button
				className="btn btn__secondary"
				type="button"
				onClick={props.cancelBooking.bind(this, booking._id)}
			>
				Cancel
			</button>
		</li>
	);
};

export default BookingItem;
