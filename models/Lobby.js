var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LobbySchema = new Schema({
	category: { type: Schema.Types.ObjectId, ref: 'Category'},
	name: {type: String, default: "Lobby"},
	password: {type: String, default: ""},
	teamRed: {type: Number, default: 0},
	teamBlue: {type: Number, default: 0},
	players: [{
        username: { type: String, default: "User"},
		displayname: {type: String, default: "Display"},
        admin: { type: Number, default: 0},
		champ: {type: String, default: "Ezreal"},
		summoner1: {type: String, default: "SummonerHeal"},
		summoner2: {type: String, default: "SummonerFlash"},
		team: {type: String, default: "PURPLE"}
    }], 
	settings: {
		adminForAll: {type: Boolean, default: false},
		//Next step: move all values from obj.value to obj.settings.value
		//For now io.js uses obj.value in most cases, except adminForAll
		map:{type: Number, default: 1},
		cheats: {type: Boolean, default: false},
		cooldown: {type: Boolean, default: true},
		minions: {type: Boolean, default: true},
		mana: {type: Boolean, default: true},
		gamemode:{type: String, default: "CLASSIC"},
		name: {type: String, default: "Lobby"},
		password: {type: String, default: ""}
	},
	map:{type: Number, default: 1},
	gamemode:{type: Number, default: 1},
	status:{type: String, default: "Waiting"}
});

LobbySchema.index({ category: 'text', name: 'text', teamRed: 'text', teamBlue: 'text', status: 'text' })

module.exports = mongoose.model('Lobby', LobbySchema);