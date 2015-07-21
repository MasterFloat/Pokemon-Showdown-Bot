//server's IP host, for Smogon University(main) you would use 'sim.psim.us'.
exports.server = '158.69.1.126';
//most ports are 8000, so if you want to access any other server change this to 8000
exports.port = 7000;
//if you want it to access another server put it's name without .psim.us, and for smogon university(main) user 'showdown'.
exports.serverid = 'eos';
//your bot's name
exports.nick = '';
//your bot's password
exports.pass = '';
//the room(s) it joins
exports.rooms = ['', ''];
//the privateroom(s) it joins
exports.privaterooms = [];
//the character it reacts to
exports.commandcharacter = '.';
//it's default rank
exports.defaultrank = '@';
exports.groups = ' +%@#&~';
exports.watchconfig = false;
exports.secprotocols = [];
exports.debuglevel = 3;
//people that can do any command on your bot, might want to put your username in there
exports.excepts = [''];
//people that can't get autobanned
exports.whitelist = [''];
//people that can't get regexautobanned
exports.regexautobanwhitelist = [''];
exports.botguide = '';
exports.fork = 'http://github.com/TalkTakesTime/Pokemon-Showdown-Bot';
exports.allowmute = true;
exports.punishvals = {
	1: 'warn',
	2: 'mute',
	3: 'hourmute',
	4: 'roomban',
	5: 'ban'
};
exports.googleapikey = '';
