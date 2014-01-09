var MapLayer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(touchUiPlist);
            this.initFromConfig(this.windowConfig);
            this.bubbleAllTouches(true);

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
    onShow:function(){
        this.allowOnce = false;
        jc.log(['map'], 'show');
        //play ftue step
        this.level = hotr.blobOperations.getTutorialLevel();
        jc.log(['map'], 'level:'+this.level);
        if (this.level == 0){
            hotr.blobOperations.incrementLevel();
            this.level =1;
        }

        //remove this:
        if (this.level == 1){
            jc.log(['map'], 'ftue');
            //(msg, time, direction, character, callbackIn, callbackOut){
            hotr.blobOperations.setTutorialStep(1);
            this.scheduleOnce(function(){
                this.showTutorialStep("Summoner, we've been waiting for you. I am honored. We have not had one such as yourself in Old Vallation for many years. But, it seems a raiding party approaches. Our greeting need be short. ",
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

        }else if (this.level == 4){
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

            this.showTutorialStep("We've unlocked a random assortment of characters for you to fight. Have a play, enjoy the demo.",
                undefined,
                "left",
                "girl");
        }



    },
    targetTouchHandler:function(type, touch, sprites) {
        //any touch -
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
            }else{
                this.removeTutorialStep('girl', 'left');
                hotr.mainScene.layer.selectEditTeamPre();
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
            this.attachMsgTo("To be continued.....", this.guideCharacters['girl'], 'right');
            hotr.playerBlob.questLevel++;
            hotr.playerBlob.teamformation = [];
            hotr.playerBlob.myguys = hotr.makeRandomTeam();
            hotr.blobOperations.saveBlob();
            hotr.selectTeamScene = undefined;
            hotr.editTeam = undefined;
            jc.layerManager.wipe();
            this.level = 4;
            this.step = 4;
        }else if (this.step == 4){
            this.level = 5;
            this.attachMsgTo("We've unlocked a random assortment of characters for your deck. Have a play in some mock battles. Enjoy the demo.", this.guideCharacters['girl'], 'right');

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
               this.attachMsgTo("Orc bravado. Pathetic. Click the map to head them off at the old arena!", this.guideCharacters['girl'], 'right');
               this.step =3;
           }.bind(this));


        }else if (this.step == 3){
            this.removeTutorialStep ('girl', 'left');
            this.placeArrow(this.tutorialStep1, "down");
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
    windowConfig: {
        "mainFrame": {
            "applyAdjustments":true,
            "type": "sprite",
            "sprite": "map2.png",
            "z": 1,
            "pos": {
                "x": 1019,
                "y": 767
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
