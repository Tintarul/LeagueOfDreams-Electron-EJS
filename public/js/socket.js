var socket = io();
var teamRed = [];
var teamBlue = [];
let currentLobby = "";
let currentId = "";
    function login(id){
        currentId = id;
        socket.emit('login', id); 
    }	 
var lobbyFocus = true;
var lobbies = {};

let summoner1 = "SummonerHeal";
let summoner2 = "SummonerFlash";
let lastConnection = null;

let selectedSlot = 0;

let Champion = {
    "Aatrox": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/266/tile"
    },
    "Ahri": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/103/tile"
    },
    "Akali": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/84/tile"
    },
    "Alistar": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/12/tile"
    },
    "Amumu": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/32/tile"
    },
    "Anivia": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/34/tile"
    },
    "Annie": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/1/tile"
    },
    "Ashe": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/22/tile"
    },
    "Azir": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/268/tile"
    },
    "Bard": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/432/tile"
    },
    "Blitzcrank": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/53/tile"
    },
    "Brand": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/63/tile"
    },
    "Braum": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/201/tile"
    },
    "Caitlyn": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/51/tile"
    },
    "Camille": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/164/tile"
    },
    "Cassiopeia": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/69/tile"
    },
    "Chogath": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/31/tile"
    },
    "Corki": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/42/tile"
    },
    "Darius": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/122/tile"
    },
    "Diana": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/131/tile"
    },
    "Draven": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/119/tile"
    },
    "Mundo": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/36/tile"
    },
    "Ekko": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/245/tile"
    },
    "Elise": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/60/tile"
    },
    "Evelynn": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/28/tile"
    },
    "Ezreal": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/81/tile"
    },
    "Fiddlesticks": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/9/tile"
    },
    "Fiora": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/114/tile"
    },
    "Fizz": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/105/tile"
    },
    "Galio": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/3/tile"
    },
    "Gangplank": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/41/tile"
    },
    "Garen": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/86/tile"
    },
    "Gnar": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/150/tile"
    },
    "Gragas": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/79/tile"
    },
    "Graves": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/104/tile"
    },
    "Gwen": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/887/tile"
    },
    "Hecarim": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/120/tile"
    },
    "Heimerdinger": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/74/tile"
    },
    "Illaoi": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/420/tile"
    },
    "Irelia": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/39/tile"
    },
    "Ivern": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/427/tile"
    },
    "Janna": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/40/tile"
    },
    "JarvanIV": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/59/tile"
    },
    "Jax": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/24/tile"
    },
    "Jinx": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/222/tile"
    },
    "Kalista": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/429/tile"
    },
    "Karma": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/43/tile"
    },
    "Karthus": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/30/tile"
    },
    "Kassadin": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/38/tile"
    },
    "Katarina": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/55/tile"
    },
    "Kayle": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/10/tile"
    },
    "Kennen": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/85/tile"
    },
    "Khazix": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/121/tile"
    },
    "Kindred": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/203/tile"
    },
    "KogMaw": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/96/tile"
    },
    "Leblanc": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/7/tile"
    },
    "LeeSin": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/64/tile"
    },
    "Leona": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/89/tile"
    },
    "Lissandra": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/127/tile"
    },
    "Lucian": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/236/tile"
    },
    "Lulu": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/117/tile"
    },
    "Lux": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/99/tile"
    },
    "Malphite": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/54/tile"
    },
    "Malzahar": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/90/tile"
    },
    "Maokai": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/57/tile"
    },
    "MasterYi": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/11/tile"
    },
    "MissFortune": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/21/tile"
    },
    "Mordekaiser": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/82/tile"
    },
    "Morgana": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/25/tile"
    },
    "Nami": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/267/tile"
    },
    "Nasus": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/75/tile"
    },
    "Nautilus": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/111/tile"
    },
    "Nidalee": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/76/tile"
    },
    "Nocturne": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/56/tile"
    },
    "Nunu": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/20/tile"
    },
    "Olaf": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/2/tile"
    },
    "Orianna": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/61/tile"
    },
    "Pantheon": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/80/tile"
    },
    "Poppy": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/78/tile"
    },
    "Quinn": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/133/tile"
    },
    "Rakan": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/497/tile"
    },
    "Rammus": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/33/tile"
    },
    "RekSai": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/421/tile"
    },
    "Renekton": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/58/tile"
    },
    "Rengar": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/107/tile"
    },
    "Riven": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/92/tile"
    },
    "Rumble": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/68/tile"
    },
    "Ryze": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/13/tile"
    },
    "Sejuani": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/113/tile"
    },
    "Shaco": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/35/tile"
    },
    "Shen": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/98/tile"
    },
    "Shyvana": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/102/tile"
    },
    "Singed": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/27/tile"
    },
    "Sion": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/14/tile"
    },
    "Sivir": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/15/tile"
    },
    "Skarner": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/72/tile"
    },
    "Sona": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/37/tile"
    },
    "Soraka": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/16/tile"
    },
    "Syndra": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/134/tile"
    },
    "TahmKench": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/223/tile"
    },
    "Talon": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/91/tile"
    },
    "Taric": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/44/tile"
    },
    "Teemo": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/17/tile"
    },
    "Thresh": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/412/tile"
    },
    "Tristana": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/18/tile"
    },
    "Trundle": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/48/tile"
    },
    "Tryndamere": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/23/tile"
    },
    "TwistedFate": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/4/tile"
    },
    "Twitch": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/29/tile"
    },
    "Udyr": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/77/tile"
    },
    "Urgot": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/6/tile"
    },
    "Varus": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/110/tile"
    },
    "Vayne": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/67/tile"
    },
    "Veigar": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/45/tile"
    },
    "Velkoz": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/161/tile"
    },
    "Vex": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/711/tile"
    },
    "Vi": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/254/tile"
    },
    "Viktor": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/112/tile"
    },
    "Vladimir": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/8/tile"
    },
    "Volibear": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/106/tile"
    },
    "Warwick": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/19/tile"
    },
    "Wukong": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/62/tile"
    },
    "Xerath": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/101/tile"
    },
    "XinZhao": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/5/tile"
    },
    "Yasuo": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/157/tile"
    },
    "Yorick": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/83/tile"
    },
    "Zac": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/154/tile"
    },
    "Zed": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/238/tile"
    },
    "Zilean": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/26/tile"
    },
    "Zyra": {
        "img": "https://lolcdn.darkintaqt.com/cdn/champion/143/tile"
    }
}

