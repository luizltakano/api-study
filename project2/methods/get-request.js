module.exports = (req, res) => {
    const baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1)
    const username = req.url.split("/")[3]
    const user = req.users.filter(user => {
        return user.username === username
    });
    
    if(req.url === "/api/users"){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(
            JSON.stringify(req.users)
        );
        res.end();
    } else if (user.length < 1) {
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(
            JSON.stringify({title: "Not Found", message: "Username Not Found"})
            );
    } else if (user) {        
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.write(
                JSON.stringify(user)
            );
            res.end();
    } else {
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(
            JSON.stringify({title: "Not Found", message: "Route Not Found"})
            );
    }
};