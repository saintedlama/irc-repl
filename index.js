var irc = require('slate-irc');
var net = require('net');
var fs = require('fs');
var vm = require('vm');
var util = require('util');
var async = require('async');

var colors = require('colors');

var parseServer = require('./lib/parse-server');

var nomnom = require('nomnom');
var opts = nomnom
  .option('channel', {
    abbr : 'c',
    list : true,
    help: 'Automatically join channels.',
    default : []
  }).option('quiet', {
    abbr : 'q',
    help: 'Do not display IRC PRIVMSG by default.',
    default : false
  }).option('nickname', {
    position : 0,
    help : 'Set  the  nickname. Defaults to the environment variable IRCNICK.',
    required : true,
    default : process.env.IRCNICK
  }).option('server', {
    position : 1,
    required : true,
    help : 'Set the server with which irc will try to connect upon startup. The format for server is: hostname[:portno] for IRC  connections. Defaults to the environment variable IRCSERVER',
    default : process.env.IRCSERVER
  }).option('username', {
    abbr: 'u',
    help: 'User name send via USER command. Defaults to nickname'
  }).option('realname', {
    abbr: 'r',
    help: 'Real name send via USER command. Defaults to nickname'
  }).option('script', {
    abbr: 's',
    help: 'Script file to evaluate after connecting and joining channels. The script can access the context.'
  }).option('eval', {
    abbr: 'e',
    help: 'Script string to evaluate after connecting and joining channels. The script can access the context.'
  }).parse();

var server = parseServer(opts.server);
server.port = server.port || 6667;

opts.username = opts.username  || opts.nickname;
opts.realname = opts.realname || opts.nickname;

var stream = net.connect({
  port: server.port,
  host: server.host
});

var client = irc(stream);

if (opts.password) {
  client.pass(opts.password);
}

client.nick(opts.nickname);
client.user(opts.username, opts.realname);

client.on('message', echoMessage);

var script = null;

if (opts.script) {
  script = fs.readFileSync(opts.script, { encoding : 'utf-8' });
}

if (opts.eval) {
  script = opts.eval;
}

async.each(opts.channel, function(channel, next) {
  client.join(channel, function(err) {
    if (err) { return next(err); }

    console.log(util.format('joined %s', channel.blue));
    next();
  });
}, function(err) {
  if (err) { console.err(err); process.exit(2); }

  var repl = require('repl');

  var r = repl.start({
    prompt: 'irc-repl>'.cyan,
    terminal: true,
    ignoreUndefined: true,
    useGlobal: true
  });

  r.context.client = client;
  r.context.server = server;

  r.context.channels = opts.channel;
  r.context.nickname = opts.nickname;
  r.context.username = opts.username;
  r.context.realname = opts.realname;

  r.context.echoMessage = opts.echoMessage;
  r.context.util = opts.util;
  r.context.colors = colors;

  r.context.help = function() {
    console.log('This is the end my friend');
  };

  if (script) {
    vm.runInNewContext(script, r.context);
  }
});


function echoMessage(msg) {
  if (!opts.quiet) {
    console.log(util.format('%s <%s> : %s', msg.to.blue, msg.from.green, msg.message));
  }
}




