var express         = require('express'),
    User            = require('./models/user'),
    yelpController  = require('./controllers/yelpController'),
    userController  = require('./controllers/userController');
    
    
function routes(app, passport) {
    yelpController = new yelpController();
    userController = new userController(passport);
    
    app.route("/")
        .get(function(req, res) {
            res.render("index");
        });
        
    app.route("/login")
        .get(userController.startLogin)
        .post(userController.login);
        
    app.route("/signup")
        .get(userController.startSignup)
        .post(userController.signup);
        
    app.route("/logout")
        .get(userController.logout);
    
    app.route("/api/search")
        .get(yelpController.search);
        
    app.route("/api/attending/:id")
        .get(yelpController.getUsersAttending);
    
    app.route("/api/:user/attending/:id") 
        .get(isLoggedIn, yelpController.markAttending)
        
    app.route("/*")
        .get(function(req, res) {
            res.redirect("/");
        });
}

module.exports = routes;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}