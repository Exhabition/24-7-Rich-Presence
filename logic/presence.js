require('dotenv').config();

const { Client } = require('discord-rpc');
const { developer, inviteUrl, clientSettings } = require('../configuration/config.json');

class PresenceClient {
    constructor() {
        this._rpc = new Client({
            transport: "ipc",
        });

        this._rpc.on("ready", () => console.log(`[RPC] Ready!`));
        this._rpc.on("connected", () => console.log(`[RPC] Connected!`));

        this._rpc.login({ clientId: "780027677632757771" });

        this.loadSettings();
    }

    updatePresence(songInfo, botInfo) {
        if (!this._rpc.transport.socket) return console.info(`[RPC] No socket active`);

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
        if (this.settings.timeLeft == "remaining" && songLength > 0) {
            timestampRequest["end"] = Date.now() + songLength;
        } else {
            timestampRequest["start"] = Date.now();
        }

        const audioUrl = songUrl ? songUrl : 'https://open.spotify.com/search/' + (encodeURIComponent(songName ? songName : ''));

        // Make an activity object so we can decide wether we use timestamps.start or timestamps.end
        const activity = {
            state: songStation && songName ? `${songName}${this.settings.showAudioSource ? ` | Audio Source: ${songStation}` : ""}` : songName ? songName : songStation ? songStation : "Nothing",
            details: "Listening to",
            timestamps: {},
            assets: {
                large_image: this.settings.showAlbumArtWhenPossible && songArt ? songArt : botIcon,
                large_text: this.settings.showAlbumArtWhenPossible && songArt ? songName : botName,
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
        this._rpc.request('SET_ACTIVITY', {
            pid: process.pid,
            activity: activity,
        }).catch(console.error);
    }

    loadSettings() {
        const { timeLeft, showAudioSource, showAlbumArtWhenPossible } = clientSettings;

        let timeLeftSetting = timeLeft;
        if (timeLeft && typeof timeLeft !== "string" || timeLeft && (timeLeft !== "elapsed" && timeLeft !== "remaining")) {
            console.warn(`[RPC] Setting "timeLeft" should be a string "elapsed" or "remaining"\nDefaulting to "remaining"`);

            timeLeftSetting = "remaining";
        }

        let showAudioSourceSetting = showAudioSource;
        if (showAudioSource && typeof showAudioSource !== "boolean") {
            console.warn(`[RPC] Setting "showAudioSource" should be a boolean "true" or "false"\nDefaulting to "false"`);

            showAudioSourceSetting = false;
        }

        let showAlbumArtWhenPossibleSetting = showAlbumArtWhenPossible;
        if (showAudioSource && typeof showAudioSource !== "boolean") {
            console.warn(`[RPC] Setting "showAlbumArtWhenPossible" should be a boolean "true" or "false"\nDefaulting to "true"`);

            showAlbumArtWhenPossibleSetting = true;
        }

        this.settings = {
            timeLeft: timeLeftSetting ?? "remaining",
            showAudioSource: showAudioSourceSetting ?? false,
            showAlbumArtWhenPossible: showAlbumArtWhenPossibleSetting ?? true,
        }
    }

};

module.exports = { PresenceClient };