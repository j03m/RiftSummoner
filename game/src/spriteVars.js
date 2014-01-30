var spriteDefs = {
	"dragon": {
		"name": "dragon",
		"parentOnly": true,
		"byStep": 3,
		"startFrame": 1,
		"endFrame": 780,
		"targetRadius": 50,
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
		"details": "These small dragons are aerial terrors that do massive damage to the ground units below them. However, they have a difficulty targeting other air born units. Fire Dragons inflict additional burn damage to targets and splash damage to surrounding units.",
		"elementType": "fire",
		"unitType": 2,
		"damageMods": {
			"splashDamage": {
				"damage": 100,
				"radius": 200
			},
			"burn": {
				"damage": 25,
				"duration": 1,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 10000,
			"speed": 400,
			"damage": 1000,
			"missile": "ballFire",
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
			"targetRadius": 200,
			"seekRadius": 50
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
		"damageMods": {
			"splashDamage": {
				"damage": 100,
				"radius": 200
			},
			"vampireDistro": {
				"heal": 10,
				"damage": 25
			}
		},
		"gameProperties": {
			"MaxHP": 5000,
			"speed": 500,
			"movementType": 0,
			"missile": "ballVoid",
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"missleTarget": "base",
			"targets": 1,
			"damage": 1000,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 200,
			"seekRadius": 50
		},
		"inherit": "dragon"
	},
	"dwarvenKnight": {
		"name": "dwarvenKnight",
		"parentOnly": true,
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
			"special": {
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
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with earth magic these dwarves are particularly hard to kill.",
		"elementType": "earth",
		"unitType": 3,
		"creep": true,
		"number": 5,
		"gameProperties": {
			"MaxHP": 1500,
			"speed": 150,
			"movementType": 1,
			"targets": 1,
			"damage": 60,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightFire": {
		"name": "dwarvenKnightFire",
		"formalName": "Dwarven Knight - Fire",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with fire magic, this dwarf is completely immune to fire element attackers.",
		"elementType": "fire",
		"unitType": 3,
		"creep": true,
		"number": 5,
		"gameProperties": {
			"MaxHP": 1300,
			"speed": 150,
			"movementType": 1,
			"targets": 1,
			"damage": 60,
			"defense": {
				"fire": 90
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightLife": {
		"name": "dwarvenKnightLife",
		"formalName": "Dwarven Knight - Life",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with life magic, this dwarf is immune to poison and life based attackers.",
		"elementType": "life",
		"unitType": 3,
		"creep": true,
		"number": 5,
		"gameProperties": {
			"MaxHP": 1300,
			"speed": 150,
			"damage": 60,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"life": 90
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightVoid": {
		"name": "dwarvenKnightVoid",
		"formalName": "Dwarven Knight - Void",
		"details": "Dwarven Knights are known for being very difficult to kill. His armor embued with void magic, this dwarf is immune to void powers and drains the life of his targets.",
		"elementType": "void",
		"unitType": 3,
		"creep": true,
		"number": 5,
		"damageMods": {
			"vampireDrain": {
				"heal": 10,
				"damage": 10
			}
		},
		"gameProperties": {
			"MaxHP": 1200,
			"speed": 150,
			"damage": 50,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"void": 90
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightWater": {
		"name": "dwarvenKnightWater",
		"formalName": "Dwarven Knight - Water",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with water magic, this dwarf regenerates health over time.",
		"elementType": "water",
		"unitType": 3,
		"creep": true,
		"number": 5,
		"powers": {
			"regeneration": {
				"heal": 20,
				"interval": 0.35
			}
		},
		"gameProperties": {
			"MaxHP": 1200,
			"speed": 150,
			"damage": 60,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "dwarvenKnight"
	},
	"elemental1": {
		"name": "elemental1",
		"byStep": 2,
		"startFrame": 1,
		"endFrame": 550,
		"parentOnly": true,
		"animations": {
			"move": {
				"start": 41,
				"end": 65,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 71,
				"end": 92,
				"delay": 0.07,
				"type": 1
			},
			"attack2": {
				"start": 101,
				"end": 125,
				"delay": 0.07,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 37,
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 131,
				"end": 152,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"elemental2": {
		"name": "elemental2",
		"parentOnly": true,
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
			"MaxHP": 18000,
			"speed": 120,
			"damage": 500,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "elemental1"
	},
	"elementalFire": {
		"name": "elementalFire",
		"formalName": "Fire Elemental",
		"details": "Extraordinarily powerful, but slow moving. These elementals inflict additional burn damage.",
		"elementType": "fire",
		"unitType": 3,
		"multisheet-ipadhd": 2,
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 1,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 16000,
			"speed": 120,
			"damage": 700,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "elemental1"
	},
	"elementalWater": {
		"name": "elementalWater",
		"formalName": "Water Elemental",
		"details": "Fast elemental creatures that fire at range. Water elementals also have regenerative abilities.",
		"elementType": "water",
		"unitType": 3,
		"multisheet-ipadhd": 2,
		"special": "None",
		"powers": {
			"regeneration": {
				"heal": 20,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 6000,
			"speed": 250,
			"damage": 250,
			"movementType": 1,
			"targets": 2,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600,
			"seekRadius": 100
		},
		"inherit": "elemental2"
	},
	"elementalWind": {
		"name": "elementalWind",
		"formalName": "Wind Elemental",
		"details": "Fast elemental creatures that fire at range. Wind elementals have knock back capability.",
		"elementType": "air",
		"unitType": 3,
		"multisheet-ipadhd": 2,
		"damageMods": {
			"knockBack": {
				"distance": 250
			}
		},
		"gameProperties": {
			"MaxHP": 6000,
			"speed": 250,
			"damage": 250,
			"movementType": 1,
			"targets": 2,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600,
			"seekRadius": 100
		},
		"inherit": "elemental2"
	},
	"elf": {
		"name": "elf",
		"parentOnly": true,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 26,
				"end": 49,
				"delay": 0.04,
				"type": 0
			},
			"attack": {
				"start": 52,
				"end": 80,
				"delay": 0.04,
				"type": 1
			},
			"attackClose": {
				"start": 82,
				"end": 115,
				"delay": 0.04,
				"type": 1
			},
			"special": {
				"start": 118,
				"end": 149,
				"delay": 0.04,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 161,
				"end": 176,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"elfArcherEarth": {
		"name": "elfArcherEarth",
		"formalName": "Plains Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Plains Elves are heartier and faster then their other elven cousins.",
		"elementType": "earth",
		"flip": true,
		"unitType": 4,
		"special": "None",
		"gameProperties": {
			"MaxHP": 7000,
			"resistsRange": 50,
			"movementType": 1,
			"targets": 2,
			"missile": "arrowNormal",
			"damage": 500,
			"speed": 350,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.7
			},
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"targetRadius": 2400
		},
		"inherit": "elf"
	},
	"elfArcherFire": {
		"name": "elfArcherFire",
		"formalName": "Fire Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. These elves have arrows that burn their targets alive.",
		"elementType": "earth",
		"flip": true,
		"unitType": 4,
		"special": "None",
		"damageMods": {
			"burn": {
				"damage": 200,
				"duration": 5,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 4000,
			"movementType": 1,
			"targets": 2,
			"missile": "arrowFire",
			"damage": 250,
			"speed": 300,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.7
			},
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"targetRadius": 2400
		},
		"inherit": "elf"
	},
	"elfArcherLife": {
		"name": "elfArcherLife",
		"formalName": "Forest Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Forest Elves deal poison damage with each arrow.",
		"elementType": "life",
		"flip": true,
		"unitType": 4,
		"damageMods": {
			"poison": {
				"damage": 200,
				"duration": 5,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 4000,
			"damage": 25,
			"movementType": 1,
			"targets": 2,
			"missile": "arrowPoison",
			"poisonDamage": 10,
			"speed": 300,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.7
			},
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"targetRadius": 2400
		},
		"inherit": "elf"
	},
	"elfArcherVoid": {
		"name": "elfArcherVoid",
		"formalName": "Dark Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Touched with Void magic, Dark Elves have the magic arrows that steal life from targets and give it to all allies on the board.",
		"elementType": "void",
		"flip": true,
		"unitType": 4,
		"damageMods": {
			"vampireDistro": {
				"heal": 50,
				"damage": 50
			}
		},
		"gameProperties": {
			"MaxHP": 2000,
			"damage": 250,
			"movementType": 1,
			"missile": "arrowVoid",
			"targets": 2,
			"speed": 300,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.7
			},
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"targetRadius": 2400
		},
		"inherit": "elf"
	},
	"elfAssassin": {
		"name": "elfAssassin",
		"formalName": "Elvish Assassin",
		"details": "Elvish Assassin's are mixed units, capable of impressive melee and short ranged attacks with her side arm.",
		"elementType": "none",
		"unitType": 3,
		"cardIndex": 1,
		"gameProperties": {
			"MaxHP": 7500,
			"speed": 450,
			"movementType": 1,
			"targets": 2,
			"damage": 500,
			"spdamage": 1000,
			"resistsRange": 80,
			"actionDelays": {
				"attack": 0
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 300,
			"closeRadius": 100
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"byStep": 1,
		"behavior": "switch",
		"inherit": "femaleSorcerer"
	},
	"femaleSorcerer": {
		"name": "femaleSorcerer",
		"parentOnly": true,
		"flip": true,
		"byStep": 3,
		"animations": {
			"move": {
				"start": 26,
				"end": 49,
				"delay": 0.03,
				"type": 0
			},
			"attack": {
				"start": 51,
				"end": 80,
				"delay": 0.03,
				"type": 1
			},
			"attack2": {
				"start": 82,
				"end": 115,
				"delay": 0.03,
				"type": 1
			},
			"special": {
				"start": 116,
				"end": 149,
				"delay": 0.03,
				"type": 1
			},
			"dead": {
				"start": 161,
				"end": 176,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.04,
				"type": 0
			}
		}
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
		"details": "An winged creature embued with elemental fire. It possesses magic that it uses to attack other air or ground targets. Fire demons inflict additional burn damage to enemies.",
		"elementType": "fire",
		"unitType": 0,
		"creep": true,
		"number": 5,
		"special": "Splash Damage, Burn Damage",
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 1,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 300,
			"movementType": 0,
			"targets": 2,
			"damage": 50,
			"resistsRange": 25,
			"missile": "magicFire",
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
			"targetRadius": 200
		},
		"inherit": "gargoyle"
	},
	"gargoyleVoid": {
		"name": "gargoyleVoid",
		"formalName": "Void Demon",
		"details": "An winged creature embued with the void. It possesses magic that it uses to destroy other air or ground targets.",
		"elementType": "void",
		"special": "None",
		"creep": true,
		"number": 5,
		"gameProperties": {
			"MaxHP": 1000,
			"movementType": 0,
			"targets": 2,
			"speed": 300,
			"damage": 75,
			"missile": "magicVoid",
			"resistsRange": 25,
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
			"targetRadius": 200,
			"seekRadius": 200
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
		"details": "Goblin demolition experts hurl explosives at enemies. While they don't have an impressive range, they can inflict massive damage on groups of ground enemies.",
		"elementType": "fire",
		"unitType": 3,
		"flip": true,
		"special": "Splash Damage",
		"damageMods": {
			"splashDamage": {
				"damage": 200,
				"radius": 200
			}
		},
		"deathMods": {
			"explodeFire": {
				"damage": 200,
				"radius": 200,
				"burn": {
					"damage": 50,
					"duration": 5,
					"interval": 0.5
				}
			}
		},
		"gameProperties": {
			"MaxHP": 2500,
			"movementType": 1,
			"targets": 1,
			"missile": "bomb",
			"damage": 750,
			"speed": 200,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 600
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
			"special": {
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
		"creep": true,
		"number": 7,
		"unitType": 3,
		"special": "Burn Damage",
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 340,
			"movementType": 1,
			"targets": 1,
			"resistsRange": 50,
			"damage": 50,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
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
		"creep": true,
		"number": 7,
		"unitType": 3,
		"special": "Burn Damage",
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 180,
			"movementType": 1,
			"targets": 1,
			"damage": 75,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightFire": {
		"name": "goblinKnightFire",
		"formalName": "Goblin Knight - Fire",
		"details": "Goblin Knights are fast and do reasonable damage. These fire goblins live near magma in deep caves and are immune to fire based damage.",
		"elementType": "fire",
		"creep": true,
		"number": 7,
		"unitType": 3,
		"special": "Resist Fire",
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 200,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"fire": 90
			},
			"damage": 50,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightNormal": {
		"name": "goblinKnightNormal",
		"formalName": "Goblin Knight",
		"details": "Goblin Knights are fast and do reasonable damage.",
		"elementType": "none",
		"notplayable": 1,
		"unitType": 3,
		"creep": true,
		"special": "Resist Fire",
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 150,
			"movementType": 1,
			"targets": 1,
			"damage": 50,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "goblinKnight"
	},
	"knight": {
		"name": "knight",
		"parentOnly": true,
		"startFrame": 1,
		"endFrame": 2050,
		"flip": true,
		"byStep": 3,
		"animations": {
			"move": {
				"start": 4,
				"end": 27,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 144,
				"end": 174,
				"delay": 0.06,
				"type": 1
			},
			"attack2": {
				"start": 174,
				"end": 206,
				"delay": 0.06,
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
		"multisheet-ipadhd": 2,
		"special": "None",
		"gameProperties": {
			"MaxHP": 16000,
			"speed": 120,
			"damage": 1000,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "knight"
	},
	"knightFire": {
		"name": "knightFire",
		"formalName": "Elemental Knight - Fire",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of fire, this unit deals additional burn damage to its targets.",
		"elementType": "fire",
		"unitType": 3,
		"multisheet-ipadhd": 2,
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 13000,
			"speed": 120,
			"damage": 1000,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 50,
			"seekRadius": 100
		},
		"inherit": "knight"
	},
	"knightVoid": {
		"name": "knightVoid",
		"formalName": "Elemental Knight - Void",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of the void, this unit saps life from nearby enemies, healing itself.",
		"elementType": "void",
		"unitType": 3,
		"multisheet-ipadhd": 2,
		"effect": "voidFire",
		"powers": {
			"vampireRadius": {
				"damage": 50,
				"radius": 200,
				"interval": 1
			}
		},
		"gameProperties": {
			"MaxHP": 12000,
			"speed": 120,
			"movementType": 1,
			"targets": 1,
			"damage": 1000,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 0,
			"seekRadius": 100
		},
		"inherit": "knight"
	},
	"knightWater": {
		"name": "knightWater",
		"formalName": "Elemental Knight - Water",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of water, this unit also heals any units nearby.",
		"elementType": "water",
		"unitType": 3,
		"effect": "healingRadius",
		"multisheet-ipadhd": 2,
		"gameProperties": {
			"MaxHP": 12000,
			"movementType": 1,
			"targets": 1,
			"speed": 175,
			"damage": 1000,
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 100,
			"seekRadius": 100,
			"heal": 60
		},
		"powers": {
			"healingRadius": {
				"heal": 50,
				"interval": 0.25,
				"radius": 300
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
	"necromancer": {
		"name": "necromancer",
		"formalName": "Necromancer",
		"details": "Necromancers are light range units, but will summon back your dead team members as skeleton warriors.",
		"elementType": "void",
		"unitType": 3,
		"special": "Healing",
		"gameProperties": {
			"MaxHP": 4000,
			"speed": 300,
			"movementType": 1,
			"targets": 2,
			"damage": 500,
			"actionDelays": {
				"attack": 0.5,
				"heal": 0.4
			},
			"effectDelays": {
				"attack": 0.05,
				"heal": 0.05
			},
			"targetRadius": 600
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"byStep": 1,
		"inherit": "femaleSorcerer",
		"behavior": "range"
	},
	"nexus": {
		"name": "nexus",
		"formalName": "Nexus",
		"notplayable": 1,
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 20000,
			"speed": 0,
			"movementType": 1,
			"targetRadius": 100
		},
		"byStep": 1,
		"animations": {
			"idle": {
				"start": 1,
				"end": 1,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 1,
				"delay": 0.02,
				"type": 0
			},
			"attack2": {
				"start": 1,
				"end": 1,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 1,
				"end": 1,
				"delay": 0.02,
				"type": 0
			}
		},
		"behavior": "nexus"
	},
	"ogre": {
		"name": "ogre",
		"formalName": "Ogre",
		"byStep": 1,
		"flip": true,
		"cardIndex": 0,
		"portraitXy": {
			"x": 241,
			"y": 122
		},
		"details": "Ogres are massive, powerful creatures. Though they are slow movers, you do not want to be at the wrong end of their weapons.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"targetRadius": 150,
		"startFrame": 1,
		"endFrame": 204,
		"multisheet-ipadhd": 2,
		"multisheet-iphone5": 2,
		"gameProperties": {
			"movementType": 1,
			"targets": 1,
			"MaxHP": 20000,
			"speed": 120,
			"damage": 2000,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.9
			},
			"targetRadius": 60
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
				"end": 48,
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
		"creep": true,
		"number": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 2000,
			"speed": 160,
			"movementType": 1,
			"targets": 1,
			"damage": 100,
			"actionDelays": {
				"attack": 0.25
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 100
		},
		"baseOffset": {
			"x": -20,
			"y": -5
		},
		"byStep": 1,
		"animations": {
			"move": {
				"start": 18,
				"end": 40,
				"delay": 0.04,
				"type": 0
			},
			"attack": {
				"start": 42,
				"end": 63,
				"delay": 0.03,
				"type": 1
			},
			"attack2": {
				"start": 66,
				"end": 89,
				"delay": 0.03,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 17,
				"delay": 0.04,
				"type": 0
			},
			"dead": {
				"start": 102,
				"end": 130,
				"delay": 0.04,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"priestessEarth": {
		"name": "priestessEarth",
		"formalName": "Priestess - Earth",
		"details": "A priestess of the element earth. She will support your warriors with the healing arts.",
		"elementType": "earth",
		"unitType": 3,
		"special": "Healing",
		"gameProperties": {
			"MaxHP": 4000,
			"speed": 200,
			"movementType": 1,
			"targets": 2,
			"damage": 100,
			"heal": 300,
			"actionDelays": {
				"attack": 0.5,
				"heal": 0.25
			},
			"effectDelays": {
				"attack": 0.05,
				"heal": 0.05
			},
			"targetRadius": 300
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"byStep": 1,
		"inherit": "femaleSorcerer",
		"behavior": "healer"
	},
	"scowerer": {
		"name": "scowerer",
		"formalName": "Void Scavenger",
		"details": "Weak, dog-like creatures that are trained to rush archers and healers. When killed the scowerer will burst and a poison acid will cover anyone nearby.",
		"elementType": "life",
		"unitType": 3,
		"creep": true,
		"number": 3,
		"special": "None",
		"deathMods": {
			"explodePoison": {
				"damage": 500,
				"radius": 300,
				"poison": {
					"damage": 50,
					"duration": 5,
					"interval": 0.25
				}
			}
		},
		"gameProperties": {
			"MaxHP": 10,
			"movementType": 1,
			"targets": 1,
			"resistsRange": 80,
			"speed": 500,
			"damage": 10,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 100
		},
		"animations": {
			"move": {
				"start": 11,
				"end": 30,
				"delay": 0.03,
				"type": 0
			},
			"attack": {
				"start": 31,
				"end": 70,
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
				"start": 71,
				"end": 95,
				"delay": 0.03,
				"type": 1
			}
		},
		"behavior": "flanker"
	},
	"shellback": {
		"name": "shellback",
		"formalName": "Shellback Raider",
		"details": "Heavily armored and fast, shellbacks are mindless attack animals trained to lock onto and kill weaker archers and healers.",
		"elementType": "none",
		"unitType": 3,
		"creep": true,
		"number": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 2000,
			"movementType": 1,
			"targets": 1,
			"speed": 450,
			"damage": 50,
			"resistsRange": 100,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 100
		},
		"animations": {
			"move": {
				"start": 72,
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
				"end": 320,
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
			"MaxHP": 10000,
			"speed": 300,
			"movementType": 1,
			"targets": 1,
			"damage": 500,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 50,
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
		"multisheet-ipadhd": 2,
		"multisheet-iphone5": 2,
		"damageMods": {
			"poison": {
				"damage": 50,
				"duration": 5,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 10000,
			"speed": 400,
			"movementType": 1,
			"targets": 1,
			"resistsRange": 50,
			"damage": 750,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 50,
			"seekRadius": 300
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
		"details": "These small trolls are expert in healing magic. They will stay back, supporting your warriors and healing them in battle.",
		"elementType": "none",
		"unitType": 3,
		"special": "Healing",
		"gameProperties": {
			"MaxHP": 6000,
			"speed": 110,
			"movementType": 1,
			"targets": 2,
			"damage": 100,
			"heal": 200,
			"actionDelays": {
				"attack": 0.5,
				"heal": 0.4
			},
			"effectDelays": {
				"attack": 0.05,
				"heal": 0.05
			},
			"targetRadius": 200
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
			"MaxHP": 5000,
			"movementType": 1,
			"targets": 2,
			"speed": 200,
			"damage": 250,
			"missile": "magicNormal",
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 1200
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"animations": {
			"move": {
				"start": 26,
				"end": 48,
				"delay": 0.03,
				"type": 0
			},
			"attack": {
				"start": 49,
				"end": 72,
				"delay": 0.03,
				"type": 1
			},
			"attack2": {
				"start": 73,
				"end": 97,
				"delay": 0.03,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.03,
				"type": 0
			},
			"dead": {
				"start": 110,
				"end": 155,
				"delay": 0.03,
				"type": 1
			}
		},
		"behavior": "range"
	}
}