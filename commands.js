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
  'mymood': true,
  'be': true
};

//var wallTitle = [];
//var wallMessage = [];
//var wallRoom = [];
var walls = [];

//A Game of Trivia 
var triviaQuestions = ['This Pokemon helps Nurse Joy in Pokemon Center and also have highest HP stat','blissey','What is the ability of Charizard Mega - X','toughclaws',
'A two turn move which starts with the absorbtion of sunlight','solarbeam','Its the only Dark Type Pulsating Move','darkpulse','Which colors are Raichu\'s Cheeks?','yellow',
'Pokemon having Rock type and SandStorm as his/her Ability','tyranitar','What ability boosts the power of Fire-type moves when the Pokemon is below 1/3 of its health?','blaze',
'What is the subtitle of the first Pokémon movie?','mewtwostrikesback','Name a move that can have a 100% chance of flinching the target barring Fake Out.','fling',
'What is the only Poison-Type Pokemon to learn Rock Polish?','garbodor','What cave lies between Mahogany Town and Blackthorn City?','icepath',
'This Electric-Type move increases the user\'s Special Defense.','charge','What is the only Pokémon available in the Yellow Forest Pokéwalker route?','pikachu',
'This is the nickname of the Pokemon acting as the light source of Glitter Lighthouse in Olivine City.','amphy','This Pokemon has the longest cry.','jynx',
'This Pokemon Conquest warlord has the warrior ability of "chesto!" at rank 2.','yoshihiro','What Pokemon is based on the mythological kitsune?','ninetales',
'This is the only pure Flying-Type Pokémon (excluding forms)','tornadus',
'This evolutionary stone either removes a type immunity or adds type immunities when used on certain Pokemon that evolve via this stone.','dawnstone',
'What is the only single-typed Pokemon with Tangled Feet?','spinda','This is the most expensive item that you can obtain in-game.','gorgeousroyalribbon',
'This Pokémon is the first Pokémon to be revealed.','rhydon','Name a non Psychic-Type Pokémon that can learn Heart Stamp.','pikachu','This type of berry have the longest name.',
'marangaberry','Name the only Pokemon with a BST of 336.','unown','Name a Pokémon that can be obtained by breeding a Pokémon they cannot evolve into.','phione',
'This herbal medicine cures infatuation.','mentalherb','This was the only Dragon-type attack in Generation I.','dragonrage',
'In the games, baseball players are represented by this trainer class.','infielder','Name one of the six moves that is a Self-KO move.',',memento',
'How much Poke Dollars does an Escape Rope cost?','500','What starter does your rival have in Pokemon Yellow version?','eevee',
'In the Pokemon anime, Jessie gives herself this name during the Kanto Grand Festival.','jessadia','What is the only Pokemon able to learn Secret Power by leveling up?',
'audino','This Pokemon in Pokemon Mystery Dungeon: Explorers of Time/Darkness/Sky has the job of waking up you and your partner in the morning.',
'exploud','In the main series Pokemon games, there are various Pokemon that impede your path to new areas. Name one.','snorlax','Name the only Pokemon to weigh 0.9 kg.',
'floette','This is the first Key Item you have in Pokemon X and Y.','holocaster','What is Castelia Park shaped like?','pokeball',' This Gym Leader doesn\'t have a Vs. Sprite.',
'juan', 'What is Mega Venusaur\'s ability', 'thickfat', 'How many PP does hyper beam have normally (number only)', '5','This is the only Dark-Type move Clawitzer learns.','darkpulse',
'Which Pokemon according to the Unova horoscope represents Libra?','lampent','What Fighting-type move is guaranteed to cause a critical hit?','stormthrow', 
'What is the subtitle of the first Pokémon movie?','mewtwostrikesback','What is the only Pokémon available in the Yellow Forest Pokéwalker route?','pikachu',
'What Move does HM02 contain?','fly','What Pokemon was Latias combined with in early concept art?','blaziken','What is Prof. Oak\'s first name?','samuel',
'Who ran the bank in Pokemon Mystery Dungeon: Explorers of Time, Darkness, and Sky?','duskull','Which Pseudo legendary was originally based off of a tank?','hydreigon',
'Which Legendary Pokemon was originally found at Victory Road but was moved to the Sevii Islands in later generations?','moltres',
'What Pokemon requires an empty space in the party during evolution to be obtained?','shedinja','Which Pokemon has the lowest base stat total?','sunkern',
'In the main series game, this Pokemon can evolve into its final form using either one of 2 methods.','feebas',
'Which Pokemon Has the Highest \"Attack\" stat that is __Not__ A Legendary or Mega', 'rampardos','Which Pokemon Has the Highest \"Speed\" stat that is __Not__ A Legendary or Mega',
'ninjask','Which Pokemon Has the Highest \"Defense\" stat that is __Not__ A Legendary or Mega', 'shuckle',
'Which Pokemon Has the Highest \"Special Defense\" stat that is __Not__ A Legendary or Mega', 'shuckle',
'Which Pokemon Has the Highest \"Special Attack\" stat that is __Not__ A Legendary or Mega', 'chandelure','Which Pokemon Has the Lowest \"HP\" stat', 'shedinja',
'This ability is exclusive to Dragonite and Lugia.', 'multiscale', 'This\, Servine\'s hidden ability\, is also the hidden ability of Spinda', 'contrary', 
'Water-type starter pokemon have this ability as their primary ability.', 'torrent', 
'Most legendary pokemon have this ability\, which doubles the amount of PP opponents use up when attacking.', 'pressure',
'Pokemon with this ability are immune to moves such as Bug Buzz and Boomburst.', 'soundproof', 'This ability allows the pokemon to change typing and appearance when the weather shifts.',
'forecast', 'A pokemon\'s speed stat is doubled in the rain when it has this ability.', 'swiftswim','This move is the signature move of Chatot.', 'chatter',
'Aside from smeargle\, Lugia is the only pokemon that can learn this flying-type move with an increased critical-hit rate.', 'aeroblast',
'This move deals supereffective damage to water-type pokemon even when used by a pokemon with Normalize.', 'freezedry', 
'This move is given as a technical machine after defeating Tate & Liza.', 'calm mind', 
'A hidden machine introduced in Diamond and Pearl\, this move deals normal-typed damage and may confuse the opponent.','rockclimb',
'This pokemon is first encountered inside a TV set in the Old Chateau.', 'rotom', 'This guaranteed-shiny pokemon can be encountered in the Nature Preserve.', 'haxorus', 
'This is the only pokemon that can be encountered walking in Rusturf Tunnel.', 'whismur', 
'As thanks for stopping Team Magma/Aqua\, the Weather Institute gives you one of these pokemon.', 'castform', 'This pokemon is the only one to have the ability Stance Change.', 
'aegislash', 'As you liberate Silph Co. from Team Rocket\, an employee will give you one of these pokemon.', 'lapras', 'This pokemon costs 9999 coins at the Celadon Game Corner.', 
'porygon', 'You can receive this pokemon as a gift from Bebe.', 'eevee', 'This ghost-type evolves from female Snorunt.', 'froslass', 'This lake guardian resides in Lake Verity.',
'mesprit','This person is the Hoenn Champion in Pokemon Emerald.', 'wallace', 'The pokemon PC system is operated by this lady in the Hoenn Region.', 'lanette',
'The pokemon PC system was expanded to allow trade with Hoenn by this resident of One Island', 'Celio', 
'Pokemon Platinum introduced this NPC\, a scientist working with Team Galactic that was arrested in Stark Mountain.',
'charon', 'Viridian\'s gym leader\, he is also the boss of Team Rocket.', 'giovanni', 'This person is the head of Team Galactic.', 'cyrus',
'This member of the Seven Sages resurrected Team Plasma in the events of Black and White 2.', 'ghetsis',
'A member of the Hoenn elite four\, this person\'s team includes Altaria and Flygon.', 'drake', 'This item has a 3/16 chance to move the user to the top of its priority bracket.', 
'quickclaw', 'Holders of this item cannot become infatuated\, and they also guarantee their offspring inherit 5 stats from its parents.', 'destinyknot',
'Defeating the Winstrate family and talking to them afterward allows the player to receive this item\, which doubles the EV gains of its holder.', 'machobrace',
'This item is found deep inside Mt. Ember after the player receives the National Pokedex.', 'ruby', 
'Sinnoh\'s underground can be visited once the player has obtained this Key Item.', 'explorerkit', 
'This item summons Heatran when brought to Stark Mountain or Reversal Mountain.', 'magmastone','What Pokemon is based off of antlion larvae?', 'trapinch',
'What Pokemon trainer gives you a Dusk Stone in ORAS after defeating them?','hexmaniacvalerie','What move increases the Attack and Sp. Attack of grounded Grass-type Pokemon?',
'rototiller', 'Who is the daughter of a gym leader that became a member of the Elite Four?', 'janine', 'What was the most common pokemon type in Gen 1?', 'poison',
'Who is the worst E4 in Vanguard?', 'myth', 'Who is better at rapping me or mewth?', 'mewth', 'Who was the main character of Pokémon XD Gale of Darkness?', 'michael', 
'This pokemon takes the longest to evolve', 'larvesta', 'What is the most OP Pokemon ever?', 'magikarp', 'What move does Charmender learn at level 13 in FireRed/LeafGreen?', 'metalclaw',
'What ability should your pokemon have to make eggs on your party hatch faster?','flamebody'];
var triviaRoom; // This var will check if trivia is going in other room or not..
var triviaON = false; // A switch case to tell if trivia is going on not
var triviaTimer; // Keeps the track of the timer of the trivia
var triviaA; // The answer of the trivia
var triviaQ; // Question of trivia
var triviaPoints = []; // This empty object will keep the track off all the trivia points during a game of trivia
var teamOne = [];
var teamTwo = [];
var teamOnePoints = 0;
var teamTwoPoints = 0;
clearInterval(triviaTimer);