var AllowedChamps = [
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

let Spells = {
    "SummonerFlash": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/4"
    },
    "SummonerSmite": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/11"
    },
    "SummonerSnowball": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/32"
    },
    "SummonerBarrier": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/21"
    },
    "SummonerHeal": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/7"
    },
    "SummonerDot": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/14"
    },
    "SummonerBoost": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/1"
    },
    "SummonerTeleport": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/12"
    },
    "SummonerHaste": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/6"
    },
    "SummonerPoroRecall": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/30"
    },
    "SummonerMana": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/13"
    },
    "SummonerExhaust": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/3"
    },
    "SummonerCherryHold": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/2201"
    },
    "SummonerPoroThrow": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/31"
    },
    "Summoner_UltBookPlaceholder": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/54"
    },
    "Summoner_UltBookSmitePlaceholder": {
        "img": "https://lolcdn.darkintaqt.com/cdn/spells/55"
    }
}

function GenerateAllSpells(){
    let parrent = document.getElementById("spellSlotsAll");
    Object.keys(Spells).forEach(function(key) {
        let newSpell = document.createElement("div");
        newSpell.setAttribute("class", "spell-icon");
        newSpell.setAttribute("id", "Spell" + key);
        newSpell.style = "margin: 2px";
        newSpell.setAttribute("onclick", "selectSpell('" + key + "')");
        let newImg = document.createElement("img");
        newImg.setAttribute("src", Spells[key].img);
        newSpell.appendChild(newImg);
        parrent.appendChild(newSpell);
    })
}

function selectSlot(number){
    console.log("Slot: " + number);
    if(number == 0){
        document.getElementById("slotSpell1").classList.remove("selectedSlot");
        document.getElementById("slotSpell0").classList.add("selectedSlot");
        document.getElementById("Spell" + summoner2).classList.remove("selectedSlot");
        document.getElementById("Spell" + summoner1).classList.add("selectedSlot");
        selectedSlot = number;
    }
    if(number == 1){
        document.getElementById("slotSpell0").classList.remove("selectedSlot");
        document.getElementById("slotSpell1").classList.add("selectedSlot");
        document.getElementById("Spell" + summoner2).classList.add("selectedSlot");
        document.getElementById("Spell" + summoner1).classList.remove("selectedSlot");
        selectedSlot = number;
    }
}

