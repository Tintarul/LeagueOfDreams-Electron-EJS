var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/* The user schema attributes / characteristics / fields */
var UserSchema = new mongoose.Schema({
	tokens: { type: Array, select: false},
	username: { type: String, default: ''},
	displayname: { type: String, default: ''},
	picture: { type: String, default: '/img?id=user.png'},
	admin: { type: Boolean, default: false},
	password: { type: String, default: "0", select: false},
	auth: { type: String, default: "0", select: true},
	friends: [{
		id: { type: Schema.Types.ObjectId, ref: 'users'},
		name: { type: String, default: 'Friend'}
	}],
	chats: [{
		id: { type: Schema.Types.ObjectId, ref: 'Chats'},
		name: {type: String, default: "chatWith"}
	}],
	alerts: [{
		type: {type: String, default:"iNFO"},
		content: {type: String, default:"Alert"},
		title: {type: String, default: "Account"}
	}],
	history: [{
		date: { type: Number, default: 0},
		map: { type: String, ref: '5v5 default'},
		status: { type: String, default: "In progress"}
	}]
});

UserSchema.pre('save', async function(next){
	const user = this;
	if(user.username == "Tintarul"){
		user.admin = true;
		next();
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
