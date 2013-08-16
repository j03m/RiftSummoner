var goblinWizard = {
	defs:{}, //states, run, die, attack1, attack2, hit
	position:Consts.ground,
	class: Consts.range,
	targetting:[Consts.ground, Consts.air],
	base-dam:{min:1, max:10},
	dam-mod:1,
	speed:4,
	behavior:function(){
		//look for ground attacker to support
		//get behind him at N distance, angle of, follow
		//pick closest enemy or crystal, attack
		//if no ground attacker, pick enemy or crystal, move to range, attack
		//if attacker closer then X, back off
		//if cornered, attack at -7 mod
	},
	points:20
	

}

var redOrcWarrior = {
	defs:{}, //states, run, die, attack1, attack2, hit
	position:Consts.ground,
	class: Consts.flanker,
	targetting:[Consts.ground],
	hp:20,
	dam:{min:1, max:5},
	mod:1,
	speed:2,
	behavior:function(){ //chain these (next() pattern)
		//look for a weaker opponent, b-line + attack
		//else find the crystal
	},
	points:2
}

var blueOrcWarrior = {
	defs:{}, //states, run, die, attack1, attack2, hit
	position:Consts.ground,
	class: Consts.flanker,
	targetting:[Consts.ground],
	hp:20,
	dam:{min:1, max:5},
	mod:1,
	speed:2,
	behavior:function(){
		//look for support character, or range and attack
		//else find the crystal
	},
	points:1

}


var orgeHitter = {
	defs:{}, //states, run, die, attack1, attack2, hit
	position:Consts.ground,
	class: Consts.tank,
	targetting:[Consts.ground],
	hp:40,
	dam:{min:3, max:10},
	mod:2,
	speed:.5,
	behavior:function(){
		//hates trolls, go after them without hestitation
		//look for the strongest enemy opponent on the screen and attack them
		//else find the crystal
	},
	points:65
}

var trollCurer = {
	defs:{}, //states, run, die, attack1, attack2, hit
	position:Consts.ground,
	class: Consts.support,
	targetting:[Consts.ground],
	hp:5,
	dam:{min:1, max:2},
	power:{min:1, max:5},
	speed:2,
	behavior:function(){
		//look for any attacker to support, pick angle stay back
		//scan for damaged guys, go to them heal
		//if no dam, stay back, scan
		//if team is dead, find the crystal or enemy and attack
	},
	points:20
}

var trollPoisoner = { //extend trollCurer, then override
	dam:{min:2, max:4}
	power:{
		min:1,
		max:2,
		type:'poison',
		pulse:.1,
		effect:effectClass
	}
	speed:3,
	behavior:function(){
		//pick aggressive char to support
		//shadow (set distance and angle)
		//flank and poison - poison does damage
	},
	points:10
}
	
var demonBeserker = {
	defs:{}, //states, run, die, attack1, attack2, hit
	position:Consts.ground,
	class: Consts.beserker,
	targetting:[Consts.ground],
	base-hp:100,
	base-dam:25,
	behavior:function(){
		//attack anything close, save for player crystal.
		//if none, attack enemy crystal
	},
	points:50	
}



//evolve table?
//level
