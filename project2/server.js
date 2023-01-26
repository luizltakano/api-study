const http = require("http");

const getReq = require("./methods/get-request.js");
const postReq = require("./methods/post-request.js");
const pullReq = require("./methods/pull-request.js");
const deleteReq = require("./methods/delete-request.js");

let users = require("./data/users.json");

const PORT = 3000;

const server = http.createServer((req, res) => {
    req.users = users;
    switch(req.method){
        case "GET":
            getReq(req, res)
            break
        case "POST":
            postReq(req, res)
            break
        case "PULL":
            pullReq(req, res)
            break
        case "DELETE":
            deleteReq(req, res)
            break
        default:
            res.statusCode = 404;
            res.setHeader("Content-Type","application/json");
            res.write(
                JSON.stringify({title: "Not Found", message: "Route Not Found"})
            );
            res.end();
    }
})

server.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`)
});