const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

// remove all
/* Todo.deleteMany({}).then((result) => {
    console.log(result);
}); */

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

/* Todo.findOneAndDelete({_id: '5c6118dabe0dc0a3bf22d57d'}).then((todo) => {

});
 */
Todo.findByIdAndDelete('5c6118dabe0dc0a3bf22d57d').then((todo) => {
    console.log(todo);
});