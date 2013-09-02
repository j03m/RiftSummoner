var spriteDefs = {
	"blackGargoyle": {
		"name": "blackGargoyle",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 100,
			"damage": 15,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 25,
			"seekRadius": 25
		},
		"inherit": "gargoyle"
	},
	"blueKnight": {
		"name": "blueKnight",
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"damage": 50,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": -25,
			"seekRadius": 25
		},
		"inherit": "knight"
	},
	"dragon": {
		"name": "dragon",
		"parentOnly": true,
		"targetRadius": 100,
		"step": 1,
		"animations": {
			"move": {
				"start": 529,
				"end": 565,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 614,
				"end": 690,
				"delay": 0.05,
				"type": 1
			},
			"dead": {
				"start": 725,
				"end": 790,
				"delay": 0.1,
				"type": 1
			},
			"idle": {
				"start": 529,
				"end": 565,
				"delay": 0.1,
				"type": 0
			}
		},
		"behavior": "tank"
	},
	"dragonBlack": {
		"name": "dragonBlack",
		"gameProperties": {
			"MaxHP": 400,
			"speed": 130,
			"damage": 40,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 25,
			"seekRadius": 25
		},
		"inherit": "dragon"
	},
	"dragonRed": {
		"name": "dragonRed",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 150,
			"damage": 50,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 25,
			"seekRadius": 25
		},
		"inherit": "dragon"
	},
	"elf": {
		"name": "elf",
		"parentOnly": true,
		"targetRadius": 600,
		"animations": {
			"move": {
				"start": 730,
				"end": 741,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 1365,
				"end": 1415,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1263,
				"end": 1358,
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 862,
				"end": 910,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"fireKnight": {
		"name": "fireKnight",
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"damage": 50,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": -25,
			"seekRadius": 25
		},
		"inherit": "knight"
	},
	"forestElf": {
		"name": "forestElf",
		"gameProperties": {
			"MaxHP": 200,
			"damage": 10,
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
	"gargoyle": {
		"name": "gargoyle",
		"parentOnly": true,
		"animations": {
			"move": {
				"start": 230,
				"end": 255,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 51,
				"end": 100,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 100,
				"end": 147,
				"delay": 0.025,
				"type": 1
			},
			"dead": {
				"start": 147,
				"end": 228,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.025,
				"type": 0
			}
		},
		"behavior": "tank"
	},
	"goblin": {
		"name": "goblin",
		"gameProperties": {
			"MaxHP": 50,
			"damage": 80,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 200
		},
		"animations": {
			"move": {
				"start": 80,
				"end": 90,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 315,
				"end": 353,
				"delay": 0.025,
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
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"goldElf": {
		"name": "goldElf",
		"gameProperties": {
			"MaxHP": 200,
			"damage": 10,
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
	"goldKnight": {
		"name": "goldKnight",
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"damage": 50,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": -25
		},
		"inherit": "knight"
	},
	"knight": {
		"name": "knight",
		"parentOnly": true,
		"targetRadius": 200,
		"animations": {
			"move": {
				"start": 11,
				"end": 80,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 440,
				"end": 520,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 613,
				"end": 796,
				"delay": 0.025,
				"type": 1
			},
			"dead": {
				"start": 1120,
				"end": 1259,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 1380,
				"end": 1460,
				"delay": 0.05,
				"type": 0
			}
		},
		"behavior": "tank"
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
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 24,
				"delay": 0.05,
				"type": 1
			},
			"attack2": {
				"start": 25,
				"end": 48,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 121,
				"end": 137,
				"delay": 0.05,
				"type": 0
			},
			"damage": {
				"start": 49,
				"end": 60,
				"delay": 0.05,
				"type": 1
			},
			"dead": {
				"start": 72,
				"end": 120,
				"delay": 0.05,
				"type": 1
			}
		}
	},
	"orc": {
		"name": "orc",
		"gameProperties": {
			"MaxHP": 300,
			"speed": 40,
			"damage": 25,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": -20
		},
		"baseOffset": {
			"x": -20,
			"y": -5
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 264,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 25,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 73,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 209,
				"delay": 0.05,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
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
	"orge": {
		"name": "orge",
		"targetRadius": 150,
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 15,
			"damage": 100,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": -30
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 265,
				"delay": 0.05,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 37,
				"delay": 0.05,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 84,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 240,
				"delay": 0.05,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.05,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"redGargoyle": {
		"name": "redGargoyle",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 100,
			"damage": 15,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 25
		},
		"inherit": "gargoyle"
	},
	"scowerer": {
		"name": "scowerer",
		"gameProperties": {
			"MaxHP": 10,
			"speed": 200,
			"damage": 25,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": -5
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
		"behavior": "tank"
	},
	"shadowKnight": {
		"name": "shadowKnight",
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"damage": 50,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": -25
		},
		"inherit": "knight"
	},
	"shellback": {
		"name": "shellback",
		"gameProperties": {
			"MaxHP": 150,
			"speed": 200,
			"damage": 25,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": -5
		},
		"animations": {
			"move": {
				"start": 70,
				"end": 88,
				"delay": 0.05,
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
				"end": 131,
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 283,
				"end": 340,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"snakeThing": {
		"name": "snakeThing",
		"gameProperties": {
			"MaxHP": 150,
			"speed": 80,
			"damage": 45,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 0,
			"seekRadius": 150
		},
		"animations": {
			"move": {
				"start": 53,
				"end": 84,
				"delay": 0.05,
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
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 275,
				"end": 315,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "defender"
	},
	"spider": {
		"name": "spider",
		"gameProperties": {
			"MaxHP": 250,
			"speed": 150,
			"damage": 80,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 0,
			"seekRadius": 150
		},
		"animations": {
			"move": {
				"start": 164,
				"end": 189,
				"delay": 0.05,
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
				"delay": 0.05,
				"type": 0
			},
			"dead": {
				"start": 332,
				"end": 400,
				"delay": 0.05,
				"type": 1
			}
		},
		"behavior": "defender"
	},
	"troll": {
		"name": "troll",
		"gameProperties": {
			"MaxHP": 100,
			"speed": 100,
			"damage": 10,
			"heal": 25,
			"actionDelays": {
				"attack": 1,
				"heal": 1
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
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 264,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 24,
				"delay": 0.05,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 73,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 209,
				"delay": 0.05,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "healer"
	},
	"voidElf": {
		"name": "voidElf",
		"gameProperties": {
			"MaxHP": 200,
			"damage": 10,
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
	"wizard": {
		"name": "wizard",
		"gameProperties": {
			"MaxHP": 100,
			"speed": 50,
			"damage": 50,
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 200
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 264,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 40,
				"delay": 0.05,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 80,
				"delay": 0.05,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 209,
				"delay": 0.05,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "range"
	}
}