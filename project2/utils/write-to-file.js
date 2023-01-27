const fs = require("fs")
const path = require("path")

module.exports = (data) => {
    try {
        fs.writeFileSync(path.join(__dirname, "../", "data", "users.json"), JSON.stringify(data), "utf-8")
    } catch (error) {
        console.log(err)
    }
}