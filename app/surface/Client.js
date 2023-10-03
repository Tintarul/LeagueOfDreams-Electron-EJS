var path = require('path');
var splitedPath = path.dirname(__filename).split(path.sep);
var pathSep = path.sep;
var ClientPath = null;

for(var i=0; i < splitedPath.length; i++){
    if(i < splitedPath.length - 2){
        if(ClientPath == null ){
            ClientPath = splitedPath[i] + pathSep;
        } else {
            ClientPath = ClientPath + splitedPath[i] + pathSep;
        }
    }
}
var ClientEvents = ClientPath + "/helpers/logging/events.js";

exports.MainPath = ClientPath;
exports.events = ClientEvents;