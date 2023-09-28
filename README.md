# Taterland Discord Bot

## Description

Discord bot for the Taterland Discord server.

## Discord Bot Usage

### Command List

| Command               | Description                         | Parameters                                                                                                                                                          | Admin Only |
|-----------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| `/funny dad_joke`     | Get a dad joke                      | None                                                                                                                                                                | false      |
| `/funny fortune`      | Get a fortune                       | None                                                                                                                                                                | false      |
| `/funny meow_fact`    | Get a meow fact                     | None                                                                                                                                                                | false      |
| `/funny useless_fact` | Get a useless fact                  | None                                                                                                                                                                | false      |
| `/server list`        | List servers                        | None                                                                                                                                                                | true       |
| `/server start`       | Start server                        | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server stop`        | Stop server                         | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server restart`     | Restart server                      | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server kill`        | Kill server                         | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server sleep`       | Sleep server                        | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server send`        | Send command to server              | `server_name` - Name of the server<br>`command` - Command to send                                                                                                   | true       |
| `/server status`      | Get server status                   | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server backup`      | Backup server                       | `server_name` - Name of the server<br>`backup_name` - Name of the backup<br>`description` - Description of the backup<br>`is_sticky` - Whether the backup is sticky | true       |
| `/server players`     | Get server players                  | `server_name` - Name of the server                                                                                                                                  | true       |
| `/server find`        | Find the server that a player is on | `player_name` - Name of the player                                                                                                                                  | true       |
| `/minecraft whitelist add` | Add player to whitelist         | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                            | true       |
| `/minecraft whitelist remove` | Remove player from whitelist   | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                            | true       |
| `/minecraft whitelist list` | List players on whitelist       | `server_name` - Name of the server                                                                                                                                  | true       |
| `/minecraft ban`     | Ban player                          | `server_name` - Name of the server<br>`player_name` - Name of the player<br>`reason` - Reason for ban                                                               | true       |
| `/minecraft unban`   | Unban player                        | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                           | true       |
| `/minecraft pardon`  | Pardon player                       | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                           | true       |
| `/minecraft banlist` | List banned players                 | `server_name` - Name of the server                                                                                                                                  | true       |
| `/minecraft kick`    | Kick player                         | `server_name` - Name of the server<br>`player_name` - Name of the player<br>`reason` - Reason for kick                                                             | true       |
| `/minecraft kill`    | Kill player                         | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                           | true       |
| `/minecraft op`      | Op player                           | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                           | true       |
| `/minecraft deop`    | Deop player                         | `server_name` - Name of the server<br>`player_name` - Name of the player                                                                                           | true       |
| `/minecraft oplist`  | List op players                     | `server_name` - Name of the server                                                                                                                                  | true       |
| `/minecraft all <subcomand>` | Run command on all servers, eg. `/minecraft all whitelist_add`, with the same arguments. | `subcommand` - Subcommand to run on all servers                                                                                                                    | true       |

<!--                  | `/playtime`                         | Get playtime                                                                                                                                                        | None       | false      | -->
