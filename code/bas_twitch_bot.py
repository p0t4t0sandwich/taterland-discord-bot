#!/bin/python3
#--------------------------------------------------------------------
# Project: BAS Network Twitch Bot
# Purpose: To link user accounts within a MySQL database.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 01AUGUST2022
# Updated: <Date> <Author> - <Notes>
#--------------------------------------------------------------------

from twitchio.ext import commands
import os
import bot_library as b

path = "/bas_twitch_bot/"

class Bot(commands.Bot):

    def __init__(self):
        super().__init__(
            token = os.getenv("TWITCH_BOT_TOKEN"),
            prefix = os.getenv("PREFIX"),
            initial_channels = [i for i in os.getenv("INITIAL_CHANNELS").split(", ")]
        )

    # Logging function to decrease clutter.
    def log(self, channel, author, content):
        b.bot_logger(path, "bas_twitch_bot", f'[{channel}] [{author}] {content}')

    async def event_ready(self):
        b.bot_logger(path, "bas_twitch_bot", f'We have logged in as {self.nick}')

    # The !help command and logging logic.
    @commands.command()
    async def help(self, ctx: commands.Context):

        # Init variables
        channel = ctx.channel.name
        author = ctx.author.name
        content = ctx.message.content

        # Log the data
        self.log(channel, author, content)

        # Response
        statement = "BAS Bot: !help, !link, !ip, !dc, !bal, !playtime"

        # Log the data
        self.log(channel, self.nick, statement)

        # Send the message
        await ctx.send(statement)

    # The !link command and logging logic.
    @commands.command()
    async def link(self, ctx: commands.Context):

        # Init variables
        channel = ctx.channel.name
        author = ctx.author.name
        user_id = ctx.author.id
        content = ctx.message.content

        # Log the data
        self.log(channel, author, content)

        # Link and response logic
        parsed = content.replace("!link ","").split(" ")
        if len(parsed) >= 2:
            statement, status = b.link_account("twitch", author, user_id, parsed[0], parsed[1])
        else:
            statement, status = b.link_account("twitch", author, user_id, parsed[0], parsed[0])

        # Log the data
        self.log(channel, self.nick, statement)

        # Send the message
        await ctx.send(statement)

    # The !playtime command and logging logic.
    @commands.command()
    async def playtime(self, ctx: commands.Context):

        # Init variables
        channel = ctx.channel.name
        author = ctx.author.name
        content = ctx.message.content

        # Log the data
        self.log(channel, author, content)

        # Playtime and response logic
        statement, status = b.playtime("twitch", author)

        # Log the data
        self.log(channel, self.nick, statement.split("\n")[0])

        # Send the message
        await ctx.send(statement.split("\n")[0])

    # The !bal command and logging logic.
    @commands.command()
    async def bal(self, ctx: commands.Context):

        # Init variables
        channel = ctx.channel.name
        author = ctx.author.name
        content = ctx.message.content

        # Log the data
        self.log(channel, author, content)

        # Bal and response logic
        statement, status = b.bal("twitch", author)

        # Log the data
        self.log(channel, self.nick, statement)

        # Send the message
        await ctx.send(statement)

    # The !ip command and logging logic.
    @commands.command()
    async def ip(self, ctx: commands.Context):

        # Init variables
        channel = ctx.channel.name
        author = ctx.author.name
        content = ctx.message.content

        # Log the data
        self.log(channel, author, content)

        # Response
        statement = "For Java:\nIP: mc.basmc.ca\nFor Bedrock:\nIP: mc.basmc.ca\nPort: 19132"

        # Log the data
        self.log(channel, self.nick, statement)

        # Send the message
        await ctx.send(statement)

    # The !dc command and logging logic.
    @commands.command()
    async def dc(self, ctx: commands.Context):

        # Init variables
        channel = ctx.channel.name
        author = ctx.author.name
        content = ctx.message.content

        # Log the data
        self.log(channel, author, content)

        # Response
        statement = "Community Discord: https://discord.com/invite/j7USDUpehn"

        # Log the data
        self.log(channel, self.nick, statement)

        # Send the message
        await ctx.send(statement)

if __name__ == "__main__":
    bot = Bot()
    bot.run()