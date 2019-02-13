const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/* {
    email: 'andrew@example.com',
    password: 'asdfsdf32343',
    tokens: [{
        access: 'auth',
        token: 'asdff23431awdf'
    }]
} */

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: { // see mongoose doc and validator package
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// overide toJSON method
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); // data, secret-key

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
}

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        /* return new Promise((resolve, reject) => {
            reject();
        }); */
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.pre('save', function(next) {
    var user = this;

    // var hashPassword = '$2a$10$Ra2POB4hfbEPruD6H4kEz.epzEA9CoOauTEyu8RMWAQHt/ZHujHkC';

    if (user.isModified('password')) { // this will run for new created user and when modify user password
        bcrypt.genSalt(10, (err, salt) => {
            // user.password
            bcrypt.hash(user.password, salt, (err, hash) => {
                // user.password = hash;
                // next();
                user.password = hash;
                next();
            });
        });      
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };