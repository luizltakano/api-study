// Import the 'fs' and 'path' modules
const fs = require("fs")
const path = require("path")

// Exports a function that writes data to a JSON file
module.exports = (data) => {
    try {
        // Writes data to the 'users.json' file in the 'data' directory
        fs.writeFileSync(path.join(__dirname, "../", "data", "users.json"), JSON.stringify(data), "utf-8")
    } catch (error) {
        // Logs error if writing to file fails
        console.log(err)
    }
}
