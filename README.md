# irc-repl

IRC + REPL => :heart: 

It feels like you're in the bot.

Not convinced? What about this?

```
> irc-repl -c #ircrepltest

irc-repl> client.send('#ircrepltest', fs.readdirSync('.'));
```

Send the current directory list to an IRC channel :dancers:

## Installation

```
npm install irc-repl -g
```

## Usage

```
Usage: irc-repl <nickname> <server> [options]

nickname     Set  the  nickname. Defaults to the environment variable IRCNICK.
server       Set the server with which irc will try to connect upon startup. 
             The format for server is: hostname[:portno] for IRC  connections. 
             Defaults to the environment variable IRCSERVER

Options:
   -c, --channel    Automatically join channels.  []
   -q, --quiet      Do not display IRC PRIVMSG by default.  [false]
   -u, --username   User name send via USER command. Defaults to nickname
   -r, --realname   Real name send via USER command. Defaults to nickname
   -s, --script     Script file to evaluate after connecting and joining channels.
                    The script can access the context.
   -e, --eval       Script string to evaluate after connecting and joining channels. 
                    The script can access the context.	
```

## Scope

irc-repl exposes the following scope values

* client: [irc-slate instance](https://github.com/slate/slate-irc)
* server: Currently connected server with host and port fields
* channels: Array of channel names
* nickname: Nickname
* username: Username
* realname: Realname

* echoMessage: Utility function to echo a message to stdout
* util: Node.js util module
* colors: [colors](https://github.com/Marak/colors.js) module for nicer output

## Common tasks

__Sending a simple message__

```javascript
client.send(channels[0], 'goes');
```

Sends 'goes' to first connected channel

