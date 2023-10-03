var router = require('express').Router(); 
var passport = require('passport');
var passportConf = require('../config/passport');

router.get('/login', function(req, res){
	if (req.user) return res.redirect('/');
	res.render('accounts/login', {message: req.flash('loginMessage'), errors: req.flash('errors')});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));
 
router.get('/signup', async function(req, res){
	res.render('accounts/signup', {
		errors: req.flash('errors')
	});
});

router.post('/signup', passport.authenticate('local-register', {
	successRedirect: '/',
	failureRedirect: '/signup',
	failureFlash: true
}));
 
router.get('/logout', function(req, res){
	req.logout(function(err) {
		if (err) { console.log(err); }
		res.redirect('/');
	});
});

module.exports = router;
















