#!/bin/python3
#--------------------------------------------------------------------
# Module: Account Link
# Purpose: Allow users to link their various accounts.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 18NOVEMBER2022
# Updated: <date> <author>
#--------------------------------------------------------------------

import discord
from discord.ext import commands

import bot_library as b

class AccountLink(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot

    @commands.command()
    async def link(self, ctx: commands.Context, *args) -> None:
        """Link's the user's account with the specified platform. !link <Platform> <Platform Username>"""

        # Init variables
        channel = ctx.guild.name
        author = str(ctx.author)
        author_id = ctx.author.id
        content = ctx.message.content

        if len(args) == 2:
            description, status = b.link_account("discord", author, author_id, args[0], args[1])
        else:
            description, status = b.link_account("discord", author, author_id, args[0], args[0])
        
        # Response logic
        if status == 200:
            title = "Account Linked!"
            color = 0x65bf65
        elif status == 100:
            title = "Correct Usage:"
            color = 0xe6d132
        else:
            title = "Error:"
            color = 0xbf0f0f

        # Log the data
        self.bot.log(channel, author, content)
        self.bot.log(channel, self.bot.user, description)

        # Send Discord Embed object
        statement = discord.Embed(title = title, description = description, color = color)
        await ctx.reply(embed=statement)
        await ctx.message.delete()

    @commands.command()
    async def flink(self, ctx: commands.Context, *args) -> None:
        """Link's the user's account with the specified platform. !link <Platform> <Platform Username>"""

        # Init variables
        channel = ctx.guild.name
        author = str(ctx.author)
        author_id = ctx.author.id
        content = ctx.message.content

        if ctx.author.guild_permissions.administrator or self.bot.owner_id == author_id:
            if args[2] == "twitch":
                description, status = b.link_account("twitch", args[3], b.get_twitch_id(args[3]), args[0], args[1])
            
                # Response logic
                if status == 200:
                    title = "Account Linked!"
                    color = 0x65bf65
                elif status == 100:
                    title = "Correct Usage:"
                    color = 0xe6d132
                else:
                    title = "Error:"
                    color = 0xbf0f0f

                # Log the data
                self.bot.log(channel, author, content)
                self.bot.log(channel, self.bot.user, description)

                # Send Discord Embed object
                statement = discord.Embed(title = title, description = description, color = color)

        else:
            description = "We can only force link twitch accounts at the moment."

            # Log the data
            self.bot.log(channel, author, content)
            self.bot.log(channel, self.bot.user, description)

            # Send Discord Embed object
            statement = discord.Embed(title = "Error:", description = description, color = 0xbf0f0f)

        await ctx.reply(embed=statement)

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(AccountLink(bot))