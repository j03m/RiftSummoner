var spriteDefs = {
    "blackGargoyle": {
        "name": "blackGargoyle",
        "inherit": "gargoyle"
    },
    "blueKnight": {
        "name": "blueKnight",
        "inherit": "knight"
    },
    "dragon": {
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
//            "damage": {
//                "start": 242,
//                "end": 277,
//                "delay": 0.1,
//                "type": 1
//            },
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
        }
    },
    "dragonBlack": {
        "name": "dragonBlack",
        "inherit": "dragon"
    },
    "dragonRed": {
        "inherits": "dragon.js"
    },
    "elf": {
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
        }
    },
    "fireKnight": {
        "name": "blueKnight",
        "inherit": "knight"
    },
    "forestElf": {
        "name": "forestElf",
        "inherit": "elf"
    },
    "gargoyle": {
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
        }
    },
    "goblin": {
        "name": "goblin",
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
        }
    },
    "goldElf": {
        "name": "goldElf",
        "inherit": "elf"
    },
    "goldKnight": {
        "name": "goldKnight",
        "inherit": "knight"
    },
    "knight": {
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
        }
    },
    "monsterbase": {
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
        "inherit": "monsterbase"
    },
    "orge": {
        "name": "orge",
        "inherit": "monsterbase"
    },
    "redGargoyle": {
        "name": "redGargoyle",
        "inherit": "gargoyle"
    },
    "scowerer": {
        "name": "scowerer",
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
        }
    },
    "shellback": {
        "name": "shellback",
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
        }
    },
    "snakeThing": {
        "name": "snakeThing",
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
        }
    },
    "spider": {
        "name": "spider",
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
        }
    },
    "troll": {
        "name": "troll",
        "inherit": "monsterbase"
    },
    "voidElf": {
        "name": "voidElf",
        "inherit": "elf"
    },
    "wizard": {
        "name": "wizard",
        "inherit": "monsterbase"
    }
}