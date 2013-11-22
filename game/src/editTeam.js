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
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
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
            this.tableView.setIndex(0);
        }
    },
    inTransitionsComplete:function(){
        if (this.statsFrame.card){
            jc.fadeIn(this.statsFrame.card, 255);
        }
    },
    outTransitionsComplete:function(){
        jc.layerManager.popLayer();
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
        hotr.scratchBoard.selectedCharacter = this.tableView.selectedIndex;
        this.close();
    },
    selectionCallback:function(index, sprite, data){
        //index of card, data = character id
        var characterEntry = hotr.blobOperations.getEntryWithId(data);

        //get card image from jc.getCharacterCard
        var card = jc.getCharacterCard(characterEntry.name);

        //put this card sprite in the frame
        this.swapCharacterCard(card);

        this.placeElement(characterEntry);

        //this.placeAttackTypes(characterEntry);

        //update labels
        this.updateStats(characterEntry);
    },
    updateStats:function(entry){
        var stats = jc.makeStats(entry.name);
        stats = this.makeStringStats(stats);

        var size = cc.size(40, 10);
        var align = cc.TEXT_ALIGNMENT_RIGHT;
        var fntSize = 12;
        var fntName = "gow";
        var firstPos = cc.p(80, 245);
        var spacing = 19;
        var zorder = this.statsFrame.getZOrder()+1

        var prefix = "lbl";
        for (var stat in stats){
            var lblName = prefix+stat
            if (this[lblName]){
                this.removeChild(this[lblName]);
            }

            this[lblName] = this.makeAndPlaceLabel(stats[stat], fntName, fntSize, size, align, firstPos,zorder);
            firstPos.y-=spacing;
        }


    },
    makeStringStats:function(stats){
        for(var stat in stats){
            stats[stat]=stats[stat].toString();
            if (stats[stat].length < 7){
                for(var i=0;i<7-stats[stat].length;i++){
                    stats[stat]+=" ";
                }
            }
        }
        return stats;
    },
    makeAndPlaceLabel:function(value,fntName, fntSize,size , align, pos, zorder){
        var lbl = cc.LabelTTF.create(value, fntName, fntSize, size, align);
        this.addChild(lbl);
        lbl.setPosition(pos);
        lbl.setZOrder(zorder);
        return lbl;
    },
    placeElement:function(entry){

        //make elment
        var element = spriteDefs[entry.name].elementType;
        var elementSprite = jc.elementSprite(element);

        //if set, remove
        if (this.statsFrame.element){
            this.removeChild(this.statsFrame.element);
        }

        if (!this.statsFrame.info){
            this.statsFrame.info = new jc.CompositeButton();
            this.statsFrame.info.initWithDefinition({
                "main":"infoButton.png",
                "pressed":"infoButton.png"
            },this.infoTouch.bind(this));
            this.statsFrame.info.setPosition(cc.p(135, 260));
            this.addChild(this.statsFrame.info);
        }else{
            this.statsFrame.info.setZOrder(this.statsFrame.card.getZOrder()+1);
        }

        //if not none (undefined)
        if (elementSprite){
            this.statsFrame.element = elementSprite;
            this.addChild(this.statsFrame.element);
            var cardPos = this.statsFrame.getPosition();
            var cardZOrder = this.statsFrame.getZOrder();
            var cardTr = this.statsFrame.card.getTextureRect();
            elementSprite.setPosition(cc.p(243, 135));
            elementSprite.setZOrder(cardZOrder+1);
        }



    },
    infoTouch:function(){
        console.log("infoTouch");
    },
    swapCharacterCard:function(card){
        var pos = this.statsFrame.getPosition();
        card.setPosition(cc.p(185,pos.y));
        var swapFade = jc.swapFade.bind(this);
        swapFade(this.statsFrame.card, card);
        this.statsFrame.card = card;
    },
    previousChar:function(){
        this.tableView.left();
    },
    nextChar:function(){
        this.tableView.right();
    },
    close:function(){
        this.done();
        jc.fadeOut(this.statsFrame.card,1);
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
                        "top":-40,
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
                        "top":31,
                        "left":-31
                    },
                    "itemPadding":{
                        "top":0,
                        "left":6
                    },
                    "members":[
                        {
                            "type":"sprite",
                            "sprite":"level_0000_Layer-6.png"
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
                        "left":-20
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


EditTeam.getInstance = function() {
    if (!hotr.editTeam){
        hotr.editTeam = new EditTeam();
        hotr.editTeam.init();
    }
    return hotr.editTeam;
};

