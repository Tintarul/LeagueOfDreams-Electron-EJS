let sockets = [];
let lobbies = {};
var User = require('../models/user');
var Lobby = require('../models/Lobby');
let GameServer = require('../middlewares/gameServer.js');
var maps = {'Old SR': 1, 'Old 3v3': 10, 'New SR': 11, 'ARAM': 12, 'Crystal Scar': 8};
var trueFalse = {'on': true, 'off': false};
var ports = [];
var defaultPort = 3001;
var Champs = [
    "Aatrox",
    "Ahri",
    "Akali",
    "Alistar",
    "Amumu",
    "Anivia",
    "Annie",
    "Ashe",
    "Azir",
    "Blitzcrank",
    "Brand",
    "Braum",
    "Caitlyn",
    "Cassiopeia",
    "Chogath",
    "Corki",
    "Darius",
    "Diana",
    "DrMundo",
    "Draven",
    "Elise",
    "Evelynn",
    "Ezreal",
    "FiddleSticks",
    "Fiora",
    "Fizz",
    "Galio",
    "Gangplank",
    "Garen",
    "Gnar",
    "Gragas",
    "Graves",
    "Hecarim",
    "Heimerdinger",
    "Irelia",
    "Janna",
    "JarvanIV",
    "Jax",
    "Jayce",
    "Jinx",
    "Karma",
    "Karthus",
    "Kassadin",
    "Katarina",
    "Kayle",
    "Kennen",
    "Khazix",
    "KogMaw",
	"Leblanc",
    "LeeSin",
    "Leona",
    "Lissandra",
    "Lucian",
    "Lulu",
    "Lux",
    "Malphite",
    "MasterYi",
    "MissFortune",
    "Mordekaiser",
    "Morgana",
    "Nami",
    "Nasus",
    "Nautilus",
    "Nidalee",
    "Nocturne",
    "Nunu",
    "Olaf",
    "Orianna",
    "Pantheon",
    "Poppy",
    "Quinn",
    "Rammus",
    "Renekton",
     "Rengar",
     "Riven",
     "Rumble",
     "Ryze",
     "Sejuani",
     "Shaco",
     "Shen",
     "Shyvana",
     "Singed",
     "Sion",
     "Sivir",
     "Skarner",
     "Sona",
     "Soraka",
     "Swain",
     "Syndra",
     "Talon",
     "Taric",
     "Teemo",
     "Thresh",
     "Tristana",
     "Trundle",
     "Tryndamere",
     "TwistedFate",
     "Twitch",
     "Udyr",
     "Urgot",
     "Varus",
     "Vayne",
     "Veigar",
     "Velkoz",
     "Vi",
     "Viktor",
     "Vladimir",
     "Volibear",
     "Warwick",
     "MonkeyKing",
     "Xerath",
     "XinZhao",
     "Yasuo",
     "Yorick",
     "Zac",
     "Zed",
     "Ziggs",
     "Zilean",
     "Zyra"
];


