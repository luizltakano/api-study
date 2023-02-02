// Import required modules
const requestBodyParser = require("../utils/body-parser.js");
const { v4: uuid } = require("uuid");
const writeToFile = require("../utils/write-to-file.js");

// Exports the handler function for creating a new user
module.exports = async (req, res) => {
	// Get the base URL of the request
	const baseUrl = req.url;

	// Check if the request is to create a new user
	if (baseUrl === "/api/users/create") {
		try {
			// Parse the request body
			const body = await requestBodyParser(req);

			// Validate that the required fields are present
			if (body.username && body.email && body.fname && body.lname) {
				// Add an id to the user data
				body.id = uuid();

				req.users.push(body);
				// Write the updated users array to the file
				writeToFile(req.users);

				res.writeHead(201, { "Content-Type": "application/json" });
				res.end(JSON.stringify(body));
			} else {
				// If the required fields are not present, throw an error
				throw Error();
			}
		} catch (err) {
			console.log(err);
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(
				JSON.stringify({
					title: "Validation Failed",
					message: "Request body not valid",
				})
			);
		}
	}
};