function selectSpell(spellName){
    if(selectedSlot == 0){
        document.getElementById("Spell" + summoner1).classList.remove("selectedSlot");
        summoner1 = spellName;
        document.getElementById("slotSpell0Image").src = Spells[spellName].img;
    }
    if(selectedSlot == 1){
        document.getElementById("Spell" + summoner2).classList.remove("selectedSlot");
        summoner2 = spellName;
        document.getElementById("slotSpell1Image").src = Spells[spellName].img;
    }
    document.getElementById("Spell" + spellName).classList.add("selectedSlot");
    socket.emit('changeSpell', summoner1, summoner2);
}

socket.on('updatePlayers', function(players, myId) {

    document.getElementById("LobbyButtons").innerHTML = '<button class="button-play" onclick="leaveLobby();">Leave</button>';
    document.getElementById("teamRed").innerHTML = "";
    document.getElementById("teamBlue").innerHTML = "";
    console.log("UPDATING Players");
    document.getElementById("LobbyLoading").style.display = "none";
    document.getElementById("containerLob").style.display = "block";
    var str = '';
    var startButton = '';
    console.log(players);
    
    for (var i = 0; i < players.length; i++) {
        console.log("For each player <->");
        var adminbtns = '<i class="fa fa-exclamation-triangle kick" style="font-size:25px;"></i>';
        var switchbtn = '<div class="spell-icon" style="cursor: pointer;"><i class="fa fa-exchange moveTo" onclick="moveTo(\'' + currentLobby + '\')" style="font-size:25px; float:right;"></i></div>';
        var playerNameTag = '<h3 class="player-name picked">' + players[i].displayname + '</h3>';
        var champSloganTag = '<small class="champ-slogan">' + players[i].champ + '</small>';
        var spellIconsTag = `
        <div class="spell-icon">
            <img src="${Spells[players[i].summoner1].img}">
        </div>
        <div class="spell-icon">
            <img src="${Spells[players[i].summoner2].img}">
        </div>`;

        if (players[i].username == currentId) {
            str = '<div class="champion-panel current-player loaded">' +
                '<div class="champ-icon"><img width="64px" height="64px" src="' + Champion[players[i].champ].img + '"></div>' +
                '<div class="content-wrap">' +
                playerNameTag + champSloganTag + spellIconsTag;

                if (players[i].admin == 1) {
                    let adminPlayBtn = document.getElementById("adminPlayBtn");
                    if(typeof adminPlayBtn == 'undefined' || adminPlayBtn == null){
                        startButton = '<button class="button-play" id="adminPlayBtn" onclick="startGame();">Start Game</button>';
                        document.getElementById("LobbyButtons").innerHTML += startButton;
                        adminPlayBtn = false;
                    }
                    str += '<div class="spell-icon"><img width="44px" height="44px" src="/crown.png"></div>';
                }

                str += switchbtn;
                str += '</div>' + '</div>';
        } else {
            str = '<div class="champion-panel loaded">' +
                '<div class="champ-icon"><img width="64px" height="64px" src="' + Champion[players[i].champ].img + '"></div>' +
                '<div class="content-wrap">' +
                playerNameTag + champSloganTag + spellIconsTag;

                if (players[i].admin == 1) {
                    
                    str += '<div class="spell-icon"><img width="44px" height="44px" src="/crown.png"></div>';
                }

                str += '</div>' + '</div>';
        }

        if (players[i].team == "PURPLE") {
            console.log("TEAM PURPLE");
            document.getElementById("teamRed").innerHTML += str;
        } else {
            console.log("TEAM BLUE");
            document.getElementById("teamBlue").innerHTML += str;
        }
    };
});


