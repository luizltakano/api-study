const requestBodyParser = require("../utils/body-parser")
const writeToFile = require("../utils/write-to-file")

module.exports = async (req,res) => {
    const baseUrl = req.url.substring(0, req.url.lastIndexOf("/"))
    const username = req.url.split("/")[4]
    const userIndex = req.users.findIndex(user => user.username === username);

    if(userIndex === -1){
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(
            JSON.stringify({title: "Not Found", message: "Username Not Found"})
            );
    }if(baseUrl === "/api/users/edit"){
        console.log("step2")
        try {
            const body = await requestBodyParser(req)
            console.log(body)
            if(body.hasOwnProperty("hobbies") || body.hasOwnProperty("id") || body.hasOwnProperty("username")){
                throw Error()
            }
            Object.entries(body).forEach(entry => {
                const [key, value] = entry
                if(!req.users[userIndex][key]){
                    throw Error()
                }
                req.users[userIndex][key] = value
                console.log(req.users[userIndex])
            })
            writeToFile(req.users)
            res.writeHead(201, {"Content-Type" : "application/json"})
            res.end(JSON.stringify(req.users[userIndex]));            
        } catch (err) {
            console.log(err)
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(
                JSON.stringify({title: "Validation Failed", message: "Request body not valid"})
            );
        }
    }
}