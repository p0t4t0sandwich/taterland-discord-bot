/**
 * @author p0t4t0sandwich
 * @description Funny Discord commands
 */

import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

import { getDadjoke, getFortune, getMeowFact, getUselessFact } from '../utils/apiTools.js';

// Import locales
import funnyCommandLocales from '../../../../../locales/commands/funny.json' assert { type: "json" };

const command = {
    data: new SlashCommandBuilder()
        .setName('funny')
        .setNameLocalizations(funnyCommandLocales.funny.name)
        .setDescription('Various funny commands')
        .setDescriptionLocalizations(funnyCommandLocales.funny.description)
        .setDefaultMemberPermissions(0)
        .setDMPermission(true)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName('dad_joke')
                .setNameLocalizations(funnyCommandLocales.funny.dad_joke.name)
                .setDescription('Get a random dad joke')
                .setDescriptionLocalizations(funnyCommandLocales.funny.dad_joke.description)
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName('fortune')
                .setNameLocalizations(funnyCommandLocales.funny.fortune.name)
                .setDescription('Get a random fortune')
                .setDescriptionLocalizations(funnyCommandLocales.funny.fortune.description)
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName('meow_fact')
                .setNameLocalizations(funnyCommandLocales.funny.meow_fact.name)
                .setDescription('Get a random meow fact')
                .setDescriptionLocalizations(funnyCommandLocales.funny.meow_fact.description)
        ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName('useless_fact')
                .setNameLocalizations(funnyCommandLocales.funny.useless_fact.name)
                .setDescription('Get a random useless fact')
                .setDescriptionLocalizations(funnyCommandLocales.funny.useless_fact.description)
        ),
    async execute(interaction: any) {
        await interaction.deferReply({ ephemeral: true });
        const discordID = interaction.user.id;
        const guildID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();

        const embed = {
            color: 0xbf0f0f,
            title: "Funny command",
            description: "An unknown error occurred."
        };

        // Handle subcommands
        switch (subcommand) {
            case 'dad_joke':
                embed.description = await getDadjoke();
                break;
            case 'fortune':
                embed.description = await getFortune();
                break;
            case 'meow_fact':
                embed.description = await getMeowFact();
                break;
            case 'useless_fact':
                embed.description = await getUselessFact();
                break;
            default:
                embed.description = "This subcommand does not exist, or has not been implemented yet.";
                break;
        }

        await interaction.editReply({ embeds: [embed] });
    }
};

export { command };
