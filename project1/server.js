const express = require('express');
const _ = require("lodash");
const {v4:uuid} = require("uuid");
const bodyParser = require("body-parser");

// Express app
const app = express();
app.use(express.json());

// Data object to store comments
const data = {comments:[]};

/**
 * Get a randomly generated outfit
 */
app.get("/outfit", (req, res, next) => {
    const tops = ["white", "black", "grey", "green", "blue"];
    const jeans = ["light blue", "denim", "dark blue"];
    const shoes = ["white", "black", "light brown", "dark brown"];

    res.json({
        tops: _.sample(tops),
        jeans: _.sample(jeans),
        shoes: _.sample(shoes)
    });
});

/**
 * Get all comments
 */
app.get("/comments", (req, res) => {
    res.json(data)
})

/**
 * Get a specific comment by id
 */
app.get("/comment/:id", (req, res) => {
    const id = req.params.id;
    const content = data.comments.find(item => item.id === id);

    if(!content){
        return res.sendStatus(404)
    }

    res.status(201).json(content)
});

/**
 * Create a new comment
 */
app.post("/comment", (req, res) => {
    const content = req.body.content;
    const author = req.body.author;
    const location = req.body.location;
    
    const newComment = {
        id: uuid(),
        properties: {
            content,
            author,
            location
        }
    };

    if(!content || !author || !location){
        return res.sendStatus(400);
    }

    data.comments.push(newComment);
    res.status(201).json(data)
});

// Start server on port 3000
app.listen("3000", () => {
    console.log("Server running on port 3000")
}); 
