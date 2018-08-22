const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//Importing functions for routes
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Initializing the Library
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1', // localhost 
        user: '',
        password: '',
        database: 'face-recognition-app'
    }
});


// Creating the server
const app = express();

// Incoming data will be parsed 
// "use" method because it's a middleware
app.use(bodyParser.json());

// Enables ‘Access-Control-Allow-Origin’
app.use(cors());

// Creating Person constructor 
class Person {
    constructor(name, email, password, entries = 0, joined = new Date(), id = uniqid()) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.entries = entries;
        this.joined = joined;
        this.id = id;
    }
}

// Lookalike database with users
const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: "987",
      has: "",
      email: "john@gmail.com"
    }
  ]
};

// Root route
app.get('/', (req, res) => {
    res.send(database.users);
});

// Route for signing up 
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) }) // Dependency injection

// Route for registering a user
app.post('/register', (req, res) => { register.handleRegister(req,res, db, bcrypt)}); // Dependency injection

// Route for getting user information with id 
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)});

// This route updates the score for the number of images detected 
app.put('/image', (req, res) => { image.incrementEntriesImage(req, res, db) });

// Route for receiving value of input field
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

// Listen to port 3000
app.listen(3000, () => {
    console.log('App is running on port 3000');
});



/*
Routes that I need
- "/" => root route
- "/signin" => POST = success/fail (will be send through the body)
- "/register" => POST = user (will be send through the body)
- "/profile/:userId" => GET = will return us the user (will be send as params)
- "/image" => PUT => return update user object
*/