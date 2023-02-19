const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

// Require GraphQL Schema and Resolvers
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

// Create an instance of Express
const app = express();

// Enable JSON and URL-encoded body parsing middleware in Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Establish CORS policy
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// Use the middleware isAuth to authenticate API requests
app.use(isAuth);

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
		app.listen("8000", () => {
			console.log("Server active on port 8000");
		})
	)
	.catch((err) => console.log(err));
