/**
 * @author p0t4t0sandich
 * @description Game server manager utility class
 */

import { ADS, ActionResult, CommonAPI, IADSInstance, Instance, Minecraft, Status } from "@neuralnexus/ampapi";

interface InstanceData<T,R extends CommonAPI> {
    data: T;
    api: R;
}

/**
 * @class ServerManager
 * @description Game server manager utility class
 * @property {ADS} controller The main ADS instance
 * @property {{ [key: string]: InstanceData<IADSInstance, ADS> }} targetData The target data
 * @property {{ [key: string]: InstanceData<Instance, CommonAPI> }} instanceData The instance data
 */
class ServerManager {
    private controller: ADS = new ADS(
        process.env.AMP_API_URL,
        process.env.AMP_API_USERNAME,
        process.env.AMP_API_PASSWORD
    );
    private targetData: { [key: string]: InstanceData<IADSInstance, ADS> } = {};
    private instanceData: { [key: string]: InstanceData<Instance, CommonAPI> } = {};

    async initInstanceData(): Promise<void> {
        // Clear data
        this.targetData = {};
        this.instanceData = {};

        await this.controller.APILogin();

        // Get all instances
        const targets = (await this.controller.ADSModule.GetInstances()).result;

        for (const target of targets) {
            // Store the target data
            this.targetData[target.FriendlyName] = {
                data: target,
                api: undefined
            };

            // Store the instance data
            for (const instance of target.AvailableInstances) {
                if (instance.Module === "ADS") continue

                this.instanceData[instance.InstanceName] = {
                    data: instance,
                    api: undefined
                };
            }
        }
    }

    /**
     * @method initTargetAPI
     * @description Initializes the API for a target
     * @param {string} targetName The name of the target to initialize the API for
     */
    async initTargetAPI(targetName: string): Promise<void> {
        // Get the target data
        const targetData = this.targetData[targetName];

        // Get the target API
        const targetAPI = await this.controller.InstanceLogin<ADS>(
            targetData.data.InstanceId, "ADS"
        );

        // Store the target API
        targetData.api = targetAPI;
    }

    /**
     * @method initInstanceAPI
     * @description Initializes the API for an instance
     * @param {string} instanceName
     */
    async initInstanceAPI(instanceName: string): Promise<void> {
        // Get the instance data
        const instanceData: InstanceData<Instance,CommonAPI> = this.instanceData[instanceName];

        // Get the instance API
        const instanceAPI = await this.controller.InstanceLogin<CommonAPI>(
            instanceData.data.InstanceID,
            instanceData.data.Module
        );

        // Store the instance API
        this.instanceData[instanceName].api = instanceAPI;
    }

    /**
     * @method getTargetAPI
     * @description Gets the API for a target
     * @param {string} targetName The name of the target to get the API for
     * @returns {Promise<ADS>} The instance API
     */
    async getTargetAPI(targetName: string): Promise<ADS> {
        if (this.targetData[targetName].api === undefined) {
            await this.initTargetAPI(targetName);
        }

        return this.targetData[targetName].api;
    }

    /**
     * @method getIntanceAPI
     * @description Gets the API for an instance
     * @param {string} instanceName The name of the instance to get the API for
     * @returns {Promise<CommonAPI>} The instance API
     */
    async getIntanceAPI(instanceName: string): Promise<CommonAPI> {
        if (this.instanceData[instanceName].api === undefined) {
            await this.initInstanceAPI(instanceName);
        }

        return this.instanceData[instanceName].api;
    }

    /**
     * @method listServers
     * @description Lists all servers
     * @returns {string[]} The result of the action
     */
    listServers(): string[] {
        return Object.keys(this.instanceData);
    }

    /**
     * @method serverExists
     * @description Checks if a server exists
     * @param {string} instanceName The name of the instance to check
     * @returns {boolean} Whether or not the server exists
     */
    serverExists(instanceName: string): boolean {
        return Object.keys(this.instanceData).includes(instanceName);
    }

    /**
     * @method startServer
     * @description Starts a server
     * @param {string} instanceName The name of the instance to start
     * @returns {Promise<ActionResult<any>>} The result of the action
     */
    async startServer(instanceName: string): Promise<ActionResult<any>> {
        return await (await this.getIntanceAPI(instanceName)).Core.Start();
    }

