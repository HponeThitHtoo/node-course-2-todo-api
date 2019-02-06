// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // deleteMany
    /* db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    }); */

    // deleteOne // only first matched one will be deleted
    /* db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    }); */

    // findOneAndDelete // only first matched one will be deleted
    /* db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
    }); */

    // deleteMany
    /* db.collection('Users').deleteMany({name: 'Peter Pan'}).then((result) => {
        console.log(result);
    }); */

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c5aab77704d522b38128036')}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });

    // client.close();
});