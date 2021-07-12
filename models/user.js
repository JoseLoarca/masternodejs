const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    /**
     * Save a new User
     *
     * @returns {*}
     */
    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    /**
     * Find a new User by id
     *
     * @param userId
     * @returns {*}
     */
    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new ObjectId(userId)}).then(user => {
            console.log(user);
            return user;
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = User
