const {ipcRenderer} = require('electron');

window.addEventListener('DOMContentLoaded', async function() {
  let StartGameEvent = new Event('startGame');
  let AbortGameEvent = new Event('abortGame');
  var closebtn = document.getElementById("close-btn");
  var maxbtn = document.getElementById("max-btn");
  var minbtn = document.getElementById("min-btn");
  var refreshbtn = document.getElementById("refresh-btn");
  var settingsbtn = document.getElementById("settings-btn");
  var tiggerForStartingGame = document.getElementById("tiggerForStartingGame");
  var tiggerForAbortingGame = document.getElementById("tiggerForAbortingGame");
  var connectButtons = document.querySelectorAll('.serverButton');

  connectButtons.forEach(item => {
    item.addEventListener('click', event => {
      var ip = event.target.value;
      ipcRenderer.send('setServer', ip, true);
    })
  } , false);

  if(settingsbtn){
    var settingsbtntext = document.getElementById("info");
    settingsbtn.addEventListener("click", function (e) {
      ipcRenderer.send('openSettings');
    });
    settingsbtn.addEventListener("mouseover", function (e) {
      settingsbtntext.innerHTML = "Settings";
      refreshbtntext.style.marginRight = "70px";
      refreshbtntext.style.display = "block";
    });
    settingsbtn.addEventListener("mouseout", function (e) {
      settingsbtntext.style.display = "none";
    });
  }

  if (refreshbtn) {
    var refreshbtntext = document.getElementById("info");
    refreshbtn.addEventListener("click", function (e) {
        ipcRenderer.send('refresh');
    });
    refreshbtn.addEventListener("mouseover", function (e) {
      refreshbtntext.innerHTML = "Refresh";
      refreshbtntext.style.marginRight = "120px";
      refreshbtntext.style.display = "block";
    });
    refreshbtn.addEventListener("mouseout", function (e) {
      refreshbtntext.style.display = "none";
    });
  }

  if (minbtn) {
    var minbtntext = document.getElementById("info");
      minbtn.addEventListener("click", function (e) {
          ipcRenderer.send('minimize');
      });
      minbtn.addEventListener("mouseover", function (e) {
        minbtntext.innerHTML = "Minimize";
        minbtntext.style.marginRight = "30px";
        minbtntext.style.display = "block";
      });
      minbtn.addEventListener("mouseout", function (e) {
        minbtntext.style.display = "none";
      });
  }

  if(maxbtn){
    var maxbtntext = document.getElementById("info");
      maxbtn.addEventListener("click", function (e) {
          if (!window.windowState == 1){
              ipcRenderer.send('maximize');   
              window.windowState = 1;     
          } else {
              ipcRenderer.send('unmaximize');
              window.windowState = 0;
          }
      });
      maxbtn.addEventListener("mouseover", function (e) {
        maxbtntext.innerHTML = "Maximize";
        maxbtntext.style.marginRight = "5px";
        maxbtntext.style.display = "block";
      });
      maxbtn.addEventListener("mouseout", function (e) {
        maxbtntext.style.display = "none";
      });
  }

  if(closebtn){
    var closebtntext = document.getElementById("info");
      closebtn.addEventListener("click", function (e) {
          ipcRenderer.send('close');
      });
      closebtn.addEventListener("mouseover", function (e) {
        closebtntext.innerHTML = "Close";
        closebtntext.style.marginRight = "2px";
        closebtntext.style.display = "block";
      });
      closebtn.addEventListener("mouseout", function (e) {
        closebtntext.style.display = "none";
      });
  }
  
  if(tiggerForStartingGame){
    tiggerForStartingGame.addEventListener("startGame", function (e){
      var splitString = tiggerForStartingGame.value.split('/');
      var data = {};
      data.token = splitString[0];
      data.id = splitString[1];
      data.port = splitString[2];
      ipcRenderer.send('startGame', data);
    });
  }

  if(tiggerForAbortingGame){
    tiggerForAbortingGame.addEventListener("abortGame", function (e){
      var message = tiggerForAbortingGame.value;
      document.getElementById("LobbyMessage").innerHTML = message;
      document.getElementById("LobbyMessage").className = "LobbyError";
      ipcRenderer.send('abortGame');
    });
  }

});
