
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

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); // set middleware to use bodyParser.json()

app.post('/todos', authenticate, (req, res) => {
    // console.log(JSON.stringify(req.body, undefined, 2));
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e); // http 400 status code error putting manually
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// Get /todos/1234344
app.get('/todos/:id', authenticate, (req, res) => {
    // res.send(req.params);
    var id = req.params.id;

    // Valid id using isValid
    if (!ObjectID.isValid(id)) {
        // 404 - send back empty send
        return res.status(404).send();
    }

    // findById and user _id
    Todo.findOne({
        _id:id,
        _creator: req.user._id
    }).then((todo) => { // success
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

app.delete('/todos/:id', authenticate, (req, res) => {
    // get the id
    var id = req.params.id;

    // Valid id using isValid
    if (!ObjectID.isValid(id)) {
        // 404 - send back empty send
        return res.status(404).send();
    }

    // remove todo by id
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        // success
        // if no doc, send 404
        if (!todo) {
            return res.status(404).send();
        }

        // if doc, send doc back with 200
        res.send({todo});
    }).catch((e) => {
        // error
        // 400 with empty
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => { // retuen new updated todo object
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
        // res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user); // custom header
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/* app.get('/users/me', (req, res) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            res.status(401).send();
        }

        res.send(user);
    }).catch((e) => {
        res.status(401).send();
    });
}); */

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        // res.send(user);
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };