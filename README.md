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

<!--                  | `/playtime`                         | Get playtime                                                                                                                                                        | None       | false      | -->
