function HideFriendList(){
    document.getElementById("friendlist").style.display="none";
}

function ShowFriendList(){
    if(document.getElementById("friendlist").style.display == "none"){
        HideMessages();
        HideAlerts();
        document.getElementById("friendlist").style.display="block";
    } else {
        HideFriendList();
    }
}

function HideMessages(){
    document.getElementById("messagelist").style.display="none";
}

function ShowMessages(){
    if(document.getElementById("messagelist").style.display == "none"){
        HideFriendList();
        HideAlerts();
        document.getElementById("messagelist").style.display="block";
    } else {
        HideMessages();
    }
}

function HideAlerts(){
    document.getElementById("alertlist").style.display="none";
}

function ShowAlerts(){
    if(document.getElementById("alertlist").style.display == "none"){
        HideMessages();
        HideFriendList();
        document.getElementById("alertlist").style.display="block";
    } else {
        HideAlerts();
    }
}

function LogOut(){
    window.location.href = '/logout';
}

function News(){
    if(document.getElementById("NewsContent").style.display == "none"){
        document.getElementById("NewsContent").style.display="block";
		document.getElementById("LobbyContent").style.display="none";
		document.getElementById("ProfileContent").style.display="none";
        document.getElementById("ServersContent").style.display="none";
    } else {
        document.getElementById("NewsContent").style.display="none";
    }
}

function Servers(){
    if(document.getElementById("ServersContent").style.display == "none"){
        document.getElementById("NewsContent").style.display="none";
		document.getElementById("LobbyContent").style.display="none";
		document.getElementById("ProfileContent").style.display="none";
        document.getElementById("ServersContent").style.display="block";
    } else {
        document.getElementById("ServersContent").style.display="none";
    }
}

function submitServer(){
    var name = document.getElementById("ServerName_submit").value;
    var ip = document.getElementById("ServerIP_submit").value;
    var description = document.getElementById("ServerDescription_submit").value;
    var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
        };
        xhr.send();
    };

    getJSON('http://164.68.103.55:3000/api/servers/submit?Name=' + name + '&IP=' + ip + '&Motd=' + description, function(err, data) {
        if (err !== null) {
            console.log(err);
        } else {
            if(data.error){
                var server = "<h1> " + data.error + " </h1>";
            } else {
                var server = "<h1> Server sent! You must wait for verification </h1>";
            }
            
            document.getElementById("message").innerHTML += server;
            //Show message
            document.getElementById("message").style.display="block";
        }
    });
}

function submitServerPage(){
    if(document.getElementById("submitPage").style.display == "none"){
        document.getElementById("submitPage").style.display="block";
        document.getElementById("serversList").style.display="none";
    } else {
        document.getElementById("serversList").style.display="block";
        document.getElementById("submitPage").style.display="none";
    }
}

function JoinLobby(id){
	console.log(id);
	window.location.href = '/lobby/' + id;
}

function goHome(){
	window.location.href = '/';
}

function Profile(){
    if(document.getElementById("ProfileContent").style.display == "none"){
        document.getElementById("ProfileContent").style.display="block";
		document.getElementById("LobbyContent").style.display="none";
		document.getElementById("NewsContent").style.display="none";
        document.getElementById("ServersContent").style.display="none";
    } else {
        document.getElementById("ProfileContent").style.display="none";
    }
}

function Play(){
    if(document.getElementById("LobbyContent").style.display == "none"){
        document.getElementById("LobbyContent").style.display="block";
		document.getElementById("ProfileContent").style.display="none";
		document.getElementById("NewsContent").style.display="none";
        document.getElementById("ServersContent").style.display="none";
    } else {
        document.getElementById("LobbyContent").style.display="none";
    }
}