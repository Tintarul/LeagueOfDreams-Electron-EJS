var router = require('express').Router();
var Lobby = require('../models/Lobby');
var User = require('../models/user');
var Servers = require('../models/Servers');

router.get('/api/servers', function(req, res, next){
	Servers.find({Status: "ONLINE"}, function(err, servers){
		if (err) {
			console.log(err);
			res.send('{}');
		} else {
			res.send(servers);
		}
	});
});

router.get('/api/servers/submit', function(req, res, next){
	var Name = req.query.Name;
	var Motd = req.query.Motd;
	var IP = req.query.IP;
	if(Name && Motd && IP){
		var server = new Servers({
			Name: Name,
			Motd: Motd,
			IP: IP,
			status: "NOT_VERIFIED"	// NOT_VERIFIED, ONLINE, OFFLINE
		});
		server.save(function(err){
			if (err) {
				console.log(err);
				res.send('{"error": "Server Already Exists"}');
			} else {
				server.status = true;
				res.send(server);
			}
		});
	}else{
		res.send('{"error": "Missing Parameters"}');
	}
});

router.get('/api/servers/verify', function(req, res, next){
	var IP = req.query.IP;
	if(IP){
		Servers.findOne({IP: IP}, function(err, server){
			if (err) {
				console.log(err);
				res.send('{"error": "Server Not Found"}');
			} else {
				if(server){
					if(req.user){
						User.findOne({_id: req.user._id}, function(err, user){
							if(err){
								console.log(err);
								res.send('{"error": "User Not Found"}');
							} else {
								if(user){
									if(user.admin){
										server.Status = "ONLINE";
										server.save(function(err){
											if (err) {
												console.log(err);
												res.send('{"error": "Server Not Found"}');
											} else {
												res.send(server);
											}
										});
									} else {
										res.send('{"error": "You are not an Admin"}');
									}
								} else {
									res.send('{"error": "User Not Found"}');
								}
							}
						});
					} else {
						res.send('{"error": "You are not logged in"}');
					}
				}else{
					res.send('{"error": "Server Not Found"}');
				}
			}
		});
	} else {
		res.send('{"error": "Missing Parameters"}');
	}
});

router.get('/api/servers/delete', function(req, res, next){
	var IP = req.query.IP;
	if(IP){
		Servers.findOne({IP: IP}, function(err, server){
			if (err) {
				console.log(err);
				res.send('{"error": "Server Not Found"}');
			} else {
				if(server){
					User.findOne({_id: req._id}, function(err, user){
						if(err){
							console.log(err);
							res.send('{"error": "User Not Found"}');
						} else {
							if(user){
								if(user.admin){
									server.remove(function(err){
										if (err) {
											console.log(err);
											res.send('{"error": "Server Not Found"}');
										} else {
											res.send('{"success": "Server Deleted"}');
										}
									});
								} else {
									res.send('{"error": "You are not an Admin"}');
								}
							} else {
								res.send('{"error": "User Not Found"}');
							}
						}
					});
				}else{
					res.send('{"error": "Server Not Found"}');
				}
			}
		});
	} else {
		res.send('{"error": "Missing Parameters"}');
	}
});

router.get('/api/servers/update', function(req, res, next){
	var IP = req.query.IP;
	var Motd = req.query.Motd;
	var Name = req.query.Name;
	var Status = req.query.Status;
	var statuses = ["NOT_VERIFIED", "ONLINE", "OFFLINE"];
	if(IP || Motd || Name || Status){
		Servers.findOne({IP: IP}, function(err, server){
			if (err) {
				console.log(err);
				res.send('{"error": "Server Not Found"}');
			} else {
				if(server){
					User.findOne({_id: req._id}, function(err, user){
						if(err){
							console.log(err);
							res.send('{"error": "User Not Found"}');
						} else {
							if(user){
								if(user.admin){
									if(Motd){
										server.Motd = Motd;
									}
									if(Name){
										server.Name = Name;
									}
									if(Status){
										if(statuses.indexOf(Status) > -1){
											server.status = Status;
										}
									}
									server.save(function(err){
										if (err) {
											console.log(err);
											res.send('{"error": "Server Not Found"}');
										} else {
											res.send(server);
										}
									});
								} else {
									res.send('{"error": "You are not an Admin"}');
								}
							} else {
								res.send('{"error": "User Not Found"}');
							}
						}
					});
				}else{
					res.send('{"error": "Server Not Found"}');
				}
			}
		});
	} else {
		res.send('{"error": "Missing Parameters"}');
	}
});

module.exports = router;