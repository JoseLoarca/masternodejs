const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const rootDir = require('./util/path');

// own routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// setup express app
const app = express();

// set custom views engine
app.set('view engine', 'pug');

// use body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// catch all 404s
app.use(((req, res, next) => {
    res.render('404', {pageTitle: 'Page not found'});
}));

// listen on port xxxx
app.listen(3000);
