var spriteDefs = {
    "blackGargoyle": {
        "name": "blackGargoyle",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "gargoyle"
    },
    "blueKnight": {
        "name": "blueKnight",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "knight"
    },
    "dragon": {
        "name": "dragon",
        "parentOnly": true,
        "targetRadius": 100,
        "animations": {
            "move": {
                "start": 178,
                "end": 189,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 190,
                "end": 206,
                "delay": 0.1,
                "type": 1
            },
            "attack2": {
                "start": 207,
                "end": 231,
                "delay": 0.1,
                "type": 1
            },
            "damage": {
                "start": 242,
                "end": 77,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 236,
                "end": 257,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 1,
                "end": 9,
                "delay": 0.1,
                "type": 0
            }
        },
        "behavior": "tank"
    },
    "dragonBlack": {
        "name": "dragonBlack",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "dragon"
    },
    "dragonRed": {
        "name": "dragonRed",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "dragon"
    },
    "elf": {
        "name": "elf",
        "parentOnly": true,
        "targetRadius": 600,
        "animations": {
            "move": {
                "start": 242,
                "end": 263,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 454,
                "end": 471,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 422,
                "end": 454,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 471,
                "end": 482,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 327,
                "end": 324,
                "delay": 0.1,
                "type": 1
            }
        },
        "behavior": "range"
    },
    "fireKnight": {
        "name": "fireKnight",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "knight"
    },
    "forestElf": {
        "name": "forestElf",
        "gameProperties": {
            "MaxHP": 200,
            "damage": 10,
            "speed": 25,
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
        "animations": {
            "move": {
                "start": 78,
                "end": 86,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 17,
                "end": 34,
                "delay": 0.1,
                "type": 1
            },
            "attack2": {
                "start": 35,
                "end": 50,
                "delay": 0.1,
                "type": 1
            },
            "damage": {
                "start": 50,
                "end": 58,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 58,
                "end": 77,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 1,
                "end": 9,
                "delay": 0.1,
                "type": 0
            }
        },
        "behavior": "tank"
    },
    "goblin": {
        "name": "goblin",
        "targetRadius": 300,
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "animations": {
            "move": {
                "start": 27,
                "end": 34,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 95,
                "end": 105,
                "delay": 0.1,
                "type": 1
            },
            "attack2": {
                "start": 105,
                "end": 120,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 2,
                "end": 26,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 121,
                "end": 134,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 151,
                "end": 181,
                "delay": 0.1,
                "type": 1
            }
        },
        "behavior": "range"
    },
    "goldElf": {
        "name": "goldElf",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "elf"
    },
    "goldKnight": {
        "name": "goldKnight",
        "gameProperties": {
            "MaxHP": 500,
            "speed": 10,
            "damage": 50,
            "actionDelays": {
                "attack": 0.5
            },
            "effectDelays": {
                "attack": 1.5
            },
            "targetRadius": 30
        },
        "inherit": "knight"
    },
    "knight": {
        "name": "knight",
        "parentOnly": true,
        "targetRadius": 200,
        "animations": {
            "move": {
                "start": 1,
                "end": 28,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 147,
                "end": 175,
                "delay": 0.1,
                "type": 1
            },
            "attack2": {
                "start": 176,
                "end": 206,
                "delay": 0.1,
                "type": 1
            },
            "attack3": {
                "start": 207,
                "end": 267,
                "delay": 0.1,
                "type": 1
            },
            "damage": {
                "start": 347,
                "end": 374,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 348,
                "end": 419,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 461,
                "end": 481,
                "delay": 0.1,
                "type": 0
            }
        },
        "behavior": "tank"
    },
    "monsterbase": {
        "name": "monsterbase",
        "parentOnly": true,
        "animations": {
            "move": {
                "start": 55,
                "end": 63,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 2,
                "end": 11,
                "delay": 0.1,
                "type": 1
            },
            "attack2": {
                "start": 11,
                "end": 20,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 46,
                "end": 54,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 20,
                "end": 29,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 29,
                "end": 45,
                "delay": 0.1,
                "type": 1
            }
        }
    },
    "orc": {
        "name": "orc",
        "targetRadius": 50,
        "gameProperties": {
            "MaxHP": 300,
            "speed": 20,
            "damage": 25,
            "actionDelays": {
                "attack": 0.2
            },
            "effectDelays": {
                "attack": 0.4
            },
            "targetRadius": 5
        },
        "inherit": "monsterbase",
        "behavior": "tank"
    },
    "orge": {
        "name": "orge",
        "targetRadius": 150,
        "gameProperties": {
            "MaxHP": 1000,
            "speed": 5,
            "damage": 100,
            "actionDelays": {
                "attack": 2
            },
            "effectDelays": {
                "attack": 2.5
            },
            "targetRadius": 50
        },
        "inherit": "monsterbase",
        "behavior": "tank"
    },
    "redGargoyle": {
        "name": "redGargoyle",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "inherit": "gargoyle"
    },
    "scowerer": {
        "name": "scowerer",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "targetRadius": 25,
        "animations": {
            "move": {
                "start": 1,
                "end": 11,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 81,
                "end": 110,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 1,
                "end": 1,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 111,
                "end": 134,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 158,
                "end": 168,
                "delay": 0.1,
                "type": 1
            }
        },
        "behavior": "tank"
    },
    "shellback": {
        "name": "shellback",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "animations": {
            "move": {
                "start": 25,
                "end": 31,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 68,
                "end": 85,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 4,
                "end": 12,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 59,
                "end": 67,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 86,
                "end": 94,
                "delay": 0.1,
                "type": 1
            }
        },
        "behavior": "tank"
    },
    "snakeThing": {
        "name": "snakeThing",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "animations": {
            "move": {
                "start": 54,
                "end": 64,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 65,
                "end": 74,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 1,
                "end": 13,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 86,
                "end": 89,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 112,
                "end": 128,
                "delay": 0.1,
                "type": 1
            }
        },
        "behavior": "tank"
    },
    "spider": {
        "name": "spider",
        "MaxHP": 250,
        "speed": 125,
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "animations": {
            "move": {
                "start": 54,
                "end": 64,
                "delay": 0.1,
                "type": 0
            },
            "attack": {
                "start": 65,
                "end": 74,
                "delay": 0.1,
                "type": 1
            },
            "idle": {
                "start": 1,
                "end": 13,
                "delay": 0.1,
                "type": 0
            },
            "damage": {
                "start": 86,
                "end": 89,
                "delay": 0.1,
                "type": 1
            },
            "dead": {
                "start": 112,
                "end": 128,
                "delay": 0.1,
                "type": 1
            }
        },
        "behavior": "tank"
    },
    "troll": {
        "name": "troll",
        "gameProperties": {
            "MaxHP": 100,
            "speed": 100,
            "damage": 10,
            "heal": 50,
            "actionDelays": {
                "attack": 1,
                "heal": 1
            },
            "effectDelays": {
                "attack": 1,
                "heal": 1
            },
            "targetRadius": 75
        },
        "inherit": "monsterbase",
        "behavior": "healer"
    },
    "voidElf": {
        "name": "voidElf",
        "gameProperties": {
            "MaxHP": 200,
            "damage": 10,
            "speed": 25,
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
            "speed": 100,
            "actionDelays": {
                "attack": 1
            },
            "effectDelays": {
                "attack": 1
            },
            "targetRadius": 25
        },
        "targetRadius": 500,
        "inherit": "monsterbase",
        "behavior": "range"
    }
}