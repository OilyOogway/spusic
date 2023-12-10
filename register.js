const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://idhar01:bearniles7@cluster0.m9zr1ap.mongodb.net/?retryWrites=true&w=majority';


mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  highScore: {
    type: Number,
    default: 0,
  },
});

const Login = mongoose.model('login', loginSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Login route
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const user = await Login.findOne({ username, password }).exec();

    if (user) {
      res.send(`Welcome, ${username}! Your high score is ${user.highScore}`);
    } else {
      res.status(401).send('Invalid username or password.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Registration route
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const existingUser = await Login.findOne({ username }).exec();
    if (existingUser) {
      return res.status(409).send('Username already exists. Please choose another one.');
    }

    const newUser = new Login({ username, password });
    await newUser.save();

    res.send(`Account created successfully for ${username}!`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
