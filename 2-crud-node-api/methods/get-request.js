module.exports = (req, res) => {
	// Extract the base URL of the request and username from the URL string
	const baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
	const username = req.url.split("/")[3];

	// Filter the users array to find the user with the specified username
	const user = req.users.filter((user) => user.username === username);

	// If the request URL is "/api/users", return a list of all users
	if (req.url === "/api/users") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(req.users));
		res.end();
	}
	// If the filtered user array is empty, return a "Not Found" error
	else if (user.length < 1) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({ title: "Not Found", message: "Username Not Found" })
		);
	}
	// Otherwise, return the filtered user as a JSON string
	else if (user) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(user));
		res.end();
	}
};
