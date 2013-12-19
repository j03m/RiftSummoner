var missileConfig = {
                     "greenbullet":{
                         "png":"art/missiles.png",
                         "plist":"art/missiles.plist",
                         "start":"greenbullet.1.png",
                         "effect":"greenBang",
                         "frames":27,
                         "delay":0.02 ,
                         "first":9,
                         "speed":300,
						 "height":150
                         
                     },
                     "arrow":{
                         "png":"art/missiles.png",
                         "plist":"art/missiles.plist",
                         "start":"arrow.png",
                         "simple":true,
						 "hasDirection":true,
						 "rotation":"arrow",
                         "initialAngle":-45,
						 "path":"arrow",
                         "speed":350,
						 "height":200
						 
                     },
                    "bomb":{
                        "png":"art/missiles.png",
                        "plist":"art/missiles.plist",
                        "start":"bomb.png",
                        "simple":true,
                        "path":"jump",
                        "speed":100
                    },
                    "fireball":{
                        "png":"art/missiles.png",
                        "plist":"art/missiles.plist",
                        "start":"fireball.1.png",
                        "effect":"explosion",
                        "frames":10,
                        "delay":0.01,
                        "speed":500
                    },
}

