var http = require('http');

if (Config.serverid === 'eos') {
	var https = require('https');
	var csv = require('csv-parse');
}

const CONFIGURABLE_COMMANDS = {
	'randmono': true,
        'joingame': true,
        'startgame': true,
        'endgame': true,
        'stay': true,
        'hit': true,
        'fire': true,
        'signup': true,   
        'randa': true,
        'reel': true,
        'pair': true,
        'join': true,
        'guide': true,
        'say': true,
        'pmuser': true,
        'mymood': true
};

exports.commands = {

	/****************
	* Tool Commands *
	****************/

	reload: function (arg, user, room) {
		if (!user.isExcepted) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(room, '__Commands reloaded.__');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},

	uptime: function (arg, user, room) {
		var text = ((room === user || user.isExcepted) ? '' : '/pm ' + user.id + ', ') + '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			let divisor = divisors.pop();
			let unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
		case 5:
			text += buffer[4] + ', ';
			/* falls through */
		case 4:
			text += buffer[3] + ', ';
			/* falls through */
		case 3:
			text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
			break;
		case 2:
			text += buffer[1] + ' and ' + buffer[0];
			break;
		case 1:
			text += buffer[0];
			break;
		}

		this.say(room, text);
	}, 

	seen: function (arg, user, room) { // this command is still a bit buggy
		var text = (room === user ? '' : '/pm ' + user.id + ', ');
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === user.id) {
			text += 'Have you looked in the mirror lately?';
		} else if (arg === Users.self.id) {
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			text += 'The user ' + arg + ' has never been seen.';
		} else {
			text += arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.');
		}
		this.say(room, text);
	},

	w: 'wall',
	announce: 'wall',
	wall: function(arg, user, room) {
		if (!user.isExcepted) return false;
		arg = arg.toLowerCase();
		var matched = false;
		if (arg === 'retro1') {
			matched = true;
			this.say(room, '/wall Everyone must enter with ONE POKEMON ONLY.');
		}
		if (arg === 'retro2') {
			matched = true;
			this.say(room, '/wall NO UBERS OR MEGA UBERS.');
		}  
		if (arg === 'retro3') {
			matched = true;
			this.say(room, '/wall NO SCOUTING. YOU WILL BE DQ\'d. (Moveset counters.)');
		}  
		if (arg === 'retro4') {
			matched = true;
			this.say(room, '/wall Focus Sash and OHKO moves are BANNED. Sturdy is an ability, therefore it\'s fine.');
		} 
		if (arg === 'retro5') {
			matched = true;
			this.say(room, '/wall Don\'t change pokemon during this tournament.');
		} 
		if (arg === 'monogen1') {
			matched = true;
			this.say(room, '/wall This is a MONOGEN tournament, please use a team of pokemon sharing the same GEN. Gen 1 team would be: Chansey, Dragonite, Gengar, Zapdos, Articuno, Mega Venusaur.');
		} 
		if (arg === 'monogen2') {
			matched = true;
			this.say(room, '/wall Megas can be used in their respective gen and ON gen 6 teams.');
		} 
		if (arg === 'monogen3') {
			matched = true;
			this.say(room, '/wall Mega Blastoise can be used on GEN 1 AND GEN 6 TEAMS.');
		} 
		if (arg === 'botg1') {
			matched = true;
			this.say(room, '/wall his is a battle of gens tournament, please use a BoG team or get disqualified. Rules: Each team must have a Pokemon from each gen! TL;DR: 1 Pokemon from each gen.');
		} 
		if (arg === 'botg2') {
			matched = true;
			this.say(room, '/wall Example: Chansey, Feraligatr, Metagross Mega, Infernape, Meloetta, Talonflame. MEGAS only count for their generation, example: Mega Sharpedo is a GEN 3 POKEMON and not a gen 6.');
		} 
		if (arg === 'botg3') {
			matched = true;
			this.say(room, '/wall USE THIS TO HELP: http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number');
		} 
		if (arg === 'botg4') {
			matched = true;
			this.say(room, '/wall PM Dream Eater Gengar your teams to see if they are viable.');
		} else if (!matched) {
			this.say(room, "__The wall '" + arg + "' does not exist.__");
		}
	},


	help: 'info',
	om: 'info',
	othermetagame: 'info',
	format: 'info',
	formats: 'info',
	data: 'info',
	meta: 'info',
	metas: 'info',
	metagame: 'info',
	metagames: 'info',
	information: 'info',
	info: function(arg, user, room) {
		if (!user.isExcepted) return false;
		arg = arg.toLowerCase();
		var matched = false;
		if (arg === 'ou' || arg === 'overused') {
			matched = true;
			this.say(room, '__Smogon\'s OU tier:__ http://www.smogon.com/dex/xy/formats/ou');
		}
		if (arg === 'uu' || arg === 'underused') {
			matched = true;
			this.say(room, '__Smogon\'s UU tier:__ http://www.smogon.com/dex/xy/formats/uu');
		}  
		if (arg === 'ru' || arg === 'rarelyused') {
			matched = true;
			this.say(room, '__Smogon\'s RU tier:__ http://www.smogon.com/dex/xy/formats/ru');
		}  
		if (arg === 'nu' || arg === 'neverused') {
			matched = true;
			this.say(room, '__Smogon\'s NU tier:__ http://www.smogon.com/dex/xy/formats/nu');
		}  
		if (arg === 'pu' || arg === 'poorlyused' || arg === 'partiallyused') {
			matched = true;
			this.say(room, '__Smogon\'s PU tier:__ http://www.smogon.com/dex/xy/formats/pu');
		}  
		if (arg === 'mono' || arg === 'monotype') {
			matched = true;
			this.say(room, '__Smogon\'s Monotype tier:__ http://www.smogon.com/dex/xy/formats/monotype');
		} 
		if (arg === '1v1') {
			matched = true;
			this.say(room, '__Smogon\'s 1v1 tier:__ http://www.smogon.com/dex/xy/formats/ru');
		}  
		if (arg === '2v2doubles' || arg === 'doubles2v2') {
			matched = true;
			this.say(room, '__Smogon\'s 2v2Doubles tier:__ http://www.smogon.com/dex/xy/formats/2v2_doubles');
		}   
		if (arg === 'aaa' || arg === 'almostanyability') {
			matched = true;
			this.say(room, '__Smogon\'s AlmostAnyAbility tier:__ http://www.smogon.com/dex/xy/formats/almost_any_ability/');
		}  
		if (arg === 'ag' || arg === 'anythinggoes') {
			matched = true;
			this.say(room, '__Smogon\'s AG tier:__ http://www.smogon.com/dex/xy/formats/ag');
		}  
		if (arg === 'averagemons') {
			matched = true;
			this.say(room, '__Smogon\'s AverageMons tier:__ http://www.smogon.com/dex/xy/formats/averagemons');
		}  
		if (arg === 'bh' || arg === 'balancedhackmons') {
			matched = true;
			this.say(room, '__Smogon\'s BalancedHackmons tier:__ http://www.smogon.com/dex/xy/formats/bh');
		}  
		if (arg === 'battlespotsingles' || arg === 'bss') {
			matched = true;
			this.say(room, '__Smogon\'s BattleSpotSingles tier:__ http://www.smogon.com/dex/xy/formats/battlespotsingles');
		}   
		if (arg === 'cc' || arg === 'challengecup' || arg === 'hackmonscup') {
			matched = true;
			this.say(room, '__Smogon\'s CC tier:__ http://www.smogon.com/dex/xy/formats/cc');
		}   
		if (arg === 'cc1v1' || arg === 'challengecup1v1') {
			matched = true;
			this.say(room, '__Smogon\'s CC1v1 tier:__ http://www.smogon.com/dex/xy/formats/cc1v1');
		}   
		if (arg === 'cap' || arg === 'createapokemon' || arg === 'create-a-pokemon') {
			matched = true;
			this.say(room, '__Smogon\'s CAP tier:__ http://www.smogon.com/dex/xy/formats/cap');
		}   
		if (arg === 'doublescc' || arg === 'doubleschallengecup') {
			matched = true;
			this.say(room, '__Smogon\'s Doubles CC tier:__ http://www.smogon.com/dex/xy/formats/double_cc');
		}   
		if (arg === 'doubles' || arg === 'doublesou') {
			matched = true;
			this.say(room, '__Smogon\'s Doubles tier:__ http://www.smogon.com/dex/xy/formats/doubles');
		}   
		if (arg === 'hiddentype') {
			matched = true;
			this.say(room, '__Smogon\'s Hidden Type tier:__ http://www.smogon.com/dex/xy/formats/hidden_type');
		}   
		if (arg === 'inversebattle') {
			matched = true;
			this.say(room, '__Smogon\'s Inverse Battle tier:__ http://www.smogon.com/dex/xy/formats/inverse_battle');
		}   
		if (arg === 'lc' || arg === 'littlecup') {
			matched = true;
			this.say(room, '__Smogon\'s LC tier:__ http://www.smogon.com/dex/xy/formats/lc');
		}   
		if (arg === 'middlecup') {
			matched = true;
			this.say(room, '__Smogon\'s MiddleCup tier:__ http://www.smogon.com/dex/xy/formats/middle_cup');
		}   
		if (arg === 'randomdoublesbattle' || arg === 'doublesrandombattle' || arg === 'randomdoubles') {
			matched = true;
			this.say(room, '__Smogon\'s Random Doubles tier:__ http://www.smogon.com/dex/xy/formats/random_doubles');
		}   
		if (arg === 'stabmons') {
			matched = true;
			this.say(room, '__Smogon\'s STABmons tier:__ http://www.smogon.com/dex/xy/formats/stabmons');
		}   
		if (arg === 'tiershift') {
			matched = true;
			this.say(room, '__Smogon\'s Tier Shift tier:__ http://www.smogon.com/dex/xy/formats/tier_shift');
		}   
		if (arg === 'triplescc' || arg === 'tripleschallengecup') {
			matched = true;
			this.say(room, '__Smogon\'s Triples CC tier:__ http://www.smogon.com/dex/xy/formats/triples_cc');
		}    
		if (arg === 'ubers' || arg === 'uber') {
			matched = true;
			this.say(room, '__Smogon\'s Ubers tier:__ http://www.smogon.com/dex/xy/formats/uber');
		}    
		if (arg === 'vgc15') {
			matched = true;
			this.say(room, '__Smogon\'s VGC15 tier:__ http://www.smogon.com/dex/xy/formats/vgc15');
		}    
		if (arg === 'proteanpalace') {
			matched = true;
			this.say(room, '__Smogon\'s Protean Palace tier:__ http://www.smogon.com/forums/threads/protean-palace-leaders-choice-july.3496299');
		}    
		if (arg === 'inheritance') {
			matched = true;
			this.say(room, '__Smogon\'s Inheritance tier:__ http://www.smogon.com/forums/threads/inheritance.3529252');
		}    
		if (arg === 'fu') {
			matched = true;
			this.say(room, '__Smogon\'s FU tier:__ http://www.smogon.com/forums/threads/oras-fu-metagame-discussion-old.3519286');
		}     
		if (arg === 'mixandmega' || arg === 'mix-and-mega') {
			matched = true;
			this.say(room, '__Smogon\'s Mix and Mega tier:__ http://www.smogon.com/forums/threads/mix-and-mega-omotm-july.3540979');
		} else if (!matched) {
			this.say(room, "__The information for '" + arg + "' does not exist.__");
		}
	},

    d: 'declare',
	declare: function (arg, user, room) {
		if (!user.isExcepted) return false;
		arg = arg.toLowerCase();
		var matched = false;
		if (arg === 'gt1') {
			matched = true;
			this.say(room, '/declare <u>Voting for the tiers</u>: <b>ChallengeCup1v1</b> or <b>ChallengeCup</b> is useless.<br />Any votes for those tiers will be ignored.');
		}
		if (arg === 'gt2') {
			matched = true;
			this.say(room, '/declare Vote for a tier you\'ll probably win in, to increase your chances of winning the prize!');
		}
		if (arg === 'gt3') {
			matched = true;
			this.say(room, '/declare Switching teams and scouting is against the rules (unless the tier is random).');
		} else if (!matched) {
			this.say(room, "__The declare '" + arg + "' does not exist.__");
		}
	},

	music: function(arg, user, room) {
		if (!user.isExcepted) return false;
		var parts = arg.split(',');
		if (!/(.mp3)/i.test(parts[1])) return this.say(room, 'The soundtrack needs to end by .mp3');
		if (!parts[1]) return this.say(room, '__Usage: -music [music title/description], [music.mp3]__');
		this.say(room, '/declare ' + parts[0] + '<br /><audio src="' + parts[1] + '" controls="" style="width: 100%;"></audio>');
	},

	j: 'join',
	join: function(arg, user, room) {
		if (!arg) return this.say(room, '__Usage: -join [room]__');
		arg = arg.toLowerCase();
		if (arg === 'lobby') return this.say(room, '__The room \'' + arg + '\' cannot be joined.__');
		if (arg === 'staff') return this.say(room, '__The room \'' + arg + '\' cannot be joined.__');
		this.say(room, '/join ' + arg);
	},

	l: 'leave',
	leave: function(arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;
		this.say(room, '__I\'m off__');
		this.say(room, '/leave');
	},

	runtour: function(arg, user, room) {
		if(!user.hasRank(room, '+')) return false;
		this.say(room, '/tour start');
		this.say(room, '/tour remind');
		this.say(room, '/tour autodq 2');
		this.say(room, '/tour runautodq');
		this.say(room, '/wall Good luck and Have fun!');
	},

	/*********************
	* Tool Commands ~end *
	*********************/

	/***************
	* FUN COMMANDS *
	***************/

	helix: function (arg, user, room) {
		var text = (room === user || user.canUse('8ball', room)) ? '' : '/pm ' + user.id + ', ';
		var rand = ~~(20 * Math.random());

		switch (rand) {
	 		case 0:
				text += "Signs point to yes.";
				break;
	  		case 1:
				text += "Yes.";
				break;
			case 2:
				text += "Reply hazy, try again.";
				break;
			case 3:
				text += "Without a doubt.";
				break;
			case 4:
				text += "My sources say no.";
				break;
			case 5:
				text += "As I see it, yes.";
				break;
			case 6:
				text += "You may rely on it.";
				break;
			case 7:
				text += "Concentrate and ask again.";
				break;
			case 8:
				text += "Outlook not so good.";
				break;
			case 9:
				text += "It is decidedly so.";
				break;
			case 10:
				text += "Better not tell you now.";
				break;
			case 11:
				text += "Very doubtful.";
				break;
			case 12:
				text += "Yes - definitely.";
				break;
			case 13:
				text += "It is certain.";
				break;
			case 14:
				text += "Cannot predict now.";
				break;
			case 15:
				text += "Most likely.";
				break;
			case 16:
				text += "Ask again later.";
				break;
			case 17:
				text += "My reply is no.";
				break;
			case 18:
				text += "Outlook good.";
				break;
			case 19:
				text += "Don't count on it.";
				break;
		}

		this.say(room, '__' + text + '__');
	},

	mymood: function(arg, user, room) {
		var differentMoods = [
			"happy",
			"sad",
			"angry",
			"tired",
			"lazy",
			"confused",
			"bored",
			"crazy",
			"curious",
			"drunk",
			"energetic"
		]
		var mood = differentMoods[Math.floor(Math.random() * 11)];
		this.say(room, user.name + "'s current mood is: " + mood);
	},

    pm: 'pmuser',
	pmuser: function(arg, user, room) {
		var parts = arg.split(',');
		if (!this.chatData[parts[0]] || !this.chatData[parts[0]].seenAt) {
			this.say(room, 'The user \'' + parts[0] + '\' does not exist.');
		}
		if (/(http\/\/|.com|.net)/i.test(parts[1])) return this.say(room, "__Please do not use the bot to link to websites.__");
		if (!parts[1]) return this.say(room, '__Usage: -pmuser [name], [message]__');
		this.say(room, '/pm ' + parts[0] + ', ' + parts[1] + ' (This was sent by ' + user.name + '.)');
		this.say(room, '__Message sent!__');
	},

	say: function(arg, user, room) {
		if (/(penis|vagina|xxx|porn|anal)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', inap');
		this.say(room, stripCommands(arg));
	},

    marry: 'pair',
    pair: function(arg, user, room) {
        if (!user.canUse('pair', room)) return false;
        var pairing = toId(arg);

        function toBase(num, base) {
            var symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            var num = num.split("");
            var conversion = "";
            var val;
            var total = 0;

            if (base > symbols.length || base <= 1) return false;

            for (var i = 0; i < num.length; i++) {
                val = symbols.indexOf(num[i]);
                total += ((val % base) * Math.pow(10, i)) + (Math.floor(val / base) * Math.pow(10, i + 1));
            }
            return parseInt(total);
        }

        user.pair = toBase(user.id, 10);
        pairing = toBase(pairing, 10);
        var match = (user.pair + pairing) % 101;
        if (match <= 20) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! The hate is real.');
        if (match >= 80) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! Such love!~');

        this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible!');
    },
    
    away: function(arg, usern room) {
    	if(!user.hasRank(room, '@')) return false;
    	if (/(xxx|porn|anal|fag|nude|dick)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', inap');
    	if (arg.length > 15 - this.name.length) return this.say(room, '__The away message \'' + arg + '\' is too long. Try using an away message that\'s ' + 15 - this.name.length + ' letters long or less.__');
    	this.say(room, '/away ' + arg);
    },

	/********************
	* FUN COMMANDS ~END *
	********************/

	/*******************************************************************************************
	* Room Owner commands                                                                      *
	*
	* These commands allow room owners to personalise settings for moderation and command use. *
	*******************************************************************************************/

	settings: 'set',
	set: function (arg, user, room) {
		if (room === user || !user.hasRank(room, '#')) return false;

		var settable = {
			autoban: 1,
			banword: 1,
			say: 1,
			joke: 1,
			usagestats: 1,
			'8ball': 1,
			guia: 1,
			studio: 1,
			wifi: 1,
			monotype: 1,
			survivor: 1,
			happy: 1,
			buzz: 1

		};
		var modOpts = {
			flooding: 1,
			caps: 1,
			stretching: 1,
			bannedwords: 1
		};

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		var setting;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding') {
			let modOpt = toId(opts[1]);
			if (!modOpts[modOpt]) return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
				Object.keys(modOpts).join('/') + '](, [on/off])');

			setting = toId(opts[2]);
			if (!setting) return this.say(room, 'Moderation for ' + modOpt + ' in this room is currently ' +
				(this.settings.modding[room] && modOpt in this.settings.modding[room] ? 'OFF' : 'ON') + '.');

			let roomid = room.id;
			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[roomid]) this.settings.modding[roomid] = {};
			if (setting === 'on') {
				delete this.settings.modding[roomid][modOpt];
				if (Object.isEmpty(this.settings.modding[roomid])) delete this.settings.modding[roomid];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			} else if (setting === 'off') {
				this.settings.modding[roomid][modOpt] = 0;
			} else {
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(modOpts).join('/') + '](, [on/off])');
			}

			this.writeSettings();
			return this.say(room, 'Moderation for ' + modOpt + ' in this room is now ' + setting.toUpperCase() + '.');
		}

		if (!(cmd in Commands)) return this.say(room, Config.commandcharacter + '' + opts[0] + ' is not a valid command.');

		var failsafe = 0;
		while (true) {
			if (typeof Commands[cmd] === 'string') {
				cmd = Commands[cmd];
			} else if (typeof Commands[cmd] === 'function') {
				if (cmd in settable) break;
				return this.say(room, 'The settings for ' + Config.commandcharacter + '' + opts[0] + ' cannot be changed.');
			} else {
				return this.say(room, 'Something went wrong. PM Morfent or TalkTakesTime here or on Smogon with the command you tried.');
			}

			if (++failsafe > 5) return this.say(room, 'The command "' + Config.commandcharacter + '' + opts[0] + '" could not be found.');
		}

		var settingsLevels = {
			off: false,
			disable: false,
			'false': false,
			'+': '+',
			'%': '%',
			'@': '@',
			'#': '#',
			'&': '&',
			'~': '~',
			on: true,
			enable: true,
			'true': true
		};

		var roomid = room.id;
		setting = opts[1].trim().toLowerCase();
		if (!setting) {
			let msg = '' + Config.commandcharacter + '' + cmd + ' is ';
			if (!this.settings[cmd] || (!(roomid in this.settings[cmd]))) {
				msg += 'available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank) + ' and above.';
			} else if (this.settings[cmd][roomid] in settingsLevels) {
				msg += 'available for users of rank ' + this.settings[cmd][roomid] + ' and above.';
			} else {
				msg += this.settings[cmd][roomid] ? 'available for all users in this room.' : 'not available for use in this room.';
			}

			return this.say(room, msg);
		}

		if (!(setting in settingsLevels)) return this.say(room, 'Unknown option: "' + setting + '". Valid settings are: off/disable/false, +, %, @, #, &, ~, on/enable/true.');
		if (!this.settings[cmd]) this.settings[cmd] = {};
		this.settings[cmd][roomid] = settingsLevels[setting];

		this.writeSettings();
		this.say(room, 'The command ' + Config.commandcharacter + '' + cmd + ' is now ' +
			(settingsLevels[setting] === setting ? ' available for users of rank ' + setting + ' and above.' :
			(this.settings[cmd][roomid] ? 'available for all users in this room.' : 'unavailable for use in this room.')));
	},
	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!toId(arg)) return this.say(room, 'You must specify at least one user to blacklist.');

		arg = arg.split(',');
		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];
		var roomid = room.id;
		for (let i = 0; i < arg.length; i++) {
			let tarUser = toId(arg[i]);
			if (!tarUser || tarUser.length > 18) {
				illegalNick.push(tarUser);
			} else if (!this.blacklistUser(tarUser, roomid)) {
				alreadyAdded.push(tarUser);
			} else {
				added.push(tarUser);
				this.say(room, '/roomban ' + tarUser + ', Blacklisted user');
			}
		}

		var text = '';
		if (added.length) {
			text += 'User' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist.';
			this.say(room, '/modnote ' + text + ' by ' + user.name + '.');
			this.writeSettings();
		}
		if (alreadyAdded.length) {
			text += ' User' + (alreadyAdded.length > 1 ? 's "' + alreadyAdded.join('", "') + '" are' : ' "' + alreadyAdded[0] + '" is') + ' already present in the blacklist.';
		}
		if (illegalNick.length) text += (text ? ' All other' : 'All') + ' users had illegal nicks and were not blacklisted.';
		this.say(room, text);
	},
	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!toId(arg)) return this.say(room, 'You must specify at least one user to unblacklist.');

		arg = arg.split(',');
		var removed = [];
		var notRemoved = [];
		var roomid = room.id;
		for (let i = 0; i < arg.length; i++) {
			let tarUser = toId(arg[i]);
			if (!tarUser || tarUser.length > 18) {
				notRemoved.push(tarUser);
			} else if (!this.unblacklistUser(tarUser, roomid)) {
				notRemoved.push(tarUser);
			} else {
				removed.push(tarUser);
				this.say(room, '/roomunban ' + tarUser);
			}
		}

		var text = '';
		if (removed.length) {
			text += ' User' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
			this.say(room, '/modnote ' + text + ' by user ' + user.name + '.');
			this.writeSettings();
		}
		if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
		this.say(room, text);
	},
	rab: 'regexautoban',
	regexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		try {
			new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		// checks if the user is attempting to autoban everyone
		// this isn't foolproof, but good enough to catch mistakes.
		// if a user bypasses this to autoban everyone, then they shouldn't be on the regex autoban whitelist
		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:[*+]|\{\d+\,(?:\d+)?\})?)+$/i.test(arg)) {
			return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Proofread!');
		}

		arg = '/' + arg + '/i';
		if (!this.blacklistUser(arg, room.id)) return this.say(room, '/' + arg + ' is already present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was added to the blacklist by user ' + user.name + '.');
		this.say(room, 'Regular expression ' + arg + ' was added to the blacklist.');
	},
	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!this.unblacklistUser(arg, room.id)) return this.say(room, '/' + arg + ' is not present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was removed from the blacklist user by ' + user.name + '.');
		this.say(room, 'Regular expression ' + arg + ' was removed from the blacklist.');
	},
	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;

		var text = '/pm ' + user.id + ', ';
		if (!this.settings.blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		var roomid = room.id;
		var blacklist = this.settings.blacklist[roomid];
		if (!blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		if (!arg.length) {
			let userlist = Object.keys(blacklist);
			if (!userlist.length) return this.say(room, text + 'No users are blacklisted in this room.');
			return this.uploadToHastebin('The following users are banned from ' + roomid + ':\n\n' + userlist.join('\n'), function (link) {
				if (link.startsWith('Error')) return this.say(room, text + link);
				this.say(room, text + 'Blacklist for room ' + roomid + ': ' + link);
			}.bind(this));
		}

		var nick = toId(arg);
		if (!nick || nick.length > 18) {
			text += 'Invalid username: "' + nick + '".';
		} else {
			text += 'User "' + nick + '" is currently ' + (blacklist[nick] || 'not ') + 'blacklisted in ' + roomid + '.';
		}
		this.say(room, text);
	},
	banphrase: 'banword',
	banword: function (arg, user, room) {
		arg = arg.trim().toLowerCase();
		if (!arg) return false;

		var tarRoom = room.id;
		if (room === user) {
			if (!user.isExcepted) return false;
			tarRoom = 'global';
		} else if (user.canUse('banword', room)) {
			tarRoom = room.id;
		} else {
			return false;
		}

		var bannedPhrases = this.settings.bannedphrases ? this.settings.bannedphrases[tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) this.settings.bannedphrases = {};
			bannedPhrases = (this.settings.bannedphrases[tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.say(room, 'Phrase "' + arg + '" is already banned.');
		}
		bannedPhrases[arg] = 1;

		this.writeSettings();
		this.say(room, 'Phrase "' + arg + '" is now banned.');
	},
	unbanphrase: 'unbanword',
	unbanword: function (arg, user, room) {
		var tarRoom;
		if (room === user) {
			if (!user.isExcepted) return false;
			tarRoom = 'global';
		} else if (user.canUse('banword', room)) {
			tarRoom = room.id;
		} else {
			return false;
		}

		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		if (!this.settings.bannedphrases) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		var bannedPhrases = this.settings.bannedphrases[tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete this.settings.bannedphrases[tarRoom];
			if (Object.isEmpty(this.settings.bannedphrases)) delete this.settings.bannedphrases;
		}

		this.writeSettings();
		this.say(room, 'Phrase \"' + arg + '\" is no longer banned.');
	},
	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function (arg, user, room) {
		var tarRoom = room.id;
		var text = '';
		var bannedFrom = '';
		if (room === user) {
			if (!user.isExcepted) return false;
			tarRoom = 'global';
			bannedFrom += 'globally';
		} else if (user.canUse('banword', room)) {
			text += '/pm ' + user.id + ', ';
			bannedFrom += 'in ' + room.id;
		} else {
			return false;
		}

		if (!this.settings.bannedphrases) return this.say(room, text + 'No phrases are banned in this room.');
		var bannedPhrases = this.settings.bannedphrases[tarRoom];
		if (!bannedPhrases) return this.say(room, text + 'No phrases are banned in this room.');

		if (arg.length) {
			text += 'The phrase "' + arg + '" is currently ' + (bannedPhrases[arg] || 'not ') + 'banned ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + 'No phrases are banned in this room.');

		this.uploadToHastebin('The following phrases are banned ' + bannedFrom + ':\n\n' + banList.join('\n'), function (link) {
			if (link.startsWith('Error')) return this.say(room, link);
			this.say(room, text + 'Banned phrases ' + bannedFrom + ': ' + link);
		}.bind(this));
	}

	/**************************
	* Roomowner commands ~end *
	**************************/

};
