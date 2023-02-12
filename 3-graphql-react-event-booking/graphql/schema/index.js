const { buildSchema } = require("graphql");

module.exports = buildSchema(`

			type User {
				_id: ID!
				email: String!
				password: String
				createdEvents: [Event!]
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
				event: [Event!]!
			}

			type RootMutation {
				createUser(userInput: UserInput!): User
				createEvent(eventInput: EventInput!): Event
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`);
