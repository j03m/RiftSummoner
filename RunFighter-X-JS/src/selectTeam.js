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
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.highlight = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmallSelected.png");
            this.highlight.setVisible(false);
            this.addChild(this.highlight);
            this.name = "SelectTeam";
            jc.layerManager.pushLayer(this);
            this.start();

            //if blob formation is not set
            //use it
            //else autopop with light logic (range back most, tank front most, anyone else middle)
            //save blob formation
            //if selected character is not null
            //place that character into the cell
            //update blob formation

            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        console.log("show");
    },
    previousFormation:function(){
        console.log("previous");
    },
    nextFormation:function(){
        console.log("next");
    },
    fightStart:function(){
        //transition to loading
        //sync blob (loader needs to handle this as well )
        //load scene
        console.log("fight");
    },
    close:function(){
        console.log("close");
    },
    targetTouchHandler: function(type, touch, sprites) {
        if (sprites[0]){

            if (type == jc.touchEnded){
                //on grid cell touch
                //place highlight border
                this.highlight.setVisible(true);
                var pos = sprites[0].getPosition();
                pos.y-=10;
                this.highlight.setPosition(pos);
                this.reorderChild(this.highlight, sprites[0].getZOrder()+1);
                //put cell # into scratchboard
                hotr.scratchBoard.currentCell = sprites[0].name;
                jc.layerManager.pushLayer(EditTeam.getInstance(),10);

            }

            return true;
        }
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
                            "sprite":"portraitSmallDarkBackground.png"
                        }
                    ],
                    "membersTotal":12
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
    if (!hotr.selectTeamScene){
        hotr.selectTeamScene = cc.Scene.create();
        hotr.selectTeamScene.layer = new SelectTeam();
        hotr.selectTeamScene.addChild(hotr.selectTeamScene.layer);
        hotr.selectTeamScene.layer.init();

    }
    return hotr.selectTeamScene;
};

