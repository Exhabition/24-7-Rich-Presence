require('dotenv').config();

const { Client } = require('discord-rpc');
const { developer, inviteUrl, supportUrl } = require('../configuration/config.json');

const RPC = new Client({
    transport: "ipc",
});

RPC.on('ready', async () => {
    console.log(`RP ready`);
});

RPC.on("connected", async () => {
    console.log(`RP connected`);
});

RPC.login({
    clientId: "780027677632757771",
}).catch(console.error);

const functions = {};

functions.updatePresence = function (songInfo, botInfo) {
    const botName = botInfo.name;
    const botIcon = botInfo.icon;

    if (!RPC.transport.socket) return console.log(`No socket active`);
    RPC.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            state: songInfo.station && songInfo.name ? `${songInfo.name}\nAudio Source: ${songInfo.station}` : songInfo.name ? songInfo.name : songInfo.station ? songInfo.station : "Nothing",
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
            { label: `Support`, url: supportUrl }],
        },
    }).catch(console.error);
};

module.exports = functions;