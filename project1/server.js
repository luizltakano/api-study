const express = require('express');
const _ = require("lodash");
const {v4:uuid} = require("uuid");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());

const data = {comments:[]};

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

app.get("/comments", (req, res) => {
    res.json(data)
})

app.post("/comment", (req, res) => {
    
    const newComment = {
        content: req.body.content,
        author: req.body.author,
        location: req.body.location,
        id: uuid()
    }

    if(!newComment.content || !newComment.author || !newComment.location){
        return res.sendStatus(400);
    }

    data.comments.push(newComment);

    res.status(201).json(data)
})

app.listen("3000", () => {
    console.log("Server running on port 3000")
}); 