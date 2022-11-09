#!/usr/bin/python3

from discord import Embed
from discord.ext import commands

import os

import bot_library as b

class Redeem(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot

    @commands.group()
    async def redeem(self, ctx: commands.Context) -> None:
        if ctx.subcommand_passed is None:
            await ctx.reply("Please input a subcommand!")

        elif ctx.invoked_subcommand is None:
            await ctx.reply('Twitch username is a required input!')

    @redeem.command()
    async def hcticket(self, ctx: commands.Context, *args) -> None:
        # Init variables
        if args == ():
            await ctx.reply('Twitch username is a required input!')

        else:
            twitch_username = args[0]

            channel = ctx.guild.name
            author = str(ctx.author)
            content = ctx.message.content

            (user, uuid), status = b.get_minecraft_account("twitch", twitch_username)

            command = f"lp user {uuid} group add publichardcore"
            servers = eval(os.getenv("AMP_SERVERS"))

            # User is in the system, continue to server check
            if status == 200:
                server_status = await b.send_console_command(servers["Hub"], command)

                # "Green" Embed response
                if server_status == 20:
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
    await bot.add_cog(Redeem(bot))