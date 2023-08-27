/**
 * @author p0t4t0sandwich
 * @description Server management Discord commands
 */

import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';

import { Logger } from '../../../../utils/Logger.js';

// Import locales
import serverCommandLocales from '../../../../../locales/commands/server.json' assert { type: "json" };

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
            case 'list':
                embed.description = "Not implemented yet.";
                break;
            case 'start':
                embed.description = "Not implemented yet.";
                break;
            case 'stop':
                embed.description = "Not implemented yet.";
                break;
            case 'restart':
                embed.description = "Not implemented yet.";
                break;
            case 'kill':
                embed.description = "Not implemented yet.";
                break;
            case 'sleep':
                embed.description = "Not implemented yet.";
                break;
            case 'send':
                embed.description = "Not implemented yet.";
                break;
            case 'status':
                embed.description = "Not implemented yet.";
                break;
            case 'backup':
                embed.description = "Not implemented yet.";
                break;
            case 'players':
                embed.description = "Not implemented yet.";
                break;
            case 'find':
                embed.description = "Not implemented yet.";
                break;
            default:
                embed.description = "Unknown subcommand.";
                break;
        }

        await interaction.editReply({ embeds: [embed] });
    }
};

export { command };
