const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// own routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// own controller
const errorController = require('./controllers/error');

// mongodb connection
const mongoConnect = require('./util/database').mongoConnect;

// mongodb models
const User = require('./models/user');

// setup express app
const app = express();

// set custom views engine
app.set('view engine', 'ejs');
app.set('views', 'views')

// use body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// append user to request
app.use((req, res, next) => {
    User.findById('60eb902450f8a60329b3e91d')
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id)
        next();
    })
    .catch(err => console.log(err));
})

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// catch all 404s
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})
