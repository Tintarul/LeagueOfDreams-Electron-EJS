var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var ChatsSchema = new mongoose.Schema({
	users: [{ type: Schema.Types.ObjectId, ref: 'users'}],
	name: { type: String, default: 'FriendsChat'},
	messages: [{
		sentBy: { type: Schema.Types.ObjectId, ref: 'users'},
		content: {type: String, default: "Message"}
	}]
})

ChatsSchema.pre('save', function(next){
	var chat = this;
	next();
});

module.exports = mongoose.model('Chats', ChatsSchema);