exports.commands = {

  /****************
  * Tool Commands *
  ****************/

  reload: function (arg, user, room) {
    if (!user.isExcepted) return false;
    try {
      this.uncacheTree('./commands.js');
      Commands = require('./commands.js').commands;
      this.say(room, '__commands.js reloaded.__');
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
      if (!user.canUse('autoban', room)) return false;
      arg = arg.toLowerCase();
      var matched = false;
      if (arg === 'retro1') {
        matched = true;
        this.say(room, '/wall Create only ONE Pokemon at a time. DO NOT BRING A 3v3 TEAM.');
      }
      if (arg === 'retro2') {
        matched = true;
        this.say(room, '/wall Uber-Mega Pokemon are ALLOWED. Regular Ubers, however, are banned (obviously).');
      }  
      if (arg === 'retro3') {
        matched = true;
        this.say(room, '/wall NO SCOUTING. (Moveset counters)');
      }  
      if (arg === 'retro4') {
        matched = true;
        this.say(room, '/wall Changing Pokemon during the tournament is ALLOWED.');
      } 
      if (arg === 'retro5') {
        matched = true;
        this.say(room, '/wall More rules and details are here: http://izziisawesome2011.wix.com/tournaments#!retro-1v1/a3hkp');
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
      }
      if (arg === 'gt1') {
        matched = true;
        this.say(room, '/wall Voting for the tiers: ChallengeCup1v1 or ChallengeCup is useless. Any votes for those tiers will be ignored.');
      }
      if (arg === 'gt2') {
        matched = true;
        this.say(room, '/wall Vote for a tier you\'ll probably win in, to increase your chances of winning the prize!');
      }
      if (arg === 'gt3') {
        matched = true;
        this.say(room, '/wall Switching teams and scouting is against the rules (unless the tier is random).');
      } else if (!matched) {
        this.say(room, "__The wall '" + arg + "' does not exist.__");
      }
    },

  addwall: function(arg, user, room) {
    if (!user.canUse('autoban', room)) return false;
    var parts = arg.split(',');
    if (!parts[1]) return this.say(room, '__Usage: -addwall [wallTitle], [wallMessage]__');
    for (var i = 0; i < walls.length; i++) {
      if (parts[0] === walls[i].title) return this.say(room, '__There\'s already a wall under the name \'' + parts[0] + '\'.__');
    }
    walls.push({title: parts[0], message: parts[1], room: room.id});
    this.say(room, '__The wall \'' + parts[0] + '\' was added to the list of walls of the room: \'' + room.id + '\'.__');
  },

  walls: function(arg, user, room) {
    if (!user.canUse('autoban', room)) return false;
    for (var i = 0; i < walls.length; i++) {
      if (arg === walls[i].title && room.id === walls[i].room) return this.say(room, '/wall ' + walls[i].message);
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

  music: function(arg, user, room) {
    if (!user.canUse('autoban', room)) return false;
    var parts = arg.split(',');
    if (!parts[1]) return this.say(room, '__Usage: -music [music title/description], [music.mp3]__');
    if (!/(.mp3)/i.test(parts[1])) return this.say(room, '__The soundtrack needs to end by .mp3__');
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

  ajl: 'autojoinlist',
    roomlist: 'autojoinlist',
    autojoinlist: function(arg, user, room) {
      if (arg === 'priv' && user.isExcepted) {
        var Message = 'PrivateRoom List: ';
        for (var i = 0; i < Config.privaterooms.length - 1; i++) {
          if (Config.privaterooms.length > 1) return Message += ' ' + Config.privaterooms[i] + ', ';
        }
        Message += Config.privaterooms[Config.privaterooms.length - 1] + '.';

        return this.say(room, '/modnote ' + Message);
      }
      var Message = '__**Room List:** ';
      for (var i = 0; i < Config.rooms.length - 1; i++) {
        if (Config.rooms.length > 1) Message += ' ' + Config.rooms[i] + ', ';
      }
      Message += Config.rooms[Config.rooms.length - 1] + '.__';

      this.say(room, Message);
    },

  l: 'leave',
    leave: function(arg, user, room) {
      if (room === user || !user.canUse('autoban', room)) return false;
      this.say(room, '__I\'m off__');
      this.say(room, '/leave');
    },

  corrotorneios: 'runtour', //for Portuguese
    runtour: function(arg, user, room) {
      if(!user.hasRank(room, '+')) return false;
      this.say(room, '/tour start');
      this.say(room, '/tour remind');
      this.say(room, '/tour autodq 2');
      this.say(room, '/tour runautodq');
      this.say(room, '/wall Good luck and Have fun!');

      this.remind2 = setTimeout(function (room, remind2) {
        this.say(room, remind2);
      }.bind(this), 120 * 1000, room, '/tour remind');

    },

  gte: 'grandtourevent',
    grandtourevent: function(arg, user, room){
      if (room.id !== "tournaments") return false;
      if (!user.canUse('autoban', room)) return false;
      this.say(room, '/etour ' + arg)
      this.say(room, '/wall The Grand Tournament will be starting in 15 minutes!')

      this.gt3 = setTimeout(function (room, gt3) {
        this.say(room, gt3);
      }.bind(this), 120 * 1000, room, '/wall Switching teams and scouting is against the rules (unless the tier is random).');

      this.gt32 = setTimeout(function (room, gt32) {
        this.say(room, gt32);
      }.bind(this), 480 * 1000, room, '/wall Switching teams and scouting is against the rules (unless the tier is random).');

      this.gtedeclare = setTimeout(function (room, gt32) {
        this.say(room, gt32);
      }.bind(this), 750 * 1000, room, '/modnote Declare the last gdeclare in 30 seconds!');

      this.gtedeclare = setTimeout(function (room, gt32) {
        this.say(room, gt32);
      }.bind(this), 856 * 1000, room, '/wall We\'re starting!');

      this.gtestart = setTimeout(function (room, gtestart) {
        this.say(room, gtestart);
      }.bind(this), 900 * 1000 , room, '/tour start');

      this.gteremind = setTimeout(function (room, gteremind) {
        this.say(room, gteremind);
      }.bind(this), 901 * 1000 , room, '/tour remind');

      this.gteautodq = setTimeout(function (room, gteautodq) {
        this.say(room, gteautodq);
      }.bind(this), 902 * 1000 , room, '/tour autodq 2');

      this.gterundq = setTimeout(function (room, gterundq) {
        this.say(room, gterundq);
      }.bind(this), 903 * 1000 , room, '/tour runautodq');

      this.gt33 = setTimeout(function (room, gt33) {
        this.say(room, gt33);
      }.bind(this), 963 * 1000, room, '/wall Switching teams and scouting is against the rules (unless the tier is random).');

      this.gteremind2 = setTimeout(function (room, gteremind2) {
        this.say(room, gteremind2);
      }.bind(this), 1030 * 1000, room, '/tour remind');

      this.gteremind3 = setTimeout(function (room, gteremind3) {
        this.say(room, gteremind3);
      }.bind(this), 1150 * 1000, room, '/tour remind');  
    },

  commands: 'guide',
    guia: 'guide',
    guide: function(arg, user, room) {
      this.say(room, '**Guide:** http://pastebin.com/359ufDq8');
    },

  code: 'github',
    source: 'github',
    sourcecode: 'github',
    git: 'github',
    github: function(arg, user, room) {
      this.say(room, '**Source Code:** https://github.com/MasterFloat/Pokemon-Showdown-Bot');
    },

  /*********************
  * Tool Commands ~end *
  *********************/

  /***************
  * FUN COMMANDS *
  ***************/

  helix: function (arg, user, room) {
    var text = (room === user || user.canUse('8ball', room)) ? '' : '/pm ' + user.id + ', ';
    var rand = ~(20 * Math.random());

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
      if (/(http\/\/|.com|.net)/i.test(parts[1])) return this.say(room, "__Please do not use the bot to link to websites.__");
      if (!parts[1]) return this.say(room, '__Usage: -pmuser [name], [message]__');
      this.say(room, '/pm ' + parts[0] + ', ' + parts[1] + ' (This was sent by ' + user.name + '.)');
      this.say(room, '__Message sent!__');
    },

  dizer: 'say',//for Portuguese
    say: function(arg, user, room) {
      if (/(penis|vagina|xxx|porn|anal|fag|nude|dick)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', Automated response: inap');
      if (/(\+say)/i.test(arg)) return this.say(room, 'I don\'t want to control Safety Shark.');
      this.say(room, stripCommands(arg));
    },

  bsay: function(arg, user, room) {
    if (/(penis|vagina|xxx|porn|anal|fag|nude|dick)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', Automated response: inap');
    if (/(\+say)/i.test(arg)) return this.say(room, 'I don\'t want to control Safety Shark.');
    this.say(room, stripCommands('**' + arg + '**'));
  },

  isay: function(arg, user, room) {
    if (/(penis|vagina|xxx|porn|anal|fag|nude|dick)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', Automated response: inap');
    if (/(\+say)/i.test(arg)) return this.say(room, 'I don\'t want to control Safety Shark.');
    this.say(room, stripCommands('__' + arg + '__'));
  },

  csay: function(arg, user, room) {
    if (/(penis|vagina|xxx|porn|anal|fag|nude|dick)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', Automated response: inap');
    if (/(\+say)/i.test(arg)) return this.say(room, 'I don\'t want to control Safety Shark.');
    this.say(room, stripCommands('``' + arg + '``'));
  },

  greet: function(arg, user, room) {
    if (room.id === 'portugus') return this.say(room, 'Olá ' + arg + ', bem-vindo ao quarto português.');
    this.say(room, 'Hey there ' + arg + ', welcome to the ' + room.id + ' room!');
  },

  casar: 'pair',//for Portuguese
    marry: 'pair',
    pair: function(arg, user, room) {
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

      if (room.id === 'portugus') return this.say(room, user.name + ' e ' + arg + ' são ' + match + '% compatível!');//for Portuguese
      if (user.name === 'Dex Leader Blue' && arg === 'Master Float') return this.say(room, 'Dex Leader Blue and Master Float are 69% compatible! :^]');
      if (user.name === 'Master Float' && arg === 'Dex Leader Blue') return this.say(room, 'Master Float and Dex Leader Blue are 69% compatible! :^]');

      if (user.name === 'Inferno Prof Fabio' && arg === 'Master Float') return this.say(room, 'Inferno Prof Fabio and Master Float are 100% compatible! Such love!~');
      if (user.name === 'Master Float' && arg === 'Inferno Prof Fabio') return this.say(room, 'Master Float and Inferno Prof Fabio are 100% compatible! Such love!~');

      if (match <= 20) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! The hate is real.');
      if (match >= 80) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! Such love!~');
      if (match === 69) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! ooo kinky.');

      this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible!');
    },

  mytype: 'typing',
    type: 'typing',
    typing: function(arg, user, room) {
      if (!arg) {
        var target = {
          'id': user.id,
          'name': user.name
        }
      }
      else {
        var target = {
          'id': toId(arg),
          'name': arg,
        }
      }
      var types = {
        0: {
          type: 'Ice',
            color: '2B8F9A'
        },
        1: {
          type: 'Water',
            color: '2822DA'
        },
        2: {
          type: 'Fire',
            color: 'BF6224'
        },
        3: {
          type: 'Grass',
            color: '4A8B4F'
        },
        4: {
          type: 'Normal',
            color: '6C6C6C'
        },
        5: {
          type: 'Fighting',
            color: '865A44'
        },
        6: {
          type: 'Psychic',
            color: '8E1164'
        },
        7: {
          type: 'Ghost',
            color: '695170'
        },
        8: {
          type: 'Dark',
            color: '000'
        },
        9: {
          type: 'Electric',
            color: '9F9F25'
        },
        10: {
          type: 'Ground',
            color: '90903E'
        },
        11: {
          type: 'Rock',
            color: '897246'
        },
        12: {
          type: 'Steel',
            color: '5B6265'
        },
        13: {
          type: 'Fairy',
            color: 'C95596'
        },
        14: {
          type: 'Flying',
            color: '6F7AA1'
        },
        15: {
          type: 'Poison',
            color: '591F7A'
        },
        16: {
          type: 'Bug',
            color: '5F6F32'
        },
        17: {
          type: 'Dragon',
            color: '473981'
        },
      };

      if(!this.settings.typing){
        this.settings.typing = {};
        this.writeSettings();
      }
      if (this.settings.typing[target.id]) {
        return this.say(room, '!htmlbox ' + target.name + ' is a <font style="font-weight: bold; color: #' + types[this.settings.typing[target.id][0]].color + '"> ' + types[this.settings.typing[target.id][0]].type + '</font>' + (this.settings.typing[target.id][1] ? ' type and <font style="font-weight: bold; color: #' + types[this.settings.typing[target.id][1]].color + '">' + types[this.settings.typing[target.id][1]].type + '</font> type' : ' type'))
      }
      var dualtype = true;

      function scramble(text, variable){
        var array = [];
        for(var i = 0; i < variable; i++){
          array.push('');
        }
        for(var i = 0; i < text.length;i++){
          array[i % array.length] += text[i];
        }
        return array.join('');
      }
      function returnType(target, variation) {
        var base = 'qwertyuiopasdfghjklzxcvbnm1234567890';
        var chars = scramble(base, variation);
        var total = 0;
        for (var i = 0; i < target.length; i++) {
          total += chars.indexOf(target[i]);
        }
        return total % 18;
      }
      //using 2 different numbers to generate random numbers;
      var type1 = types[returnType(target.id, 4)];
      var type2 = types[returnType(target.id, 6)];
      if (type1.type === type2.type) {
        dualtype = false;
      }
      this.say(room, '!htmlbox ' + target.name + ' is a <font style="font-weight: bold; color: #' + type1.color + '">' + type1.type + '</font> ' + (dualtype ? 'and <font style="font-weight: bold; color: #' + type2.color + '">' + type2.type + '</font> type.' : 'type.'));
    },

  customtype: 'settype',
    settype: function(arg, user, room) {
      if(!Config.excepts.includes(user.id)) return false;
      if(!arg) return false;
      var target = toId(arg.replace(', ', ',').split(',')[0]);
      var typing = arg.replace(', ', ',').split(',')[1];
      if(!typing){
        return false;
      }
      if (typing.indexOf('/') > -1) {
        typing = [toId(typing.split('/')[0]), toId(typing.split('/')[1])]
      }
      else {
        typing = [typing];
      }
      var type = {
        ice: 0,
          water: 1,
          fire: 2,
          grass: 3,
          normal: 4,
          fighting: 5,
          psychic: 6,
          ghost: 7,
          dark: 8,
          electric: 9,
          ground: 10,
          rock: 11,
          steel: 12,
          fairy: 13,
          flying: 14,
          poison: 15,
          bug: 16,
          dragon: 17
      };
      for (var i = 0; i < typing.length; i++) {
        if(!type[typing[i]]) return this.say(room, 'Invalid type.');
        typing[i] = type[typing[i]];
      }
      this.settings.typing[target] = typing;
      this.writeSettings();
      this.say(room, 'Done!');
    },

  away: function(arg, user, room) {
    if(!user.hasRank(room, '+')) return false;
    if (/(xxx|porn|anal|fag|nude|dick)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', Automated response: inap');
    if (arg.length > 4) return this.say(room, '__The away message \'' + arg + '\' is too long. Try using an away message that\'s 4 letters long or less.__');
    if (arg === 'n') return this.say(room, '/back');
    this.say(room, '/away ' + arg);
  },

  be: function(arg, user, room) {
    arg = arg.toLowerCase();
    var matched = false;
    if (arg === 'happy') {
      matched = true;
      this.say(room, 'feelsgd');
    }
    if (arg === 'sad') {
      matched = true;
      this.say(room, 'feelsbd');
    }
    if (arg === 'mad') {
      matched = true;
      this.say(room, 'feelsmd');
    }
    if (arg === 'high') {
      matched = true;
      this.say(room, 'fukya');
    }
    if (arg === 'thinking') {
      matched = true;
      this.say(room, 'hmmface');
    }
    if (arg === 'dead' || arg === 'ded') {
      matched = true;
      this.say(room, 'feelsdd');
    }
    if (arg === 'scared' || arg === 'confused') {
      matched = true;
      this.say(room, 'oshet');
    }
    if (arg === 'serious' || arg === 'resentful') {
      matched = true;
      this.say(room, 'feelsrs');
    }
    if (arg === 'stupid' || arg === 'dumb') {
      matched = true;
      this.say(room, 'fukya');
    }
    if (arg === 'ok') {
      matched = true;
      this.say(room, 'feelsok');
    }		
    if (arg === 'nervous') {
      matched = true;
      this.say(room, 'feelsnv');
    }
    if (arg === 'funny') {
      matched = true;
      this.say(room, 'funnylol');
    }
    if (arg === 'rofling' || arg === 'laughing') {
      matched = true;
      this.say(room, 'xaa');
    } else if (!matched) {
      this.say(room, "__I can't feel that way__ wtfman");
    }
  },

  trivia: function(arg, user, room){
    if (room === user) return false;
    var text = '';
    if(triviaON){this.say( room, '__**ERROR**: A game of trivia is going on another room and hence it cannot be started here__'); return false;}
    triviaON = true;
    triviaRoom = room.id;
    triviaA = '';
    triviaPoints = [];
    this.say( room, '__' + user.name + ' is hosting a game of **trivia**. Answer the questions using -ta or -triviaanswer. First to get 10 points wins.__');
    triviaTimer = setInterval( function() {
      if(triviaA){this.say(room, '**BEEP** TIMES UP!! ' + triviaA);}
      var TQN = 2*(Math.floor(triviaQuestions.length*Math.random()/2))
      triviaQ = triviaQuestions[TQN];
      triviaA = triviaQuestions[TQN+ 1];
      this.say( room, '**Question**: ' + triviaQ); 
    }.bind(this), 15000);
  },

  triviapoints: function(arg, user, room){
    var text = user.canUse('triviapoints', room.id) ? '' : '/pm ' + user.id + ', ';
    if(!anagramON) return false;
    var text = '**Points so far**: '
    for (var i = 0; i < triviaPoints.length; i++){
      text += '' + triviaPoints[i] + ': ';
      text += triviaPoints[i + 1] + ' Pokepoints, ';
      i++
    }
    this.say(room, text);
  },

  ta: 'triviaanswer',
    triviaanswer: function(arg, user, room){
      if(room.id !== triviaRoom) return false;
      if (!arg) return false;
      arg = (arg);
      arg = arg.replace(/\s+/g, '');
      arg = arg.toLowerCase();
      var theuser = (user.name);
      if(arg == triviaA){
        if (triviaPoints.indexOf(theuser) > -1){
          triviaA = '';
          triviaPoints[triviaPoints.indexOf(theuser) + 1] += 1;
          if (triviaPoints[triviaPoints.indexOf(theuser) + 1] >= 10) {
            clearInterval(triviaTimer);
            this.say( room, '__**Congrats to ' + user.name + ' for winning Trivia!**__');
            this.say(room,'/pm '+ user.name + ' ,__**Congratulations** on winning the game of trivia.__')
            triviaON = false; 
            return false;
          }
          this.say(room,'__**' + user.name + '** got the right answer, and has **' + triviaPoints[triviaPoints.indexOf(theuser) + 1] + '** points!__');
        } else {
          triviaA = '';
          triviaPoints[triviaPoints.length] = theuser;
          triviaPoints[triviaPoints.length] = 1;
          this.say(room,'__**' + user.name + '** got the right answer, and has **' + triviaPoints[triviaPoints.indexOf(theuser) + 1] + '** point!__');
        }
      }
    },

  atq: 'addtriviaquestion',
    addtriviaquestion: function(arg, user, room) {
      if (!user.isExcepted) return false;
      var argument = arg.split(',');
      if (!argument[1]) return this.say(room, '__Usage: -addtriviaquestion [question], [answer]__');
      triviaQuestions.push(argument[0]);
      triviaQuestions.push(argument[1]);
    },

  rtq: 'removetriviaquestion',
    removetriviaquestion: function(arg, user, room) {
      if (!user.isExcepted) return false;
      var argument = arg.split(',');
      if (!argument[1]) return this.say(room, '__Usage: -removetriviaquestion [question], [answer]__');
      triviaQuestions.splice(triviaQuestions.indexOf(argument[0]), 1);
      triviaQuestions.splice(triviaQuestions.indexOf(argument[1]), 1);
    },

  endtrivia: 'triviaend',
    triviaend: function(arg, user, room){
      if (room === user) return false;
      if(room.id !== triviaRoom)return false;
      if(!triviaON) return false;
      clearInterval(triviaTimer);
      this.say(room, '__The game of trivia has been ended.__');
      triviaON = false;
    },
    
    
	add: function(arg, user, room) {
		var plus = arg.split('+');
		if (plus.length < 2) return this.say(room, '__You must add at least two numbers.__');
		var Result = "**Result:** ";
		var num = 0;
		
		for (var i = 0; i < plus.length; i++) {
			num += Number(plus[i]);
		}
		Result += num;
		
		this.say(room, Result);
	},
	
	substract: function(arg, user, room) {
		var minus = arg.split('-');
		if (minus.length < 2) return this.say(room, '__You must substract at least two numbers.__');
		var Result = "**Result:** ";
		var num = 0;
		
		num += Number(minus[0]);
		for (var i = 1; i < minus.length; i++) {
			num -= Number(minus[i]);
		}
		Result += num;
		
		this.say(room, Result);
	},
	
	multiply: function(arg, user, room) {
		var times = arg.split('x');
		if (times.length < 2) return this.say(room, '__You must multiply at least two numbers.__');
		var Result = "**Result:** ";
		var num = 0;
		
		num += Number(times[0]);
		for (var i = 1; i < times.length; i++) {
			num *= Number(times[i]);
		}
		Result += num;
		
		this.say(room, Result);
	},
	
	divide: function(arg, user, room) {
		var on = arg.split('/');
		if (on.length < 2) return this.say(room, '__You must multiply at least two numbers.__');
		var Result = "**Result:** ";
		var num = 0;
		
		num += Number(on[0]);
		for (var i = 1; i < on.length; i++) {
			num /= Number(on[i]);
		}
		Result += num;
		
		this.say(room, Result);
	},

  /********************
  * FUN COMMANDS ~END *
  ********************/

  /********************************************************************************************
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
          buzz: 1,
          pair: 1
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
