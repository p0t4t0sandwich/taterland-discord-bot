#!/usr/bin/python3

from discord.ext import commands, tasks

import os

import bot_library as b
from ampapi_handler_async import AMPAPIHandlerAsync

class ADSHandler(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.bot.amp_base_uri = "http://172.16.1.172:8080/"
        self.bot.amp_username = os.getenv("AMP_API_USER")
        self.bot.amp_password = os.getenv("AMP_API_PASSWORD")

    async def initInstances(self) -> None:
        self.bot.ADS = AMPAPIHandlerAsync(
            baseUri=self.bot.amp_base_uri,
            username=self.bot.amp_username,
            password=self.bot.amp_password
        )

        status = await self.bot.ADS.LoginAsync()
        b.bot_logger(self.bot.path, self.bot.name, f"ADS Login: {status}")

        self.bot.targets = (await self.bot.ADS.ADSModule_GetInstancesAsync())["result"]
        self.bot.instances = {}
        for target in self.bot.targets:
            instances = {}
            target_name = target["FriendlyName"]

            for instance in target["AvailableInstances"]:
                instance_module = instance["Module"]
                instance_id = instance["InstanceID"]

                if instance_module == "Minecraft":
                    instance_name = instance["InstanceName"]
                    instances[instance_name] = await self.bot.ADS.InstanceLoginAsync(instance_id=instance_id)

            self.bot.instances[target_name] = instances
            b.bot_logger(self.bot.path, self.bot.name, f"Target Initialized: {target_name}")



    @tasks.loop(minutes=15)
    async def task(self):
        try:
            self.bot.targets = (await self.bot.ADS.ADSModule_GetInstancesAsync())["result"]
        except:
            status = await self.bot.ADS.LoginAsync()
            b.bot_logger(self.bot.path, self.bot.name, f"ADS Login: {status}")
            self.bot.targets = (await self.bot.ADS.ADSModule_GetInstancesAsync())["result"]

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(ADSHandler(bot))