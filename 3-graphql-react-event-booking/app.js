const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/events");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionParams = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eepxz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		connectionParams
	)
	.then(
		app.listen("3000", () => {
			console.log("Server active on port 3000");
		})
	)
	.catch((err) => console.log(err));

app.use(
	"/graphql",
	graphqlHTTP({
		schema: buildSchema(`
			
			type Event {
				_id: String!
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
				createEvent(eventInput: EventInput!): Event
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),
		rootValue: {
			event: () => {
				return Event.find()
					.then((events) => {
						return events.map((event) => {
							return { ...event._doc, _id: event.id };
						});
					})
					.catch((err) => {
						throw err;
					});
			},
			createEvent: (args) => {
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
						throw err;
					});
			},
		},
		graphiql: true,
	})
);
