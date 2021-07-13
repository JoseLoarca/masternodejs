require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// own routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// own controller
const errorController = require('./controllers/error');

// import mongoose
const mongoose = require('mongoose');

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
    User.findById('60ed156d3bb1d02760d73603')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// catch all 404s
app.use(errorController.get404);

mongoose.connect(process.env.MONGO_CONNECTION)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Jose',
                    email: 'jc@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
    app.listen(3000);
}).catch(err => {
    console.log(err);
})
