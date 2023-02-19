import React, { Component } from "react";
import axios from "axios";

import "./EventsPage.css";
import AuthContext from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

const api = axios.create({
	baseURL: "http://localhost:8000/graphql",
	headers: {
		"Content-Type": "application/json",
	},
});

class EventsPage extends Component {
	state = {
		newEventModalActive: false,
		selectedEvent: null,
		events: [],
		isLoading: false,
	};

	isActive = true;

	static contextType = AuthContext;

	componentDidMount() {
		this.isActive = true;
		this.fetchEvents();
	}

	manageRequest = async (args) => {
		const res = await api.post("/", args.requestBody, {
			headers: args.auth,
		});

		if (res.status !== 200 && res.status !== 201) {
			throw new Error("Failed");
		}

		return res;
	};

	constructor(props) {
		super(props);
		this.titleEl = React.createRef();
		this.priceEl = React.createRef();
		this.dateEl = React.createRef();
		this.descriptionEl = React.createRef();
	}

	startCreateEventHandler = () => {
		this.setState({ newEventModalActive: true });
	};

	modalCancelHandler = () => {
		this.setState({ newEventModalActive: false, selectedEvent: null });
	};

	createEventHandler = async () => {
		this.setState({ newEventModalActive: false });

		const title = this.titleEl.current.value;
		const price = +this.priceEl.current.value;
		const date = this.dateEl.current.value;
		const description = this.descriptionEl.current.value;

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		) {
			return;
		}

		const event = { title, price, date, description };

		const requestBody = {
			query: `
                    mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
                        createEvent(eventInput: {
							title: $title,
							price: $price,
							date: $date,
							description: $description
						}) {
							_id
							title
							price
							date
							description
						}
                    }
                `,
			variables: {
				title: event.title,
				price: event.price,
				date: event.date,
				description: event.description,
			},
		};

		try {
			const res = await this.manageRequest({
				requestBody,
				auth: { Authorization: "Bearer " + this.context.token },
			});

			const data = res.data.data;

			this.setState((prevState) => {
				const updatedEvents = [...prevState.events];
				updatedEvents.push({
					_id: data.createEvent._id,
					title: data.createEvent.title,
					price: data.createEvent.price,
					date: data.createEvent.date,
					description: data.createEvent.description,
					creator: {
						_id: this.context.userId,
					},
				});
				return { events: updatedEvents };
			});
		} catch (err) {
			console.log(err);
		}
	};

	startBookEventHadler = (eventId) => {
		const event = this.state.events.find((ev) => ev._id === eventId);

		this.setState({ selectedEvent: event });
	};

	bookEventHandler = async () => {
		const requestBody = {
			query: `
                    mutation BookEvent($id: ID!) {
                        bookEvent(eventId: $id) {
							_id
							createdAt
							updatedAt
						}
                    }
                `,
			variables: {
				id: this.state.selectedEvent._id,
			},
		};

		try {
			await this.manageRequest({
				requestBody,
				auth: { Authorization: "Bearer " + this.context.token },
			});

			this.setState({ selectedEvent: null });
		} catch (err) {
			console.log(err);
			this.setState({ selectedEvent: null });
		}
	};

	fetchEvents = async () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
                    query {
                        events {
							_id
							title
							price
							date
							description
							creator {
								_id
								email
							}
						}
                    }
                `,
		};

		try {
			const res = await this.manageRequest({
				requestBody,
			});

			const data = res.data.data;

			if (this.isActive) {
				this.setState({ events: data.events, isLoading: false });
			}
		} catch (err) {
			console.log(err);
			if (this.isActive) {
				this.setState({ isLoading: false });
			}
		}
	};

	componentWillUnmount() {
		this.isActive = false;
	}

	render() {
		return (
			<React.Fragment>
				{(this.state.newEventModalActive || this.state.selectedEvent) && (
					<Backdrop />
				)}
				{this.state.newEventModalActive && (
					<Modal
						title="Add Event"
						canCancel
						canCreate
						onCancel={this.modalCancelHandler}
						onCreate={this.createEventHandler}
						createText="Create"
						cancelText="Cancel"
					>
						<div className="form-control">
							<label htmlFor="title">Title</label>
							<input
								type="text"
								id="title"
								placeholder="Wonderful Event"
								ref={this.titleEl}
							></input>
							<label htmlFor="price">Price</label>
							<input
								type="number"
								id="price"
								step="0.01"
								placeholder="10.0"
								ref={this.priceEl}
							></input>
							<label htmlFor="date">Date</label>
							<input type="datetime-local" id="date" ref={this.dateEl}></input>
							<label htmlFor="description">Description</label>
							<textarea
								id="description"
								rows={4}
								ref={this.descriptionEl}
							></textarea>
						</div>
					</Modal>
				)}
				{this.state.selectedEvent && (
					<Modal
						title={this.state.selectedEvent.title}
						canCancel
						onCancel={this.modalCancelHandler}
						cancelText={this.context.token ? "Cancel" : "Close"}
						{...(this.context.token && {
							canCreate: true,
							onCreate: this.bookEventHandler,
							createText: "Book",
						})}
					>
						<div>
							<p>{this.state.selectedEvent.description}</p>
							<div className="book__details">
								<p>
									Date:{" "}
									{new Date(this.state.selectedEvent.date).toLocaleDateString(
										"es-ES"
									)}
								</p>
								<p>Price: ${this.state.selectedEvent.price}</p>
							</div>
						</div>
					</Modal>
				)}
				{this.context.token && (
					<div className="event-control">
						<h1>Create your event!</h1>
						<button
							className="btn"
							type="button"
							onClick={this.startCreateEventHandler}
						>
							Create event
						</button>
					</div>
				)}
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<EventList
						events={this.state.events}
						authUserId={this.context.userId}
						startEventBooking={this.startBookEventHadler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default EventsPage;
