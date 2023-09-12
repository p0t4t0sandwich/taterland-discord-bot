/**
 * @author p0t4t0sandwich
 * @description Server management Discord commands
 * 
 * Colors:
 * - Green: 0x65bf65
 * - Yellow: 0xe6d132
 * - Red: 0xbf0f0f
 */

import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';

import { Logger } from '../../../../utils/Logger.js';

// Import locales
import serverCommandLocales from '../../../../../locales/commands/server.json' assert { type: "json" };
import { serverManager } from '../utils/ServerManager.js';
import { ActionResult, Status, lookupState } from '@neuralnexus/ampapi';

const logger: Logger = new Logger('serverCommand', 'discord');
const clientId: string = process.env.DISCORD_CLIENT_ID;
const DISCORD_ADMIN_IDS: string[] = process.env.DISCORD_ADMIN_IDS.split(",");

const command = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setNameLocalizations(serverCommandLocales.server.name)
        .setDescription("Commands for managing game servers")
        .setDescriptionLocalizations(serverCommandLocales.server.description)
        .setDefaultMemberPermissions(0)
        .setDMPermission(true)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("list")
                .setNameLocalizations(serverCommandLocales.server.list.name)
                .setDescription("List all servers")
                .setDescriptionLocalizations(serverCommandLocales.server.list.description)
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("start")
                .setNameLocalizations(serverCommandLocales.server.start.name)
                .setDescription("Start a server")
                .setDescriptionLocalizations(serverCommandLocales.server.start.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("stop")
                .setNameLocalizations(serverCommandLocales.server.stop.name)
                .setDescription("Stop a server")
                .setDescriptionLocalizations(serverCommandLocales.server.stop.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("restart")
                .setNameLocalizations(serverCommandLocales.server.restart.name)
                .setDescription("Restart a server")
                .setDescriptionLocalizations(serverCommandLocales.server.restart.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("kill")
                .setNameLocalizations(serverCommandLocales.server.kill.name)
                .setDescription("Kill a server")
                .setDescriptionLocalizations(serverCommandLocales.server.kill.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("sleep")
                .setNameLocalizations(serverCommandLocales.server.sleep.name)
                .setDescription("Put a server to sleep")
                .setDescriptionLocalizations(serverCommandLocales.server.sleep.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("send")
                .setNameLocalizations(serverCommandLocales.server.send.name)
                .setDescription("Send a command to a server")
                .setDescriptionLocalizations(serverCommandLocales.server.send.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("command")
                        .setNameLocalizations(serverCommandLocales.server.send.variable.command.name)
                        .setDescription("Command to send to the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.send.variable.command.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("status")
                .setNameLocalizations(serverCommandLocales.server.status.name)
                .setDescription("Get the status of a server")
                .setDescriptionLocalizations(serverCommandLocales.server.status.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("backup")
                .setNameLocalizations(serverCommandLocales.server.backup.name)
                .setDescription("Backup a server")
                .setDescriptionLocalizations(serverCommandLocales.server.backup.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("backup_name")
                        .setNameLocalizations(serverCommandLocales.server.backup.variable.backup_name.name)
                        .setDescription("Name of the backup")
                        .setDescriptionLocalizations(serverCommandLocales.server.backup.variable.backup_name.description)
                        .setRequired(false)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("description")
                        .setNameLocalizations(serverCommandLocales.server.backup.variable.description.name)
                        .setDescription("Description of the backup")
                        .setDescriptionLocalizations(serverCommandLocales.server.backup.variable.description.description)
                        .setRequired(false)
                ).addBooleanOption((option: SlashCommandBooleanOption) =>
                    option.setName("is_sticky")
                        .setNameLocalizations(serverCommandLocales.server.backup.variable.is_sticky.name)
                        .setDescription("Whether or not the backup is sticky")
                        .setDescriptionLocalizations(serverCommandLocales.server.backup.variable.is_sticky.description)
                        .setRequired(false)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("players")
                .setNameLocalizations(serverCommandLocales.server.players.name)
                .setDescription("Get the players of a server")
                .setDescriptionLocalizations(serverCommandLocales.server.players.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(serverCommandLocales.server.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(serverCommandLocales.server.global.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("find")
                .setNameLocalizations(serverCommandLocales.server.find.name)
                .setDescription("Find the server that a player is on")
                .setDescriptionLocalizations(serverCommandLocales.server.find.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(serverCommandLocales.server.find.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(serverCommandLocales.server.find.variable.player_name.description)
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

        const embed = {
            color: 0xbf0f0f,
            title: "Server command",
            description: "An unknown error occurred.",
            fields: []
        };

        if (!DISCORD_ADMIN_IDS.includes(discordID)) {
            embed.title = "Permission denied";
            embed.description = "You do not have permission to use this command.";
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        // Handle subcommands
        switch (subcommand) {

            // List servers
            case 'list':
                const servers: string[] = await serverManager.listServers();
                embed.title = "Available Servers";
                embed.description = servers.join(", ");
                embed.color = 0x65bf65;
                break;

            // Start a server
            case 'start': {
                const serverName: string = interaction.options.getString("server_name");
                const result: ActionResult<any> = await serverManager.startServer(serverName);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Started server " + serverName + ".";
                    embed.color = 0x65bf65;
                } else {
                    embed.description = "Failed to start server " + serverName + ".\n" + result.Reason;
                }
                break;
            }

            // Stop a server
            case 'stop': {
                const serverName: string = interaction.options.getString("server_name");
                await serverManager.stopServer(serverName);
                embed.title = serverName;
                embed.description = "Stopped server " + serverName + ".";
                embed.color = 0x65bf65;
                break;
            }

            // Restart a server
            case 'restart': {
                const serverName: string = interaction.options.getString("server_name");
                const result: ActionResult<any> = await serverManager.restartServer(serverName);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Restarted server " + serverName + ".";
                    embed.color = 0x65bf65;
                } else {
                    embed.description = "Failed to restart server " + serverName + ".\n" + result.Reason;
                }
                break;
            }

            // Kill a server
            case 'kill': {
                const serverName: string = interaction.options.getString("server_name");
                await serverManager.killServer(serverName);
                embed.title = serverName;
                embed.description = "Killed server " + serverName + ".";
                embed.color = 0x65bf65;
                break;
            }

            // Put a server to sleep
            case 'sleep': {
                const serverName: string = interaction.options.getString("server_name");
                const result: ActionResult<any> = await serverManager.sleepServer(serverName);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Put server " + serverName + " to sleep.";
                    embed.color = 0x65bf65;
                } else {
                    embed.description = "Failed to put server " + serverName + " to sleep.\n" + result.Reason;
                }
                break;
            }

            // Send a command to a server
            case 'send': {
                const serverName: string = interaction.options.getString("server_name");
                const command: string = interaction.options.getString("command");
                await serverManager.sendConsoleMessageToServer(serverName, command);
                embed.title = serverName;
                embed.description = "Sent command to server " + serverName + ".";
                embed.color = 0x65bf65;
                break;
            }

            // Get the status of a server
            case 'status':
                const serverName: string = interaction.options.getString("server_name");
                const status: Status = await serverManager.getServerStatus(serverName);

                let state: string = lookupState(status.State);

                embed.title = serverName;
                // embed.description = "Status of server " + serverName + ":";
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
                        embed.color = 0x65bf65;
                        break;
                    case 'Sleeping':
                        embed.color = 0xe6d132;
                        break;
                    case 'Failed':
                        embed.color = 0xbf0f0f;
                        break;
                    default:
                        embed.color = 0xbf0f0f;
                        break;
                }

                break;

            // Backup a server
            case 'backup': {
                const serverName: string = interaction.options.getString("server_name");
                const backupName: string = interaction.options.getString("backup_name");
                const description: string = interaction.options.getString("description");
                const isSticky: boolean = interaction.options.getBoolean("is_sticky");

                const result: ActionResult<any> = await serverManager.backupServer(serverName, backupName, description, isSticky);
                embed.title = serverName;
                if (result.Status === true) {
                    embed.description = "Backed up server " + serverName + ".";
                    embed.color = 0x65bf65;
                } else {
                    embed.description = "Failed to backup server " + serverName + ".\n" + result.Reason;
                }
                break;
            }

            // Get the players of a server
            case 'players':{
                const serverName: string = interaction.options.getString("server_name");
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
                    embed.color = 0x65bf65;
                } else {
                    embed.description = "Could not find player " + playerName + ".";
                    embed.color = 0xe6d132;
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
