require('dotenv').config();
const { Client } = require('eris');
const { updatePresence } = require('./presence');
const { musicBotIds } = require('../configuration/config.json');
const ms = require('ms');

const bot = new Client(process.env.TOKEN);

bot.once('ready', async () => {
    console.info(`Message scanner is ready`);
});

bot.on('messageCreate', async (message) => {
    // Whenever a message is sent by one of the bots
    if (Object.keys(musicBotIds).includes(message.author.id)) {
        // Default info
        const songInfo = {
            name: null,
            station: "YouTube",
            length: 0,
        };

        // Get info from embed if there is an embed
        if (message.embeds && message.embeds.length > 0) {
            // The first embed of the embeds array, assuming this is a bot and not a webhook, the embeds array will always be 1 item long
            const currentEmbed = message.embeds[0];

            // Loop through all fields
            for (const field of currentEmbed.fields) {
                if (field.name) {
                    // Capitalization is not always the same :-(
                    const fieldName = field.name.toLowerCase();

                    // If a field has a name and the field has 'now playing' in the name, save the value of the embed as the name
                    if (fieldName.includes('now playing')) {
                        songInfo.name = field.value;
                    }

                    // If there is a field with stream link as the name, it's playing a radio, but we can't access the radio name without making a request ourselves
                    if (fieldName.includes('stream link')) {
                        songInfo.station = "Unknown";
                    }

                    // If permission attach files is off and user is playing queue, grab duration
                    if (fieldName.includes('duration')) {
                        // Field is contains current progress and total duration, get duration - progress
                        if (field.value.includes('/')) {
                            const [progress, duration] = field.value.split('/');
                            const timeLeft = stringToSeconds(duration.trim()) - stringToSeconds(progress.trim());

                            songInfo.length = timeLeft;
                        } else {
                            songInfo.length = stringToSeconds(field.value);
                        }
                    }
                }

            }

            // If the author.name contains 'now playing' there is either a [name](url) in the title or the description
            if ((currentEmbed.description || currentEmbed.title) && currentEmbed.author && currentEmbed.author.name.toLowerCase().includes("now playing")) {
                songInfo.name = getNameFromDescription(currentEmbed.description || currentEmbed.title);
            }

            // If there is footer text and the footer text starts with 'station:' the information after that is the station name
            if (currentEmbed.footer && currentEmbed.footer.text && currentEmbed.footer.text.toLowerCase().startsWith('station:')) {
                songInfo.station = currentEmbed.footer.text.split('station: ')[1];
            }
        } else if (message.attachments && message.attachments.length > 0) {
            // If there is a image which has a filename it might be sending images instead of embeds
            // TODO check if there is a better way to display filenames of images
            if (message.attachments[0] && message.attachments[0].filename) {
                // Make sure it's an png image, this filters out .json files from mb exportqueue
                if (message.attachments[0].filename.endsWith('.png')) {
                    // Each '-' should be a space > Hello_There.png = Hello There.png > Remove the .png extension
                    const filteredTitle = message.attachments[0].filename.replace(new RegExp("_", "g"), " ");
                    songInfo.name = filteredTitle.slice(0, filteredTitle.length - '.png'.length);
                }
            }
        }

        // If none of the values are null, then update presence
        if (!Object.values(songInfo).some(item => item === null)) {
            updatePresence(songInfo, musicBotIds[message.author.id]);
        }
    }
});

function getNameFromDescription(description) {
    // if string is in format '[name](url)' then filter out the name
    if (description.startsWith('[') && description.endsWith(')')) {
        description = description.split('(http')[0].replace(/[[\]]/g, '');
    }

    return description;
}

function stringToSeconds(string) {
    const stringArray = string.split(" ");

    let totalTime = 0;
    for (const stringTime of stringArray) {
        totalTime += ms(stringTime);
    }

    return totalTime;
}

bot.connect();