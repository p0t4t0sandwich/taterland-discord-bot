/**
 * @author p0t4t0sandwich
 * @description Minecraft server management commands
 */

import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';

import { Logger } from '../../../../utils/Logger.js';

// Import locales
import globalCommandLocales from '../../../../../locales/commands/global.json' assert { type: "json" };
// import serverCommandLocales from '../../../../../locales/commands/server.json' assert { type: "json" };
import { serverManager } from '../utils/ServerManager.js';
import { ActionResult, Status, lookupState } from '@neuralnexus/ampapi';

const logger: Logger = new Logger('minecraftCommand', 'discord');
const clientId: string = process.env.DISCORD_CLIENT_ID;
const DISCORD_ADMIN_IDS: string[] = process.env.DISCORD_ADMIN_IDS.split(",");

const command = {
    data: new SlashCommandBuilder()
        .setName("minecraft")
        // .setNameLocalizations(serverCommandLocales.minecraft.name)
        .setDescription("Commands for managing Minecraft servers")
        // .setDescriptionLocalizations(serverCommandLocales.minecraft.description)
        .setDefaultMemberPermissions(0)
        .setDMPermission(true)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("whitelist_add")
                // .setNameLocalizations(serverCommandLocales.minecraft.whitelist_add.name)
                .setDescription("Adds a player to the whitelist")
                // .setDescriptionLocalizations(serverCommandLocales.minecraft.whitelist_add.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.global.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.global.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.global.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("whitelist_remove")
                // .setNameLocalizations(serverCommandLocales.minecraft.whitelist_remove.name)
                .setDescription("Removes a player from the whitelist")
                // .setDescriptionLocalizations(serverCommandLocales.minecraft.whitelist_remove.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.global.variable.server_name.description)
                        .setRequired(true)
                ).addStringOption((option: SlashCommandStringOption) =>
                    option.setName("player_name")
                        .setNameLocalizations(globalCommandLocales.global.variable.player_name.name)
                        .setDescription("Name of the player")
                        .setDescriptionLocalizations(globalCommandLocales.global.variable.player_name.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("whitelist_list")
                // .setNameLocalizations(serverCommandLocales.minecraft.whitelist_list.name)
                .setDescription("Lists all players on the whitelist")
                // .setDescriptionLocalizations(serverCommandLocales.minecraft.whitelist_list.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("server_name")
                        .setNameLocalizations(globalCommandLocales.global.variable.server_name.name)
                        .setDescription("Name of the server")
                        .setDescriptionLocalizations(globalCommandLocales.global.variable.server_name.description)
                        .setRequired(true)
                )
        )
    ,
    async execute(interaction: any) {
        await interaction.deferReply({ ephemeral: true });
        const discordID = interaction.user.id;
        const guildID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();

        // Log command
        logger.log(guildID, discordID, interaction.commandName + " " + subcommand);

        const embed = {
            color: 0xbf0f0f,
            title: "Minecraft command",
            description: "An unknown error occurred.",
            fields: []
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
                    color: 0xbf0f0f,
                    title: "Server not found",
                    description: `The server ${serverName} does not exist.`,
                }] });
                return true;
            }
            return false;
        }

        // Handle subcommands
        switch (subcommand) {
            // Whitelist add
            case "whitelist_add": {
                const serverName = interaction.options.getString("server_name");
                const playerName = interaction.options.getString("player_name");
                if (await serverNotExists(serverName)) return;

                await serverManager.whitelistAdd(serverName, playerName);

                embed.title = "Whitelist add";
                embed.description = `Added ${playerName} to the whitelist of ${serverName}.`;
                await interaction.editReply({ embeds: [embed] });
                break;
            }

            // Whitelist remove
            case "whitelist_remove": {
                const serverName = interaction.options.getString("server_name");
                const playerName = interaction.options.getString("player_name");
                if (await serverNotExists(serverName)) return;

                await serverManager.whitelistRemove(serverName, playerName);

                embed.title = "Whitelist remove";
                embed.description = `Removed ${playerName} from the whitelist of ${serverName}.`;
                await interaction.editReply({ embeds: [embed] });
                break;
            }

            // Whitelist list
            case "whitelist_list": {
                const serverName = interaction.options.getString("server_name");
                if (await serverNotExists(serverName)) return;

                const whitelist = await serverManager.whitelistList(serverName);

                embed.title = "Whitelist list";
                embed.description = `Whitelist of ${serverName}:`;
                embed.fields = whitelist.map((playerName: string) => {
                    return {
                        name: playerName,
                        value: " ",
                        inline: true
                    };
                });
                await interaction.editReply({ embeds: [embed] });
                break;
            }
        }
    }
}

export { command };
