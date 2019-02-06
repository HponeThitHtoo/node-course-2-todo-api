// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

/* var user = {name: 'andrew', age: 25};
var {name} = user;
console.log(name); */

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    /* db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2)); // result.ops >> documents
    }); */

    /* db.collection('Users').insertOne({
        // _id: 123,
        name: 'Peter Pan',
        age: 34,
        location: 'Yangon Myanmar'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2)); // result.ops >> documents
        // console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    }); */

    client.close();
});