require('dotenv').config();

const { Client } = require('discord-rpc');
const { developer, inviteUrl, supportUrl } = require('../configuration/config.json');

const RPC = new Client({
    transport: "ipc",
});

RPC.on('ready', async () => {
    console.info(`RP ready`);
});

RPC.on("connected", async () => {
    console.info(`RP connected`);
});

RPC.login({
    clientId: "780027677632757771",
}).catch(console.error);

const functions = {};

functions.updatePresence = function (songInfo, botInfo) {
    // If there is not socket, don't attempt to change status
    if (!RPC.transport.socket) return console.log(`No socket active`);

    // Name and icon of the bot the users is listening to, see config files for all supported bot versions
    const botName = botInfo.name;
    const botIcon = botInfo.icon;

    // Name and (optional) station of the song the user is listening too
    const songName = songInfo.name;
    const songStation = songInfo.station;

    // Log the song and what we are trying to update the status too
    console.info(`[UPDATING STATUS] Listening to ${botName}`);
    console.info(`[SONG TITLE] ${songName}`);
    console.info(`[SONG SOURCE] ${songStation}`);

    // Make a set activity request ourselves
    RPC.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            state: songStation && songName ? `${songName}\nAudio Source: ${songStation}` : songName ? songName : songStation ? songStation : "Nothing",
            details: "Listening to",
            timestamps: {
                start: Date.now(),
            },
            assets: {
                large_image: botIcon,
                large_text: botName,
                small_image: "developer",
                small_text: `Made by ${developer}`,
            },
            buttons: [{ label: `Invite`, url: inviteUrl },
            { label: 'Song on Youtube', url: 'https://www.youtube.com/results?search_query=' + (encodeURIComponent(songName ? songName : '')) }],
        },
    }).catch(console.error);
};

module.exports = functions;