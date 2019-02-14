var env = process.env.NODE_ENV || 'development'; // for heroku OR for testing to use test DB
// console.log('env *****', env);

if (env === 'development' || env === 'test') {
    var config = require('./config.json'); // auto return JS Object
    // console.log(config);
    var evnConfig = config[env];

    // console.log(Object.keys(evnConfig)); // return keys of object
    Object.keys(evnConfig).forEach((key) => {
        process.env[key] = evnConfig[key];
    });
}

/* if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
} */