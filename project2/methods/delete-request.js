const writeToFile = require("../utils/write-to-file.js")

module.exports = (req, res) => {
    const baseUrl = req.url.substring(0, req.url.lastIndexOf("/"))
    const username = req.url.split("/")[3]
    const user = req.users.filter(user => {
        return user.username === username
    });

    if(user.length < 1){
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(
            JSON.stringify({title: "Not Found", message: "Username Not Found"})
        );
    } else if(baseUrl === "/api/users" && user.length === 1){
        try {
            const users = req.users.filter(user => user.username !== username)
            writeToFile(users)
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.write(
                JSON.stringify(users)
            );
            res.end();
        } catch (error) {
            throw Error()
        }
    }
};