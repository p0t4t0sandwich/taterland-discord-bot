/**
 * @author p0t4t0sandwich
 * @description Commands for managing AMP instnaces
 */

import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';

import { Logger } from '../../../../utils/Logger.js';

// Import locales
import { locales as globalCommandLocales } from '../../../../../locales/commands/global.js';
import { locales as instanceCommandLocales } from '../../../../../locales/commands/instance.js';
import { serverManager } from '../utils/ServerManager.js';
import { EmbedColors } from '../../../../utils/EmbedColors.js';

const logger: Logger = new Logger('instanceCommand', 'discord');
const clientId: string = <string><unknown>process.env.DISCORD_CLIENT_ID;
const DISCORD_ADMIN_IDS: string[] = (<string><unknown>process.env.DISCORD_ADMIN_IDS).split(",");

const command = {
    data: new SlashCommandBuilder()
        .setName("instance")
        .setNameLocalizations(instanceCommandLocales.name)
        .setDescription("Commands for managing AMP instances")
        .setDescriptionLocalizations(instanceCommandLocales.description)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("list")
                // .setNameLocalizations(globalCommandLocales.list.name)
                .setDescription("List all AMP instances")
                // .setDescriptionLocalizations(globalCommandLocales.list.description)
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("start")
                // .setNameLocalizations(globalCommandLocales.start.name)
                .setDescription("Start an AMP instance")
                // .setDescriptionLocalizations(globalCommandLocales.start.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("instance_name")
                        // .setNameLocalizations(instanceCommandLocales.start.options.instance.name)
                        .setDescription("The instance to start")
                        // .setDescriptionLocalizations(instanceCommandLocales.start.options.instance.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("stop")
                // .setNameLocalizations(globalCommandLocales.stop.name)
                .setDescription("Stop an AMP instance")
                // .setDescriptionLocalizations(globalCommandLocales.stop.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("instance_name")
                        // .setNameLocalizations(instanceCommandLocales.stop.options.instance.name)
                        .setDescription("The instance to stop")
                        // .setDescriptionLocalizations(instanceCommandLocales.stop.options.instance.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("restart")
                // .setNameLocalizations(globalCommandLocales.restart.name)
                .setDescription("Restart an AMP instance")
                // .setDescriptionLocalizations(globalCommandLocales.restart.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("instance_name")
                        // .setNameLocalizations(instanceCommandLocales.restart.options.instance.name)
                        .setDescription("The instance to restart")
                        // .setDescriptionLocalizations(instanceCommandLocales.restart.options.instance.description)
                        .setRequired(true)
                )
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("update")
                // .setNameLocalizations(globalCommandLocales.update.name)
                .setDescription("Update an AMP instance")
                // .setDescriptionLocalizations(globalCommandLocales.update.description)
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("instance_name")
                        // .setNameLocalizations(instanceCommandLocales.update.options.instance.name)
                        .setDescription("The instance to update")
                        // .setDescriptionLocalizations(instanceCommandLocales.update.options.instance.description)
                        .setRequired(true)
                )
        )
    ,
    async execute(interaction: any) {}
}