module.exports = function(livesession) {
  var io = livesession;
  
	io.on('connection', (socket) => {
		console.log("Got session"); 
		sockets.push(socket);
		const index = sockets.indexOf(socket);
		 
		socket.on('login', (id) => {
			socket['id'] = "";
			socket['displayname'] = "";
			socket['lobbyName'] = ""; 
			socket['login'] = false;
			sockets[index]['id'] = "";
			sockets[index]['displayname'] = "";
			sockets[index]['lobbyName'] = "";
			sockets[index]['login'] = false;

			if(socket.login == false){
				User.findOne({ _id: id }, function(err, docs) {
					if (err) console.error(err);
					if(docs){
						socket['id'] = docs._id;
						socket['username'] = docs._id;
						socket['displayname'] = docs.displayname;
						socket['lobbyName'] = docs.lobbyName;
						
						sockets[index]['id'] = docs._id;
						sockets[index]['username'] = docs._id;
						sockets[index]['displayname'] = docs.displayname;
						sockets[index]['lobbyName'] = docs.lobbyName;
						console.log("Welcome " + docs.displayname + "!");
						socket.login = true;
						sockets[index].login = true;
						Lobby.find({}, function(err, existingLobb){
							var data = {};
							console.log("Updating lobbies from server-side");
							data.lobbies = existingLobb;
							data.action = "load";
							sockets[index].emit('updateLobbies', data);
						})
					} else {
						console.log("Unusual activity, disconnected socket.");
						socket.disconnect();
					}
				});
				console.log("ENDED LOGIN");
			} else {
				console.log("Unusual activity, disconnected socket.");
				socket.disconnect();
			}
		});

		socket.on('join', (lobbyName) => {
			var id = socket['id'];
			Lobby.findOne({ name: lobbyName }, function(err, existingLobb){
				var admin = 0;
				if(existingLobb){
					socket.emit('getInLobby', lobbyName);
					if(existingLobb.settings.adminForAll){
						admin = 1;
					};
					User.findOne({ _id: id }, function(err, existingUser){
						if(existingUser){
							if(existingLobb.teamRed == 5) {
								if(existingLobb.teamBlue == 5){
									console.log("Lobbies full");
									socket.emit('leaveLobby');
								} else {
									existingLobb.players.push({username: socket.username, displayname: existingUser.displayname, admin: admin, team: "BLUE"});
									existingLobb.teamBlue += 1;
									Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"players": existingLobb.players}}, {upsert: true}, function(err, doc) {
										Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamBlue": existingLobb.teamBlue}}, {upsert: true}, function(err, doc1) {
											Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamRed": existingLobb.teamRed}}, {upsert: true}, function(err, doc2) {
											});
										});
										socket['lobbyName'] = lobbyName;
										sockets[index]['lobbyName'] = lobbyName;
										var data = {};
										Lobby.find({}, function(err, result){
											data.lobby = result;
											data.action = "update";	
											for(var i = 0; i < sockets.length; i++){
												if(sockets[i].login){
													sockets[i].emit('updateLobbies', data);
													if(sockets[i]['lobbyName'] == lobbyName){
														sockets[i].emit('updatePlayers', existingLobb.players);
													}
												}
											}
										})
									});
								} 
							} else {
								existingLobb.players.push({username: socket.username, displayname: existingUser.displayname, admin: admin, team: "PURPLE"});
								existingLobb.teamRed += 1;
								Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"players": existingLobb.players}}, {upsert: true}, function(err, doc) {
									Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamBlue": existingLobb.teamBlue}}, {upsert: true}, function(err, doc1) {
										Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamRed": existingLobb.teamRed}}, {upsert: true}, function(err, doc2) {
										});
									});
									socket['lobbyName'] = lobbyName;
									sockets[index]['lobbyName'] = lobbyName;
									var data = {};
									Lobby.find({}, function(err, result){
										data.lobby = result;
										data.action = "update";	
										for(var i = 0; i < sockets.length; i++){
											if(sockets[i].login){
												sockets[i].emit('updateLobbies', data);
												if(sockets[i]['lobbyName'] == lobbyName){
													sockets[i].emit('updatePlayers', existingLobb.players);
												}
											}
										}
									})
								});
							}
						} else {
							console.log("Suspect activity, disconnecting socket");
							socket.disconnect();
						}
					});
				} else {
					console.log("Lobby doesnt exist 2222");
					socket.emit('leaveLobby');
				}
			});
		});
		
		socket.on('movePlayer', (lobbyName) => {
			var id = socket['id'];
			Lobby.findOne({ name: lobbyName }, function(err, existingLobb){
				var admin = 0;
				if(existingLobb){
					if(existingLobb.settings.adminForAll){
						admin = 1;
					};
					User.findOne({ _id: id }, function(err, existingUser){
						if(existingUser){
							for(var i = 0; i < existingLobb.players.length; i++){
								if(existingLobb.players[i].username == id){
									if(existingLobb.players[i].team == "PURPLE"){
										if(existingLobb.teamBlue < 5) {
											existingLobb.players[i].team = "BLUE";
											existingLobb.teamBlue += 1;
											existingLobb.teamRed -= 1;
										}
									} else {
										if(existingLobb.teamRed < 5) {
											existingLobb.players[i].team = "PURPLE";
											existingLobb.teamBlue -= 1;
											existingLobb.teamRed += 1;
										}
									}
								}
							}
							Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"players": existingLobb.players}}, {upsert: true}, function(err, doc) {
								Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamBlue": existingLobb.teamBlue}}, {upsert: true}, function(err, doc) {
									Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamRed": existingLobb.teamRed}}, {upsert: true}, function(err, doc) {
									});
								});
								socket['lobbyName'] = lobbyName;
								sockets[index]['lobbyName'] = lobbyName;
								var data = {};
								Lobby.find({}, function(err, result){
										data.lobby = result;
										data.action = "update";	
										for(var i = 0; i < sockets.length; i++){
											if(sockets[i].login){
												sockets[i].emit('updateLobbies', data);
												if(sockets[i]['lobbyName'] == lobbyName){
													sockets[i].emit('updatePlayers', existingLobb.players);
												}
											}
										}
								})
							});
						} else {
							console.log("Suspect activity, disconnecting socket");
							socket.disconnect();
						}
					});
				} else {
					console.log("Lobby doesnt exist 3333");
					socket.emit('leaveLobby');
				}
			});
		});

		socket.on('championSelectOpen', (lobbyName) => {
			if(socket.id){
				Lobby.findOne({name: socket.lobbyName}, function(err, result){
					if(err){console.error(err)};
					let admin = false;
					for(var i = 0; i < result.players.length; i++){
						if(result.players[i].username == socket['id']){
							if(result.players[i].admin > 0){
								admin = true;
							}
						}
					}
					if(admin){
						var players = result.players;
						console.log("Starting Champion Select");
						for(var i = 0; i < sockets.length; i++){
							if(sockets[i].lobbyName == socket.lobbyName){
								for(var a = 0; a < players.length; a++){
									if(players[a].username == sockets[i].id){
										console.log("Emitting to sockets[" + i + "]");
										sockets[i].emit("showChampionSelect");
									}
								}
							}
						}
					} else {
						console.log("YOU ARE NOT ALLOWED TO DO THAT");
					}
				});
			}
		});

		socket.on('message', (chatId, username, message) => {
			if(socket.id){
				for(var i = 0; i < sockets.length; i++){
					for(var a = 0; a < sockets.length; i++){
						if(sockets[i].chats[a].id == chatId){
							sockets[i].emit('gotMessage', chatId, username, message);
						}
					}
				}
			}
		});

		socket.on('startGame', () => {
			if(socket.id){
				Lobby.findOne({name: socket.lobbyName}, function(err, result){
					if(err){console.error(err)};
					let admin = false;
					for(var i = 0; i < result.players.length; i++){
						if(result.players[i].username == socket['id']){
							if(result.players[i].admin > 0){
								admin = true;
							}
						}
					} 
	
					if(admin){
						var players = result.players;
						console.log("Starting game");
						var settings = result['settings'];
						var gameServerPort = defaultPort + ports.length;
						ports.push(gameServerPort);
						GameServer.startGameServer(players, settings, gameServerPort, socket, result._id);
						for(var i = 0; i < sockets.length; i++){
							if(sockets[i].lobbyName == socket.lobbyName){
								for(var a = 0; a < players.length; a++){
									if(players[a].username == sockets[i].id){
										var id = a+1; 
										var token = "17BLOhi6KZsTtldTsizvHg==";
										console.log("Emitting to sockets[" + i + "]");
										sockets[i].emit("loadGame", token, id, gameServerPort);
										console.log("loadGame with port" + gameServerPort);
										
										let query = {$push: {"history": result}};

										User.findOneAndUpdate({ _id: socket.id }, query, function(userUpdated){
											console.dir(userUpdated);
										}).catch(function (error) {
											console.dir(error);
										});	
									}
								}
							}
						}
					} else {
						console.log("YOU ARE NOT ALLOWED TO DO THAT");
					}
				});
			}
		});

		socket.on('createLobby', (lobbyData) => {
			if(socket.id){
				User.findOne({ _id: socket.id }, function(err, existingUser){
					if(existingUser) {
						var admin = 1;
						var lobbyName = lobbyData.name;
						var lobbyPassword = "";
						var lobby = new Lobby();
						lobby.name = lobbyName;
						lobby.password = lobbyPassword;


						Lobby.findOne({ name: lobby.name }, function(err, existingLobb){
							if(existingLobb) {
								console.log("Lobby already exists");
								return;
							} else {
								//translating values
								lobbyData.map = maps[lobbyData.map];

								lobby['settings'].map = lobbyData.map;
								console.log("Map: " + lobbyData.map);
								lobby['settings'].cheats = lobbyData.cheats;
								lobby['settings'].mana = lobbyData.mana;
								lobby['settings'].cooldown = lobbyData.cooldown;
								lobby['settings'].minions = lobbyData.minions;
								lobby['settings'].adminForAll = lobbyData.adminForAll;
								lobby['settings'].gamemode = lobbyData.gamemode;
								lobby.save(function(err, lobb){
									if (err) console.error(err);
									socket.lobbyName = lobb.name;
									//starting with teamRed
									//push admin to teamRed
									lobb.players.push({username: socket.username, displayname: existingUser.displayname, admin: admin, team: "PURPLE"});
									lobb.teamRed = 1;
									Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"players": lobb.players}}, {upsert: true}, function(err, doc) {
										if (err) return err;
										Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamBlue": lobb.teamBlue}}, {upsert: true}, function(err, doc) {
											Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamRed": lobb.teamRed}}, {upsert: true}, function(err, doc) {
											});
										});
										Lobby.findOne({ name: lobbyName }, function(err, docs) {
											if (err) return err;
											socket.emit('getInLobby', docs.name);
											socket['lobbyName'] = lobbyName;
											sockets[index]['lobbyName'] = lobbyName;
											socket.emit('myId', socket['id']);
											var data = {};
											Lobby.find(function(err, result){
												data.lobby = result;
												data.action = "add";
												for(var i = 0; i < sockets.length; i++){
													if(sockets[i].login){
														sockets[i].emit('updateLobbies', data);
														if(sockets[i]['lobbyName'] == lobbyName){
															sockets[i].emit('updatePlayers', docs.players);
														}
													}
												}
											})
											
										});
									});
								});
							}
						});
					} else {
						console.log("User not found, ending socket");
						socket.disconnect();
					}
				});
			} else {
				res.redirect('/login');
			}
		});
	  
		socket.on('changeChamp', (newChamp) => {
			console.log("Change EVENT champ");
			Lobby.findOne({name: socket['lobbyName']}, function(err, result){
				let lobbyName = socket['lobbyName'];
				for(var i = 0; i < result.players.length; i++){
					if(result.players[i].username == socket['id']){
						for(var c = 0; c < Champs.length; c++){
							if(Champs[c] == newChamp){
								result.players[i].champ = newChamp;
								for(var i = 0; i < sockets.length; i++){
									if(sockets[i].login){
										if(sockets[i]['lobbyName'] == lobbyName){
											sockets[i].emit('updatePlayers', result.players);
										}
									}
								}
							}
						}
					}
				}
				Lobby.findOneAndUpdate({ name: socket['lobbyName'] }, {$set: {"players": result.players}}, {upsert: true}, function(err, doc) {
					if (err) return err;
					console.log("Updated champion");
				});
			})
			
		});

		socket.on('changeSpell', (summoner1, summoner2) => {
			console.log("Change EVENT spell");
			Lobby.findOne({name: socket['lobbyName']}, function(err, result){
				let lobbyName = socket['lobbyName'];
				for(var i = 0; i < result.players.length; i++){
					if(result.players[i].username == socket['id']){
						

						result.players[i].summoner1 = summoner1;
						result.players[i].summoner2 = summoner2;

								for(var i = 0; i < sockets.length; i++){
									if(sockets[i].login){
										if(sockets[i]['lobbyName'] == lobbyName){
											sockets[i].emit('updatePlayers', result.players);
										}
									}
								}
							
						
					}
				}
				Lobby.findOneAndUpdate({ name: socket['lobbyName'] }, {$set: {"players": result.players}}, {upsert: true}, function(err, doc) {
					if (err) return err;
					console.log("Updated champion");
				});
			})
			
		});

		socket.on('leave', (lobbyName) => {
			console.log("Socket on leave lobby " + lobbyName);
			console.log("Leaving lobby");
			socket.emit('leaveLobby');
			Lobby.findOne({ name: lobbyName }, function(err, existingLobb){
				if(existingLobb){
					User.findOne({ _id: socket['id'] }, function(err, existingUser){
						if(existingUser){
							for(var i = 0; i < existingLobb.players.length; i++){
								if(existingLobb.players[i].team == "PURPLE"){
									existingLobb.teamRed -= 1;
								}
								if(existingLobb.players[i].team == "BLUE"){
									existingLobb.teamBlue -= 1;
								}
								if(existingLobb.players[i].username == socket['id']){
									existingLobb.players.splice(i, 1);
								}
							}
							if(existingLobb.players.length > 0) {
								Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"players": existingLobb.players}}, {upsert: true}, function(err, doc) {
									Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamBlue": existingLobb.teamBlue}}, {upsert: true}, function(err, doc) {
										Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamRed": existingLobb.teamRed}}, {upsert: true}, function(err, doc) {
										});
									});
									socket['lobbyName'] = lobbyName;
									sockets[index]['lobbyName'] = lobbyName;
									var data = {};
									Lobby.find({}, function(err, result){
										data.lobby = result;
										data.action = "update";	
										for(var i = 0; i < sockets.length; i++){
											if(sockets[i].login){
												sockets[i].emit('updateLobbies', data);
												if(sockets[i]['lobbyName'] == lobbyName){
													sockets[i].emit('updatePlayers', existingLobb.players);
												}
											}
										}
									})
									
								});
							} else {
								Lobby.findOneAndDelete({ name: lobbyName }, function(err, doc) {
									console.log("DELETED LOBBY");
									var data = {};
									Lobby.find({}, function(err, result){
										data.lobby = existingLobb;
										data.action = "remove";
										for(var i = 0; i < sockets.length; i++){
											if(sockets[i].login){
												sockets[i].emit('updateLobbies', data);
												if(sockets[i]['lobbyName'] == lobbyName){
													sockets[i].emit('updatePlayers', existingLobb.players);
												}
											}
										}
									})
									
								});
							}
						} else {
							console.log("Suspect activity, disconnecting socket");
							socket.disconnect();
						}
					});
				} else {
					console.log("Lobby doesnt exist");
					socket.emit('leaveLobby');
				}
			});
		});
		
		socket.on('disconnect', () => {
			console.log("Socket on disconnect");
			var lobbyName = socket['lobbyName'];
			socket.emit('leaveLobby');
			Lobby.findOne({ name: lobbyName }, function(err, existingLobb){
				if(existingLobb){
					User.findOne({ _id: socket['id'] }, function(err, existingUser){
						if(existingUser){
							for(var i = 0; i < existingLobb.players.length; i++){
								if(existingLobb.players[i].team == "PURPLE"){
									existingLobb.teamRed -= 1;
								}
								if(existingLobb.players[i].team == "BLUE"){
									existingLobb.teamBlue -= 1;
								}
								if(existingLobb.players[i].username == socket['id']){
									existingLobb.players.splice(i, 1);
								}
							}
							if(existingLobb.players.length > 0) {
								Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"players": existingLobb.players}}, {upsert: true}, function(err, doc) {
									Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamBlue": existingLobb.teamBlue}}, {upsert: true}, function(err, doc) {
										Lobby.findOneAndUpdate({ name: lobbyName }, {$set: {"teamRed": existingLobb.teamRed}}, {upsert: true}, function(err, doc) {
										});
									});
									socket['lobbyName'] = lobbyName;
									sockets[index]['lobbyName'] = lobbyName;
									var data = {};
									Lobby.find({}, function(err, result){
										data.lobby = result;
										data.action = "update";	
										for(var i = 0; i < sockets.length; i++){
											if(sockets[i].login){
												sockets[i].emit('updateLobbies', data);
												if(sockets[i]['lobbyName'] == lobbyName){
													sockets[i].emit('updatePlayers', existingLobb.players);
												}
											}
										}
									})
									
								});
							} else {
								Lobby.findOneAndDelete({ name: lobbyName }, function(err, doc) {
									console.log("DELETED LOBBY");
									var data = {};
									Lobby.find({}, function(err, result){
										data.lobby = result;
										data.action = "remove";
										for(var i = 0; i < sockets.length; i++){
											if(sockets[i].login){
												sockets[i].emit('updateLobbies', data);
												if(sockets[i]['lobbyName'] == lobbyName){
													sockets[i].emit('updatePlayers', existingLobb.players);
												}
											}
										}
									})
									
								});
							}
						} else {
							console.log("Suspect activity, disconnecting socket");
							socket.disconnect();
						}
					});
				} else {
					console.log("Lobby doesnt exist");
					socket.emit('leaveLobby');
				}
			});
		});

		//End of IO connection;	
	});
  
};