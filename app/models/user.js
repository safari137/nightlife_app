var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    attending: {
        id: String,
        date: Date
    }
});

module.exports = mongoose.model("User", userSchema);