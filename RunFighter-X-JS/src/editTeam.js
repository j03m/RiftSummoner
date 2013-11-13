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
    cellWidth:120,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(editTeamUI);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(portraitsPlist);
            this.initFromConfig(this.windowConfig);
            this.playerBlob = jc.playerBlob;
            jc.layerManager.push(this);
            this.name = "EditTeam";


            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
        if (!this.tableView){
            this.tableView = new jc.ScrollingLayer();
            this["characterPortraitsFrame"].addChild(this.tableView);
            var sprites = this.getDisplaySprites();
            this.tableView.init({
                sprites:sprites,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this),
                width:this.winSize.width
            });


            var pos = this.tableView.getPosition();
            pos.y+=28;
            this.tableView.setPosition(pos);


            this.reorderChild(this.tableView, 3);
            this.tableView.hackOn();
            this.tableView.setInitialPos(5);

        }
    },
    getDisplaySprites: function(){
        var returnme = [];
        for(var i=0;i<jc.playerBlob.myguys.length;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("characterPortraitFrame.png");
            var pic = jc.getCharacterPortrait(this.playerBlob.myguys[i]);
            sprite.pic = new cc.Sprite();
            sprite.pic.initWithSpriteFrameName(pic);
            sprite.addChild(sprite.pic);
            this.scaleTo(sprite.pic, sprite);
            this.centerThis(sprite.pic, sprite);
            returnme.push(sprite);
        }

       // returnme = returnme.concat(this.getEmptyCells(this.cells - this.playerBlob.myguys.length));
        return returnme;
    },
    getEmptyCells:function(number){
        var returnme=[];
        for(var i =0;i<number;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("characterPortraitFrame.png");
            if (!this.cellWidth){
                this.cellWidth = sprite.getTextureRect().width + 100;
            }
            returnme.push(sprite);
        }
        return returnme;
    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
        return false;
    },
    "trainPower": function(){
        console.log("trainPower");
    },
    "doneButton": function(){
        console.log("done");
    },
    selectionCallback:function(){
        //index of card
        //get card image from jc.getCharacterCard
        //fade in/fade out card
        //update labels
    },
    previousChar:function(){
        console.log("scroll button left");
        this.tableView.setInitialPos(4);
    },
    nextChar:function(){
        console.log("scroll button right");
        this.tableView.setInitialPos(6);
    },
    close:function(){
        console.log("close");
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
                    "pressed":"closeButtonPressed.png",
                    "touchDelegateName":"close"

                },
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
                    "pressed":"buttonTrainPressed.png",
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
                    "pressed":"buttonDonePressed.png",
                    "touchDelegateName":"doneButton",
                    "cell":3,
                    "anchor":['center'],
                    "padding":{
                        "top":23,
                        "left":5
                    }
                },
                "characterPortraitsFrame":{
                    "type":"sprite",
                    "sprite":"characterPortraitsFrame.png",
                    "cell":2,
                    "anchor":['top'],
                    "padding":{
                        "top":2,
                        "left":0
                    }
                },
                "characterPortraitsLeft":{
                    "type":"button",
                    "main":"characterPortraitsButtonLeft.png",
                    "pressed":"characterPortraitsButtonLeftPressed.png",
                    "touchDelegateName":"previousChar",
                    "cell":1,
                    "anchor":['top', 'left'],
                    "padding":{
                        "top":2,
                        "left":0
                    }
                },
                "characterPortraitsRight":{
                    "type":"button",
                    "main":"characterPortraitsButtonRight.png",
                    "pressed":"characterPortraitsButtonRightPressed.png",
                    "touchDelegateName":"nextChar",
                    "cell":3,
                    "anchor":['top', 'right'],
                    "padding":{
                        "top":2,
                        "left":0
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

