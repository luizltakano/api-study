const requestBodyParser = require("../utils/body-parser.js");
const {v4: uuid} = require("uuid")

module.exports = async (req, res) => {
    const baseUrl = req.url
    if(baseUrl === "/api/users/create"){
        try {
            const body = await requestBodyParser(req)
            if(body.username && body.email && body.fname && body.lname){
                body.id = uuid()
                req.users.push(body)
                res.writeHead(201, {"Content-Type" : "application/json"})
                res.end(JSON.stringify(body));
            } else {
                throw Error();
            }
        } catch (err) {
            console.log(err)
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(
                JSON.stringify({title: "Validation Failed", message: "Request body not valid"})
            );
        }
    } else {
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(
            JSON.stringify({title: "Not Found", message: "Route Not Found"})
        );
    }
}