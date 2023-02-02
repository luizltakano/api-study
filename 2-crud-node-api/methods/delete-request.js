// Import utility function to write data to file
const writeToFile = require("../utils/write-to-file.js");

// Export the DELETE request handler
module.exports = (req, res) => {
	// Get base URL and username from the request URL
	const baseUrl = req.url.substring(0, req.url.lastIndexOf("/"));
	const username = req.url.split("/")[3];

	// Filter the user from the list of users in the request
	const user = req.users.filter((user) => {
		return user.username === username;
	});

	// If user not found, return a 404 status and error message
	if (user.length < 1) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				title: "Not Found",
				message: "Username Not Found",
			})
		);
	}
	// If base URL is "/api/users" and the user is found, delete the user and write the updated list to file
	else if (baseUrl === "/api/users" && user.length === 1) {
		try {
			const users = req.users.filter((user) => user.username !== username);
			writeToFile(users);
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.write(JSON.stringify(users));
			res.end();
		} catch (error) {
			throw Error();
		}
	}
};
