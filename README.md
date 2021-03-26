## Rich Presence for any of the 24/7 🔊 Bots

**Nonstop music in discord**<br>
multisource, unlimited video length,
radio streams, livestreams and more!<br>
[Read more on the 24/7 🔊 Website](https://24-7music.com/)
#### Stats
![Online Top.GG](https://top.gg/api/widget/status/369208607126061057.svg)<br>
![Servers Top.GG](https://top.gg/api/widget/servers/369208607126061057.svg)<br>
![Upvotes Top.GG](https://top.gg/api/widget/upvotes/369208607126061057.svg)<br>

#### Invites
[Invite 24/7 🔊 with minimum permissions](https://invite.24-7music.com)<br>
[Invite 24/7 🔊 with administator permissions](https://discord.com/oauth2/authorize?client_id=369208607126061057&permissions=8&scope=bot%20applications.commands)<br>

### Supported
![Standard Icon](https://cdn.discordapp.com/avatars/369208607126061057/d976a0f1ae3a157dba7749cf5400cf37.png?size=20) Standard<br> 
![Premium Icon](https://cdn.discordapp.com/avatars/577082479538733068/c84bc9c33bfb61d04fdf5a117514929c.png?size=20) Premium<br>
![BETA Icon](https://cdn.discordapp.com/avatars/380673375904989185/dc62dba49af50368d66501fc4d885656.png?size=20) BETA<br>
![Staging Icon](https://cdn.discordapp.com/avatars/823309067047927808/70a90dfa5a770157492293f4ea0a37ae.png?size=20) Staging<br>

### Required
- Node.js - [View](https://nodejs.dev/) | [Download](https://nodejs.org/en/download/)
- NPM - [View](https://www.npmjs.com/get-npm) | [Download](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  - eris - [NPM](https://www.npmjs.com/package/eris) | [Github](https://github.com/abalabahaha/eris)
  - discord-rpc - [NPM](https://www.npmjs.com/package/discord-rpc) | [Github](https://github.com/discordjs/RPC)
  - dotenv - [NPM](https://www.npmjs.com/package/dotenv) | [Github](https://github.com/motdotla/dotenv)

- A bot application [Discord Applications](https://discord.com/developers/applications)
  - Has to be able to read the channels the nowPlaying messages are sent in  
- A .env file with TOKEN=botToken<br>
[Tutorial on how to create and add a bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

### Concept
- Bot is waiting for messages of any of the 24/7 🔊 bots
- When a message is sent, message get checked on song & station info
- If the song info is present, update presence
