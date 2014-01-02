var SelectTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    squad1Prefix:"squad1Cells",
    squad2Prefix:"squad2Cells",
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.highlight = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmallSelected.png");
            this.highlight.setVisible(false);
            this.mainFrame.addChild(this.highlight);
            this.name = "SelectTeam";
            jc.layerManager.pushLayer(this);


            //if blob formation is not set
            //use it
            //else autopop with light logic (range back most, tank front most, anyone else middle)
            //save blob formation
            //if selected character is not null
            //place that character into the cell
            //update blob formation
            this.first = false;
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
		this.nextEnabled = true;
        if (!this.first){
            //llp through characters
            this.start();
            var formationOrder = hotr.blobOperations.getFormationOrder();
            var length = hotr.teamformationSize/2;

            //first 9 characters == squad 1
            for (var i =0; i<length; i++){
                if (formationOrder[i]!=undefined){
                    var cell = i;
                    this.doSelectionData(formationOrder[i], cell);
                    this.doSelectionVisual(formationOrder[i], cell, this.squad1Prefix+i);
                }
            }

            for (var i=length; i<hotr.teamformationSize; i++){
                if (formationOrder[i]!=undefined){
                    var cell = i;
                    this.doSelectionData(formationOrder[i], cell);
                    this.doSelectionVisual(formationOrder[i], cell, this.squad2Prefix+(i-length));
                }
            }

            this.first = true;
        }else if (hotr.scratchBoard.selectedCharacter!=undefined && hotr.scratchBoard.currentCell!=undefined){

            var id = hotr.blobOperations.indexToId(hotr.scratchBoard.selectedCharacter);
            var cell = this.cellFromCellName(hotr.scratchBoard.currentCell);
            if (id){
                this.removeExistingVisual(id, hotr.scratchBoard.currentCell);
                this.doSelectionData(id, cell);
                this.doSelectionVisual(id, cell, hotr.scratchBoard.currentCell);
                hotr.scratchBoard.selectedCharacter = undefined;
                hotr.scratchBoard.currentCell = undefined;
            }else{
                if (this[hotr.scratchBoard.currentCell].pic){
                    jc.fadeOut(this[hotr.scratchBoard.currentCell].pic);
                    hotr.blobOperations.clearFormationPosition(cell);
                }
            }			
        }
    },
    cellFromCellName:function(name){
      if (name.indexOf(this.squad1Prefix)!=-1){
          return parseInt(name.replace(this.squad1Prefix, ""));
      }

      return parseInt(name.replace(this.squad2Prefix, "")) + (hotr.teamformationSize/2);
    },
    inTransitionsComplete:function(){
        if (this.first){
            this.showTutorialStep("We need to build your team - click here to select your troops!");
            var position = cc.p(300 * jc.assetScaleFactor ,1000 * jc.assetScaleFactor);
            this.placeArrow(position, "down");
        }
    },
    removeExistingVisual:function(id){
        var oldCell = hotr.blobOperations.getCurrentFormationPosition(id);
        if (oldCell != -1){
            var cellName = this.getCellName(oldCell);
            if (this[cellName].pic){
                jc.fadeOut(this[cellName].pic);
            }
        }
    },
    getCellName:function(id){
        if (id >= hotr.teamformationSize/2){
            return this.squad2Prefix+(id - (hotr.teamformationSize/2 ));
        }else{
            return this.squad1Prefix+id;
        }
    },
    doSelectionVisual:function(id, cell, cellName){
        var characterEntry = hotr.blobOperations.getEntryWithId(id);

        //get card image from jc.getCharacterCard
        var card = jc.getCharacterCard(characterEntry.name);

        //scale it to size
        this.scaleTo(card,this[cellName]);
        jc.scaleCard(card);


        //center on selected cell
        this.centerThisPeer(card, this[cellName]);


        //if one is there, hide it
        if (this[cellName].pic){
            jc.swapFade.bind(this)(this[cellName].pic, card);
        }else{ //otherwise show it
            this.mainFrame.addChild(card);
            jc.fadeIn(card, 255);
        }

        //set it
        this[cellName].pic=card;

        //reorder it
        this.reorderChild(card,this[cellName].getZOrder());

        //add a border if it's not there
        if (!this[cellName].border) {
            this[cellName].border = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmall.png")
            this.mainFrame.addChild(this[cellName].border);
            this.centerThisPeer(this[cellName].border, this[cellName]);
            this.reorderChild(this[cellName].border, this[cellName].pic.getZOrder()+1);
        }
    },
    doSelectionData:function(id, cell){
        hotr.blobOperations.placeCharacterFormation(id, cell);
    },
    previousFormation:function(){
        jc.log(['selectTeam'], "previousButton");
    },
    nextFormation:function(){
        jc.log(['selectTeam'], "nextButton");
    },
    fightStart:function(){
        if (!this.nextEnabled){
            return;
        }
        if (this.arrow){
            this.removeChild(this.arrow, true);
        }
        this.nextEnabled = false;
		var formationOrder = hotr.blobOperations.getFormationOrder();
		if (formationOrder.length!=0){
		    hotr.mainScene.layer.arenaPre();
		}      
    },
    kikStart:function(){
        if (!this.nextEnabled){
            return;
        }

        //cards.browser.setOrientationLock('free');
        cards.kik.pickUsers(function (users) {

            //todo: save to cloud, pull from cloud - no need to send the data - users can mod cheat.
            var level = hotr.blobOperations.getLevel();

            var teamA = hotr.blobOperations.getTeam();
            var teamAFormation = hotr.blobOperations.getFormation();
            var teamAPowers = hotr.blobOperations.getPowers();
            var fightConfig = {
                team:teamA,
                teamFormation:teamAFormation,
                teamPowers:teamAPowers
            };

            if (users){
                for(var i=0;i<users.length;i++){
                    cards.kik.send(users[i].username,  {title : 'Get some' ,
                        text  : 'My army will crush you'  ,
                        data  : fightConfig});
                }
            }


        });

        //launch picker
        //send msg
        //from msg, init battle
        //send back
    },
    close:function(){
        jc.log(['selectTeam'], "close");
    },
    targetTouchHandler: function(type, touch, sprites) {
        if (sprites[0]){

            if (type == jc.touchEnded){
                //on grid cell touch
                //place highlight border
                this.highlight.setVisible(true);
                var pos = sprites[0].getPosition();
                this.highlight.setPosition(pos);
                this.reorderChild(this.highlight, sprites[0].getZOrder()+1);
                //put cell # into scratchboard
                hotr.scratchBoard.currentCell = sprites[0].name;
                this.nextEnabled = false;
                if (this.arrow){
                    this.arrow.setVisible(false);
                }
                jc.layerManager.pushLayer(EditTeam.getInstance(),10);
            }
        }
        return true;
    },
    windowConfig: {
        "mainFrame": {
            "type": "sprite",
            "blackBox": true,
            "applyAdjustments": true,
            "transitionIn": "top",
            "transitionOut": "top",
            "sprite": "genericBackground.png",
            "z": 0,
            "kids": {
                "squad1Cells": {
                    "isGroup": true,
                    "z": 1,
                    "type": "grid",
                    "cols": 3,
                    "itemPadding": {
                        "top": 3,
                        "left": 4
                    },
                    "input": true,
                    "members": [
                        {
                            "type": "sprite",
                            "input": true,
                            "sprite": "portraitSmallDarkBackground.png"
                        }
                    ],
                    "membersTotal": 9,
                    "sprite": "portraitSmallDarkBackground.png",
                    "pos": {
                        "x": 310,
                        "y": 834
                    }
                },
                "squad2Cells": {
                    "isGroup": true,
                    "z": 1,
                    "type": "grid",
                    "cols": 3,
                    "itemPadding": {
                        "top": 3,
                        "left": 4
                    },
                    "input": true,
                    "members": [
                        {
                            "type": "sprite",
                            "input": true,
                            "sprite": "portraitSmallDarkBackground.png"
                        }
                    ],
                    "membersTotal": 9,
                    "sprite": "portraitSmallDarkBackground.png",
                    "pos": {
                        "x": 1234,
                        "y": 831
                    }
                },
                "fightButton": {
                    "type": "button",
                    "main": "buttonFight.png",
                    "pressed": "buttonFight.png",
                    "touchDelegateName": "fightStart",
                    "z": 1,
                    "pos": {
                        "x": 1023,
                        "y": 145
                    }
                },
                "leftSquadFrame": {
                    "type": "sprite",
                    "sprite": "frameA.png",
                    "z": 0,
                    "pos": {
                        "x": 535,
                        "y": 597
                    }
                },
                "rightSquadFrame": {
                    "type": "sprite",
                    "sprite": "frameB.png",
                    "z": 0,
                    "pos": {
                        "x": 1502,
                        "y": 593
                    }
                },
                "banner": {
                    "type": "sprite",
                    "sprite": "buildYourTeamTitle.png",
                    "z": 0,
                    "pos": {
                        "x": 1021,
                        "y": 1020
                    }
                }
            },
            "pos": {
                "x": 1024,
                "y": 777.9999999999999
            }
        }
    }
});



SelectTeam.scene = function() {
    if (!hotr.selectTeamScene){
        hotr.selectTeamScene = cc.Scene.create();
        hotr.selectTeamScene.retain();
        hotr.selectTeamScene.layer = new SelectTeam();
        hotr.selectTeamScene.layer.retain();
        hotr.selectTeamScene.addChild(hotr.selectTeamScene.layer);
        hotr.selectTeamScene.layer.init();
    }
    return hotr.selectTeamScene;
};

