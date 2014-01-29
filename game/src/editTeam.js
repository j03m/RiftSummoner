var EditTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(cardsPlists[0]);
            this.initFromConfig(this.windowConfig);
            this.name = "EditTeam";
            //this.bubbleAllTouches(true);
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();

        //this.infoFadeWorker();

        var scrollData = this.getDisplaySpritesAndMetaData();
        this.cellWidth = scrollData.sprites[0].getContentSize().width*2;
        if (this.tableView){
            this.tableView.clear()
            this.removeChild(this.tableView, true);
        }

        this.tableView = new jc.ScrollingLayer();

        this.tableView.init({
            sprites:scrollData.sprites,
            metaData:scrollData.ids,
            cellWidth:this.cellWidth,
            selectionCallback:this.selectionCallback.bind(this),
            width:this.winSize.width
        });

        var tableDim = this.tableView.getContentSize();
        var y = tableDim.height/2;
        y += 25 * jc.assetScaleFactor;
        this.tableView.setPosition(cc.p(tableDim.width/2,y ));
        this.reorderChild(this.tableView, 3);
        this["characterPortraitsFrame"].addChild(this.tableView);
        this.tableView.hackOn();
        this.tableView.setIndex(1);


    },
    inTransitionsComplete:function(){
        this.level = hotr.blobOperations.getTutorialLevel();
        this.step = hotr.blobOperations.getTutorialStep();
        if (!this.firstShow){
            this.tableView.setIndex(1);
            if (this.level == 1 && this.step == 7){
                this.showTutorialStep("Okay, now select a character for the fight below - choose wisely.", 1.5 , "left", "girl");
            }
            this.firstShow = true;
        }else{
            this.step = hotr.blobOperations.getTutorialStep();
            if (this.step == 12){
                var position = cc.p(1450 * jc.assetScaleFactor , 400 * jc.assetScaleFactor);
                this.placeArrow(position, "down");
            }
        }

    },
    outTransitionsComplete:function(){
        jc.layerManager.popLayer();
    },
    makeScrollSprites: function(names){
        var characters =  _.map(names, function(name){
            return this.makeScrollSprite(name);
        }.bind(this));

        //empty

        var sprite = jc.makeSimpleSprite("characterPortraitFrame.png");
        characters.push(sprite);
        return characters;

    },
    makeScrollSprite: function(name){
        var sprite = jc.makeSimpleSprite("characterPortraitFrame.png");
        sprite.pic = jc.getCharacterCard(name);
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
            var sprite = jc.makeSimpleSprite("characterPortraitFrame.png");
            if (!this.cellWidth){
                this.cellWidth = sprite.getTextureRect().width + 100;
            }
            returnme.push(sprite);
        }
        return returnme;
    },
    targetTouchHandler: function(type, touch, sprites) {
        return true;
    },
    "trainPower": function(){
        jc.log(['editTeam'], "train");
    },
    "doneTouch": function(){
        hotr.scratchBoard.selectedCharacter = this.tableView.selectedIndex;
        this.close();
    },
    selectionCallback:function(index, sprite, data){
        if (data){
            //index of card, data = character id

            this.card.setVisible(true);
            this.element.setVisible(true);
            //this.info.setVisible(true);

            var characterEntry = hotr.blobOperations.getEntryWithId(data);

            this.lastSelection = characterEntry

            //get card image from jc.getCharacterCard
            var card = jc.getCharacterCardFrame(characterEntry.name);

            //put this card sprite in the frame
            this.swapCharacterCard(card);

            this.placeElement(characterEntry);

            this.placeAttackTypes(characterEntry);

            //update labels
            this.updateStats(characterEntry);

            this.infoPress();



            if (this.level == 1 && this.step == 7){
                var position = cc.p(825 * jc.assetScaleFactor , 400 * jc.assetScaleFactor);
                this.placeArrow(position, "down");
                this.step = 8;
            }else if (this.level == 1 && this.step ==8){
                this.step = 9;
                hotr.blobOperations.setTutorialStep(9);
                this.placeArrowOn(this.doneButton, "down");
            }else if (this.level == 1 && this.step == 12){
                this.step = 13;
                hotr.blobOperations.setTutorialStep(13);
                this.placeArrowOn(this.doneButton, "down");
            }
        }else{
            this.card.setVisible(false);
            this.lastSelection=undefined;
            this.element.setVisible(false);
            //this.info.setVisible(false);

            this.hideStats();
            this.clearAttackTypes();
        }
    },
    clearAttackTypes:function(){
        this.ground.setVisible(false);
        this.air.setVisible(false);
    },
    placeAttackTypes:function(entry){
        this.clearAttackTypes();

        var def = spriteDefs[entry.name];
        if (def.gameProperties.targets == 0){
            this.ground.setVisible(false);
            this.air.setVisible(true);
        }

        if (def.gameProperties.targets == 1){
            this.ground.setVisible(true);
            this.air.setVisible(false);
        }

        if (def.gameProperties.targets == 2){
            this.ground.setVisible(true);
            this.air.setVisible(true);
        }
    },
    hideStats:function(){
        var stats = jc.makeStats();
        var prefix = "lbl";
        for (var stat in stats){
            var lblName = prefix+stat;
            if (this[lblName]){
                this[lblName].setVisible(false);
            }
        }
    },
    showStats:function(){
        var stats = jc.makeStats();
        var prefix = "lbl";
        for (var stat in stats){
            var lblName = prefix+stat;
            if (this[lblName]){
                this[lblName].setVisible(true);
            }
        }
    },
    updateStats:function(entry){
        this.showStats();
        var stats = jc.makeStats(entry.name);
        stats = this.makeStringStats(stats);

        var prefix = "lbl";
        for (var stat in stats){
            var lblName = prefix+stat			
            this[lblName].setText(stats[stat]);
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
    placeElement:function(entry){

        //make elment
        var element = spriteDefs[entry.name].elementType;
        var elementSprite = jc.elementSprite(element);
        if (elementSprite == undefined){
            this.element.setVisible(false);
        }else{
            this.element.setVisible(true);
            jc.swapSpriteFrameName(this.element, elementSprite);
        }

    },
    infoPress: function(){
        this.buildInfoDialogForSelectedCharacter(spriteDefs[this.lastSelection.name]);
    },
    buildInfoDialogForSelectedCharacter:function(entry){

        this.infoTitle.setText(entry.formalName);
        this.infoText.setText(entry.details);
//        this.doInfoFadeOut = false;
//        this.infoFadeIn();
    },
    infoTouch:function(){
        this.doInfoFadeOut = true;
    },
    infoFadeIn:function(){
        this.powerFade('out');
        jc.fadeIn(this.infoTitle, 255,jc.defaultTransitionTime*2);
        jc.fadeIn(this.infoText, 255,jc.defaultTransitionTime*2);
        jc.fadeIn(this.infoDialog, 255, jc.defaultTransitionTime*2, function(){
            this.scheduleOnce(this.infoFade.bind(this),2);
        }.bind(this));
    },
    infoFade:function(){
        if (this.doInfoFadeOut){
            this.infoFadeWorker();
            this.doInfoFadeOut = false;
        }else{
            this.scheduleOnce(this.infoFade.bind(this),2);
        }
    },
    powerFade:function(how){
        for(var i =0;i<5;i++){
            if (how == 'in'){
                jc.fadeIn(this["powerIcons"+i], 255,jc.defaultTransitionTime*2);
                jc.fadeIn(this["powerLevels"+i], 255,jc.defaultTransitionTime*2);
            }

            if (how == 'out'){
                jc.fadeOut(this["powerIcons"+i], jc.defaultTransitionTime*2);
                jc.fadeOut(this["powerLevels"+i],jc.defaultTransitionTime*2);
            }

        }
    },
    infoFadeWorker:function(){
        this.powerFade('in');
        jc.fadeOut(this.infoDialog,jc.defaultTransitionTime*2);
        jc.fadeOut(this.infoTitle,jc.defaultTransitionTime*2);
        jc.fadeOut(this.infoText,jc.defaultTransitionTime*2);
    },
    swapCharacterCard:function(card){
        jc.fadeOut(this.card, jc.defaultTransitionTime, function(){
            jc.swapSpriteFrame(this.card, card);
            jc.fadeIn(this.card, 255);
        }.bind(this));

    },
    previousChar:function(){
        this.tableView.left();
    },
    nextChar:function(){
        this.tableView.right();
    },
    close:function(){
        this.done();
    },
    windowConfig: 	{
	"mainFrame": {
		"blackBox":true,
		"size": {
			"width": 2048,
			"height": 1365
		},
		"type": "sprite",
		"rect": {
			"origin": {
				"x": 220,
				"y": 220
			},
			"size": {
				"width": 293,
				"height": 293
			}
		},
		"applyAdjustments": true,
		"transitionIn": "top",
		"transitionOut": "top",
		"sprite": "genericBackground.png",
		"z": 0,
		"kids": {
			"closeButton": {
				"type": "button",
				"main": "closeButton.png",
				"pressed": "closeButtonPressed.png",
				"touchDelegateName": "close",
				"z": 1,
				"pos": {
					"x": 1973,
					"y": 1081
				}
			},
			"statsFrame": {
				"type": "sprite",
				"sprite": "statsFrame.png",
				"z": 2,
				"pos": {
					"x": 596,
					"y": 731
				}
			},
//			"powerLevels": {
//				"isGroup": true,
//				"type": "grid",
//				"cols": 5,
//				"itemPadding": {
//					"top": 0,
//					"left": 30
//				},
//				"members": [
//					{
//						"type": "sprite",
//						"sprite": "level_0000_Layer-6.png"
//					}
//				],
//				"membersTotal": 5,
//				"sprite": "level_0000_Layer-6.png",
//				"z": 1,
//				"pos": {
//					"x": 1210,
//					"y": 967
//				},
//
//			},
//			"powerIcons": {
//				"isGroup": true,
//				"type": "grid",
//				"cols": 5,
//				"itemPadding": {
//					"top": 0,
//					"left": 0
//				},
//				"input": true,
//				"members": [
//					{
//						"type": "sprite",
//						"input": true,
//						"sprite": "powerIconSmallFrame.png"
//					}
//				],
//				"membersTotal": 5,
//				"sprite": "powerIconSmallFrame.png",
//				"z": 1,
//				"pos": {
//					"x": 1213,
//					"y": 797
//				},
//
//			},
//			"powerDesc": {
//				"type": "sprite",
//				"sprite": "powerIconsDescription.png",
//				"z": 1,
//				"pos": {
//					"x": 1535,
//					"y": 630
//				}
//			},
//			"nextLevel": {
//				"type": "sprite",
//				"sprite": "nextLevelCostFrame.png",
//				"z": 1,
//				"pos": {
//					"x": 1363,
//					"y": 456
//				}
//			},
//			"trainButton": {
//				"type": "button",
//				"main": "buttonTrain.png",
//				"pressed": "buttonTrainPressed.png",
//				"touchDelegateName": "trainPower",
//				"z": 1,
//				"pos": {
//					"x": 1249,
//					"y": 386
//				}
//			},
			"doneButton": {
				"type": "button",
				"main": "buttonDone.png",
				"pressed": "buttonDonePressed.png",
				"touchDelegateName": "doneTouch",
				"z": 4,
				"pos": {
					"x": 1500,
					"y": 457
				}
			},
			"characterPortraitsFrame": {
				"type": "sprite",
				"sprite": "characterPortraitsFrame.png",
				"z": 1,
				"pos": {
					"x": 1019,
					"y": 200
				}
			},
			"characterPortraitsLeft": {
				"type": "button",
				"main": "characterPortraitsButtonLeftBrown.png",
				"pressed": "characterPortraitsButtonLeftPressedBrown.png",
				"touchDelegateName": "previousChar",
				"z": 10,
				"pos": {
					"x": 97,
					"y": 208
				}
			},
			"characterPortraitsRight": {
				"type": "button",
				"main": "characterPortraitsButtonRightBrown.png",
				"pressed": "characterPortraitsButtonRightPressedBrown.png",
				"touchDelegateName": "nextChar",
				"z": 10,
				"pos": {
					"x": 1956,
					"y": 198
				}
			},
//			"info": {
//				"type": "button",
//				"main": "infoButton.png",
//				"pressDelegateName": "infoPress",
//				"touchDelegateName": "infoTouch",
//				"z": 5,
//				"pos": {
//					"x": 496,
//					"y": 981
//				}
//			},
			"card": {
				"type": "sprite",
				"sprite": "gargoyleFire_bg.png",
				"z": 1,
				"pos": {
					"x": 781,
					"y": 680
				}
			},
			"element": {
				"type": "sprite",
				"sprite": "elements_0000_void.png",
				"z": 5,
				"pos": {
					"x": 1015,
					"y": 420
				}
			},
			"air": {
				"type": "sprite",
				"sprite": "canAttackAir.png",
				"z": 1,
				"pos": {
					"x": 238,
					"y": 1039
				}
			},
			"ground": {
				"type": "sprite",
				"sprite": "canAttackGround.png",
				"z": 1,
				"pos": {
					"x": 384,
					"y": 1039
				}
			},
			"lblhp": {
				"type": "label",
				"text": "HEALTH",
				"width": 160,
				"height": 80,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 3,
				"pos": {
					"x": 335,
					"y": 875
				}
			},
			"lbldamage": {
				"type": "label",
				"text": "DAMAGE",
				"width": 160,
				"height": 80,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 3,
				"pos": {
					"x": 335,
					"y": 795
				}
			},
            "lblarmor": {
                "type": "label",
                "text": "ARMOR",
                "width": 160,
                "height": 80,
                "alignment": 0,
                "fontSize": jc.font.fontSizeRaw,
                "fontName": jc.mainFont,
                "z": 3,
                "pos": {
                    "x": 335,
                    "y": 715
                }
            },
			"lblspeed": {
				"type": "label",
				"text": "SPEED",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 3,
				"pos": {
					"x": 297,
					"y": 635
				}
			},
			"lblpower": {
				"type": "label",
				"text": "POWER",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 3,
				"pos": {
					"x": 297,
					"y": 555
				}
			},
			"lblrange": {
				"type": "label",
				"text": "RANGE",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 3,
				"pos": {
					"x": 297,
					"y": 475
				}
			},

			"infoDialog": {
				"type": "sprite",
				"sprite": "titleDescription.png",
				"z": 3,
				"pos": {
					"x": 1525,
					"y": 750
				}
			},
			"infoTitle": {
				"type": "label",
				"text": "TITLE",
				"width": 400,
				"height": 80,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 4,
				"pos": {
					"x": 1560,
					"y": 1000
				}
			},
			"infoText": {
				"type": "label",
				"text": "DESC",
				"width": 600,
				"height": 400,
				"alignment": 0,
				"fontSize": jc.font.fontSizeRaw,
				"fontName": jc.mainFont,
				"z": 4,
				"pos": {
					"x": 1525,
					"y": 680
				}
			}
		},
		"pos": {
			"x": 1024,
			"y": 768
		}
	}
} 
});


EditTeam.getInstance = function() {
    if (!hotr.editTeam){
        hotr.editTeam = new EditTeam();
        hotr.editTeam.retain();
        hotr.editTeam.init();
    }
    return hotr.editTeam;
};

