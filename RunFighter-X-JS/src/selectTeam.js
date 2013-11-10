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
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"top",
            "transitionOut":"top",
            "scaleRect":jc.UiConf.frame19Rect,
            "sprite":"genericBackground.png",
            "padding":{
                "top":12,
                "left":2
            }
        }
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

