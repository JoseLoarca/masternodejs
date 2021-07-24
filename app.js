const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

// setup express app
const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_CONNECTION,
    collection: 'sessions'
});
const csrfProtection = csrf({});

// set custom views engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findById(req.session.user._id)
            .then(user => {
                if (!user) {
                    return next();
                }

                req.user = user;
                next();
            })
            .catch(err => {
                next(new Error(err));
            });
    }
});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// render 500 errors
app.get('/500', errorController.get500);

// catch all 404s
app.use(errorController.get404);

// catch errors
app.use((error, req, res, next) => {
    res
        .status(500)
        .render('500', {
            pageTitle: 'Error!',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        });
})

mongoose.connect(process.env.MONGO_CONNECTION)
    .then(result => {
        app.listen(3000);
        console.log('Connected!')
    })
    .catch(err => {
        console.log(err);
    });
