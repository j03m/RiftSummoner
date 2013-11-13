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

var SelectTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(selectTeamUI);
            this.initFromConfig(this.windowConfig);
            this.start();
            this.playerBlob = jc.playerBlob;

            jc.layerManager.push(this);
            this.name = "SelectTeam";

            return true;
        } else {
            return false;
        }
    },
    previousFormation:function(){
        console.log("previous");
    },
    nextFormation:function(){
        console.log("next");
    },
    fightStart:function(){
        console.log("fight");
    },
    close:function(){
        console.log("close");
    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
        return false;
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"top",
            "transitionOut":"top",
            "sprite":"genericBackground.png",
            "kids":{
                "closeButton":{
                    "cell":9,
                    "anchor":['center', 'right'],
                    "padding":{
                        "top":-15,
                        "left":0
                    },
                    "type":"button",
                    "main":"closeButton.png",
                    "pressed":"closeButton.png",
                    "touchDelegateName":"close"

                },
                "gridCells":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":4,
                    "cell":7,
                    "anchor":['bottom'],
                    "padding":{
                        "top":-35,
                        "left":-25
                    },
                    "itemPadding":{
                        "top":3,
                        "left":4
                    },

                    "input":true,
                    "members":[
                        {
                            "type":"sprite",
                            "input":true,
                            "sprite":"portraitSmall.png"
                        }
                    ],
                    "membersTotal":20
                },
                "formation":{
                    "cell":6,
                    "anchor":['right','top'],
                    "padding":{
                        "top":-67,
                        "left":-27
                    },
                    "type":"sprite",
                    "sprite":"formationFrame.png"
                },
                "description":{
                    "cell":3,
                    "anchor":['top'],
                    "padding":{
                        "top":-40,
                        "left":-30
                    },
                    "type":"sprite",
                    "sprite":"descriptionWindow.png"
                },
                "formationSelect":{
                    "isGroup":true,
                    "type":"line",
                    "cell":3,
                    "anchor":['left', 'top'],
                    "padding":{
                        "top":20,
                        "left":-50
                    },

                    "members":[
                        {
                            "type":"button",
                            "main":"leftArrowFormationName.png",
                            "pressed":"leftArrowFormationName.png",
                            "touchDelegateName":"previousFormation"
                        },
                        {
                            "type":"sprite",
                            "sprite":"formationNameFrame.png"
                        },
                        {
                            "type":"button",
                            "main":"rightArrowFormationName.png",
                            "pressed":"rightArrowFormationName.png",
                            "touchDelegateName":"nextFormation"
                        }
                    ]
                },
                "fightButton":{
                    "cell":3,
                    "anchor":['center'],
                    "padding":{
                        "top":20,
                        "left":-30
                    },
                    "type":"button",
                    "main":"buttonFight.png",
                    "pressed":"buttonFight.png",
                    "touchDelegateName":"fightStart"
                },
            }
        },
    }
});



SelectTeam.scene = function() {
    if (!jc.selectTeamScene){
        jc.selectTeamScene = cc.Scene.create();
        jc.selectTeamScene.layer = new SelectTeam();
        jc.selectTeamScene.addChild(jc.selectTeamScene.layer);
        jc.selectTeamScene.layer.init();

    }
    return jc.selectTeamScene;
};

