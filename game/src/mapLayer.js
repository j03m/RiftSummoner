var MapLayer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(touchUiPlist);
            this.initFromConfig(this.windowConfig);
            this.bubbleAllTouches(true);
            jc.layerManager.pushLayer(this);
            jc.log(['map'], 'init');
            this.tutorialStep1 = cc.p(500 * jc.assetScaleFactor,500* jc.assetScaleFactor);
            this.tutorialStep2 = cc.p(800 * jc.assetScaleFactor,500* jc.assetScaleFactor);
            this.tutorialStep3 = cc.p(400 * jc.assetScaleFactor,600* jc.assetScaleFactor);
            this.start();
            return true;
        } else {
            return false;
        }
    },
    inTransitionsComplete:function(){

        this.summonFrame.setVisible(false);
        this.summonFrame.setZOrder(jc.topMost);
        this.infoDialog.setVisible(false);
        this.infoDialog.setZOrder(jc.topMost);
        this.summonRestore = this.summonFrame.getPosition();
        this.centerThisChild(this.summonFrame, this);
        if (this.level < 5){
            this.buttonSummon.setVisible(false);
            this.buttonStore.setVisible(false);
            this.buttonHero.setVisible(false);
        }

    },
    onShow:function(){
        this.allowOnce = false;
        this.buttonsEnabled = true;
        jc.log(['map'], 'show');
        //play ftue step
//        hotr.playerBlob.questLevel = 5;
//        hotr.playerBlob.teamformation = [];
//        hotr.playerBlob.myguys = hotr.makeRandomTeam();
//        hotr.blobOperations.saveBlob();
//        this.level =5;
        this.level = hotr.blobOperations.getLevel();
        jc.log(['map'], 'level:'+this.level);
        if (this.level == 0){
            hotr.blobOperations.incrementLevel();
            this.level =1;
        }

        this.flagAttack1.setVisible(false);
        this.flagAttack2.setVisible(false);
        this.flagAttack3.setVisible(false);
        this.flagAttack4.setVisible(false);
        this.flagAttack5.setVisible(true);


        //remove this:
        if (this.level == 1){
            jc.log(['map'], 'ftue');
            //(msg, time, direction, character, callbackIn, callbackOut){
            hotr.blobOperations.setTutorialStep(1);
            this.scheduleOnce(function(){
                this.showTutorialStep("I am honored to meet you, Summoner. But, an orc raiding party approaches. We have work to do.",
                    undefined,
                    "left",
                    "girl");
            }.bind(this));

            this.step = 1;
        } else if (this.level == 2){
            jc.log(['map'], 'ftue2');
            //(msg, time, direction, character, callbackIn, callbackOut){
            hotr.blobOperations.setTutorialStep(1);
            this.scheduleOnce(function(){
                this.showTutorialStep("There's more! We need to fight again.",
                    undefined,
                    "left",
                    "girl");
            }.bind(this));

            this.step = 1;
        }else if (this.level == 3){
            jc.log(['map'], 'ftue3');
            hotr.blobOperations.setTutorialStep(1);
            this.scheduleOnce(function(){
                this.showTutorialStep("Wait, something is wrong. There's a strange power amassing outside the city gates. We need to hurry.",
                    undefined,
                    "left",
                    "girl");
            }.bind(this));

            this.step = 1;

        }else if (this.level == 4 && this.step !=8){
            jc.log(['map'], 'ftue3');
            hotr.blobOperations.setTutorialStep(1);
            this.scheduleOnce(function(){
                this.showTutorialStep("The great city of Old Vallation...destroyed. Hundreds of lives sacrificed...But there is no time to dwell on those lost.",
                    undefined,
                    "left",
                    "girl");
            }.bind(this));

            this.step = 1;

        }else{
            this.removeGirl = true;
            this.showTutorialStep("We've unlocked a random assortment of characters for you to fight. You may use the summon button at any time. Have a play, enjoy the demo.",
                undefined,
                "left",
                "girl");
        }
    },
    targetTouchHandler:function(type, touch, sprites) {

        //hide the summoner card
        if (this.summoning){
            this.summoning = false;
            this.slideoutSummonStuff();
        }

        jc.log(['map'], 'touch:' + type);
        if (type == jc.touchEnded){
            if (this.level==1){
                this.level1Tutorial();
            }else if (this.level == 2){
                this.level2Tutorial();
            }else if (this.level == 3){
                this.level3Tutorial();
            }else if (this.level == 4){
                this.level4Tutorial();
            }else if (this.removeGirl){
                this.removeTutorialStep('girl', 'left');
                this.removeGirl = false;
            }else{
                hotr.mainScene.layer.arenaPre();
            }
        }

        return true;

    },
    level4Tutorial:function(){
        if (this.step == 1){
            this.attachMsgTo("Your coming is omen then. Only a summoner can bring forth the creatures of The Rift. With your help we must raise an army to defeat the Dark One.", this.guideCharacters['girl'], 'right');
            this.step = 2;
        }else if (this.step == 2){
            this.attachMsgTo("We will need to build your strength. The Rift stones you've collected will allow us to summon minions to your cause.", this.guideCharacters['girl'], 'right');
            this.step = 3;
        }else if (this.step == 3){
            this.attachMsgTo("Touch the summon button to summon a minion to your aide.", this.guideCharacters['girl'], 'right');
            this.step = 4;
        }else if (this.step == 4){
            this.removeTutorialStep('girl', 'left');
            this.buttonSummon.setVisible(true);

            this.placeArrowOn(this.buttonSummon, "down");
            this.step = 5;
        }else if (this.step == 5){
            this.showTutorialStep("Each time you kill an enemy, you gain coins and possibly Rift Stones. Each time you summon it will cost you a stone.",
                undefined,
                "left",
                "girl");
            this.step = 6;
        }else if (this.step ==6){
            this.attachMsgTo("Learn more about your Heroes and how to leverage them in the Hero Room", this.guideCharacters['girl'], "right");
            this.step =7;
        }else if (this.step ==7){
            this.removeTutorialStep('girl', 'left')
            this.buttonHero.setVisible(true);
            this.placeArrowOn(this.buttonHero, "down");
            this.step =8;
        }else if (this.step == 8){
            this.showTutorialStep("From here on out in the demo, you will face randomly generated opponents.",
                undefined,
                "left",
                "girl");
            hotr.playerBlob.questLevel = 10;
            this.level = 10;
            hotr.blobOperations.saveBlob();
        }
    },
    level3Tutorial:function(){
        if (this.step == 1){
            this.removeTutorialStep('girl', 'left');
            this.placeArrow(this.tutorialStep2, "down");
            this.step = 2;
        }else if (this.step == 2){
            if (!this.allowOnce){
                this.allowOnce = true;
                jc.log(['map'], 'going to team');
                this.removeChild(this.arrow, true);
                hotr.mainScene.layer.arenaPre();
            }
        }
    },
    level2Tutorial:function(){
        if (this.step == 1){
            this.showTutorialStep("Do you think because you killed some puny goblins that we would run away scared? You wil die, summoner.",
                undefined,
                "right",
                "orc");
            this.step=2;
        }else if(this.step == 2){
            this.removeTutorialStep('orc', 'right', function(){
                this.attachMsgTo("Hmm, these fiends are much more aggressive than usual... No matter, let us drive them off.", this.guideCharacters['girl'], 'right');
                this.step =3;
            }.bind(this));
        }else if (this.step == 3){
            this.removeTutorialStep ('girl', 'left');
            this.placeArrow(this.tutorialStep2, "down");
            this.step = 4;
        }else if (this.step == 4){
            if (!this.allowOnce){
                this.allowOnce = true;
                jc.log(['map'], 'going to team');
                this.removeChild(this.arrow, true);
                hotr.mainScene.layer.arenaPre();
            }
        }
    },
    level1Tutorial:function(){
        if (this.step == 1){
            this.showTutorialStep("Our master wants your head, summoner. Come with us and we'll spare the city.",
                undefined,
                "right",
                "orc");
            this.step=2;
        }else if (this.step == 2){
           this.removeTutorialStep('orc', 'right', function(){
               this.attachMsgTo("Orc bravado. Pathetic. Let us show them what you can do.", this.guideCharacters['girl'], 'right');
               this.step =3;
           }.bind(this));
        }else if (this.step == 3){
            this.removeTutorialStep ('girl', 'left');
            this.placeArrowOn(this.flagAttack5, "down", cc.p(-20*jc.assetScaleFactor, 0));
            this.step = 4;
        }else if (this.step == 4){
            jc.log(['map'], 'touch ended');
            if (!this.allowOnce){
                this.allowOnce = true;
                jc.log(['map'], 'going to team');
                this.removeChild(this.arrow, true);
                hotr.mainScene.layer.arenaPre();
            }
        }
    },
    heroClick:function(){
        if (!this.buttonsEnabled){ return;}
        this.removeArrow();
        this.buttonsEnabled = false;
        jc.layerManager.pushLayer(EditTeam.getInstance(),10);

    },
    summon:function(){
        if (!this.buttonsEnabled){ return;}

        this.removeArrow();
        this.flash();
        this.summoning=true;

        //todo replace with online service
        var card = hotr.randomCard();
        hotr.playerBlob.myguys.push({name:card, id:jc.randomNum(1000,9000)});
        //todo: adjust blob

        var cardSprite = jc.getCharacterCard(card);
        this.summonFrame.card = card;
        this.summonFrame.cardSprite = cardSprite;
        this.summonFrame.addChild(cardSprite);
        this.centerThisChild(cardSprite, this.summonFrame);
        this.summonFrame.cardSprite.setZOrder(-1);
        this.summonFrame.setVisible(true);
        this.scheduleOnce(function(){
            var pos = this.summonFrame.getPosition();
            var size = this.summonFrame.getContentSize();

            var move = cc.MoveTo.create(jc.defaultTransitionTime,cc.p(512*jc.assetScaleFactor,pos.y));
            this.summonFrame.runAction(move);
            this.infoSlideIn(card);


        }.bind(this), 0.25);
    },
    infoSlideIn:function(name){

        var cardPos = this.summonFrame.getBoundingBox();
        var from = cc.p(1365*jc.assetScaleFactor, this.winSize.height + this.infoDialog.getContentSize().height);
        var to = cc.p(1365*jc.assetScaleFactor, 680*jc.assetScaleFactor);
        var def = spriteDefs[name];
        var theSize = cc.size(jc.font.fontSizeRaw* def.formalName.length, jc.font.fontSizeRaw);
        this.infoTitle.setContentSize(theSize);
        var size = this.infoDialog.getContentSize();
        var pos = this.infoTitle.getPosition();
        this.infoTitle.setPosition(cc.p(size.width/2, pos.y));
        this.infoTitle.setText(def.formalName);
        this.infoText.setText(def.details)
        this.infoDialog.setVisible(true);
        this.slide(this.infoDialog, from, to, jc.defaultTransitionTime, cc.p(0,jc.defaultNudge), 'after',function(){

        });
    },
    slideoutSummonStuff:function(){
        this.summonFrame.setVisible(false);
        this.summonFrame.setPosition(this.summonRestore);
        this.slideOutToTop(this.infoDialog, jc.defaultTransitionTime, undefined, function(){
            this.infoDialog.setVisible(false);
        }.bind(this));
    },
    storeClick:function(){
        if (!this.buttonsEnabled){ return;}
    },
    windowConfig: {
        "mainFrame": {
            "type": "sprite",
            "applyAdjustments": true,
            "sprite": "map2.png",
            "z": 1,
            "pos": {
                "x": 1004,
                "y": 756
            },
            "kids": {
                "buttonHero": {
                    "type": "button",
                    "main": "buttonStore.png",
                    "pressed": "buttonStorePressed.png",
                    "touchDelegateName": "heroClick",
                    "z": 1,
                    "pos": {
                        "x": 1700,
                        "y": 110
                    }
                },
                "buttonStore": {
                    "type": "button",
                    "main": "buttonStore.png",
                    "pressed": "buttonStorePressed.png",
                    "touchDelegateName": "storeClick",
                    "z": 1,
                    "pos": {
                        "x": 1520,
                        "y": 110
                    }
                },
                "buttonSummon": {
                    "type": "button",
                    "main": "buttonSummon.png",
                    "pressed": "buttonSummonPressed.png",
                    "touchDelegateName": "summon",
                    "z": 1,
                    "pos": {
                        "x": 1880,
                        "y": 110
                    }
                },
                "flagAttack1": {
                    "type": "sprite",
                    "sprite": "flagAttack.png",
                    "z": 1,
                    "pos": {
                        "x": 1383,
                        "y": 820
                    }
                },
                "flagAttack2": {
                    "type": "sprite",
                    "sprite": "flagAttack.png",
                    "z": 1,
                    "pos": {
                        "x": 989,
                        "y": 793
                    }
                },
                "flagAttack3": {
                    "type": "sprite",
                    "sprite": "flagAttack.png",
                    "z": 1,
                    "pos": {
                        "x": 662,
                        "y": 639
                    }
                },
                "flagAttack4": {
                    "type": "sprite",
                    "sprite": "flagAttack.png",
                    "z": 1,
                    "pos": {
                        "x": 407,
                        "y": 493
                    }
                },
                "flagAttack5": {
                    "type": "sprite",
                    "sprite": "flagAttack.png",
                    "z": 1,
                    "pos": {
                        "x": 600,
                        "y": 241
                    }
                },
                "summonFrame": {
                    "type": "sprite",
                    "sprite": "cardSummonedFrame.png",
                    "z": 0,
                    "pos": {
                        "x": 1032,
                        "y": 602
                    }
                },
                "infoDialog": {
                    "type": "sprite",
                    "sprite": "titleDescription.png",
                    "kids": {
                        "infoTitle": {
                            "type": "label",
                            "text": "TITLE",
                            "width": 500,
                            "height": 80,
                            "alignment": cc.TEXT_ALIGNMENT_CENTER,
                            "fontSize": 40,
                            "fontName": "GODOFWAR",
                            "z": 4,
                            "pos": {
                                "x": 450,
                                "y": 580
                            }
                        },
                        "infoText": {
                            "type": "label",
                            "text": "DESC",
                            "width": 600,
                            "height": 400,
                            "alignment": cc.TEXT_ALIGNMENT_LEFT,
                            "fontSize": 40,
                            "fontName": "GODOFWAR",
                            "z": 4,
                            "pos": {
                                "x": 420,
                                "y": 290
                            }
                        }
                    },
                    "z": 0,
                    "pos": {
                        "x": 1458,
                        "y": 602
                    }
                }
            }
        }
    }
});

MapLayer.scene = function() {
    if (!hotr.mapScene){
        hotr.mapScene = cc.Scene.create();
        hotr.mapScene.retain();
        hotr.mapScene.layer = new MapLayer();

        hotr.mapScene.addChild(hotr.mapScene.layer);
        hotr.mapScene.layer.init();

    }
    return hotr.mapScene;
};
