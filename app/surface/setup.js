const {ipcRenderer} = require('electron');

//Game

ipcRenderer.on("download progress", (event, progress) => {
  const cleanProgressInPercentages = progress;
  this.document.getElementById("downloadProgress").innerHTML = cleanProgressInPercentages;
  this.document.getElementById("setupBtnFull").disabled = true;
});

ipcRenderer.on("download complete", (event, file) => {
    console.log(file);
    this.document.getElementById("downloadProgress").innerHTML = "Game is installing.. It may take a while..";
});

ipcRenderer.on("unzip complete", (event, file) => {
    this.document.getElementById("downloadProgress").innerHTML = "Game is installed!";
    ipcRenderer.send('setServer', document.getElementById("serverIp").value, true);
});

//Server

ipcRenderer.on("download progress server", (event, progress) => {
  const cleanProgressInPercentages = progress;
  this.document.getElementById("downloadProgressServer").innerHTML = cleanProgressInPercentages;
  this.document.getElementById("setupServerFull").disabled = true;
});

ipcRenderer.on("server complete", () => {
    this.document.getElementById("downloadProgressServer").innerHTML = "Server is installed!";
    this.document.getElementById("startServerBtn").disabled = false;
    this.document.getElementById("startServerBtn").addEventListener("click", function (e) {
        ipcRenderer.send('startServer');
    })
});

window.addEventListener('DOMContentLoaded', async function() {
  var closebtn = document.getElementById("close-btn");
  var maxbtn = document.getElementById("max-btn");
  var minbtn = document.getElementById("min-btn");

  if (minbtn) {
    var minbtntext = document.getElementById("info");
      minbtn.addEventListener("click", function (e) {
          ipcRenderer.send('setupMinimize');
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
              ipcRenderer.send('setupMaximize');   
              window.windowState = 1;     
          } else {
              ipcRenderer.send('setupUnmaximize');
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
          ipcRenderer.send('setupClose');
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

  var submit = document.getElementById("setupBtn");
  var setupBtnFull = document.getElementById("setupBtnFull");
  var setupServerFull = document.getElementById("setupServerFull");
  var startServerBtn = document.getElementById("startServerBtn");
  var updatesBtn = document.getElementById("updatesBtn");

  if(setupBtnFull){
    setupBtnFull.addEventListener("click", function (e) {
      ipcRenderer.send("download");
      console.log("Downloading game..");
    });
  }

  if(setupServerFull){
    setupServerFull.addEventListener("click", function (e) {
      ipcRenderer.send("download server");
    })
  }

  if(startServerBtn){
    startServerBtn.addEventListener("click", function (e) {
      ipcRenderer.send('startServer');
    });
  }

  if(updatesBtn){
    updatesBtn.addEventListener("click", function (e) {
      ipcRenderer.send('update');
    });
  }
  
  ipcRenderer.on("startedServer", (event, file) => {
    startServerBtn.innerHTML = "Stop Server";
  });
  ipcRenderer.on("stopedServer", (event, file) => {
    startServerBtn.innerHTML = "Start Server";
  });

  if(submit){
    submit.addEventListener("click", function (e) {
          if(document.getElementById("gamePath").value){
            if(document.getElementById("serverIp").value){
              ipcRenderer.send('setPath', document.getElementById("gamePath").value, false);
              ipcRenderer.send('setServer', document.getElementById("serverIp").value, true);
            } else {
              ipcRenderer.send('setPath', document.getElementById("gamePath").value, true);
            }
          } else {
            if(document.getElementById("serverIp").value){
              ipcRenderer.send('setServer', document.getElementById("serverIp").value, true);
            }
          }
    });
  }
});