// Listen for incoming data on the request stream and concatenate it
// Return the parsed JSON body or reject with an error
module.exports = async (request) => {
    return new Promise((resolve, reject) => {
        let body = "";
        request.on("data", chunk => body += chunk);
        request.on("end", () => resolve(JSON.parse(body)));
        request.on("error", err => reject(err));
    });
};
