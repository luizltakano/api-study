import React from "react";

import "./EventItem.css";

const EventItem = (props) => {
	const event = props.event;

	return (
		<li key={event._id} className="events__list-item">
			<h2>{event.title}</h2>
			<p>
				${event.price} - {new Date(event.date).toLocaleDateString("es-ES")}
			</p>
			{event.creator._id === props.authUserId ? (
				<p>You're the event creator</p>
			) : (
				<button
					className="btn"
					type="button"
					onClick={props.startEventBooking.bind(this, event._id)}
				>
					Details
				</button>
			)}
		</li>
	);
};

export default EventItem;
