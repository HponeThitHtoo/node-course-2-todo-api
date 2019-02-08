
/* var newTodo = new Todo({
    text: 'Cook dinner'
});

newTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo');
}); */

/* var otherTodo = new Todo({
    text: 'Feed the cat',
    completed: true,
    completedAt: 123
});

otherTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
    console.log('Unable to save', e);
}); */

// User
// email - require it - trim it - set type - set min length of 1


/* var newUser = new User({
    email: 'white.nuzzle@gmail.com'
});

newUser.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
    console.log('Unable to save', e);
}); */

var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000; // for heroku

app.use(bodyParser.json()); // set middleware to use bodyParser.json()

app.post('/todos', (req, res) => {
    // console.log(JSON.stringify(req.body, undefined, 2));
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e); // http 400 status code error putting manually
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// Get /todos/1234344
app.get('/todos/:id', (req, res) => {
    // res.send(req.params);
    var id = req.params.id;

    // Valid id using isValid
    if (!ObjectID.isValid(id)) {
        // 404 - send back empty send
        return res.status(404).send();
    }

    // findById
    Todo.findById(id).then((todo) => { // success
        if (!todo) {
            // if no todo - send back 400 with empty body
            return res.status(404).send();
        }
        // if todo - send it back
        res.send({todo});
    }).catch((e) => { // error
        // 400 - and send empty body back
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };