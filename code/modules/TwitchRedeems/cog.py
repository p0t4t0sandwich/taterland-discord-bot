#!/bin/python3
#--------------------------------------------------------------------
# Module: Twitch Redeems
# Purpose: Program built to integrate with Twitch and handle redeems.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 18NOVEMBER2022
# Updated: <date> <author>
#--------------------------------------------------------------------

from discord import Embed
from discord.ext import commands

import os

import bot_library as b

class TwitchRedeems(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot

    @commands.hybrid_group()
    async def redeem(self, ctx: commands.Context) -> None:
        if ctx.subcommand_passed is None:
            await ctx.reply("Please input a subcommand!")

        elif ctx.invoked_subcommand is None:
            await ctx.reply('Twitch username is a required input!')

    @redeem.command()
    async def hcticket(self, ctx: commands.Context, twitch_username) -> None:
        # Init variables

        channel = ctx.guild.name
        author = str(ctx.author)
        content = ctx.message.content

        (user, uuid), status = b.get_minecraft_account("twitch", twitch_username)

        command = f"lp user {uuid} group add null"

        # User is in the system, continue to server check
        if status == 200:
            result = await self.bot.instances["AMP02"]["Hub"].Core_GetStatusAsync()

            # "Green" Embed response
            if "State" in result and result["State"] == 20:
                await self.bot.instances["AMP02"]["Hub"].Core_SendConsoleMessageAsync(command)
                title = f"Success:"
                description = f"{twitch_username} has successfully redeemed hcticket!"
                color = 0x65bf65
                embed = Embed(title = title, description = description, color = color)

                # Log the data
                self.bot.log(channel, author, content)
                self.bot.log(channel, self.bot.user, description)

                await ctx.reply(embed=embed)
            
            # "Red" Embed response
            else:
                title = f"Error:"
                description = f"""Server is offline, please ensure the server is
                    started and run the Discord bot command:
                    !redeem hcticket {twitch_username}
                """
                color = 0xbf0f0f
                embed = Embed(title = title, description = description, color = color)

                # Log the data
                self.bot.log(channel, author, content)
                self.bot.log(channel, self.bot.user, description)

                await ctx.reply(embed=embed)

        # "Yellow" Embed response
        else:
            title = f"Warning:"
            description = f"""User account is not linked in the system.
                Please link them using the Discord bot command:
                !flink minecraft <MC Username> twitch {twitch_username}

                Then redeem them again using the Discord bot command:
                !redeem hcticket {twitch_username}
            """
            color = 0xe6d132
            embed = Embed(title = title, description = description, color = color)

            # Log the data
            self.bot.log(channel, author, content)
            self.bot.log(channel, self.bot.user, description)

            await ctx.reply(embed=embed)

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(TwitchRedeems(bot))