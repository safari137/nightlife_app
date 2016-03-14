var express         = require('express'),
    User            = require('./models/user'),
    yelpController  = require('./controllers/yelpController'),
    userController  = require('./controllers/userController');
    
    
function routes(app, passport) {
    yelpController = new yelpController();
    userController = new userController(passport);
    
    app.route("/")
        .get(yelpController.sendBlankOrUserPage);
        
    app.route("/login")
        .get(userController.startLogin)
        .post(userController.login);
        
    app.route("/signup")
        .get(userController.startSignup)
        .post(userController.signup);
        
    app.route("/logout")
        .get(userController.logout);
    
    app.route("/api/search")
        .get(yelpController.apiSearch);
        
    app.route("/api/attending/:id")
        .get(yelpController.getUsersAttending)
        .post(yelpController.markAttending);
        
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