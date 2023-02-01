// Import necessary modules
const requestBodyParser = require("../utils/body-parser");
const writeToFile = require("../utils/write-to-file");

// Export function to handle incoming request
module.exports = async (req, res) => {
	// Get base URL and username from request URL
	const baseUrl = req.url.substring(0, req.url.lastIndexOf("/"));
	const username = req.url.split("/")[4];

	// Find the index of the user with the specified username
	const userIndex = req.users.findIndex((user) => user.username === username);

	// If the user is not found, send a "Not Found" error response
	if (userIndex === -1) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				title: "Not Found",
				message: "Username Not Found",
			})
		);
	}

	// If the URL is for editing a user
	if (baseUrl === "/api/users/edit") {
		try {
			// Parse the request body
			const body = await requestBodyParser(req);

			// Check if the request body contains any restricted keys
			if (
				body.hasOwnProperty("hobbies") ||
				body.hasOwnProperty("id") ||
				body.hasOwnProperty("username")
			) {
				throw Error();
			}

			// Update the user with the specified properties in the request body
			Object.entries(body).forEach((entry) => {
				const [key, value] = entry;

				// If the property doesn't exist in the user object, throw an error
				if (!req.users[userIndex][key]) {
					throw Error();
				}

				// Update the property value in the user object
				req.users[userIndex][key] = value;
			});

			// Write the updated users data to file
			writeToFile(req.users);

			// Send a 201 response with the updated user data
			res.writeHead(201, { "Content-Type": "application/json" });
			res.end(JSON.stringify(req.users[userIndex]));
		} catch (err) {
			// If there is an error, send a "Validation Failed" error response
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
