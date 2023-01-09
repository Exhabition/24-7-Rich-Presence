require('dotenv').config();

const { Client } = require('discord-rpc');
const { developer, inviteUrl, timeLeft, showAudioSource, showAlbumArtWhenPossible } = require('../configuration/config.json');

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
    if (!RPC.transport.socket) return console.info(`[RPC] No socket active`);

    // Name and icon of the bot the users is listening to, see config files for all supported bot versions
    const botName = botInfo.name;
    const botIcon = botInfo.icon;

    // Name, length and (optional) station of the song the user is listening too
    const songName = songInfo.name;
    const songLength = songInfo.length;
    const songStation = songInfo.station;
    const songUrl = songInfo.url;
    const songArt = songInfo.thumbnail;

    // Log the song and what we are trying to update the status too
    console.info(`[UPDATING STATUS] Listening to ${botName}`);
    console.info(`[SONG TITLE] ${songName}`);
    console.info(`[SONG LENGTH] ${songLength > 0 ? songLength : "Unknown"}`);
    console.info(`[SONG SOURCE] ${songStation}`);

    // Check which setting is on, elapsed or remaining (we need to be able to access the length of the song if we want to use "remaining")
    const timestampRequest = {};
    if (timeLeft.toLowerCase() == "remaining" && songLength > 0) {
        timestampRequest["end"] = Date.now() + songLength;
    } else {
        timestampRequest["start"] = Date.now();
    }

    const audioUrl = songUrl ? songUrl : 'https://open.spotify.com/search/' + (encodeURIComponent(songName ? songName : ''));

    // Make an activity object so we can decide wether we use timestamps.start or timestamps.end
    const activity = {
        state: songStation && songName ? `${songName}${showAudioSource ? ` | Audio Source: ${songStation}` : ""}` : songName ? songName : songStation ? songStation : "Nothing",
        details: "Listening to",
        timestamps: {},
        assets: {
            large_image: showAlbumArtWhenPossible && songArt ? songArt : botIcon,
            large_text: botName,
            small_image: "developer",
            small_text: `Made by ${developer}`,
        },
        buttons: [{ label: `Invite`, url: inviteUrl },
        {
            label: 'Song on Spotify', url: audioUrl,
        }],
    };

    // Apply timestamp setting
    const typeOfTimestamp = Object.keys(timestampRequest)[0];
    activity.timestamps[typeOfTimestamp] = timestampRequest[typeOfTimestamp];

    console.info(`[TIMESTAMP] Using '${typeOfTimestamp}' with ${timestampRequest[typeOfTimestamp]}`);

    // Make a set activity request ourselves
    RPC.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: activity,
    }).catch(console.error);
};

module.exports = functions;