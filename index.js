const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const connection = require("./database/connection");
connection.authenticate().then(() => console.log("Conexão realizada!"));

const Question = require("./database/Question");
const Answer = require("./database/Answer");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    Question.findAll({ 
        raw: true, 
        order: [[ "id", "DESC" ]] 
    }).then((questions) => {
        res.render("index", { questions: questions });
    });
});

app.get("/make-question", (req, res) => {
    res.render("make-question");
});

app.post("/save-question", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/answer-question/:id", (req, res) => {
    const id = req.params.id;

    Question.findOne({ 
        raw: true,
        where: { id: id }
    }).then((question) => {
        if (question != undefined) {
            Answer.findAll({
                raw: true,
                order: [ [ "id", "DESC" ] ],
                where: { questionId: question.id }
            }).then((answers) => {
                if (answers != undefined) {
                    res.render("answer-question", {
                        question: question,
                        answers: answers
                    });
                } else {
                    res.render("answer-question", {
                        question: question 
                    });
                }
            });
        } else {
            res.redirect("/");
        }
    });
});

app.post("/save-answer", (req, res) => {
    const body = req.body.body;
    const questionId = req.body.questionId;

    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect(`/answer-question/${questionId}`);
    });
});

app.listen(3000, (error) => {
    if (error) {
        console.log("error");
    } else {
        console.log("The server started successfully");
    }
})