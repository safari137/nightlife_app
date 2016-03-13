var mongoose    = require('mongoose'),
    User        = require("../models/user");

var userController = function(passport) {
    
    this.startLogin = function(req, res) {
        res.render("login", { message: req.flash('loginMessage')} );
    }
    
    this.login = passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login'
    });
    
    this.startSignup = function(req, res) {
        res.render("signup", { message: req.flash('signupMessage') });
    }
    
    this.signup = passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup'
    });
    
    this.logout = function(req, res) {
        req.logout();
        res.redirect("/");
    }
}

module.exports = userController;