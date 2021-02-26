// db
const db = require('../util/database');

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static getById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?', [id]);
    }

    static deleteById(id) {

    }

    save() {
        return db.execute('INSERT INTO products(title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]);
    }
}
