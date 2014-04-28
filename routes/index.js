var User = require('../models/user');
var Tweet = require('../models/tweet');
var crypto = require('crypto');
module.exports = function(app){
	app.get('/', function(req, res){
	  res.render('index');
	});
	app.get('/u/:user',checkLogin);
	app.get('/u/:user', function(req, res){
		console.log('User--> '+req.session.user.name);
		Tweet.get(req.session.user.name, function(err, tweets){
			if(err){
				req.flash('error',err);
				res.redirect('/');
			}
			console.log('Tweets.length ==> ' + tweets.length);
			res.render('home',{user:req.session.user,tweets:tweets});
		});
	});
	app.post('/post',checkLogin);
	app.post('/post', function(req, res){
		var tweet = new Tweet(req.session.user.name, req.params.content, new Date());
		tweet.save(function(err, tweet){
			if(err){
				req.flash('error', err);
				res.redirect('/');
			}
			req.flash('success','post tweet success!');
			res.redirect('/u/'+req.session.user.name);
		});
	});
	app.get('/reg',checkNotLogin);
	app.get('/reg', function(req, res){
		res.render("register");
	});
	app.post('/reg',checkNotLogin);
	app.post('/reg', function(req, res){
		var params = req.body;
		if(params.name && params.pass && params['pass-repeat']){
			if (req.body['pass-repeat'] != req.body['pass']) {
				req.flash('error', 'make sure you input the same passwords.');
				return res.redirect('/reg');
			}
			var md5 = crypto.createHash('md5');
			var password = md5.update(req.body.pass).digest('base64');
			var newUser = new User({
				name: req.body.name,
				password: password,
			});
			User.get(newUser.name, function(err, user) {
				if (user)
					err = 'Username already exists.';
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}
				newUser.save(function(err) {
					if (err) {
						req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success', 'Congratulations, you are now one of MeatBall!');
				res.redirect('/');
				});
			});
		}else{
			req.flash('error', 'Sorry, all fields are required!');
			res.redirect('/reg');
		}
	});
	app.get('/login',checkNotLogin);
	app.get('/login', function(req, res){
		res.render('login');
	});
	app.post('/login',checkNotLogin);
	app.post('/login', function(req, res){
		var params = req.body;
		if(params.name && params.pass ){
			var md5 = crypto.createHash('md5');
			var password = md5.update(req.body.pass).digest('base64');
			User.get(req.body.name, function(err, user) {
				if (!user){
					req.flash('error', 'Username doesn\'t exists.');
					return res.redirect('/login');
				}
				if (err) {
					req.flash('error', err);
					return res.redirect('/login');
				}
				if (user.password != password) {
					req.flash('error', 'Wrong password');
					return res.redirect('/login');
				}
				req.session.user = user;
				res.redirect('/u/'+user.name);
			});
		}else{
			req.flash('error', 'Sorry, all fields are required!');
			res.redirect('/login');
		}
	});
	app.get('/logout',checkLogin);
	app.get('/logout', function(req, res){
		req.session.user = null;
		req.flash('success', 'Logout success');
		res.redirect('/');
	});
	function checkLogin(req, res, next){
		if(!req.session.user){
			req.flash('error','Please login first!');
			return res.redirect('/login');
		}
		next();
	}
	function checkNotLogin(req, res, next){
		if(req.session.user){
			req.flash('error','You have already login!');
			return req.redirect('/');
		}
		next();
	}
	return app.router;
};