socket.on('updateLobbies', function(obj){
    console.log("GOT UPDATE LOBBIES");
    console.dir(obj);
    var parent = document.getElementById("BiggerCardcontainer");
    parent.innerHTML = '';
    if(typeof obj !== 'undefined'){
        console.log("Not undefined")
        if(typeof obj.lobby !== 'undefined'){
            console.log("Lobby is array of " + obj.lobby.length);
            for(var i = 0; i < obj.lobby.length ; i++){
                obj.lobby[i].players = obj.lobby[i].teamBlue + obj.lobby[i].teamRed;
                if(obj.lobby[i].players >= 0){
                    
                    var html = `<div onclick='joinLobby("${obj.lobby[i].name}");' style="padding: 10px; margin: 10px; border: 1px solid white; color: white; border-radius: 10px; cursor: pointer; display: inline-block; backdrop-filter: blur(10px);" id="lobby ${obj.lobby[i].name}">
                                    <h3 class="title">${obj.lobby[i].name}</h3>
        
                                    <hr>
                                    <p>${obj.lobby[i].status}</p>
                                    <br>
                                    <p>${obj.lobby[i].players} Players</p>
                                    <hr>
                                    <b>Gamemode: ${obj.lobby[i]['settings'].gamemode}</b>
                                </div>`
                                ;
                    parent.innerHTML += html;
                    console.log("Pusshed lobby " + obj.lobby[i].name);
                    lobbies[obj.lobby[i].lobbyName] = {};
                    lobbies[obj.lobby[i].lobbyName]['lobbyName'] = obj.lobby[i].name;
                    lobbies[obj.lobby[i].lobbyName]['html'] = html;
                    lobbies[obj.lobby[i].lobbyName]['document'] = html;
                }
            }
        }
        if(typeof obj.lobbies !== 'undefined'){
            console.log("Lobbies is array");
            for(var i = 0; i < obj.lobbies.length ; i++){
                obj.lobbies[i].players = obj.lobbies[i].teamBlue + obj.lobbies[i].teamRed;
                if(obj.lobbies[i].players >= 0){
                    
                    var html = `<div onclick='joinLobby("${obj.lobbies[i].name}");' class="lobbyCard" id="lobby ${obj.lobbies[i].name}">
                                    <h3 class="title">${obj.lobbies[i].name}</h3>
        
                                    <hr>
                                    <p>${obj.lobbies[i].status}</p>
                                    <br>
                                    <p>${obj.lobbies[i].players} Players</p>
                                </div>`
                                ;
                    parent.innerHTML += html;
                    lobbies[obj.lobbies[i].lobbyName] = {};
                    lobbies[obj.lobbies[i].lobbyName]['lobbyName'] = obj.lobbies[i].name;
                    lobbies[obj.lobbies[i].lobbyName]['html'] = html;
                    lobbies[obj.lobbies[i].lobbyName]['document'] = html;
                }
            }
        }
    }
});

  socket.on('disconnect', function() {
    socket.emit('leave', currentLobby);
	window.location.href = '/logout';
  });
 
  socket.on('close', function() { 
    socket.emit('leave', currentLobby);
	window.location.href = '/logout';
  });

socket.on('leaveLobby', function() {
    console.log("Socket on leave lobby");
    
    //Refresh the page
    window.location.href = '/';
});

socket.on('loadGame', function(token, id, port) {
    lastConnection = {
        token:token, 
        id:id,
        port:port
    };
    let StartGameEvent = new Event('startGame');
    currentLobby = '';
    document.getElementById("tiggerForStartingGame").value = token + "/" + id + "/" + port;
    console.log("Dispatching event");
    document.getElementById("tiggerForStartingGame").dispatchEvent(StartGameEvent);
    document.getElementById("inClient").style.display = "none";
    document.getElementById("inGame").style.display = "block";
});

socket.on('abortGame', function(message){
    let AbortGameEvent = new Event('abortGame');
    console.log("Dispatching event");
    console.log("Aborting with " + message); 
    document.getElementById("tiggerForAbortingGame").dispatchEvent(AbortGameEvent);
    document.getElementById("LobbyMessage").innerHTML = message;
    document.getElementById("LobbyMessage").className = "LobbyError";
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search-champs-input").addEventListener("keyup", function(event) {
        if(event.target.value == "" || event.target.value == null || event.target.value == undefined || event.target.value == " "){
            let parentOfChampions = document.querySelector('.champions-grid-overflow');
            parentOfChampions.innerHTML = "";
            Object.keys(Champion).forEach(key => {
                let championName = key;
                let championData = Champion[key];
                if(AllowedChamps.includes(championName)){
        
                    let html = document.createElement('div');
                    html.className = "champ-icon loaded";
                    html.innerHTML = `<img width="64px" height="64px" src="${championData.img}">`;
                    html.addEventListener('click', function(){
                        changeChamp(championName);
                    });
                    parentOfChampions.appendChild(html);
                }
                
            });
        } else {
            console.log("Searching for " + event.target.value);
            let parentOfChampions = document.querySelector('.champions-grid-overflow');
            parentOfChampions.innerHTML = "";
            Object.keys(Champion).forEach(key => {
                let championName = key;
                let championData = Champion[key];
                if(AllowedChamps.includes(championName)){
        
                    if(championName == event.target.value){
                        let html = document.createElement('div');
                        html.className = "champ-icon loaded";
                        html.innerHTML = `<img width="64px" height="64px" src="${championData.img}">`;
                        html.addEventListener('click', function(){
                            changeChamp(championName);
                        });
                        parentOfChampions.appendChild(html);
                    }

                }
                
            });
        }
    });
})

