var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServersSchema = new Schema({
	Name: {type: String, default: "Unamed Server NOT RECOMMENDED"},
    Motd: {type: String, default: "No Motd for this server"},
    IP: {type: String, default: "127.0.0.1"},
    Status: {type: String, default: "NOT_VERIFIED"}
});

ServersSchema.index({ Name: 'text', Motd: 'text', IP: 'text'})

module.exports = mongoose.model('Servers', ServersSchema);