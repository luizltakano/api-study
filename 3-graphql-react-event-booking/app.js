const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	"/graphql",
	graphqlHTTP({
		schema: buildSchema(`

			type RootQuery {
				event: [String!]!
			}

			type RootMutation {
				createEvent(name: String): String
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),
		rootValue: {
			event: () => {
				return ["This is amazing", "This is not so amazing"];
			},
			createEvent: (args) => {
				const eventName = args.name;
				return eventName;
			},
		},
		graphiql: true,
	})
);

app.listen("3000", () => {
	console.log("Server active on port 3000");
});