    /**
     * @method stopServer
     * @description Stops a server
     * @param {string} instanceName The name of the instance to stop
     */
    async stopServer(instanceName: string): Promise<void> {
        return await (await this.getIntanceAPI(instanceName)).Core.Stop();
    }

    /**
     * @method restartServer
     * @description Restarts a server
     * @param {string} instanceName The name of the instance to restart
     */
    async restartServer(instanceName: string): Promise<ActionResult<any>> {
        return await (await this.getIntanceAPI(instanceName)).Core.Restart();
    }

    /**
     * @method killServer
     * @description Kills a server
     * @param {string} instanceName The name of the instance to kill
     */
    async killServer(instanceName: string): Promise<void> {
        return await (await this.getIntanceAPI(instanceName)).Core.Kill();
    }

    /**
     * @method sleepServer
     * @description Sleeps a server
     * @param {string} instanceName The name of the instance to sleep
     */
    async sleepServer(instanceName: string): Promise<ActionResult<any>> {
        return await (await this.getIntanceAPI(instanceName)).Core.Sleep();
    }

    /**
     * @method sendConsoleMessageToServer
     * @description Sends a console message to a server
     * @param {string} instanceName The name of the instance to send the message to
     * @param {string} message The message to send
     */
    async sendConsoleMessageToServer(instanceName: string, message: string): Promise<void> {
        return await (await this.getIntanceAPI(instanceName)).Core.SendConsoleMessage(message);
    }

    /**
     * @method getServerStatus
     * @description Gets the status of a server
     * @param {string} instanceName The name of the instance to get the status of
     * @returns {Promise<Status>} The status of the server
     */
    async getServerStatus(instanceName: string): Promise<Status> {
        return await (await this.getIntanceAPI(instanceName)).Core.GetStatus();
    }

    /**
     * @method backupServer
     * @description Backups a server
     * @param {string} instanceName The name of the instance to backup
     * @returns {Promise<ActionResult<any>>} The result of the action
     */
    async backupServer(instanceName: string, backupTitle: string, backupDescription: string, isSticky: boolean): Promise<ActionResult<any>> {
        return await (await this.getIntanceAPI(instanceName)).LocalFileBackupPlugin.TakeBackup(backupTitle, backupDescription, isSticky);
    }

    /**
     * @method parsePlayerList
     * @description Parses the player list of a server
     * @param {{ [key: string]: string }} playerList The player list to parse
     * @returns {Promise<string[]>} The parsed player list
     */
    async parsePlayerList(playerList: { [key: string]: string }): Promise<string[]> {
        return Object.keys(playerList);
    }

    /**
     * @method getPlayerList
     * @description Gets the player list of a server
     * @param {string} instanceName The name of the instance to get the player list of
     * @returns {Promise<{ [key: string]: string }>} The player list of the server
     */
    async getPlayerList(instanceName: string): Promise<{ [key: string]: string }> {
        return (await (await this.getIntanceAPI(instanceName)).Core.GetUserList()).result
    }

    /**
     * @method findPlayer
     * @description Finds the server of a player
     * @param {string} playerName The name of the player to find
     * @returns {Promise<string>} The name of the server the player is on
     */
    async findPlayer(playerName: string): Promise<string> {
        for (const instanceName of Object.keys(this.instanceData)) {
            const playerList: { [key: string]: string } = await this.getPlayerList(instanceName);
            if (Object.keys(playerList).includes(playerName)) return instanceName;
        }
    }

    // ------------------------------ Minecraft ------------------------------
    /**
     * @method isMinecraftServer
     * @description Checks if an instance is a Minecraft server
     * @param instanceName The name of the instance to check
     * @returns {boolean} Whether the instance is a Minecraft server
     */
    isMinecraftServer(instanceName: string): boolean {
        return this.instanceData[instanceName].data.Module === "Minecraft";
    }

