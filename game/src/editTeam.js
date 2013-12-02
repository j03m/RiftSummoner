var EditTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:200,
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
        this.letterBoxVertical();
        this.start();

        //hack need to paint two black bands over the right/left of the screen because my scroller needs to be screen wide :/


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
            pos.y+=56;
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
        this.characterPortraitsLeft.setZOrder(9);
        this.characterPortraitsRight.setZOrder(9);
        this.mainFrame.setZOrder(-1);
        this.statsFrame.setZOrder(2);
    },
    outTransitionsComplete:function(){
        jc.layerManager.popLayer();
    },
    makeScrollSprites: function(names){
        var characters =  _.map(names, function(name){
            return this.makeScrollSprite(name);
        }.bind(this));

        //empty
        var sprite = new cc.Sprite();
        sprite.initWithSpriteFrameName("characterPortraitFrame.png");
        characters.push(sprite);
        return characters;

    },
    makeScrollSprite: function(name){
        var sprite = new cc.Sprite();
        sprite.initWithSpriteFrameName("characterPortraitFrame.png");
        sprite.pic = jc.getCharacterPortrait(name, sprite.getContentSize());
        sprite.addChild(sprite.pic);
        this.scaleTo(sprite.pic, sprite);
        jc.scaleCard(sprite.pic);
        this.centerThisChild(sprite.pic, sprite);
        sprite.pic.setZOrder(-1);
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
        if (data){
            //index of card, data = character id
            var characterEntry = hotr.blobOperations.getEntryWithId(data);

            this.lastSelection = characterEntry

            //get card image from jc.getCharacterCard
            var card = jc.getCharacterCard(characterEntry.name);

            //put this card sprite in the frame
            this.swapCharacterCard(card);

            this.placeElement(characterEntry);

            this.placeAttackTypes(characterEntry);

            //update labels
            this.updateStats(characterEntry);
        }else{
            this.mainFrame.removeChild(this.statsFrame.card);
            this.lastSelection=undefined;
            this.statsFrame.card=undefined;
            this.removeChild(this.statsFrame.element);
            this.removeChild(this.statsFrame.info);
            this.clearStats();
            this.clearAttackTypes();
        }
    },
    clearAttackTypes:function(){
        if (this.ground){
            this.removeChild(this.ground);
        }
        if (this.air){
            this.removeChild(this.air);
        }

    },
    placeAttackTypes:function(entry){
        this.clearAttackTypes();

        var caps = jc.getCapability(entry.name);
        if (caps.ground){
            this.ground = caps.ground;
            this.addChild(caps.ground)
            this.ground.setPosition(cc.p(205,545));
        }

        if (caps.air){
            this.air = caps.air;
            this.addChild(caps.air)
            this.air.setPosition(cc.p(275,545));
        }
    },
    clearStats:function(){
        var stats = jc.makeStats();
        var prefix = "lbl";
        for (var stat in stats){
            var lblName = prefix+stat;
            if (this[lblName]){
                this.removeChild(this[lblName]);
            }
        }
    },
    updateStats:function(entry){
        var stats = jc.makeStats(entry.name);
        stats = this.makeStringStats(stats);

        var size = cc.size(80, 20);
        var align = cc.TEXT_ALIGNMENT_LEFT;
        var fntSize = 16;
        var fntName = "gow";
        var firstPos = cc.p(250, 490);
        var spacing = 37;
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
            },this.infoTouch.bind(this), this.infoPress.bind(this));
            this.statsFrame.info.setPosition(cc.p(330, 555));
            this.addChild(this.statsFrame.info);
        }else{
            this.statsFrame.info.setZOrder(this.statsFrame.getZOrder()+2);
        }

        //if not none (undefined)
        if (elementSprite){
            this.statsFrame.element = elementSprite;
            this.addChild(this.statsFrame.element);
            var cardPos = this.statsFrame.getPosition();
            var cardZOrder = this.statsFrame.getZOrder();
            var cardTr = this.statsFrame.card.getTextureRect();
            elementSprite.setPosition(cc.p(565, 275));
            elementSprite.setZOrder(cardZOrder+2);

        }



    },
    infoPress: function(){
        this.buildInfoDialogForSelectedCharacter();

    },
    buildInfoDialogForSelectedCharacter:function(){
        //title label
        var size = cc.size(80, 20);
        var align = cc.TEXT_ALIGNMENT_LEFT;
        var fntSize = 16;
        var fntName = "gow";
        var titlePos = this.infoPos;
        titlePos.y -= 25;
        var descPos = this.infoPos;


        var zorder = this.statsFrame.getZOrder()+1;


        this.infoDialog.title = this.makeAndPlaceLabel(this.lastSelection.formalName, fntName, fntSize, size, align, titlePos,zorder);
        this.infoDialog.desc = this.makeAndPlaceLabel(this.lastSelection.details, fntName, fntSize, size, align, descPos,zorder);

        jc.fadeIn(this.infoDialog,255, jc.defaultTransitionTime*2, function(){
            this.scheduleOnce(this.infoFade.bind(this),2);
        }.bind(this));
    },
    infoTouch:function(){
        this.doInfoFadeOut = true;
    },
    infoFade:function(){
        if (this.doInfoFadeOut){
            jc.fadeOut(this.infoDialog,jc.defaultTransitionTime*2);
            jc.fadeOut(this.infoDialog.title,jc.defaultTransitionTime*2);
            jc.fadeOut(this.infoDialog.desc,jc.defaultTransitionTime*2);
            this.doInfoFadeOut = false;
        }else{
            this.scheduleOnce(this.infoFade.bind(this),2);
        }
    },
    swapCharacterCard:function(card){
        var pos = this.statsFrame.getPosition();
        card.setPosition(cc.p(360,pos.y-10));
        if (this.statsFrame.card){
            var swapFade = jc.swapFade.bind(this.mainFrame);
            swapFade(this.statsFrame.card, card, false);
        }else{
            this.mainFrame.addChild(card);
        }
        this.statsFrame.card = card;
        card.setZOrder(1);
        this.statsFrame.setZOrder(2);

    },
    previousChar:function(){
        this.tableView.left();
    },
    nextChar:function(){
        this.tableView.right();
    },
    close:function(){
        this.done();
        if (this.statsFrame.card){
            jc.fadeOut(this.statsFrame.card,1);
        }

    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"top",
            "transitionOut":"top",
            "sprite":"genericBackground.png",
            "padding":{
                "top":-10,
                "left":0
            },
            "kids":{
                "closeButton":{
                    "cell":9,
                    "anchor":['center', 'right'],
                    "padding":{
                        "top":0,
                        "left":0
                    },
                    "type":"button",
                    "main":"closeButton.png",
                    "pressed":"closeButtonPressed.png",
                    "touchDelegateName":"close"

                },
                "statsFrame":{
                    "cell":4,
                    "anchor":['center', 'left'],
                    "type":"sprite",
                    "sprite":"statsFrame.png",
                    "padding":{
                        "top":-125,
                        "left":55,
                    }
                },
                "powerLevels":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":5,
                    "cell":8,
                    "anchor":['center'],
                    "padding":{
                        "top":9,
                        "left":65
                    },
                    "itemPadding":{
                        "top":0,
                        "left":11
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
                    "anchor":['center', 'bottom'],
                    "padding":{
                        "top":-60,
                        "left":77
                    },
                    "itemPadding":{
                        "top":0,
                        "left":-2
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
                    "cell":5,
                    "anchor":['left'],
                    "padding":{
                        "top":-45,
                        "left":145
                    }
                },
                "nextLevel":{
                    "cell":5,
                    "anchor":['right'],
                    "padding":{
                        "top":45,
                        "left":5
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
                    "anchor":['left'],
                    "padding":{
                        "top":50,
                        "left":5
                    }
                },
                "doneButton":{
                    "type":"button",
                    "main":"buttonDone.png",
                    "pressed":"buttonDonePressed.png",
                    "touchDelegateName":"doneButton",
                    "cell":3,
                    "anchor":['left'],
                    "padding":{
                        "top":25,
                        "left":-30
                    }
                },
                "characterPortraitsFrame":{
                    "type":"sprite",
                    "sprite":"characterPortraitsFrame.png",
                    "cell":2,
                    "anchor":['top'],
                    "padding":{
                        "top":-20,
                        "left":-90
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
                        "top":-15,
                        "left":0
                    },
                    z:10,
                },
                "characterPortraitsRight":{
                    "type":"button",
                    "main":"characterPortraitsButtonRight.png",
                    "pressed":"characterPortraitsButtonRightPressed.png",
                    "touchDelegateName":"nextChar",
                    "cell":3,
                    "anchor":['top'],
                    "padding":{
                        "top":-20,
                        "left":-30
                    },
                    z:10,
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

