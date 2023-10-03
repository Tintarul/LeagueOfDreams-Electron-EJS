var router = require('express').Router();  
var Lobby = require('../models/Lobby');
var user = require('../models/user');
var fs = require("fs");
var path = require("path");
//fetch to get api response
var http = require("http");

//PAGINATE USERS PLS
function paginateUsers(req, res, whatToRender, next){
	var page = req.query.page || 1;
	var limit = req.query.limit || 10;
	var skip = (page - 1) * limit;
	var query = {};
	if(req.query.search){
		query = {
			$or: [
				{username: {$regex: req.query.search, $options: 'i'}},
				{displayname: {$regex: req.query.search, $options: 'i'}}
			]
		}
	}
	user.find(query).skip(skip).limit(limit).exec(function(err, users){
		if(err){
			console.log(err);
		} else {
			user.count(query).exec(function(err, count){
				if(err){
					console.log(err);
				} else {
					res.render(whatToRender, {
						users: users,
						page: page,
						limit: limit,
						count: count,
						search: req.query.search
					});
				}
			});
		}
	});
};

router.post('/search', function(req, res, next){
	res.redirect('/search?q=' + req.body.q);
});

router.get('/search', function(req, res, next){
	paginateUsers(req, res, 'main/home', next);
});

router.get("/", function(req, res, next){
	if(req.user){
		let url = "http://spoke-group.com:3000/api/servers/";

		http.get(url, function(rsp){
			var body = '';
		
			rsp.on('data', function(chunk){
				body += chunk;
			});
		
			rsp.on('end', function(){
				var jsonResponse;
				try {
					jsonResponse = JSON.parse(body);
				} catch(e){
					jsonResponse = [];
				}
				res.render('main/home', {servers: jsonResponse});
			});
		}).on('error', function(e){
			var json = [{Name: "Fatal error while loading server", Motd: "", IP: ""}];
			res.render('main/home', {servers: json});
		});
	}
	else{
		res.redirect('/login');
	}
});

router.get('/js/jquery.min.js', function(req, res, next){
	res.redirect("https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js");
});

router.get("/img", function (req, res, next){
	var name = req.query.file;
	let reqPath = path.join(__dirname, '../public/img/');
	let exists = fs.existsSync(reqPath + name + ".png");
	if(exists){
		res.sendFile(reqPath + name + ".png");
	} else {
		let reqPath = path.join(__dirname, '../public/img/');
		let exists = fs.existsSync(reqPath + name + ".jpg");
		if(exists){
			res.sendFile(reqPath + name + ".jpg");
		} else {
			res.send("404 NOT FOUND");
		}
	}
});
 
router.get("/js", function (req, res, next){
	var name = req.query.file;
	let reqPath = path.join(__dirname, '../public/js/');
	let exists = fs.existsSync(reqPath + name + ".js");
	if(exists){
		res.sendFile(reqPath + name + ".js");
	} else {
		let reqPath = path.join(__dirname, '../public/js/');
		let exists = fs.existsSync(reqPath + name + ".js");
		if(exists){
			res.sendFile(reqPath + name + ".js");
		} else {
			res.send("404 NOT FOUND");
		}
	}
});

router.get("/css", function (req, res, next){
	var name = req.query.file;
	let reqPath = path.join(__dirname, '../public/css/');
	let exists = fs.existsSync(reqPath + name + ".css");
	if(exists){
		res.sendFile(reqPath + name + ".css");
	} else {
		let reqPath = path.join(__dirname, '../public/css/');
		let exists = fs.existsSync(reqPath + name + ".css");
		if(exists){
			res.sendFile(reqPath + name + ".css");
		} else {
			res.send("404 NOT FOUND");
		}
	}
});

router.get("/file", function (req, res, next){
	var name = req.query.file;
	let reqPath = path.join(__dirname, '../public/resources/');
	let exists = fs.existsSync(reqPath + name);
	if(exists){
		res.sendFile(reqPath + name);
	} else {
		let reqPath = path.join(__dirname, '../public/resources/');
		let exists = fs.existsSync(reqPath + name);
		if(exists){
			res.sendFile(reqPath + name);
		} else {
			res.send("404 NOT FOUND");
		}
	}
});




module.exports = router;
