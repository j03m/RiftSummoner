var spriteDefs = {
	"dragon": {
		"name": "dragon",
		"parentOnly": true,
		"byStep": 3,
		"startFrame": 1,
		"endFrame": 780,
		"targetRadius": 100,
		"step": 1,
		"animations": {
			"move": {
				"start": 178,
				"end": 188,
				"delay": 0.1,
				"type": 0
			},
			"attack": {
				"start": 206,
				"end": 230,
				"delay": 0.1,
				"type": 1
			},
			"dead": {
				"start": 242,
				"end": 255,
				"delay": 0.1,
				"type": 1
			},
			"idle": {
				"start": 178,
				"end": 188,
				"delay": 0.1,
				"type": 0
			}
		},
		"behavior": "range"
	},
	"dragonFire": {
		"name": "dragonFire",
		"formalName": "Fire Dragon",
		"details": "These small dragons are aerial terrors doing massive damage to ground units below but they have a difficulty targeting other air born units. Fire Dragons do additional burning damage after each attack and splash damage to units around it. ",
		"elementType": "fire",
		"unitType": 2,
		"damageMods": {
			"splashDamage": {
				"damage": 50,
				"radius": 100
			},
			"burn": {
				"damage": 10,
				"duration": 5,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 150,
			"damage": 250,
			"missile": "fireball",
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"flightAug": {
				"x": 25,
				"y": 100
			},
			"missleTarget": "base",
			"movementType": 0,
			"targets": 1,
			"actionDelays": {
				"attack": 5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 100,
			"seekRadius": 25
		},
		"inherit": "dragon"
	},
	"dragonVoid": {
		"name": "dragonVoid",
		"formalName": "Void Dragon",
		"details": "These small dragons are aerial terrors doing massive damage to ground units below but they have a difficulty targeting other air born units.",
		"elementType": "void",
		"unitType": 1,
		"special": "None",
		"gameProperties": {
			"MaxHP": 700,
			"speed": 250,
			"movementType": 0,
			"missile": "greenbullet",
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"missleTarget": "base",
			"targets": 1,
			"damage": 300,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 100,
			"seekRadius": 25
		},
		"inherit": "dragon"
	},
	"dwarvenKnight": {
		"name": "dwarvenKnight",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 70,
				"end": 93,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 100,
				"end": 145,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 140,
				"end": 180,
				"delay": 0.025,
				"type": 1
			},
			"attack3": {
				"start": 180,
				"end": 250,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 60,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 300,
				"end": 370,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"dwarvenKnightEarth": {
		"name": "dwarvenKnightEarth",
		"formalName": "Dwarven Knight - Earth",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with earth magic, this dwarf has additional health.",
		"elementType": "earth",
		"unitType": 3,
		"gameProperties": {
			"MaxHP": 1300,
			"speed": 50,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightFire": {
		"name": "dwarvenKnightFire",
		"formalName": "Dwarven Knight - Fire",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with fire magic, this dwarf is immune completely immune to fire and explosive based attacks.",
		"elementType": "fire",
		"unitType": 3,
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"defense": {
				"fire": 100
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightLife": {
		"name": "dwarvenKnightLife",
		"formalName": "Dwarven Knight - Life",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with life magic, this dwarf is immune to poison.",
		"elementType": "life",
		"unitType": 3,
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"damage": 25,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"life": 100
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightVoid": {
		"name": "dwarvenKnightVoid",
		"formalName": "Dwarven Knight - Void",
		"details": "Dwarven Knights are known for being very difficult to kill. His armor embued with void magic, this dwarf is immune to vampiric powers and has its own.",
		"elementType": "void",
		"unitType": 3,
		"damageMods": {
			"vampireDrain": {
				"heal": 20,
				"damage": 20
			}
		},
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"damage": 35,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"void": 100
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightWater": {
		"name": "dwarvenKnightWater",
		"formalName": "Dwarven Knight - Water",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with water magic, this dwarf regenerates.",
		"elementType": "water",
		"unitType": 3,
		"powers": {
			"regeneration": {
				"heal": 30,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"damage": 25,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"elemental1": {
		"name": "elemental1",
		"byStep": 2,
		"startFrame": 1,
		"endFrame": 550,
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 41,
				"end": 65,
				"delay": 0.08,
				"type": 0
			},
			"attack": {
				"start": 71,
				"end": 92,
				"delay": 0.08,
				"type": 1
			},
			"attack2": {
				"start": 101,
				"end": 125,
				"delay": 0.08,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 37,
				"delay": 0.08,
				"type": 0
			},
			"dead": {
				"start": 131,
				"end": 152,
				"delay": 0.08,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"elemental2": {
		"name": "elemental2",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 91,
				"end": 126,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 131,
				"end": 190,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 75,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 271,
				"end": 330,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"elementalEarth": {
		"name": "elementalEarth",
		"formalName": "Stone Elemental",
		"details": "Extraordinarily powerful, but slow moving.",
		"elementType": "earth",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 1700,
			"speed": 20,
			"damage": 100,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "elemental1"
	},
	"elementalFire": {
		"name": "elementalFire",
		"formalName": "Fire Elemental",
		"details": "Extraordinarily powerful, but slow moving. Heavy additional burn damage inflicted.",
		"elementType": "fire",
		"unitType": 3,
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 600,
			"speed": 20,
			"damage": 250,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "elemental1"
	},
	"elementalWater": {
		"name": "elementalWater",
		"formalName": "Water Elemental",
		"details": "Fast elemental creatures that fire at range. Water elementals have regenerative abilities.",
		"elementType": "water",
		"unitType": 3,
		"special": "None",
		"powers": {
			"regeneration": {
				"heal": 30,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 50,
			"damage": 75,
			"movementType": 1,
			"targets": 2,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 250,
			"seekRadius": 25
		},
		"inherit": "elemental2"
	},
	"elementalWind": {
		"name": "elementalWind",
		"formalName": "Wind Elemental",
		"details": "Fast elemental creatures that fire at range. Wind elementals have knock back capability.",
		"elementType": "air",
		"unitType": 3,
		"damageMods": {
			"knockBack": {
				"distance": 15
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 50,
			"damage": 50,
			"movementType": 1,
			"targets": 2,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 250,
			"seekRadius": 25
		},
		"inherit": "elemental2"
	},
	"elf": {
		"name": "elf",
		"parentOnly": true,
		"targetRadius": 600,
		"byStep": 3,
		"startFrame": 1,
		"endFrame": 1820,
		"animations": {
			"move": {
				"start": 244,
				"end": 251,
				"delay": 0.08,
				"type": 0
			},
			"attack": {
				"start": 454,
				"end": 471,
				"delay": 0.08,
				"type": 1
			},
			"idle": {
				"start": 422,
				"end": 432,
				"delay": 0.08,
				"type": 0
			},
			"dead": {
				"start": 287,
				"end": 298,
				"delay": 0.08,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"elfEarth": {
		"name": "elfEarth",
		"formalName": "Plains Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Plains Elves are heartier and faster then their other elven cousins.",
		"elementType": "earth",
		"unitType": 4,
		"special": "None",
		"gameProperties": {
			"MaxHP": 300,
			"movementType": 1,
			"targets": 2,
			"damage": 35,
			"speed": 85,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600
		},
		"inherit": "elf"
	},
	"elfFire": {
		"name": "elfFire",
		"formalName": "Fire Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Fire Elves arrows burn their targets alive.",
		"elementType": "earth",
		"unitType": 4,
		"special": "None",
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 100,
			"movementType": 1,
			"targets": 2,
			"damage": 35,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600
		},
		"inherit": "elf"
	},
	"elfLife": {
		"name": "elfLife",
		"formalName": "Forest Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Forest Elves deal poison damage with each arrow.",
		"elementType": "life",
		"unitType": 4,
		"damageMods": {
			"poison": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 100,
			"damage": 25,
			"movementType": 1,
			"targets": 2,
			"missile": "greenbullet",
			"poisonDamage": 10,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600,
			"seekRadius": 25
		},
		"inherit": "elf"
	},
	"elfVoid": {
		"name": "elfVoid",
		"formalName": "Dark Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Touched with Void magic, Dark Elves have the magic arrows that steal life from targets and give it to allies.",
		"elementType": "void",
		"unitType": 4,
		"damageMods": {
			"vampireDistro": {
				"heal": 20,
				"damage": 20
			}
		},
		"gameProperties": {
			"MaxHP": 200,
			"damage": 45,
			"movementType": 1,
			"targets": 2,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600
		},
		"inherit": "elf"
	},
	"gargoyle": {
		"name": "gargoyle",
		"parentOnly": true,
		"byStep": 3,
		"startFrame": 1,
		"endFrame": 787,
		"flip": true,
		"animations": {
			"move": {
				"start": 1,
				"end": 8,
				"delay": 0.08,
				"type": 0
			},
			"attack": {
				"start": 34,
				"end": 49,
				"delay": 0.08,
				"type": 1
			},
			"dead": {
				"start": 58,
				"end": 73,
				"delay": 0.08,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 8,
				"delay": 0.08,
				"type": 0
			}
		},
		"behavior": "range"
	},
	"gargoyleFire": {
		"name": "gargoyleFire",
		"formalName": "Fire Demon",
		"details": "An winged creature embued with elemental fire. It possesses magic that it uses to destroy other air targets.",
		"elementType": "fire",
		"unitType": 0,
		"special": "Splash Damage, Burn Damage",
		"damageMods": {
			"burn": {
				"damage": 5,
				"duration": 1,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 200,
			"speed": 100,
			"movementType": 0,
			"targets": 2,
			"damage": 100,
			"missile": "greenbullet",
			"splashDamage": 5,
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.01
			},
			"flightAug": {
				"x": 25,
				"y": 100
			},
			"targetRadius": 25
		},
		"inherit": "gargoyle"
	},
	"gargoyleVoid": {
		"name": "gargoyleVoid",
		"formalName": "Void Demon",
		"details": "An winged creature embued with elemental fire. It possesses magic that it uses to destroy other air targets.",
		"elementType": "void",
		"special": "None",
		"gameProperties": {
			"MaxHP": 200,
			"movementType": 0,
			"targets": 2,
			"speed": 100,
			"damage": 100,
			"missile": "greenbullet",
			"vsAirDamage": 5,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"flightAug": {
				"x": 25,
				"y": 100
			},
			"targetRadius": 25,
			"seekRadius": 25
		},
		"inherit": "gargoyle"
	},
	"goblin": {
		"name": "goblin",
		"cardIndex": 0,
		"portraitXy": {
			"x": 181,
			"y": 72
		},
		"formalName": "Goblin Demolition Expert",
		"details": "Goblin demolition experts hurl explosives at enemies. While they don't have an impressive range, they can inflict massive damage on groups of ground enemies at a time.",
		"elementType": "fire",
		"unitType": 3,
		"flip": true,
		"special": "Splash Damage",
		"damageMods": {
			"splashDamage": {
				"damage": 25,
				"radius": 50
			},
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"deathMods": {
			"explodeFire": {
				"damage": 25,
				"radius": 50,
				"burn": {
					"damage": 50,
					"duration": 5,
					"interval": 0.5
				}
			}
		},
		"gameProperties": {
			"MaxHP": 50,
			"movementType": 1,
			"targets": 1,
			"missile": "greenbullet",
			"damage": 80,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 75
		},
		"animations": {
			"move": {
				"start": 80,
				"end": 90,
				"delay": 0.03,
				"type": 0
			},
			"attack": {
				"start": 315,
				"end": 353,
				"delay": 0.03,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 60,
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 450,
				"end": 550,
				"delay": 0.01,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"goblinKnight": {
		"name": "goblinKnight",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 70,
				"end": 93,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 100,
				"end": 145,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 140,
				"end": 180,
				"delay": 0.025,
				"type": 1
			},
			"attack3": {
				"start": 180,
				"end": 250,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 60,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 300,
				"end": 370,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"goblinKnightBile": {
		"name": "goblinKnightBile",
		"formalName": "Goblin Knight - Plains",
		"details": "Goblin Knights are fast and do reasonable damage. Plains goblins are incredibly fast runners.",
		"elementType": "none",
		"unitType": 3,
		"special": "Burn Damage",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 120,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightBlood": {
		"name": "goblinKnightBlood",
		"cardIndex": 0,
		"portraitXy": {
			"x": 186,
			"y": 265
		},
		"formalName": "Goblin Knight - Blood",
		"details": "Goblin Knights are fast and do reasonable damage. These blood goblins are tougher, faster then their cousins.",
		"elementType": "none",
		"unitType": 3,
		"special": "Burn Damage",
		"gameProperties": {
			"MaxHP": 500,
			"speed": 80,
			"movementType": 1,
			"targets": 1,
			"damage": 35,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightFire": {
		"name": "goblinKnightFire",
		"formalName": "Goblin Knight - Fire",
		"details": "Goblin Knights are fast and do reasonable damage. These fire goblins live near magma in deep caves are resist burning damage.",
		"elementType": "fire",
		"unitType": 3,
		"special": "Resist Fire",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 80,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"fire": 100
			},
			"damage": 35,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightNormal": {
		"name": "goblinKnightNormal",
		"formalName": "Goblin Knight",
		"details": "Goblin Knights are fast and do reasonable damage..",
		"elementType": "none",
		"unitType": 3,
		"special": "Resist Fire",
		"gameProperties": {
			"MaxHP": 250,
			"speed": 70,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"knight": {
		"name": "knight",
		"parentOnly": true,
		"targetRadius": 200,
		"startFrame": 1,
		"endFrame": 2050,
		"flip": true,
		"byStep": 3,
		"animations": {
			"move": {
				"start": 4,
				"end": 27,
				"delay": 0.08,
				"type": 0
			},
			"attack": {
				"start": 144,
				"end": 174,
				"delay": 0.08,
				"type": 1
			},
			"attack2": {
				"start": 174,
				"end": 206,
				"delay": 0.08,
				"type": 1
			},
			"dead": {
				"start": 387,
				"end": 419,
				"delay": 0.08,
				"type": 1
			},
			"idle": {
				"start": 461,
				"end": 486,
				"delay": 0.08,
				"type": 0
			}
		},
		"behavior": "tank"
	},
	"knightEarth": {
		"name": "knightEarth",
		"formalName": "Elemental Knight - Earth",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of earth, this unit has almost 2x the health of other elemental knights.",
		"elementType": "earth",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 20,
			"damage": 160,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 25
		},
		"inherit": "knight"
	},
	"knightFire": {
		"name": "knightFire",
		"formalName": "Elemental Knight - Fire",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of fire, this unit deals additional burn damage to its targets.",
		"elementType": "fire",
		"unitType": 3,
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"damage": 160,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "knight"
	},
	"knightVoid": {
		"name": "knightVoid",
		"formalName": "Elemental Knight - Void",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of the void, this unit saps life from nearby enemies, healing itself.",
		"elementType": "void",
		"unitType": 3,
		"effect": "blueRadius",
		"powers": {
			"vampireRadius": {
				"damage": 20,
				"radius": 100,
				"interval": 1
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"movementType": 1,
			"targets": 1,
			"damage": 160,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 25
		},
		"inherit": "knight"
	},
	"knightWater": {
		"name": "knightWaters",
		"formalName": "Elemental Knight - Water",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of water, this unit also heals any units nearby.",
		"elementType": "water",
		"unitType": 3,
		"effect": "blueRadius",
		"gameProperties": {
			"MaxHP": 500,
			"movementType": 1,
			"targets": 1,
			"speed": 20,
			"damage": 160,
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25,
			"heal": 30
		},
		"powers": {
			"healingRadius": {
				"heal": 20,
				"interval": 2,
				"radius": 200
			}
		},
		"inherit": "knight"
	},
	"monsterbase": {
		"name": "monsterbase",
		"parentOnly": true,
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 145,
				"end": 167,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 24,
				"delay": 0.02,
				"type": 1
			},
			"attack2": {
				"start": 25,
				"end": 48,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 121,
				"end": 137,
				"delay": 0.02,
				"type": 0
			},
			"damage": {
				"start": 49,
				"end": 60,
				"delay": 0.02,
				"type": 1
			},
			"dead": {
				"start": 72,
				"end": 120,
				"delay": 0.02,
				"type": 1
			}
		}
	},
	"ogre": {
		"name": "ogre",
		"formalName": "Ogre",
		"byStep": 2,
		"flip": true,
		"cardIndex": 0,
		"portraitXy": {
			"x": 241,
			"y": 122
		},
		"details": "Ogre are massive, powerful creatures. Though they are slow movers, you do not want to be at the wrong end of their weapons.",
		"elementType": 4,
		"unitType": 3,
		"special": "None",
		"targetRadius": 75,
		"startFrame": 1,
		"endFrame": 204,
		"gameProperties": {
			"movementType": 1,
			"targets": 1,
			"MaxHP": 1500,
			"speed": 15,
			"damage": 200,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.9
			},
			"targetRadius": 30
		},
		"animations": {
			"move": {
				"start": 50,
				"end": 72,
				"delay": 0.06,
				"type": 0
			},
			"attack": {
				"start": 74,
				"end": 115,
				"delay": 0.04,
				"type": 1
			},
			"attack2": {
				"start": 122,
				"end": 151,
				"delay": 0.04,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 35,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 169,
				"end": 203,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"orc": {
		"name": "orc",
		"flip": true,
		"formalName": "Orc Warrior",
		"details": "Orcs are fast, fierce attackers. What they lack in heavy armor, they make up for in pure tenacity.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 400,
			"speed": 55,
			"movementType": 1,
			"targets": 1,
			"damage": 50,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 30
		},
		"baseOffset": {
			"x": -20,
			"y": -5
		},
		"byStep": 1,
		"animations": {
			"move": {
				"start": 18,
				"end": 41,
				"delay": 0.04,
				"type": 0
			},
			"attack": {
				"start": 42,
				"end": 64,
				"delay": 0.03,
				"type": 1
			},
			"attack2": {
				"start": 66,
				"end": 90,
				"delay": 0.03,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 12,
				"delay": 0.04,
				"type": 0
			},
			"damage": {
				"start": 103,
				"end": 135,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.04,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"scowerer": {
		"name": "scowerer",
		"formalName": "Void Scavenger",
		"details": "Weak, dog-like creatures that quickly attack the weakest target they can find. When killed the scowerer will burst a poison acid on anyone nearby.",
		"elementType": "life",
		"unitType": 3,
		"flip": true,
		"special": "None",
		"deathMods": {
			"explodePoison": {
				"damage": 100,
				"radius": 75,
				"poison": {
					"damage": 50,
					"duration": 5,
					"interval": 0.5
				}
			}
		},
		"gameProperties": {
			"MaxHP": 10,
			"movementType": 1,
			"targets": 1,
			"speed": 200,
			"damage": 25,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 20
		},
		"animations": {
			"move": {
				"start": 170,
				"end": 190,
				"delay": 0.03,
				"type": 0
			},
			"attack": {
				"start": 245,
				"end": 320,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 1,
				"delay": 0.03,
				"type": 0
			},
			"dead": {
				"start": 460,
				"end": 560,
				"delay": 0.03,
				"type": 1
			}
		},
		"behavior": "flanker"
	},
	"shellback": {
		"name": "shellback",
		"formalName": "Shellback Raider",
		"details": "Heavily armored and fast, shellbacks are mindless attack animals. This one is trained to lock onto and kill weaker archers and healers.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 250,
			"movementType": 1,
			"targets": 1,
			"speed": 200,
			"damage": 25,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 20
		},
		"animations": {
			"move": {
				"start": 70,
				"end": 88,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 198,
				"end": 249,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 91,
				"end": 151,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 283,
				"end": 340,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "flanker"
	},
	"snakeThing": {
		"name": "snakeThing",
		"formalName": "Serpent Guardian",
		"details": "Heavily armored and fast, serpent guardians were once summoned to the defense of powerful mages. When summoned, the guardian will attach itself to a range or support unit and guard it until death.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 150,
			"speed": 80,
			"movementType": 1,
			"targets": 1,
			"damage": 45,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 20,
			"seekRadius": 150
		},
		"animations": {
			"move": {
				"start": 53,
				"end": 84,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 90,
				"end": 150,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 10,
				"end": 45,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 275,
				"end": 315,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "defender"
	},
	"spider": {
		"name": "spider",
		"formalName": "Arachnon Guardian",
		"details": "These guardians will choose and defend a target to death dealing heavy damage from their bladed legs and injecting enemies with poison. They do not however, have much armor and are easily killed.",
		"elementType": "life",
		"unitType": 3,
		"flip": true,
		"special": "Poison",
		"damageMods": {
			"poison": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 100,
			"speed": 200,
			"movementType": 1,
			"targets": 1,
			"damage": 55,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 20,
			"seekRadius": 150
		},
		"animations": {
			"move": {
				"start": 164,
				"end": 189,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 192,
				"end": 221,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 32,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 332,
				"end": 400,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "defender"
	},
	"troll": {
		"name": "troll",
		"formalName": "Goblin Cleric",
		"details": "These small goblins are expert in healing magic. They will stay back, supporting your warriors and healing them in battle.",
		"elementType": "none",
		"unitType": 3,
		"special": "Healing",
		"gameProperties": {
			"MaxHP": 100,
			"speed": 100,
			"movementType": 1,
			"targets": 2,
			"damage": 10,
			"heal": 50,
			"actionDelays": {
				"attack": 0.5,
				"heal": 0.5
			},
			"effectDelays": {
				"attack": 0.05,
				"heal": 0.05
			},
			"targetRadius": 25
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"byStep": 1,
		"animations": {
			"move": {
				"start": 25,
				"end": 49,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 50,
				"end": 71,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 109,
				"end": 145,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "healer"
	},
	"wizard": {
		"name": "wizard",
		"formalName": "Goblin Wizard",
		"details": "These goblins are masters of destructive magic and can do serious damage at an impressive range.",
		"elementType": "none",
		"unitType": 4,
		"special": "None",
		"gameProperties": {
			"MaxHP": 100,
			"movementType": 1,
			"targets": 2,
			"speed": 50,
			"damage": 50,
			"missile": "greenbullet",
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 400
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"animations": {
			"move": {
				"start": 26,
				"end": 48,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 49,
				"end": 72,
				"delay": 0.05,
				"type": 1
			},
			"attack2": {
				"start": 73,
				"end": 97,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 110,
				"end": 155,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "range"
	}
}