socket.on('getInLobby', function(lobbyName) {
    console.log("Socket get in lobby");
    currentLobby = lobbyName;
    document.getElementById("LobbyLoading").style.display="block";
    document.getElementById("containerLob").style.display="none";
    document.getElementById("LobbyContent").style.display="none";
    document.getElementById("LobbyPage").style.display="block";

    let parentOfChampions = document.querySelector('.champions-grid-overflow');

    Object.keys(Champion).forEach(key => {
        let championName = key;
        let championData = Champion[key];
        if(AllowedChamps.includes(championName)){

            let html = document.createElement('div');
            html.className = "champ-icon";
            html.innerHTML = `<img width="64px" height="64px" src="${championData.img}">`;
            html.addEventListener('click', function(){
                changeChamp(championName);
            });
            parentOfChampions.appendChild(html);
        }
        
    });

    let allChampIcons = document.querySelectorAll('.champ-icon');
    let time = 60;
    allChampIcons.forEach(element => {
        //Add class loaded to all champions
        setTimeout(function(){
            element.classList.add('loaded');
        }, time);
        time += 40;
    })

    lobbyFocus = true;
});

socket.on('showChampionSelect', function(){
    console.log("Socket get in ChampSelect");
    currentLobby = lobbyName;
    document.getElementById("LobbyChampionSelect").style.display="block";
    document.getElementById("containerLob").style.display="none";
    lobbyFocus = true;
});

function joinLobby(lobbyName){
    currentLobby = lobbyName;
    console.log("Joining " + lobbyName);
    socket.emit('join', lobbyName);
    console.log("------- EMITED SOCKET JOIN");
    document.getElementById("LobbyPage").style.display="block";
    document.getElementById("LobbyLoading").style.display="block";
    document.getElementById("containerLob").style.display="none";
}

function startGame(){
    socket.emit('startGame');
}

function changeChamp(champ){
    console.log("CHANGE CHAMP TO " + champ + " " + currentLobby);
    socket.emit('changeChamp', champ);
}

function leaveLobby(){
    console.log("BUTTON PRESSED ----------");
    document.getElementById("LobbyLoading").style.display="none";
    document.getElementById("containerLob").style.display="none";
    document.getElementById("LobbyPage").style.display="none";
    socket.emit('leave', currentLobby);
    console.log("LEAVING " + currentLobby);
    currentLobby = '';
    lobbyFocus = false;
}

function createLobby(){
    var obj = {};
    obj.name = document.getElementById("createLobbyname").value;
    obj.password = document.getElementById("createLobbypassword").value;
    obj.mana = document.querySelector("#mana").checked;
    obj.cheats = document.querySelector("#cheats").checked;
    obj.minions = document.querySelector("#minions").checked;
    obj.cooldown = document.querySelector("#cooldown").checked;
    obj.adminForAll = document.querySelector("#adminForAll").checked;
    obj.map = document.getElementById("map").value;
    obj.gamemode = document.getElementById("gamemode").value;
    currentLobby = obj.name;
    socket.emit('createLobby', obj);
}

function moveTo(lobbyName){
    socket.emit('movePlayer', lobbyName);
}

function backToClient(){
    document.getElementById("inGame").style.display = "none";
    document.getElementById("inClient").style.display = "block";
}

function reconnect(){
    if(lastConnection != null){
        let StartGameEvent = new Event('startGame');
        currentLobby = '';
        document.getElementById("tiggerForStartingGame").value = lastConnection.token + "/" + lastConnection.id + "/" + lastConnection.port;
        console.log("Dispatching event");
        document.getElementById("tiggerForStartingGame").dispatchEvent(StartGameEvent);
        document.getElementById("inClient").style.display = "none";
        document.getElementById("inGame").style.display = "block";
    }
}