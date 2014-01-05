var Summoning = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    cellPrefix:"gridCells",
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(summoningPlist);
            this.initFromConfig(this.windowConfig);

            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
    },
    windowConfig:{
        "mainFrame": {
            "cell": 5,
            "type": "sprite",
            "sprite": "summoningScreen.png",
            "z": 1,
            "kids": {
                "questButton": {
                    "type": "button",
                    "main": "questButton.png",
                    "pressed": "questButtonPressed.png",
                    "touchDelegateName": "quest",
                    "z": 2,
                    "pos": {
                        "x": 804,
                        "y": 468
                    }
                },
                "battleButton": {
                    "type": "button",
                    "main": "battleButton.png",
                    "pressed": "battleButtonPressed.png",
                    "touchDelegateName": "battle",
                    "z": 2,
                    "pos": {
                        "x": 1316,
                        "y": 468
                    }
                },
                "summonButton": {
                    "type": "button",
                    "main": "summonButton.png",
                    "pressed": "summonPressed.png",
                    "touchDelegateName": "summon",
                    "z": 2,
                    "pos": {
                        "x": 808,
                        "y": 220
                    }
                },
                "storeButton": {
                    "type": "button",
                    "main": "storeButton.png",
                    "pressed": "storeButtonPressed.png",
                    "touchDelegateName": "summon",
                    "z": 2,
                    "pos": {
                        "x": 1316,
                        "y": 218
                    }
                }
            },
            "pos": {
                "x": 1004,
                "y": 756
            }
        }
    }
});



Summoning.scene = function() {
    if (!hotr.summoningScene){
        hotr.summoningScene = cc.Scene.create();
        hotr.summoningScene.retain();
        hotr.summoningScene.layer = new Summoning();

        hotr.summoningScene.addChild(hotr.summoningScene.layer);
        hotr.summoningScene.layer.init();

    }
    return hotr.summoningScene;
};

