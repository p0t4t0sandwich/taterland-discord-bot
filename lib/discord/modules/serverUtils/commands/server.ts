/**
 * @author p0t4t0sandwich
 * @description Server management Discord commands
 */

import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';

import { Logger } from '../../../../utils/Logger.js';

// Import locales
import serverCommandLocales from '../../../../../locales/commands/server.json' assert { type: "json" };
import { serverManager } from '../utils/ServerManager.js';
import { ActionResult } from '../utils/ampapi-typescript/lib/types/ActionResult.js';
import { Status } from '../utils/ampapi-typescript/lib/types/Status.js';

const logger: Logger = new Logger('serverCommand', 'discord');
const clientId: string = process.env.DISCORD_CLIENT_ID;

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
            description: "An unknown error occurred."
        };

        // Handle subcommands
        switch (subcommand) {

            // List servers
            case 'list':
                const servers: string[] = await serverManager.listServers();
                embed.description = "Avalable Servers: " + servers.join(", ");
                break;

            // Start a server
            case 'start': {
                const serverName: string = interaction.options.getString("server_name");
                const result: ActionResult<any> = await serverManager.startServer(serverName);
                if (result.Status === true) {
                    embed.description = "Started server " + serverName + ".";
                } else {
                    embed.description = "Failed to start server " + serverName + ".\n" + result.Reason;
                }
                break;
            }

            // Stop a server
            case 'stop': {
                const serverName: string = interaction.options.getString("server_name");
                await serverManager.stopServer(serverName);
                embed.description = "Stopped server " + serverName + ".";
                break;
            }

            // Restart a server
            case 'restart': {
                const serverName: string = interaction.options.getString("server_name");
                const result: ActionResult<any> = await serverManager.restartServer(serverName);
                if (result.Status === true) {
                    embed.description = "Restarted server " + serverName + ".";
                } else {
                    embed.description = "Failed to restart server " + serverName + ".\n" + result.Reason;
                }
                break;
            }

            // Kill a server
            case 'kill': {
                const serverName: string = interaction.options.getString("server_name");
                await serverManager.killServer(serverName);
                embed.description = "Killed server " + serverName + ".";
                break;
            }

            // Put a server to sleep
            case 'sleep': {
                const serverName: string = interaction.options.getString("server_name");
                const result: ActionResult<any> = await serverManager.sleepServer(serverName);
                if (result.Status === true) {
                    embed.description = "Put server " + serverName + " to sleep.";
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
                embed.description = "Sent command to server " + serverName + ".";
                break;
            }

            // Get the status of a server
            case 'status':
                const serverName: string = interaction.options.getString("server_name");
                const status: Status = await serverManager.getServerStatus(serverName);

                // Build embed
                embed.description = `Server: ${serverName}\n`
                    + `Status: ${status.State}\n`;
                    + `CPU Usage: ${status.Metrics["CPU Usage"]}\n`
                    + `Memory Usage: ${status.Metrics["Memory Usage"]}\n`
                    + `Online Players: ${status.Metrics["Active Users"]}\n`

                // Add optional metrics
                if (status.Metrics.hasOwnProperty("TPS")) {
                    embed.description += `TPS: ${status.Metrics["TPS"]}\n`;
                }
                break;

            // Backup a server
            case 'backup': {
                const serverName: string = interaction.options.getString("server_name");

                // TODO: Add backup name, description, and sticky options
                const result: ActionResult<any> = await serverManager.backupServer(serverName, "", "", false);
                if (result.Status === true) {
                    embed.description = "Backed up server " + serverName + ".";
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
                embed.description = "Players on server " + serverName + ":\n" + players.join(", ");
                break;
            }

            // Find the server that a player is on
            case 'find':{
                const playerName: string = interaction.options.getString("player_name");
                const server: string = await serverManager.findPlayer(playerName);
                if (server) {
                    embed.description = "Player " + playerName + " is on server " + server + ".";
                } else {
                    embed.description = "Could not find player " + playerName + ".";
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
