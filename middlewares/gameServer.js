var fs = require("fs");
var Lobby = require("../models/Lobby");
var child_process = require("child_process");
let game;
var ports = [];
var toBeInserted = {
"runes": {
    "1": 5245,
    "2": 5245,
    "3": 5245,
    "4": 5245,
    "5": 5245,
    "6": 5245,
    "7": 5245,
    "8": 5245,
    "9": 5245,
    "10": 5317,
    "11": 5317,
    "12": 5317,
    "13": 5317,
    "14": 5317,
    "15": 5317,
    "16": 5317,
    "17": 5317,
    "18": 5317,
    "19": 5289,
    "20": 5289,
    "21": 5289,
    "22": 5289,
    "23": 5289,
    "24": 5289,
    "25": 5289,
    "26": 5289,
    "27": 5289,
    "28": 5335,
    "29": 5335,
    "30": 5335},
"talents": {
    "4111": 1,
    "4112": 3,
    "4114": 1,
    "4122": 3,
    "4124": 1,
    "4132": 1,
    "4134": 3,
    "4142": 3,
    "4151": 1,
    "4152": 3,
    "4162": 1,
    "4211": 2,
    "4213": 2,
    "4221": 1,
    "4222": 3,
    "4232": 1} 
};
 

exports.startGameServer = function(players, settings, gameServerPort, socket, lobbyId) {
        ports.push(gameServerPort);
        console.dir(ports);
        
        if (players != null){
            var config = {
                "path": __dirname + "/GameServer/GameServerConsole/bin/Debug/net6.0/GameServerConsole.exe",
                "pathToFolder": __dirname + "/GameServer/GameServerConsole/bin/Debug/net6.0"
            };
            var objToJSON = new Object();
            objToJSON.players = new Array();
            objToJSON.game = new Object();
            objToJSON.gameInfo = new Object();
            //Players setup 
            var count = 0;
            var max = players.length - 1;
            while (count <= max){
                objToJSON.players[count] = new Object();
                objToJSON["players"][count].blowfishKey = "17BLOhi6KZsTtldTsizvHg==";
                objToJSON["players"][count].rank = "";
                objToJSON["players"][count].playerId = count+1;
                objToJSON["players"][count].name = players[count].displayname;
                objToJSON["players"][count].champion = players[count].champ;
                objToJSON["players"][count].team = players[count].team;
                objToJSON["players"][count].skin = 0;
                objToJSON["players"][count].summoner1 = players[count].summoner1;
                objToJSON["players"][count].summoner2 = players[count].summoner2;
                objToJSON["players"][count].ribbon = 2;
                objToJSON["players"][count].icon = 0;
                objToJSON["players"][count]["runes"] = toBeInserted['runes'];
                objToJSON["players"][count]["talents"] = toBeInserted['talents'];
                count++;
            }
            //Game setup
            objToJSON["game"]["map"] = settings.map;
            objToJSON["game"]["gameMode"] = settings.gamemode;
            objToJSON["game"]["dataPackage"] = "LeagueSandbox-Scripts";
            //GameInfo Setup
            objToJSON["gameInfo"]["MANACOSTS_ENABLED"] = settings.mana;
            objToJSON["gameInfo"]["COOLDOWNS_ENABLED"] = settings.cooldown;
            objToJSON["gameInfo"]["CHEATS_ENABLED"] = settings.cheats;
            objToJSON["gameInfo"]["MINION_SPAWNS_ENABLED"] = settings.minions;
            objToJSON["gameInfo"]["CONTENT_PATH"] = __dirname + "/GameServer/Content";
            objToJSON["gameInfo"]["IS_DAMAGE_TEXT_GLOBAL"] = true;

            var args = []; 
            args[0] = "--config"
            args[1] =  __dirname + "/GameServer/Content/LeagueSandbox-Default/" + gameServerPort + ".json"
            args[2] = "--port"; 
            args[3] = gameServerPort;
            var readyToJSON = JSON.stringify(objToJSON);
            fs.writeFile(__dirname + "/GameServer/Content/LeagueSandbox-Default/" + gameServerPort + ".json", readyToJSON, (err) => {
                if (err) {
                    //Abort
                    console.log(__dirname + "/GameServer/Content/LeagueSandbox-Default/" + gameServerPort + ".json");
                    console.log("Cant write config file for game server. Aborting game");
                    socket.emit('abortGame', "Can't write game data! Permissions? Did you setup the server first?");
                } else {
                    try{
                        console.log("Starting gameConsole as child process");
                        game = child_process.execFile(config['path'], args, {cwd: config.pathToFolder, maxBuffer: 1024 * 90000}, (error) => {
                            if (error){
                                //Abort
                                console.log("Cant run file, gameServer.exe Aborting sesion for user..");
                                console.log(error);
                                socket.emit('abortGame', "Your active match resulted in errors. Curent game is dead and no way to recover.");
                            } else {
                                Lobby.findOneAndUpdate({_id: lobbyId}, {$set: {status: "IN-GAME"}}, {new: true}, function(err, doc){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Game server started");
                                    }
                                });
                            }
                            
                        });
                        game.on('error', function(err) {
                            Lobby.findOneAndUpdate({_id: lobbyId}, {$set: {status: "Aborted"}}, {new: true}, function(err, doc){
                                socket.emit('abortGame', "It seems the match you where playing ended in error. Curent game is dead and no way to recover.");
                            });
                        });
                        game.on('close', function(err) {
                            Lobby.findOneAndUpdate({_id: lobbyId}, {$set: {status: "Waiting"}}, {new: true}, function(err, doc){
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Game server closed");
                                }
                            });
                        });
                        game.on('exit', function(err) {
                            Lobby.findOneAndUpdate({_id: lobbyId}, {$set: {status: "Waiting"}}, {new: true}, function(err, doc){
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Game server closed");
                                }
                            });
                        });
                        game.on('quit', function(err) {
                            Lobby.findOneAndUpdate({_id: lobbyId}, {$set: {status: "Waiting"}}, {new: true}, function(err, doc){
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Game server closed");
                                }
                            });
                        });
                    } catch(e){
                        console.log("While creating a game something wrong happend. Aborting game");
                        socket.emit('abortGame', "While creating a game something wrong happend. Try a new lobby");
                    }
                }
            });
        } else {
            var indexPort = ports.indexOf(gameServerPort);
            //Releasing port
            ports.splice(indexPort, 1);
            console.log("Players null");
        }
}
