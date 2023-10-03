<h1>League Of Dreams Client & Server</h1>
# LeagueOfDreams Electron & EJS <br>
# Server was merged with client <br>
# For more informations please visit <a href="https://discord.gg/NUDmnGR2ka">our discord server</a>
<br></br>
<p>If you have range ports forwarded you can play with your friends</p><br>

Run / Compile client in Windows:<br>
 <a href="https://www.youtube.com/watch?v=ttUHCmFx02o">Client Video tutorial on youtube, click here</a>
 1. Install <a href="https://nodejs.dev">NodeJS</a>
 2. Run `install_node_modules.bat`
 3. Run `run_client.bat` for live run or `compile.bat` for compile
 
Run server in Windows:<br>
 <a href="https://www.youtube.com/watch?v=Kx1fhEyY2dk">Server Video tutorial on youtube, click here</a>
 1. Install <a href="https://www.mongodb.com/try/download/community">Mongo Database community server</a>
 2. Range port forward from 3000 to 7000 (if you want public server)
 3. Download <a href="https://github.com/LeagueSandbox/GameServer">LeagueSandboxProject</a>, place it here under the name "GameServer"
 4. Compile LeagueSandbox Project
 5. Change secretkey and database name in <code>/config/secret.js</code><br>
 7. Run `install_node_modules.bat`
 8. Run `run_client.bat` for both server and client or `run_server_only.bat` for server only

For 24/7 runtime we recommend using PM2<br>
For more informations please visit <a href="https://www.npmjs.com/package/pm2">npm page of pm2</a><br>
 Init:<br>
     - pm2 start serverLoD.js<br>
 Usage:<br>
     - pm2 restart serverLoD<br>
     - pm2 logs serverLoD<br>
     - pm2 stop serverLoD<br>
     - pm2 start serverLod<br>
