const { buildSchema } = require("graphql");

module.exports = buildSchema(`

			type Booking {
				_id: ID!
				user: User!
				event: Event!
				createdAt: String!
				updatedAt: String!
			}			

			type User {
				_id: ID!
				email: String!
				password: String
				createdEvents: [Event!]
			}

			type AuthData {
				userId: ID!
				token: String!
				tokenExpiration: Int!
			}

			input UserInput {
				email: String!
				password: String!
			}

			type Event {
				_id: ID!
				title: String!
				description: String!
				price: Float!
				date: String!
				creator: User!
			}

			input EventInput {
				title: String!
				description: String!
				price: Float!
			}

			type RootQuery {
				events: [Event!]!
				bookings: [Booking!]!
				login(email: String!, password: String!): AuthData!
			}

			type RootMutation {
				createUser(userInput: UserInput!): User
				createEvent(eventInput: EventInput!): Event
				bookEvent(eventId: ID!): Booking
				cancelBooking(bookingId: ID!): Event
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`);
