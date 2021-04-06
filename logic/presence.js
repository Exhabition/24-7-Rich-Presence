require('dotenv').config();

const { Client } = require('discord-rpc');
const { developer, inviteUrl, timeLeft } = require('../configuration/config.json');

const RPC = new Client({
    transport: "ipc",
});

RPC.on('ready', async () => {
    console.info(`[RPC] Ready!`);
});

RPC.on("connected", async () => {
    console.info(`[RPC] Connected!`);
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

    // Name, length and (optional) station of the song the user is listening too
    const songName = songInfo.name;
    const songLength = songInfo.length;
    const songStation = songInfo.station;

    // Log the song and what we are trying to update the status too
    console.info(`[UPDATING STATUS] Listening to ${botName}`);
    console.info(`[SONG TITLE] ${songName}`);
    console.info(`[SONG SOURCE] ${songStation}`);

    // Check which setting is on, elapsed or remaining (we need to be able to access the length of the song if we want to use "remaining")
    const timestampRequest = {};
    if (timeLeft.toLowerCase() == "remaining" && songLength) {
        timestampRequest["end"] = Date.now() + songLength;
    } else {
        timestampRequest["start"] = Date.now();
    }

    // Make an activity object so we can decide wether we use timestamps.start or timestamps.end
    const activity = {
        state: songStation && songName ? `${songName} | Audio Source: ${songStation}` : songName ? songName : songStation ? songStation : "Nothing",
        details: "Listening to",
        timestamps: {},
        assets: {
            large_image: botIcon,
            large_text: botName,
            small_image: "developer",
            small_text: `Made by ${developer}`,
        },
        buttons: [{ label: `Invite`, url: inviteUrl },
        {
            label: 'Song on YouTube', url: 'https://www.youtube.com/results?search_query=' + (encodeURIComponent(songName ? songName : '')),
        }],
    };

    // Apply timestamp setting
    const typeOfTimestamp = Object.keys(timestampRequest)[0];
    activity.timestamps[typeOfTimestamp] = timestampRequest[typeOfTimestamp];

    // Make a set activity request ourselves
    RPC.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: activity,
    }).catch(console.error);
};

module.exports = functions;