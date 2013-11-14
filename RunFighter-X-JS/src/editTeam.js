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
            this.initFromConfig(this.windowConfig);
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
            var scrollData = this.getDisplaySpritesAndMetaData();
            this.tableView.init({
                sprites:scrollData.sprites,
                metaData:scrollData.ids,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this),
                width:this.winSize.width
            });

            var pos = this.tableView.getPosition();
            pos.y+=28;
            this.tableView.setPosition(pos);
            this.reorderChild(this.tableView, 3);
            this.tableView.hackOn();
            //this.tableView.setIndex(0);
        }
    },
    makeScrollSprites: function(names){
       return _.map(names, function(name){
            return this.makeScrollSprite(name);
       }.bind(this));

    },
    makeScrollSprite: function(name){
        var sprite = new cc.Sprite();
        sprite.initWithSpriteFrameName("characterPortraitFrame.png");
        sprite.pic = jc.getCharacterPortrait(name, sprite.getContentSize());
        sprite.addChild(sprite.pic);
        this.scaleTo(sprite.pic, sprite);
        this.centerThis(sprite.pic, sprite);
        return sprite;
    },
    getDisplaySpritesAndMetaData: function(){
        var characters = hotr.blobOperations.getCharacterIdsAndTypes();
        var names = _.pluck(characters, 'name');
        var ids = _.pluck(characters, 'id');
        var sprites = this.makeScrollSprites(names);
        return {ids:ids, sprites:sprites};
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
    selectionCallback:function(index, sprite, data){
        //index of card, data = character id
        var characterEntry = hotr.blobOperations.getEntryWithId(data);

        //get card image from jc.getCharacterCard
        var card = jc.getCharacterCard(characterEntry.name);

        //put this card sprite in the frame
        this.swapCharacterCard(card);

        //fade in/fade out card
        //update labels
    },
    swapCharacterCard:function(card){
        if (this.statsFrame.card){
            jc.fadeOut(this.statsFrame.card, jc.defaultTransitionTime/4, function(){
                this.removeChild(this.statsFrame.card);
                doFadeIn.bind(this)();
            }.bind(this));
        }else{
            doFadeIn.bind(this)();
        }

        function doFadeIn(){
            this.statsFrame.card = card;
            card.setOpacity(0);
            this.addChild(card);
            var pos = this.statsFrame.getPosition();
            card.setPosition(cc.p(185,pos.y));
            jc.fadeIn(this.statsFrame.card, 255, jc.defaultTransitionTime/4);
        }
    },
    previousChar:function(){
        this.tableView.left();
    },
    nextChar:function(){
        this.tableView.right();
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

