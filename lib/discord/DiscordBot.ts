/**
 * @author p0t4t0sandwich
 * @description Main file for the Discord bot
 */

import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';

import { Logger } from '../utils/Logger.js';

// Import commands
import { command as funnyCommand } from './commands/funny.js';
import { command as minecraftCommand } from './commands/minecraft.js';
import { command as serverCommand } from './commands/server.js';

// Import events
import { event as clientReadyEvent } from './events/clientReady.js';
import { event as interactionCreateEvent } from './events/interactionCreate.js';
import { event as messageCreateEvent } from './events/messageCreate.js';


const clientId: string = <string><unknown>process.env.DISCORD_CLIENT_ID;

/**
 * @interface CustomClient
 * @description Custom client interface
 * @extends Client
 * @property {Collection<string, any>} commands The commands collection
 */
interface CustomClient extends Client {
    commands: Collection<string, any>;
}

interface CustomEvent {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
}

/**
 * @class DiscordBot
 * @description Discord bot class
 * @property {string} token The bot token
 * @property {string} clientId The bot client ID
 * @method {void} onInteractionCreate Handles interaction creation
 * @method {void} onClientReady Handles client ready
 * @method {void} start Starts the bot
 */
class DiscordBot {
    private token: string;
    private clientId: string;
    private logger: Logger = new Logger('DiscordBot', 'discord');

    /**
     * @constructor
     * @param {string} token The bot token
     * @param {string} clientId The bot client ID
     * @description Discord bot constructor 
     */
    constructor(token: string, clientId: string) {
        this.token = token;
        this.clientId = clientId;
    }

    /**
     * @method registerSlashCommands
     * @param client The client
     * @description Handles client ready event
     */
    async registerSlashCommands(client: CustomClient): Promise<void> {
        try {
            // Set up slash commands
            const commands = [];
            client.commands = new Collection();

            const rawCommands = [
                funnyCommand,
                minecraftCommand,
                serverCommand
            ];

            for (const rawCommand of rawCommands) {
                client.commands.set(rawCommand.data.name, rawCommand);
                commands.push(rawCommand.data.toJSON());
            }

            const rest = new REST({ version: '10' }).setToken(this.token);

            (async () => {
                try {
                    this.logger.log("Info", this.clientId, `Started refreshing ${commands.length} application (/) commands.`);
                    const data = <any[]>(await rest.put(
                        Routes.applicationCommands(this.clientId),
                        { body: commands },
                    ));

                    this.logger.log("Info", this.clientId, `Successfully reloaded ${data.length} application (/) commands.`);

                } catch (error) {
                    console.error(error);
                }
            })();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @method registerEvents
     * @param client The client
     * @description Handles client ready event
     */
    async registerEvents(client: CustomClient): Promise<void> {
        try {
            // Handle events
            const events: CustomEvent[] = [
                clientReadyEvent,
                interactionCreateEvent,
                messageCreateEvent
            ];
            for (const event of events) {
                if (event.once) {
                    client.once(event.name, async (...args: any[]) => await event.execute(...args));
                } else {
                    client.on(event.name, async (...args: any[]) => await event.execute(...args));
                }
            }
            this.logger.log("Info", this.clientId, `Registered ${events.length} events.`);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @method start
     * @description Starts the bot
     */
    async start(): Promise<void> {
        const client: CustomClient = <CustomClient>(new Client({ intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]}));

        this.registerSlashCommands(client);
        this.registerEvents(client);

        client.login(this.token);
    }
}

export { clientId, CustomClient, DiscordBot };
