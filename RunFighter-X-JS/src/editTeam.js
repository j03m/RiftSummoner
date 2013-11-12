jc.playerBlob = {
    id:1,
    grid:[1],
    myguys:[
        {   "name":"wizard",
            "number":3
        },
        {   "name":"orc",
            "number":4
        },
        {   "name":"orge",
            "number":1

        },
        {   "name":"troll",
            "number":1
        },
        {   "name":"goldKnight",
            "number":1
        },
        {   "name":"goblin",
            "number":1
        }
    ]

}

var EditTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(editTeamUI);
            this.initFromConfig(this.windowConfig);
            this.start();
            this.playerBlob = jc.playerBlob;
            jc.layerManager.push(this);
            this.name = "EditTeam";

            return true;
        } else {
            return false;
        }
    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
    },
    "trainPower": function(){
        console.log("trainPower");
    },
    "doneButton": function(){
        console.log("done");
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"top",
            "transitionOut":"top",
            "sprite":"selectEditTeamScreenS.png",
            "kids":{
                "statsFrame":{
                    "cell":4,
                    "anchor":['center', 'right'],
                    "type":"sprite",
                    "sprite":"statsFrame.png",
                    "padding":{
                        "top":-37,
                        "left":95,
                    }
                },
                "powerLevels":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":5,
                    "cell":8,
                    "anchor":['right'],
                    "padding":{
                        "top":28,
                        "left":-21
                    },
                    "itemPadding":{
                        "top":0,
                        "left":-1
                    },
                    "members":[
                        {
                            "type":"sprite",
                            "sprite":"powerIconLargeFrame.png"
                        }
                    ],
                    "membersTotal":5
                },
                "powerIcons":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":5,
                    "cell":8,
                    "anchor":['right', 'bottom'],
                    "padding":{
                        "top":12,
                        "left":-21
                    },
                    "itemPadding":{
                        "top":0,
                        "left":-1
                    },
                    "input":true,
                    "members":[
                        {
                            "type":"sprite",
                            "input":true,
                            "sprite":"powerIconSmallFrame.png"
                        }
                    ],
                    "membersTotal":5
                },
                "powerDesc":{
                    "type":"sprite",
                    "sprite":"powerIconsDescription.png",
                    "cell":6,
                    "anchor":['center'],
                    "padding":{
                        "top":-5,
                        "left":-45
                    }
                },
                "nextLevel":{
                    "cell":6,
                    "anchor":['left', 'bottom'],
                    "padding":{
                        "top":-28,
                        "left":-47
                    },
                    "type":"sprite",
                    "sprite":"nextLevelCostFrame.png"
                },
                "trainButton":{
                    "type":"button",
                    "main":"buttonTrain.png",
                    "pressed":"buttonTrain.png",
                    "touchDelegateName":"trainPower",
                    "cell":6,
                    "anchor":['right', 'bottom'],
                    "padding":{
                        "top":-22,
                        "left":-36
                    }
                },
                "doneButton":{
                    "type":"button",
                    "main":"buttonDone.png",
                    "pressed":"buttonDone.png",
                    "touchDelegateName":"doneButton",
                    "cell":3,
                    "anchor":['center'],
                    "padding":{
                        "top":23,
                        "left":5
                    }
                }

            }
        },
    }
});



EditTeam.scene = function() {
    if (!jc.editTeamScene){
        jc.editTeamScene = cc.Scene.create();
        jc.editTeamScene.layer = new EditTeam();
        jc.editTeamScene.addChild(jc.editTeamScene.layer);
        jc.editTeamScene.layer.init();

    }
    return jc.editTeamScene;
};

