// Import required modules
const http = require("http");
const getReq = require("./methods/get-request.js");
const postReq = require("./methods/post-request.js");
const putReq = require("./methods/put-request.js");
const deleteReq = require("./methods/delete-request.js");

// Import JSON data
let users = require("./data/users.json");

// Define the port for the server
const PORT = 3000;

// Create a HTTP server
const server = http.createServer((req, res) => {
    // Attach user data to the request object
    req.users = users;
    // Switch statement to handle different request methods
    switch(req.method){
        case "GET":
            getReq(req, res)
            break
        case "POST":
            postReq(req, res)
            break
        case "PUT":
            putReq(req, res)
            break
        case "DELETE":
            deleteReq(req, res)
            break
        // Handle unsupported request methods
        default:
            res.statusCode = 404;
            res.setHeader("Content-Type","application/json");
            res.write(
                JSON.stringify({title: "Not Found", message: "Route Not Found"})
            );
            res.end();
    }
})

// Start the server
server.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`)
});
