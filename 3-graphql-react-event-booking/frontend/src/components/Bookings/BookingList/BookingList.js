import React from "react";

import BookingItem from "./BookingItem/BookingItem";
import "./BookingList.css";

const BookingList = (props) => {
	const bookings = props.bookings.map((booking) => {
		return (
			<BookingItem
				key={booking._id}
				booking={booking}
				cancelBooking={props.cancelBooking}
			/>
		);
	});

	return <ul className="booking__list">{bookings}</ul>;
};

export default BookingList;
