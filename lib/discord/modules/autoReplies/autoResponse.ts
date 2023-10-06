/**
 * @author p0t4t0sandwich
 * @description AutoResponse module, hooks into the MessageCreate event and replies to messages
 */

import { Embed, EmbedBuilder, Message } from 'discord.js';

import { Logger } from '../../../utils/Logger.js';
import { clientId } from '../../DiscordBot.js';
import { EmbedColors } from '../../../utils/EmbedColors.js';


const logger: Logger = new Logger('AutoResponse', 'discord');

/**
 * @interface AutoResponseMessage
 * @description AutoResponseMessage interface
 * @property {string} match The message to match
 * @property {string} reply The reply to the message
 * @property {boolean} [caseSensitive] Whether or not the message is case sensitive
 */
interface AutoResponseMessage {
    match: (RegExp | string)[];
    reply: string | EmbedBuilder | ((...args: any[]) => string | EmbedBuilder) | ((...args: any[]) => Promise<string | EmbedBuilder>);
    caseSensitive?: boolean;
}

const autoResponses: AutoResponseMessage[] = [
    {
        match: ["eta"],
        reply: new EmbedBuilder()
            .setTitle("Soon™")
            .setDescription("We don't normally give ETAs for updates. We're working on it, and it'll be out when it's ready.")
            .setColor(EmbedColors.YELLOW)
    },
    {
        match: ["cracked", "pirated", "premium", "offline mode"],
        reply: new EmbedBuilder()
            .setTitle("Note on Cracked/Pirated/Offline Clients")
            .setDescription("We don't support, or provide support for, cracked/pirated clients.\nPlease purchase the game.")
            .setColor(EmbedColors.RED)
            .addFields([
                {
                    name: "Why?",
                    value: "We don't support cracked/pirated clients because of the following:\n" +
                        "1. They are against the [Minecraft EULA](https://account.mojang.com/documents/minecraft_eula), and in turn, discussing the matter breaks Discord's [Terms of Service](https://discord.com/terms).\n" +
                        "2. Offline servers are insecure by nature. They allow anyone to join with any username, and can be easily exploited.\n" +
                        "3. Running the server without proper authentication and UUIDs can cause issues with plugins and other features, we won't fix such issues."
                }
            ])
    },
    {
        match: ["!ip", "!server", "!mc", "!minecraft"],
        reply: new EmbedBuilder()
            .setTitle("Taterland Minecraft Server")
            .setDescription("The Taterland Minecraft server is a highly compatible server that supports clients from 1.7.10 to 1.20.2, including Bedrock Edition.")
            .setColor(EmbedColors.GREEN)
            .setThumbnail("https://api.neuralnexus.dev/api/v1/mcstatus/icon/mc.taterland.ca")
            .addFields([
                {
                    name: "IP",
                    value: "`mc.taterland.ca`"
                },
                {
                    name: "Status",
                    value: "[mc.taterland.ca](https://api.neuralnexus.dev/api/v1/mcstatus/mc.taterland.ca)"
                },
                {
                    name: "Bedrock Port",
                    value: "`19132`"
                }
            ])
            .setTimestamp()
            .setFooter({ text: 'Status Provided by NeuralNexus', iconURL: 'https://api.neuralnexus.dev/api/v1/mcstatus/icon/mc.taterland.ca' })
    },
    {
        match: ["!discord", "!invite"],
        reply: new EmbedBuilder()
            .setTitle("Taterland Discord Server")
            .setDescription("The Taterland Discord server is a place for Taterland members to chat and hang out.")
            .setColor(EmbedColors.DISCORD_BLUE)
            .setThumbnail("https://cdn.discordapp.com/icons/800934783541968916/3edd5bb792b2f1bcc8b9609bfc69efac.webp")
            .addFields([
                {
                    name: "Invite",
                    value: "[discord.taterland.ca](https://discord.taterland.ca)"
                }
            ])
    },
    {
        match: ["!rules"],
        reply: new EmbedBuilder()
            .setTitle("Taterland Rules")
            .setDescription("The Taterland rules are a set of rules that all members must follow.")
            .setColor(EmbedColors.DISCORD_BLUE)
            .setThumbnail("https://cdn.discordapp.com/icons/818472824197103616/9f0f4a2e3b3a0b0b6f7e1b8e0f3f7e5e.webp")
            .addFields([
                {
                    name: "Rules",
                    value: "https://discord.com/channels/800934783541968916/800949839067480105"
                }
            ])
    },
    // {
    //     match: ["fuck"],
    //     reply: async (message: Message): Promise<string | EmbedBuilder> => {
    //         await message.delete();
    //         return new EmbedBuilder()
    //             .setTitle("We dont say that here!")
    //             .setDescription("Please refrain from using that sort of language.")
    //             .setColor(EmbedColors.RED)
    //             .setThumbnail("https://cdn.discordapp.com/icons/800934783541968916/3edd5bb792b2f1bcc8b9609bfc69efac.webp")
    //     }
    // }
];

/**
 * @function autoResponse
 * @description autoResponse function that replies to messages
 * @param {Message} message The message object
 */
async function autoResponse(message: Message): Promise<void> {
    try {
        // Don't reply to bots
        if (message.author.bot) return;

        // Reply to messages
        let messageContent = message.content;
        for (const autoResponse of autoResponses) {
            if (autoResponse.caseSensitive !== true) {
                messageContent = messageContent.toLowerCase();
            }
            for (const match of autoResponse.match) {
                if (messageContent.match(match)) {
                    let reply: string | EmbedBuilder;
                    if (typeof autoResponse.reply === 'function') {
                        reply = await autoResponse.reply(message);
                    } else {
                        reply = autoResponse.reply;
                    }
                    logger.log("Info", message.author.id, `AutoResponse: ${message.content}`);
                    if (reply instanceof EmbedBuilder) {
                        message.reply({ embeds: [reply] });
                    } else {
                        message.reply(reply);
                    }
                    return;
                }
            }
        }
    } catch (error: any) {
        logger.log("Error", clientId, error.toString());
    }
}

export { autoResponse };
