const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// own routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// own controller
const errorController = require('./controllers/error');

// sequelize
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

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
    User.findByPk(1)
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

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});


// sequelize sync
sequelize.sync()
.then(result => {
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        return User.create({name: 'Jose', email: 'jose.loarca.hass@gmail.com'});
    }

    return user;
}).then(user => {
    return user.createCart();
}).then(cart => {
    // listen on port xxxx
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
