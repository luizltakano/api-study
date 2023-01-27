const requestBodyParser = require("../utils/body-parser.js");
const {v4: uuid} = require("uuid")
const writeToFile = require("../utils/write-to-file.js")

module.exports = async (req, res) => {
    const baseUrl = req.url
    if(baseUrl === "/api/users/create"){
        try {
            const body = await requestBodyParser(req)
            if(body.username && body.email && body.fname && body.lname){
                body.id = uuid()
                req.users.push(body)
                writeToFile(req.users)
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
    }
}