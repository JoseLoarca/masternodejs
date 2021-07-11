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
    // User.findByPk(1)
    // .then(user => {
    //     req.user = user;
    //     next();
    // })
    // .catch(err => console.log(err));
    next();
})

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// catch all 404s
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})
