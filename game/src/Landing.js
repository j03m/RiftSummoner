var Landing = jc.UiElementsLayer.extend({
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
            cc.SpriteFrameCache.getInstance().addSpriteFrames(landingPlist);
            this.initFromConfig(this.windowConfig);

            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
    },
    quest:function(){
        hotr.mainScene.layer.map();
    },
    battle:function(){         
		 // hotr.multiplayerGame = true;
		 //          hotr.mainScene.layer.battlePre();
		 //hotr.mainScene.layer.mpGetGames();
    },
    summon:function(){},
    store:function(){},
    windowConfig:{
        "mainFrame": {
            "cell": 5,
            "type": "sprite",
            "sprite": "background.png",
            "z": 1,
            "kids": {
                "questButton": {
                    "type": "button",
                    "main": "questButton.png",
                    "pressed": "questButtonPressed.png",
                    "touchDelegateName": "quest",
                    "z": 2,
                    "pos": {
                        "x": 1024,
                        "y": 200
                    }
                },
//                "battleButton": {
//                    "type": "button",
//                    "main": "battleButton.png",
//                    "pressed": "battleButtonPressed.png",
//                    "touchDelegateName": "battle",
//                    "z": 2,
//                    "pos": {
//                        "x": 1316,
//                        "y": 468
//                    }
//                },
//                "summonButton": {
//                    "type": "button",
//                    "main": "summonButton.png",
//                    "pressed": "summonPressed.png",
//                    "touchDelegateName": "summon",
//                    "z": 2,
//                    "pos": {
//                        "x": 808,
//                        "y": 220
//                    }
//                },
//                "storeButton": {
//                    "type": "button",
//                    "main": "storeButton.png",
//                    "pressed": "storeButtonPressed.png",
//                    "touchDelegateName": "summon",
//                    "z": 2,
//                    "pos": {
//                        "x": 1316,
//                        "y": 218
//                    }
//                }
            },
            "pos": {
                "x": 1004,
                "y": 577
            }
        }
    }
});



Landing.scene = function() {
    if (!hotr.landingScene){
        hotr.landingScene = cc.Scene.create();
        hotr.landingScene.retain();
        hotr.landingScene.layer = new Landing();

        hotr.landingScene.addChild(hotr.landingScene.layer);
        hotr.landingScene.layer.init();

    }
    return hotr.landingScene;
};