    /**
     * @method whitelistAdd
     * @description Adds a player to the whitelist
     * @param instanceName The name of the instance to add the player to the whitelist of
     * @param playerName The name of the player to add to the whitelist
     */
    async whitelistAdd(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        const status: Status = await API.Core.GetStatus();
        if (status.State === 20) { // 20 = Running
            await API.Core.SendConsoleMessage(`whitelist add ${playerName}`);
        } else {
            // TODO Some other idea using the FileManager
        }
    }

    /**
     * @method whitelistRemove
     * @description Removes a player from the whitelist
     * @param instanceName The name of the instance to remove the player from the whitelist of
     * @param playerName The name of the player to remove from the whitelist
     */
    async whitelistRemove(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        const status: Status = await API.Core.GetStatus();
        if (status.State === 20) { // 20 = Running
            await API.Core.SendConsoleMessage(`whitelist remove ${playerName}`);
        } else {
            // TODO Some other idea using the FileManager
        }
    }

    /**
     * @method whitelistList
     * @description Lists all players on the whitelist
     * @param instanceName The name of the instance to list the whitelist of
     * @returns {Promise<string[]>} The whitelist
     */
    async whitelistList(instanceName: string): Promise<string[]> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        // TODO Read the whitelist.json file
        return [];
    }

    /**
     * @method banPlayer
     * @description Bans a player
     * @param instanceName The name of the instance to ban the player on
     * @param playerName The name of the player to ban
     * @returns {Promise<void>} The result of the action
     */
    async banPlayer(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        const status: Status = await API.Core.GetStatus();
        if (status.State === 20) { // 20 = Running
            await API.Core.SendConsoleMessage(`ban ${playerName}`);
        } else {
            // TODO Some other idea using the FileManager
        }
    }

    /**
     * @method pardonPlayer
     * @description Unbans a player
     * @param instanceName The name of the instance to unban the player on
     * @param playerName The name of the player to unban
     * @returns {Promise<void>} The result of the action
     */
    async pardonPlayer(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        const status: Status = await API.Core.GetStatus();
        if (status.State === 20) { // 20 = Running
            await API.Core.SendConsoleMessage(`pardon ${playerName}`);
        } else {
            // TODO Some other idea using the FileManager
        }
    }

    /**
     * @method banlistList
     * @description Lists all banned players
     * @param instanceName The name of the instance to list the banlist of
     * @returns {Promise<string[]>} The banlist
     */
    async banlistList(instanceName: string): Promise<string[]> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        // TODO Read the banned-players.json file
        return [];
    }

    /**
     * @method kickPlayer
     * @description Kicks a player
     * @param instanceName The name of the instance to kick the player on
     * @param playerName The name of the player to kick
     */
    async kickPlayer(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        await API.Core.SendConsoleMessage(`kick ${playerName}`);
    }

    /**
     * @method killPlayer
     * @description Kills a player
     * @param instanceName The name of the instance to kill the player on
     * @param playerName The name of the player to kill
     */
    async killPlayer(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        await API.Core.SendConsoleMessage(`kill ${playerName}`);
    }

    /**
     * @method opPlayer
     * @description Ops a player
     * @param instanceName The name of the instance to op the player on
     * @param playerName The name of the player to op
     */
    async opPlayer(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        const status: Status = await API.Core.GetStatus();
        if (status.State === 20) { // 20 = Running
            await API.Core.SendConsoleMessage(`op ${playerName}`);
        } else {
            // TODO Some other idea using the FileManager
        }
    }

    /**
     * @method deopPlayer
     * @description Deops a player
     * @param instanceName The name of the instance to deop the player on
     * @param playerName The name of the player to deop
     */
    async deopPlayer(instanceName: string, playerName: string): Promise<void> {
        const API = <Minecraft>await this.getIntanceAPI(instanceName);
        const status: Status = await API.Core.GetStatus();
        if (status.State === 20) { // 20 = Running
            await API.Core.SendConsoleMessage(`deop ${playerName}`);
        } else {
            // TODO Some other idea using the FileManager
        }
    }

    // ------------------------------ On All Servers ------------------------------

}

// Async setInterval to refresh the server manager
setInterval(async () => {
    await serverManager.initInstanceData();
}, 1000 * 60 * 5); // 5 minutes

// Export the server manager
const serverManager = new ServerManager();
await serverManager.initInstanceData();

export { ServerManager, serverManager }
