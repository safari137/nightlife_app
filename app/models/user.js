var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    attending: String
});

module.exports = mongoose.model("User", userSchema);