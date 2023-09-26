/**
 * @author p0t4t0sandwich
 * @description Main file for the Discord bot
 */

import { CacheType, ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';

import { Logger } from '../utils/Logger.js';

// Import commands
import { command as funnyCommand } from './modules/funny/commands/funny.js';
import { command as serverCommand } from './modules/serverUtils/commands/server.js';
import { command as minecraftCommand } from './modules/serverUtils/commands/minecraft.js';

/**
 * @interface CustomClient
 * @description Custom client interface
 * @extends Client
 * @property {Collection<string, any>} commands The commands collection
 */
interface CustomClient extends Client {
    commands: Collection<string, any>;
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
     * @memberof DiscordBot 
     */
    constructor(token: string, clientId: string) {
        this.token = token;
        this.clientId = clientId;
    }

    /**
     * @method onInteractionCreate
     * @param interaction The interaction
     * @description Handles interaction creation
     * @memberof DiscordBot
     */
    async onInteractionCreate(interaction: Interaction<CacheType>): Promise<void> {
        try {
            // Handle slash commands
            if (interaction.isChatInputCommand()) {
                this.handleSlashCommand(interaction);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @method handleSlashCommand
     * @param interaction The interaction
     * @description Handles slash commands
     * @memberof DiscordBot
     */
    async handleSlashCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        // Get the command
        const command = (<CustomClient>interaction.client).commands.get(interaction.commandName);

        // If the command doesn't exist, return
        if (!command) {
            this.logger.log("Error", this.clientId, `No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Execute the command
        try {
            await command.execute(interaction);
        } catch (error: any) {
            this.logger.log("Error", this.clientId, error.toString());
            console.log(error);
            await interaction.editReply({ content: 'There was an error while executing this command!' });
        }
    }

    /**
     * @method onClientReady
     * @param client The client
     * @description Handles client ready
     * @memberof DiscordBot
     */
    async onClientReady(client: CustomClient): Promise<void> {
        try {
            // Set up slash commands
            const commands = [];
            client.commands = new Collection();

            const rawCommands = [
                funnyCommand,
                serverCommand,
                minecraftCommand
            ];

            for (const rawCommand of rawCommands) {
                client.commands.set(rawCommand.data.name, rawCommand);
                commands.push(rawCommand.data.toJSON());
            }

            const rest = new REST({ version: '10' }).setToken(this.token);

            if (client.user === null) return;
            this.logger.log("Info", this.clientId, `Ready! Logged in as ${client.user.tag}`);

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
     * @method start
     * @description Starts the bot
     * @memberof DiscordBot
     */
    async start(): Promise<void> {
        const client: CustomClient = <CustomClient>(new Client({ intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent
        ]}));

        // Handle events
        client.on(Events.InteractionCreate, this.onInteractionCreate.bind(this));

        client.once(Events.ClientReady, this.onClientReady.bind(this, client));

        client.login(this.token);
    }
}

export { DiscordBot };
