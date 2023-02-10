const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

//Require bcrypt and define saltRounds
const bcrypt = require("bcrypt");
const saltRounds = 12;

// Require the Event model from the './models/events' module
const Event = require("./models/events");
const User = require("./models/users");

// Create an instance of Express
const app = express();

// Enable JSON and URL-encoded body parsing middleware in Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use the "/graphql" endpoint with graphqlHTTP middleware
app.use(
	"/graphql",
	graphqlHTTP({
		// define the schema for the GraphQL API
		schema: buildSchema(`

			type User {
				_id: ID!
				email: String!
				password: String
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
		`),
		// provide the root value for resolving the API
		rootValue: {
			event: () => {
				return Event.find()
					.then((events) => {
						return events.map((event) => {
							return { ...event._doc, _id: event.id };
						});
					})
					.catch((err) => {
						// throw the error if any
						throw err;
					});
			},
			createEvent: (args) => {
				// create a new event using the input arguments
				const event = new Event({
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: new Date().toString(),
				});
				return event
					.save()
					.then((result) => {
						return { ...result._doc, _id: event.id };
					})
					.catch((err) => {
						// throw the error if any
						throw err;
					});
			},
			createUser: (args) => {
				const email = args.userInput.email;
				return User.findOne({ email: email })
					.then((user) => {
						if (user) {
							throw new Error("Email already exists.");
						}
						return bcrypt
							.hash(args.userInput.password, saltRounds)
							.then((encryptedPassword) => {
								const user = new User({
									email: email,
									password: encryptedPassword,
								});
								return user.save().then((user) => {
									return { ...user._doc, password: null, _id: user.id };
								});
							});
					})
					.catch((err) => {
						throw err;
					});
			},
		},
		// use the GraphiQL UI for testing the API
		graphiql: true,
	})
);

// Connection parameters for MongoDB
const connectionParams = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

// Connect to MongoDB with mongoose
mongoose
	.connect(
		// Use environmental variables for the connection URL, username and password
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eepxz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		connectionParams
	)
	.then(
		app.listen("3000", () => {
			console.log("Server active on port 3000");
		})
	)
	.catch((err) => console.log(err));
