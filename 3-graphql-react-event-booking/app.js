const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

// Require GraphQL Schema and Resolvers
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

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
		schema: graphQlSchema,
		// provide the root value for resolving the API
		rootValue: graphQlResolvers,
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
mongoose.set("strictQuery", false);
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
