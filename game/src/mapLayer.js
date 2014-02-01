var MapLayer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.name = "tehmap";
            cc.SpriteFrameCache.getInstance().addSpriteFrames(cardsPlists[1]);
            this.initFromConfig(this.windowConfig);
            this.bubbleAllTouches(true);
            jc.layerManager.pushLayer(this, true);
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
        if (this.level < 5){
            this.buttonSummon.setVisible(false);
            this.buttonStore.setVisible(false);
            this.buttonHero.setVisible(false);
        }

    },
    onShow:function(){
        this.once = false;
        this.buttonsEnabled = true;
        jc.log(['map'], 'show');

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
        }
    },
    targetTouchHandler:function(type, touch, sprites) {
        //hide the summoner card
        if (type == jc.touchEnded){
            if (this.summoning){
                this.summoning = false;
                this.slideoutSummonStuff();
                return;
            }
            jc.log(['map'], "I like the clicking! More clicking! More!!!");


        }

       return true;

    },
    heroClick:function(){
        if (!this.buttonsEnabled){ return;}
        this.removeArrow();
        this.buttonsEnabled = false;
        jc.layerManager.pushLayer(SelectTeam.getInstance(),false);

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
    attackClick:function(){
        if (!this.buttonsEnabled){ return;}

        if (!this.once){
            this.once = true;
            hotr.mainScene.layer.arenaPre();
        }

    },
    windowConfig: {
        "mainFrame": {
            "type": "sprite",
            "sprite": "map2.png",
            "applyAdjustments":true,
            "z": 1,
            "pos": {
                "x": 1024,
                "y": 577
            },
            "kids": {
                "buttonStore": {
                    "type": "button",
                    "main": "buttonStore.png",
                    "pressed": "buttonStorePressed.png",
                    "touchDelegateName": "storeClick",
                    "z": 1,
                    "pos": {
                        "x": 1427,
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
                "buttonAttack": {
                    "type": "button",
                    "main": "buttonAttack.png",
                    "pressed": "buttonAttackPressed.png",
                    "touchDelegateName": "attackClick",
                    "z": 1,
                    "pos": {
                        "x": 1733,
                        "y": 110
                    }
                },
                "buttonChampions": {
                    "type": "button",
                    "main": "buttonChampions.png",
                    "pressed": "buttonChampionsPressed.png",
                    "touchDelegateName": "heroClick",
                    "z": 1,
                    "pos": {
                        "x": 1580,
                        "y": 107
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
                        "x": 1024 ,
                        "y": 670
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
                            "alignment": 1,
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
                            "alignment": 0,
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
