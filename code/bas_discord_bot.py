#!/bin/python3
#--------------------------------------------------------------------
# Project: BAS Network Discord Bot
# Purpose: To link user accounts within a MySQL database.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 02AUGUST2022
# Updated: <Date> <Author> - <Notes>
#--------------------------------------------------------------------

import discord
import os
import bot_library as b

path = "/bas_discord_bot/"

class Bot():
    """
    Purpose:
        To serve as a hacked-together extension of the discord.Client() class.
    Pre-Conditions:
        None
    Post-Conditions:
        Responds to the Bot's events.
    """
    def __init__(self, bot_id):
        self.bot_id = bot_id

    # Logging function to decrease clutter.
    def log(self, channel, author, content):
        b.bot_logger(path, "bas_discord_bot", f'[{channel}] [{author}] {content}')

    def help_cmd(self, channel, author):
        """
        Purpose:
            To display the other available bot commands.
        Pre-Conditions:
            :param channel: The discord server the message was sent in (message.guild)
            :param author: The Bot's name (discord.Client.user)
        Post-Conditions:
            None
        Return:
            A discord.Embed object
        """
        # Init variables
        description = """
            BAS Bot: !help, !link, !ip
            Status Bot: !status, !players, !plugins, !mods
        """
        
        # Log the data
        self.log(channel, author, description)

        # Output Discord Embed object
        return discord.Embed(title = "Help:", description = description, color = 0xe6d132)

    def bal(self, channel, author, username):
        """
        Purpose:
            To access the user's balance of special currency.
        Pre-Conditions:
            :param channel: The discord server the message was sent in (message.guild)
            :param author: The Bot's name (discord.Client.user)
            :param username: The Discord user's name
        Post-Conditions:
            None
        Return:
            A discord.Embed object
        """
        # Init variables
        description, status = b.bal("discord", username)
        
        # Response logic
        if status == 200:
            title = "Balance:"
            color = 0x65bf65
        else:
            title = "Error:"
            color = 0xbf0f0f

        # Log the data
        self.log(channel, author, description)

        # Output Discord Embed object
        return discord.Embed(title = title, description = description, color = color)

    def playtime(self, channel, author, username):
        """
        Purpose:
            To access the user's playtime statistics.
        Pre-Conditions:
            :param channel: The discord server the message was sent in (message.guild)
            :param author: The Bot's name (discord.Client.user)
            :param username: The Discord user's name
        Post-Conditions:
            None
        Return:
            A discord.Embed object
        """
        # Init variables
        description, status = b.playtime("discord", username)
        
        # Response logic
        if status == 200:
            title = "Playtime:"
            color = 0x65bf65
        else:
            title = "Error:"
            color = 0xbf0f0f

        # Log the data
        self.log(channel, author, description)

        # Output Discord Embed object
        return discord.Embed(title = title, description = description, color = color)

    def link(self, channel, author, username, user_id, content):
        """
        Purpose:
            To access the link_account() function and facilitate a response.
        Pre-Conditions:
            :param channel: The discord server the message was sent in (message.guild)
            :param author: The Bot's name (discord.Client.user)
            :param username: The Discord user's name
            :param user_id: The Discord user's id
            :param content: The message formatted as a string (message.content)
        Post-Conditions:
            None
        Return:
            A discord.Embed object
        """
        # Init variables
        parsed = content.replace("!link ","").split(" ")
        if len(parsed) >= 2:
            description, status = b.link_account("discord", username, user_id, parsed[0], parsed[1])
        else:
            description, status = b.link_account("discord", username, user_id, parsed[0], parsed[0])
        
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
        self.log(channel, author, description)

        # Output Discord Embed object
        return discord.Embed(title = title, description = description, color = color)

    def ip(self, channel, author):
        """
        Purpose:
            To make the minecraft server info readily available.
        Pre-Conditions:
            :param channel: The discord server the message was sent in (message.guild)
            :param author: The Bot's name (discord.Client.user)
        Post-Conditions:
            None
        Return:
            A discord.Embed object
        """
        # Init variables
        description = "For Java:\nIP: mc.basmc.ca\nFor Bedrock:\nIP: mc.basmc.ca\nPort: 19132"
        
        # Log the data
        self.log(channel, author, description)

        # Output Discord Embed object
        output = discord.Embed(title = "BAS Network:", description = description, color = 0x877f23)
        output.set_image(url = "https://api.mcsrvstat.us/icon/mc.basmc.ca")
        return output

    def run(self):
        """
        Purpose:
            The main handler of the Bot's events, plus handling setup and discord.Client.run().
        Pre-Conditions:
            :param bot_id: The Discord bot's super secret id.
        Post-Conditions:
            Responds to the Bot's events.
        Return:
            None
        """
        client = discord.Client()

        # Startup response.
        @client.event
        async def on_ready():
            b.bot_logger(path, "bas_discord_bot", f'We have logged in as {client.user}')

        # on_message() event handling and responses.
        @client.event
        async def on_message(message):
            # Skips reading messages written by the bot.
            if message.author == client.user:
                return

            channel = message.guild
            author = message.author
            content = message.content

            # The !help command and logging logic.
            if message.content.startswith('!help'):
                self.log(channel, author, content)
                statement = self.help_cmd(channel, author)
                await message.channel.send(embed=statement)

            # The !link command and logging logic.
            if message.content.startswith('!link'):
                self.log(channel, author, content)
                statement = self.link(channel, client.user, str(author), message.author.id, content)
                await message.channel.send(embed=statement)

            # The !bal command and logging logic.
            if message.content.startswith('!bal'):
                self.log(channel, author, content)
                statement = self.bal(channel, client.user, str(author))
                await message.channel.send(embed=statement)

            # The !ip command and logging logic.
            if message.content.startswith('!ip'):
                self.log(channel, author, content)
                statement = self.ip(channel, author)
                await message.channel.send(embed=statement)

            # The !playtime command and logging logic.
            if message.content.startswith('!playtime'):
                self.log(channel, author, content)
                statement = self.playtime(channel, client.user, str(author))
                await message.channel.send(embed=statement)

        client.run(self.bot_id)


if __name__ == "__main__":
    Bot(os.getenv("BOT_ID")).run()