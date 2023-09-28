/**
 * @author p0t4t0sandwich
 * @description Minecraft server management commands
 */

import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';

import { Logger } from '../../../../utils/Logger.js';

// Import locales
import { locales as globalCommandLocales } from '../../../../../locales/commands/global.js';
import { locales as minecraftCommandLocales } from '../../../../../locales/commands/minecraft.js';
import { serverManager } from '../utils/ServerManager.js';
import { EmbedColors } from '../../../../utils/EmbedColors.js';

const logger: Logger = new Logger('minecraftCommand', 'discord');
const clientId: string = <string><unknown>process.env.DISCORD_CLIENT_ID;
const DISCORD_ADMIN_IDS: string[] = (<string><unknown>process.env.DISCORD_ADMIN_IDS).split(",");

const command = {
    data: new SlashCommandBuilder()
        .setName("minecraft")
        .setNameLocalizations(minecraftCommandLocales.name)
        .setDescription("Commands for managing Minecraft servers")
        .setDescriptionLocalizations(minecraftCommandLocales.description)
        .setDefaultMemberPermissions(0)
        .setDMPermission(true)
        .addSubcommandGroup((subcommandGroup: SlashCommandSubcommandGroupBuilder) =>
            subcommandGroup.setName("whitelist")
                .setDescription("Commands for managing the whitelist")
                .setDescriptionLocalizations(minecraftCommandLocales.whitelist.description)
                .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("add")
                        .setDescription("Adds a player to the whitelist")
                        .setDescriptionLocalizations(minecraftCommandLocales.whitelist.add.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("server_name")
                                .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                                .setDescription("Name of the server")
                                .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                                .setRequired(true)
                        ).addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("remove")
                        .setDescription("Removes a player from the whitelist")
                        .setDescriptionLocalizations(minecraftCommandLocales.whitelist.remove.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("server_name")
                                .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                                .setDescription("Name of the server")
                                .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                                .setRequired(true)
                        ).addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("list")
                        .setDescription("Lists all players on the whitelist")
                        .setDescriptionLocalizations(minecraftCommandLocales.whitelist.list.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("server_name")
                                .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                                .setDescription("Name of the server")
                                .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                                .setRequired(true)
                        )
                )
        ).addSubcommandGroup((subcommandGroup: SlashCommandSubcommandGroupBuilder) =>
            subcommandGroup.setName("all")
                .setDescription("Commands for managing all servers simultaneously")
                .setDescriptionLocalizations(minecraftCommandLocales.all.description)
                .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("whitelist_add")
                        .setNameLocalizations(minecraftCommandLocales.whitelist.add.name)
                        .setDescription("Adds a player to the whitelist")
                        .setDescriptionLocalizations(minecraftCommandLocales.whitelist.add.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("whitelist_remove")
                        .setNameLocalizations(minecraftCommandLocales.whitelist.remove.name)
                        .setDescription("Removes a player from the whitelist")
                        .setDescriptionLocalizations(minecraftCommandLocales.whitelist.remove.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("whitelist_list")
                        .setNameLocalizations(minecraftCommandLocales.whitelist.list.name)
                        .setDescription("Lists all players on the whitelist")
                        .setDescriptionLocalizations(minecraftCommandLocales.whitelist.list.description)
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("ban")
                        .setNameLocalizations(minecraftCommandLocales.ban.name)
                        .setDescription("Bans a player from the server")
                        .setDescriptionLocalizations(minecraftCommandLocales.ban.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        ).addStringOption((option: SlashCommandStringOption) =>
                            option.setName("reason")
                                .setNameLocalizations(minecraftCommandLocales.global.variable.reason.name)
                                .setDescription("Reason for the ban")
                                .setDescriptionLocalizations(minecraftCommandLocales.global.variable.reason.description)
                                .setRequired(false)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("pardon")
                        .setNameLocalizations(minecraftCommandLocales.pardon.name)
                        .setDescription("Pardons a player")
                        .setDescriptionLocalizations(minecraftCommandLocales.pardon.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("unban")
                        .setNameLocalizations(minecraftCommandLocales.unban.name)
                        .setDescription("UnBans a player from the server")
                        .setDescriptionLocalizations(minecraftCommandLocales.pardon.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("banlist")
                        .setNameLocalizations(minecraftCommandLocales.banlist.name)
                        .setDescription("Lists the banned players")
                        .setDescriptionLocalizations(minecraftCommandLocales.banlist.description)
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("kick")
                        .setNameLocalizations(minecraftCommandLocales.kick.name)
                        .setDescription("Kicks a player from the server")
                        .setDescriptionLocalizations(minecraftCommandLocales.kick.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        ).addStringOption((option: SlashCommandStringOption) =>
                            option.setName("reason")
                                .setNameLocalizations(minecraftCommandLocales.global.variable.reason.name)
                                .setDescription("Reason for the ban")
                                .setDescriptionLocalizations(minecraftCommandLocales.global.variable.reason.description)
                                .setRequired(false)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("kill")
                        .setNameLocalizations(minecraftCommandLocales.kill.name)
                        .setDescription("Kills a player")
                        .setDescriptionLocalizations(minecraftCommandLocales.kill.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("op")
                        .setNameLocalizations(minecraftCommandLocales.op.name)
                        .setDescription("Grants a player operator status")
                        .setDescriptionLocalizations(minecraftCommandLocales.op.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("deop")
                        .setNameLocalizations(minecraftCommandLocales.deop.name)
                        .setDescription("Deops a player")
                        .setDescriptionLocalizations(minecraftCommandLocales.deop.description)
                        .addStringOption((option: SlashCommandStringOption) =>
                            option.setName("player_name")
                                .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                                .setDescription("Name of the player")
                                .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                                .setRequired(true)
                        )
                ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand.setName("oplist")
                        .setNameLocalizations(minecraftCommandLocales.oplist.name)
                        .setDescription("Lists the operators")
                        .setDescriptionLocalizations(minecraftCommandLocales.oplist.description)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("ban")
                .setNameLocalizations(minecraftCommandLocales.ban.name)
                .setDescription("Bans a player from the server")
                .setDescriptionLocalizations(minecraftCommandLocales.ban.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("reason")
                        .setNameLocalizations(minecraftCommandLocales.global.variable.reason.name)
                        .setDescription("Reason for the ban")
                        .setDescriptionLocalizations(minecraftCommandLocales.global.variable.reason.description)
                        .setRequired(false)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("pardon")
                .setNameLocalizations(minecraftCommandLocales.pardon.name)
                .setDescription("Pardons a player")
                .setDescriptionLocalizations(minecraftCommandLocales.pardon.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("unban")
                .setNameLocalizations(minecraftCommandLocales.unban.name)
                .setDescription("UnBans a player from the server")
                .setDescriptionLocalizations(minecraftCommandLocales.pardon.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("banlist")
                .setNameLocalizations(minecraftCommandLocales.banlist.name)
                .setDescription("Lists the banned players")
                .setDescriptionLocalizations(minecraftCommandLocales.banlist.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("kick")
                .setNameLocalizations(minecraftCommandLocales.kick.name)
                .setDescription("Kicks a player from the server")
                .setDescriptionLocalizations(minecraftCommandLocales.kick.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                option.setName("reason")
                    .setNameLocalizations(minecraftCommandLocales.global.variable.reason.name)
                    .setDescription("Reason for the ban")
                    .setDescriptionLocalizations(minecraftCommandLocales.global.variable.reason.description)
                    .setRequired(false)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("kill")
                .setNameLocalizations(minecraftCommandLocales.kill.name)
                .setDescription("Kills a player")
                .setDescriptionLocalizations(minecraftCommandLocales.kill.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("op")
                .setNameLocalizations(minecraftCommandLocales.op.name)
                .setDescription("Grants a player operator status")
                .setDescriptionLocalizations(minecraftCommandLocales.op.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("deop")
                .setNameLocalizations(minecraftCommandLocales.deop.name)
                .setDescription("Deops a player")
                .setDescriptionLocalizations(minecraftCommandLocales.deop.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("oplist")
                .setNameLocalizations(minecraftCommandLocales.oplist.name)
                .setDescription("Lists the operators")
                .setDescriptionLocalizations(minecraftCommandLocales.oplist.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.variable.server_name.description)
                        .setRequired(true)
                )
        ),
    async execute(interaction: any) {
        await interaction.deferReply({ ephemeral: true });
        const discordID = interaction.user.id;
        const guildID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        // Log command
        logger.log(guildID, discordID, interaction.commandName + " " + subcommandGroup + " " + subcommand);

        const embed = {
            color: EmbedColors.RED,
            title: "Minecraft command",
            description: "An unknown error occurred.",
            fields: [{}]
        };

        if (!DISCORD_ADMIN_IDS.includes(discordID)) {
            embed.title = "Permission denied";
            embed.description = "You do not have permission to use this command.";
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        // Local functions
        async function serverNotExists(serverName: string): Promise<boolean> {
            if (!serverManager.serverExists(serverName)) {
                await interaction.editReply({ embeds: [{
                    color: EmbedColors.RED,
                    title: "Server not found",
                    description: `The server ${serverName} does not exist.`,
                }] });
                return true;
            }
            return false;
        }

        async function isMinecraftServer(serverName: string): Promise<boolean> {
            if (serverName === null) return true;
            if (!serverManager.isMinecraftServer(serverName)) {
                await interaction.editReply({ embeds: [{
                    color: EmbedColors.RED,
                    title: "Server not found",
                    description: `The server ${serverName} is not a Minecraft server.`,
                }] });
                return false;
            }
            return true;
        }

        // Handle subcommands
        const serverName: string = interaction.options.getString("server_name");
        const playerName: string = interaction.options.getString("player_name");
        const reason: string = (interaction.options.getString("reason") === null) ? "" : interaction.options.getString("reason");
        if (serverName !== null && await serverNotExists(serverName)) return;
        if (!await isMinecraftServer(serverName)) return;
        switch(subcommandGroup) {
            // No subcommand group
            case null:
                switch(subcommand) {
                    // Ban
                    case "ban":
                        await serverManager.banPlayer(serverName, playerName, reason);
                        embed.title = "Ban";
                        embed.description = `Banned ${playerName} from ${serverName}.`;
                        if (reason !== "") embed.fields = [{ name: "Reason", value: reason }];
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Unban/Pardon
                    case "unban":
                    case "pardon":
                        await serverManager.pardonPlayer(serverName, playerName);
                        embed.title = "Pardon";
                        embed.description = `Pardoned ${playerName} from ${serverName}.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Banlist
                    case "banlist":
                        const banlist = await serverManager.banlistList(serverName);
                        embed.title = "Banlist list";
                        embed.description = `Banlist of ${serverName}:`;
                        embed.color = EmbedColors.GREEN;
                        embed.fields = banlist.map((playerName: string) => {
                            return {
                                name: playerName,
                                value: " ",
                                inline: true
                            };
                        });
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Kick
                    case "kick":
                        await serverManager.kickPlayer(serverName, playerName, reason);
                        embed.title = "Kick";
                        embed.description = `Kicked ${playerName} from ${serverName}.`;
                        if (reason !== "") embed.fields = [{ name: "Reason", value: reason }];
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Kill
                    case "kill":
                        await serverManager.killPlayer(serverName, playerName);
                        embed.title = "Kill";
                        embed.description = `Killed ${playerName} from ${serverName}.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Op
                    case "op":
                        await serverManager.opPlayer(serverName, playerName);
                        embed.title = "Op";
                        embed.description = `Opped ${playerName} from ${serverName}.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Deop
                    case "deop":
                        await serverManager.deopPlayer(serverName, playerName);
                        embed.title = "Deop";
                        embed.description = `Deopped ${playerName} from ${serverName}.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Oplist
                    case "oplist":
                        const oplist = await serverManager.opList(serverName);
                        embed.title = "Oplist list";
                        embed.description = `Oplist of ${serverName}:`;
                        embed.color = EmbedColors.GREEN;
                        embed.fields = oplist.map((playerName: string) => {
                            return {
                                name: playerName,
                                value: " ",
                                inline: true
                            };
                        });
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    default:
                        embed.title = "Invalid subcommand";
                        embed.description = `Subcommand ${subcommand} is invalid.`;
                        await interaction.editReply({ embeds: [embed] });
                }
                break;
            // Subcommand group whitelist
            case "whitelist":
                switch (subcommand) {
                    // Whitelist add
                    case "add":
                        await serverManager.whitelistAdd(serverName, playerName);
                        embed.title = "Whitelist add";
                        embed.description = `Added ${playerName} to the whitelist of ${serverName}.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Whitelist remove
                    case "remove":
                        await serverManager.whitelistRemove(serverName, playerName);
                        embed.title = "Whitelist remove";
                        embed.description = `Removed ${playerName} from the whitelist of ${serverName}.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Whitelist list
                    case "list":
                        const whitelist = await serverManager.whitelistList(serverName);
                        embed.title = "Whitelist list";
                        embed.description = `Whitelist of ${serverName}:`;
                        embed.color = EmbedColors.GREEN;
                        embed.fields = whitelist.map((playerName: string) => {
                            return {
                                name: playerName,
                                value: " ",
                                inline: true
                            };
                        });
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    default:
                        embed.title = "Invalid subcommand";
                        embed.description = "The subcommand you entered is invalid.";
                        await interaction.editReply({ embeds: [embed] });
                }
                break;
            // Subcommand group all
            case "all":
                switch (subcommand) {
                    // Whitelist add
                    case "whitelistAdd":
                        await serverManager.whitelistAddAll(playerName);
                        embed.title = "Whitelist add";
                        embed.description = `Added ${playerName} to the whitelist of all servers.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Whitelist remove
                    case "whitelistRemove":
                        await serverManager.whitelistRemoveAll(playerName);
                        embed.title = "Whitelist remove";
                        embed.description = `Removed ${playerName} from the whitelist of all servers.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Whitelist list
                    case "whitelistList":
                        const whitelist: Map<string, string[]> = await serverManager.whitelistListAll();
                        embed.title = "Whitelist list";
                        embed.description = "Whitelist of all servers:";
                        embed.color = EmbedColors.GREEN;
                        embed.fields = [];
                        whitelist.forEach((players: string[], serverName: string) => {
                            embed.fields.push({
                                name: serverName,
                                value: players.join(", "),
                                inline: false
                            });
                        });
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Ban
                    case "ban":
                        await serverManager.banPlayerAll(playerName, reason);
                        embed.title = "Ban";
                        embed.description = `Banned ${playerName} from all servers.`;
                        if (reason !== "") embed.fields = [{ name: "Reason", value: reason }];
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Pardon/Unban
                    case "pardon":
                    case "unban":
                        await serverManager.pardonPlayerAll(playerName);
                        embed.title = "Pardon";
                        embed.description = `Pardoned ${playerName} from all servers.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Banlist
                    case "banlist":
                        const banlist: Map<string, string[]> = await serverManager.banlistListAll();
                        embed.title = "Banlist list";
                        embed.description = "Banlist of all servers:";
                        embed.color = EmbedColors.GREEN;
                        embed.fields = [];
                        banlist.forEach((players: string[], serverName: string) => {
                            embed.fields.push({
                                name: serverName,
                                value: players.join(", "),
                                inline: false
                            });
                        });
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Kick
                    case "kick":
                        await serverManager.kickPlayerAll(playerName, reason);
                        embed.title = "Kick";
                        embed.description = `Kicked ${playerName} from all servers.`;
                        if (reason !== "") embed.fields = [{ name: "Reason", value: reason }];
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Kill
                    case "kill":
                        await serverManager.killPlayerAll(playerName);
                        embed.title = "Kill";
                        embed.description = `Killed ${playerName} on all servers.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Op
                    case "op":
                        await serverManager.opPlayerAll(playerName);
                        embed.title = "Op";
                        embed.description = `Opped ${playerName} on all servers.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Deop
                    case "deop":
                        await serverManager.deopPlayerAll(playerName);
                        embed.title = "Deop";
                        embed.description = `Deopped ${playerName} on all servers.`;
                        embed.color = EmbedColors.GREEN;
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    // Oplist
                    case "oplist":
                        const oplist: Map<string, string[]> = await serverManager.opListAll();
                        embed.title = "Oplist list";
                        embed.description = "Oplist of all servers:";
                        embed.color = EmbedColors.GREEN;
                        embed.fields = [];
                        oplist.forEach((players: string[], serverName: string) => {
                            embed.fields.push({
                                name: serverName,
                                value: players.join(", "),
                                inline: false
                            });
                        });
                        await interaction.editReply({ embeds: [embed] });
                        break;
                    default:
                        embed.title = "Invalid subcommand";
                        embed.description = "The subcommand you entered is invalid.";
                        await interaction.editReply({ embeds: [embed] });
                }
                break;
            default:
                embed.title = "Invalid subcommand group";
                embed.description = `The subcommand group ${subcommandGroup} is invalid.`;
                await interaction.editReply({ embeds: [embed] });
        }
    }
}

export { command };
