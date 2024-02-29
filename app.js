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
const jwt = require('jsonwebtoken');
const Item = require('./models/item');
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
      req.session.token = jwt.sign({isAdmin}, 'my-secret-key', {expiresIn: 60 * 60});
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
      res.redirect('/');
    }
  }
  catch (error) {
    res.render('register', { message: error.message });
  }
});

app.get('/home', authMiddleware, async (req, res) => {
  const text = req.query.text || 'kazakhstan';
  try {
    const events = await historicalEventService.getEvents(text);
    res.render('home', { events });
  }
  catch (error) {
    res.render('home', { message: error.message });
  }
});

app.get('/hisEvents',authMiddleware, async (req, res) => {
    const text = req.query.text || 'kazakhstan';
    try {
        const events = await historicalEventService.getEvents(text);
        res.render('home', { events });
    }
    catch (error) {
        res.render('home', { message: error.message });
    }
})

app.get('/figures',authMiddleware, async (req, res) => {
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

app.get('/admin',authMiddleware, async (req,res) =>{
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
app.post('/admin', authMiddleware, async (req, res) => {
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
function authMiddleware(req, res, next) {
    // Check if the token exists in the session
    if (req.session && req.session.token) {
        // Token exists, so user is authenticated
        next(); // Continue to the next middleware or route handler
    } else {
        // Token doesn't exist, so user is not authenticated
        res.render('index', {message: 'You have not token, you need first login'})// Respond with 401 Unauthorized
    }
}
app.post('/add-item', authMiddleware,async (req, res) => {
    const { pictures, name1, name2, description1, description2 } = req.body;

    const newItem = new Item({
        pictures: pictures.split(',').map(url => url.trim()),
        names: [{ lang: 'en', name: name1 }, { lang: 'es', name: name2 }],
        descriptions: [{ lang: 'en', description: description1 }, { lang: 'es', description: description2 }]
    });

    try {
        await newItem.save();
        res.redirect('/admin'); // Redirect to admin page after adding the item
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding item');
    }
});

app.get('/items', authMiddleware,async (req, res) => {
    try {
        const items = await Item.find();
        res.render('itemsList', { items });
    } catch (error) {
        console.error(error);
    }
});

app.get('/items-add-page', authMiddleware, (req, res) => {
    res.render('ItemAdd');
})
app.get('/items-for-admin',authMiddleware, async (req, res) => {
    try {
        const items = await Item.find();
        res.render('itemsListAdmin', { items });
    } catch (error) {
        console.error(error);
    }
});
// Route to handle item deletion
app.post('/delete-item/:id', authMiddleware,async (req, res) => {
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.redirect('/items-for-admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting item');
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
