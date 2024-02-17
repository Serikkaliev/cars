const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const authService = require('./services/authService');
const historicalEventService = require('./services/hisEventsService');
const hisFigureService = require('./services/hisFigureService');
const userService = require('./services/userService');
const app = express();

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://serikkalievduman:142536Duman@dumanmongodb.opsfszd.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve images from the 'images' directory
app.use('/images', express.static('images'));

// Route handler for the main page
app.get('/', (req, res) => {// Get the authenticated user from the session
  res.render('index',{message: null}); // Pass the user object to the index template
});

app.post('/login', async (req, res) => {
    const user = req.body;
    try {
      const isAdmin = await authService.login(user);
      if(isAdmin){
        res.redirect('/admin');
      }
      else{
        res.redirect('/home');
      }
    }
    catch (error) {
      res.render('index', { message: error.message });
    }
});

app.get('/register', (req, res) => {
  res.render('register', { message: null });
});

app.post('/register', async (req, res) => {
  const user = req.body;
  try {
    const result = await authService.register(user);
    if(result){
      res.redirect('/home');
    }
  }
  catch (error) {
    res.render('register', { message: error.message });
  }
});

app.get('/home', async (req, res) => {
  const text = req.query.text || 'kazakhstan';
  try {
    const events = await historicalEventService.getEvents(text);
    res.render('home', { events });
  }
  catch (error) {
    res.render('home', { message: error.message });
  }
});

app.get('/hisEvents', async (req, res) => {
    const text = req.query.text || 'kazakhstan';
    try {
        const events = await historicalEventService.getEvents(text);
        res.render('home', { events });
    }
    catch (error) {
        res.render('home', { message: error.message });
    }
})

app.get('/figures', async (req, res) => {
  const name = req.query.name || 'cesar';
    try {
      const figures = await hisFigureService.getFigures(name);
        res.render('historicalFigures', { figures });
    }
    catch (error) {
      res.render('home', { message: error.message });
    }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/admin', async (req,res) =>{
    try {
        const users= await userService.getUsers();
        res.render('admin', { users });
    }
    catch (error) {
        res.render('admin', { message: error.message });
    }
})
app.post('/admin/delete', async (req, res) => {
    const id = req.body.id;
    try {
        await userService.deleteUser(id);
        res.redirect('/admin');
    }
    catch (error) {
        res.redirect('/admin');
    }
})
app.post('/admin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin === 'on';
    try {
        await userService.createUser(username, password, isAdmin);
        res.redirect('/admin');
    }
    catch (error) {
        res.redirect('/admin');
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
