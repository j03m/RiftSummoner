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
    quest:function(){},
    battle:function(){
        hotr.mainScene.layer.selectEditTeamPre();
    },
    summon:function(){},
    store:function(){},
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "sprite":"landingScreen.png",
            "padding":{
                "top":-10,
                "left":0
            },
            "z":1,
            "kids":{
                "questButton":{
                    "cell":2,
                    "anchor":['left', 'top'],
                    "padding":{
                        "top":-55,
                        "left":-110
                    },
                    "type":"button",
                    "main":"questButton.png",
                    "pressed":"questButtonPressed.png",
                    "touchDelegateName":"quest",
                    "z":2,
                },
                "battleButton":{
                    "cell":2,
                    "anchor":['right', 'top'],
                    "padding":{
                        "top":-55,
                        "left":-35
                    },
                    "type":"button",
                    "main":"battleButton.png",
                    "pressed":"battleButtonPressed.png",
                    "touchDelegateName":"battle",
                    "z":2,

                },
                "summonButton":{
                    "cell":2,
                    "anchor":['left', 'center'],
                    "padding":{
                        "top":0,
                        "left":-110
                    },
                    "type":"button",
                    "main":"summonButton.png",
                    "pressed":"summonPressed.png",
                    "touchDelegateName":"summon",
                    "z":2
                },
                "storeButton":{
                    "cell":2,
                    "anchor":['right', 'center'],
                    "padding":{
                        "top":0,
                        "left":-35
                    },
                    "type":"button",
                    "main":"storeButton.png",
                    "pressed":"storeButtonPressed.png",
                    "touchDelegateName":"summon",
                    "z":2
                }
            }
        },
    }
});



Landing.scene = function() {
    if (!hotr.landingScene){
        hotr.landingScene = cc.Scene.create();
        hotr.landingScene.layer = new Landing();
        if (!jc.isBrowser){

            //native layout mods here
            hotr.landingScene.layer.windowConfig.mainFrame.kids.battleButton.padding.left = 83;
            hotr.landingScene.layer.windowConfig.mainFrame.kids.storeButton.padding.left = 83;
            hotr.landingScene.layer.windowConfig.mainFrame.kids.questButton.padding.left = -49;
            hotr.landingScene.layer.windowConfig.mainFrame.kids.summonButton.padding.left = -49;
        }

        hotr.landingScene.addChild(hotr.landingScene.layer);
        hotr.landingScene.layer.init();

    }
    return hotr.landingScene;
};

