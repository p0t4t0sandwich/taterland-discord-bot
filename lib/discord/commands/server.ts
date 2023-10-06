/**
 * @author p0t4t0sandwich
 * @description Server management Discord commands
 */

import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';

import { Logger } from '../../utils/Logger.js';
import { clientId } from '../DiscordBot.js';

// Import locales
import { locales as globalCommandLocales } from '../../../locales/commands/global.js';
import { locales as serverCommandLocales } from '../../../locales/commands/server.js';
import { serverManager } from '../modules/serverUtils/ServerManager.js';
import { ActionResult, Status, lookupState } from '@neuralnexus/ampapi';
import { EmbedColors } from '../../utils/EmbedColors.js';

const logger: Logger = new Logger('serverCommand', 'discord');
const DISCORD_ADMIN_IDS: string[] = (<string><unknown>process.env.DISCORD_ADMIN_IDS).split(",");

const command = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setNameLocalizations(serverCommandLocales.name)
        .setDescription("Commands for managing game servers")
        .setDescriptionLocalizations(serverCommandLocales.description)
        .setDefaultMemberPermissions(0)
        .setDMPermission(true)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("refresh")
                .setNameLocalizations(serverCommandLocales.refresh.name)
                .setDescription("Refresh the server list")
                .setDescriptionLocalizations(serverCommandLocales.list.description)
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("list")
                .setNameLocalizations(serverCommandLocales.list.name)
                .setDescription("List all servers")
                .setDescriptionLocalizations(serverCommandLocales.list.description)
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("start")
                .setNameLocalizations(serverCommandLocales.start.name)
                .setDescription("Start a server")
                .setDescriptionLocalizations(serverCommandLocales.start.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("stop")
                .setNameLocalizations(serverCommandLocales.stop.name)
                .setDescription("Stop a server")
                .setDescriptionLocalizations(serverCommandLocales.stop.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("restart")
                .setNameLocalizations(serverCommandLocales.restart.name)
                .setDescription("Restart a server")
                .setDescriptionLocalizations(serverCommandLocales.restart.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("kill")
                .setNameLocalizations(serverCommandLocales.kill.name)
                .setDescription("Kill a server")
                .setDescriptionLocalizations(serverCommandLocales.kill.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("sleep")
                .setNameLocalizations(serverCommandLocales.sleep.name)
                .setDescription("Put a server to sleep")
                .setDescriptionLocalizations(serverCommandLocales.sleep.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("send")
                .setNameLocalizations(serverCommandLocales.send.name)
                .setDescription("Send a command to a server")
                .setDescriptionLocalizations(serverCommandLocales.send.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("command")
                        .setNameLocalizations(serverCommandLocales.send.variable.command.name)
                        .setDescription("Command to send to the server")
                        .setDescriptionLocalizations(serverCommandLocales.send.variable.command.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("status")
                .setNameLocalizations(serverCommandLocales.status.name)
                .setDescription("Get the status of a server")
                .setDescriptionLocalizations(serverCommandLocales.status.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("backup")
                .setNameLocalizations(serverCommandLocales.backup.name)
                .setDescription("Backup a server")
                .setDescriptionLocalizations(serverCommandLocales.backup.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("backup_name")
                        .setNameLocalizations(serverCommandLocales.backup.variable.backup_name.name)
                        .setDescription("Name of the backup")
                        .setDescriptionLocalizations(serverCommandLocales.backup.variable.backup_name.description)
                        .setRequired(false)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("description")
                        .setNameLocalizations(serverCommandLocales.backup.variable.description.name)
                        .setDescription("Description of the backup")
                        .setDescriptionLocalizations(serverCommandLocales.backup.variable.description.description)
                        .setRequired(false)
                ).addBooleanOption((option: SlashCommandBooleanOption) =>
                    option.setName("is_sticky")
                        .setNameLocalizations(serverCommandLocales.backup.variable.is_sticky.name)
                        .setDescription("Whether or not the backup is sticky")
                        .setDescriptionLocalizations(serverCommandLocales.backup.variable.is_sticky.description)
                        .setRequired(false)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("players")
                .setNameLocalizations(serverCommandLocales.players.name)
                .setDescription("Get the players of a server")
                .setDescriptionLocalizations(serverCommandLocales.players.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("find")
                .setNameLocalizations(serverCommandLocales.find.name)
                .setDescription("Find the server that a player is on")
                .setDescriptionLocalizations(serverCommandLocales.find.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                )
        ),
    async execute(interaction: any) {
        await interaction.deferReply({ ephemeral: true });
        const discordID = interaction.user.id;
        const guildID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();

        // Log command
        logger.log(guildID, discordID, interaction.commandName + " " + subcommand);

        interface Embed {
            color: number,
            title: string,
            description: string,
            fields?: {
                name: string,
                value: string | number,
                inline?: boolean
            }[]
        }

        const embed: Embed = {
            color: EmbedColors.RED,
            title: "Server command",
            description: "An unknown error occurred."
        };

        if (!DISCORD_ADMIN_IDS.includes(discordID)) {
            embed.title = "Permission denied";
            embed.description = "You do not have permission to use this command.";
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        // Local functions
        async function serverNotExists(serverName: string): Promise<boolean> {
            if (!serverManager.instanceExists(serverName)) {
                await interaction.editReply({ embeds: [{
                    color: EmbedColors.RED,
                    title: "Server not found",
                    description: `The server ${serverName} does not exist.`,
                }] });
                return true;
            }
            return false;
        }

        // Handle subcommands
        const serverName: string = interaction.options.getString("server_name");
        if (serverName !== null && await serverNotExists(serverName)) return;
        switch (subcommand) {
            // Refresh server list
            case 'refresh':
                await serverManager.initInstanceData();
                embed.title = "Refreshed server list";
                embed.description = "Refreshed server list.";
                embed.color = EmbedColors.GREEN;
                break;
            // List servers
            case 'list':
                const servers: string[] = serverManager.listServers();
                embed.title = "Available Servers";
                embed.description = servers.join(", ");
                embed.color = EmbedColors.GREEN;
                break;
            // Start a server
            case 'start': {
                const result: ActionResult<any> = await serverManager.startServer(serverName);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Started server " + serverName + ".";
                    embed.color = EmbedColors.GREEN;
                } else {
                    embed.description = "Failed to start server " + serverName + ".\n" + result.Reason;
                }
                break;
            }
            // Stop a server
            case 'stop': {
                await serverManager.stopServer(serverName);
                embed.title = serverName;
                embed.description = "Stopped server " + serverName + ".";
                embed.color = EmbedColors.GREEN;
                break;
            }
            // Restart a server
            case 'restart': {
                const result: ActionResult<any> = await serverManager.restartServer(serverName);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Restarted server " + serverName + ".";
                    embed.color = EmbedColors.GREEN;
                } else {
                    embed.description = "Failed to restart server " + serverName + ".\n" + result.Reason;
                }
                break;
            }
            // Kill a server
            case 'kill': {
                await serverManager.killServer(serverName);
                embed.title = serverName;
                embed.description = "Killed server " + serverName + ".";
                embed.color = EmbedColors.GREEN;
                break;
            }
            // Put a server to sleep
            case 'sleep': {
                const result: ActionResult<any> = await serverManager.sleepServer(serverName);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Put server " + serverName + " to sleep.";
                    embed.color = EmbedColors.GREEN;
                } else {
                    embed.description = "Failed to put server " + serverName + " to sleep.\n" + result.Reason;
                }
                break;
            }
            // Send a command to a server
            case 'send': {
                const command: string = interaction.options.getString("command");
                await serverManager.sendConsoleMessageToServer(serverName, command);
                embed.title = serverName;
                embed.description = "Sent command to server " + serverName + ".";
                embed.color = EmbedColors.GREEN;
                break;
            }

            // Get the status of a server
            case 'status':
                const status: Status = await serverManager.getServerStatus(serverName);
                let state: string = lookupState(status.State);
                embed.title = serverName;
                embed.description = "Status of server " + serverName + ":";
                embed.description = "";
                embed.fields = [
                    {
                        name: "Status",
                        value: state
                    },
                    {
                        name: "CPU",
                        value: `${status.Metrics["CPU Usage"].RawValue}${status.Metrics["CPU Usage"].Units}`,
                        inline: true
                    },
                    {
                        name: "RAM",
                        value: `${status.Metrics["Memory Usage"].RawValue}${status.Metrics["Memory Usage"].Units}`,
                        inline: true
                    },
                    {
                        name: "",
                        value: ""
                    },
                    {
                        name: "Players",
                        value: status.Metrics["Active Users"].RawValue,
                        inline: true
                    }
                ];

                // Add optional metrics
                if (status.Metrics.hasOwnProperty("TPS")) {
                    embed.fields.push({
                        name: "TPS",
                        value: status.Metrics["TPS"].RawValue,
                        inline: true
                    });
                }

                switch (state) {
                    case 'Ready':
                        embed.color = EmbedColors.GREEN;
                        break;
                    case 'Sleeping':
                        embed.color = EmbedColors.YELLOW;
                        break;
                    default:
                        embed.color = EmbedColors.RED;
                        break;
                }
                break;

            // Backup a server
            case 'backup': {
                const backupName: string = interaction.options.getString("backup_name");
                const description: string = interaction.options.getString("description");
                const isSticky: boolean = interaction.options.getBoolean("is_sticky");
                const result: ActionResult<any> = await serverManager.backupServer(serverName, backupName, description, isSticky);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Backed up server " + serverName + ".";
                    embed.color = EmbedColors.GREEN;
                } else {
                    embed.description = "Failed to backup server " + serverName + ".\n" + result.Reason;
                }
                break;
            }

            // Get the players of a server
            case 'players':{
                const players: string[] = await serverManager.parsePlayerList(
                    await serverManager.getPlayerList(serverName)
                );
                embed.title = serverName;
                embed.description = "Players on server " + serverName + ":\n" + players.join(", ");
                break;
            }

            // Find the server that a player is on
            case 'find':{
                const playerName: string = interaction.options.getString("player_name");
                const server: string = await serverManager.findPlayer(playerName);
                embed.title = "Finding player " + playerName;
                if (server) {
                    embed.description = "Player " + playerName + " is on server " + server + ".";
                    embed.color = EmbedColors.GREEN;
                } else {
                    embed.description = "Could not find player " + playerName + ".";
                    embed.color = EmbedColors.YELLOW;
                }
                break;
            }

            default:
                embed.description = "Unknown subcommand.";
                break;
        }

        await interaction.editReply({ embeds: [embed] });
    }
};

export { command };
