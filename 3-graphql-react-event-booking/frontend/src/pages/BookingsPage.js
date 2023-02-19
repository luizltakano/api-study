import React, { Component } from "react";
import axios from "axios";

import Spinner from "../components/Spinner/Spinner";
import authContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";

const api = axios.create({
	baseURL: "http://localhost:8000/graphql",
	headers: {
		"Content-Type": "application/json",
	},
});

class BookingsPage extends Component {
	state = {
		isLoading: false,
		bookings: [],
	};

	static contextType = authContext;

	componentDidMount() {
		this.fetchBookings();
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

	fetchBookings = async () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
                    query {
                        bookings {
							_id
							createdAt
							updatedAt
							event {
								_id
								title
								date
							}
						}
                    }
                `,
		};

		try {
			const res = await this.manageRequest({
				requestBody,
				auth: { Authorization: "Bearer " + this.context.token },
			});
			const data = res.data.data;
			this.setState({ bookings: data.bookings, isLoading: false });
		} catch (err) {
			console.log(err);
			this.setState({ isLoading: false });
		}
	};

	cancelBookingHandler = async (bookingId) => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
                    mutation CancelBooking($id: ID!){
                        cancelBooking(bookingId: $id) {
							_id
							title
						}
                    }
                `,
			variables: {
				id: bookingId,
			},
		};

		try {
			await this.manageRequest({
				requestBody,
				auth: { Authorization: "Bearer " + this.context.token },
			});

			this.setState((prevState) => {
				const updatedBookings = [...prevState.bookings].filter((booking) => {
					return booking._id !== bookingId;
				});
				return { bookings: updatedBookings, isLoading: false };
			});
		} catch (err) {
			console.log(err);
			this.setState({ isLoading: false });
		}
	};

	render() {
		return (
			<React.Fragment>
				{this.isLoading ? (
					<Spinner />
				) : (
					<BookingList
						bookings={this.state.bookings}
						cancelBooking={this.cancelBookingHandler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default BookingsPage;
