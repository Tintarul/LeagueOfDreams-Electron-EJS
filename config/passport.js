var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var secret = require('../config/secret');
var User = require('../models/user');

var async = require('async');
// serialize and deserialize

passport.serializeUser(function(user, done){
	done(null, user._id);
});


passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

// Middleware

passport.use('local-login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'username',
	passReqToCallback: true
}, function(req, username, password, done) {
		password = "0"

			User.findOne({ username: username}, function(err, user){
				if (err) return  done(err);

				if (!user) {
					return done(null, false, req.flash('loginMessage', 'User not found'));
				}
				return done(null, user);
			})
}));

passport.use('local-register', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'displayname',
	passReqToCallback: true
}, function(req, username, password, done) {
	console.log("Creating user")
	var createUser = new User();
	User.findOne({ username: username}, function(err, user){
		if (err) return  done(err);
		if (!user) {
			console.log("uSER DOESNT exist");
			if(typeof username === 'undefined' || username == "" || username == " " || typeof password === 'undefined' || password == "" || password == " ") {
				return done(null, false, req.flash('errors', 'Empty spaces not allowed'));
			} else {
				console.log("Values are not empty and user exists");
				createUser.username = username;
				createUser.displayname = password;
				console.log("Set new values");
				createUser.save(function(err, user){
					if (err) return next(err);
					console.log("Saving user");
					return done(null, user);
				});
			}
		} else {
			console.log("User already exist");
			return done(null, false, req.flash('errors', 'User already exists'));
		}
	});
}));

// custom function to validate

exports.isAuthenticated = function(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}








