var SelectTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    cellPrefix:"gridCells",
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.highlight = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmallSelected.png");
            this.highlight.setVisible(false);
            this.addChild(this.highlight);
            this.name = "SelectTeam";
            jc.layerManager.pushLayer(this);
            ;

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
        if (!this.first){
            //llp through characters
            this.start();
            var formationOrder = hotr.blobOperations.getFormationOrder();
            for (var i =0; i<formationOrder.length; i++){
                if (formationOrder[i]!=undefined){
                    var cell = i;
                    this.doSelectionData(formationOrder[i], cell);
                    this.doSelectionVisual(formationOrder[i], cell, this.cellPrefix+i);
                }
            }
            this.first = true;
        }else if (hotr.scratchBoard.selectedCharacter!=undefined && hotr.scratchBoard.currentCell!=undefined){
            var id = hotr.blobOperations.indexToId(hotr.scratchBoard.selectedCharacter);
            var cell = parseInt(hotr.scratchBoard.currentCell.replace(this.cellPrefix, ""));
            this.removeExistingVisual(id, cell);
            this.doSelectionData(id, cell);
            this.doSelectionVisual(id, cell, hotr.scratchBoard.currentCell);
            hotr.scratchBoard.selectedCharacter = undefined;
            hotr.scratchBoard.currentCell = undefined;
        }
    },
    removeExistingVisual:function(id,cell){
        var oldCell = hotr.blobOperations.getCurrentFormationPosition(id);
        if (oldCell != -1){
            var cellName = this.cellPrefix + oldCell;
            if (this[cellName].pic){
                jc.fadeOut(this[cellName].pic);
            }
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
            this.addChild(card);
            jc.fadeIn(card, 255);
        }

        //set it
        this[cellName].pic=card;

        //reorder it
        this.reorderChild(card,this[cellName].getZOrder());

        //add a border if it's not there
        if (!this[cellName].border) {
            this[cellName].border = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmall.png")
            this.addChild(this[cellName].border);
            this.centerThisPeer(this[cellName].border, this[cellName]);
            this.reorderChild(this[cellName].border, this[cellName].pic.getZOrder()+1);
        }
    },
    doSelectionData:function(id, cell){
        hotr.blobOperations.placeCharacterFormation(id, cell);
    },
    previousFormation:function(){
        console.log("previous");
    },
    nextFormation:function(){
        console.log("next");
    },
    fightStart:function(){
        hotr.mainScene.layer.arenaPre();
    },
    kikStart:function(){

        cards.browser.setOrientationLock('portrait');
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

            cards.browser.setOrientationLock('landscape');
        });

        //launch picker
        //send msg
        //from msg, init battle
        //send back
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
            "z":1,
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
                    "touchDelegateName":"close",
                    "z":2,

                },
                "gridCells":{
                    "isGroup":true,
                    "z":2,
                    "type":"grid",
                    "cols":4,
                    "cell":7,
                    "anchor":['top'],
                    "padding":{
                        "top":50,
                        "left":10
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
                    "cell":9,
                    "anchor":['left'],
                    "padding":{
                        "top":50,
                        "left":-200
                    },
                    "type":"sprite",
                    "sprite":"formationFrame.png",
                    "z":2,
                },
                "description":{
                    "cell":5,
                    "anchor":['right'],
                    "padding":{
                        "top":40,
                        "left":123
                    },
                    "type":"sprite",
                    "sprite":"descriptionWindow.png"
                },
                "formationSelect":{
                    "isGroup":true,
                    "type":"line",
                    "cell":2,
                    "anchor":['roght', 'top'],
                    "padding":{
                        "top":30,
                        "left":70
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
                    "cell":2,
                    "anchor":['right'],
                    "padding":{
                        "top":10,
                        "left":0
                    },
                    "type":"button",
                    "main":"buttonFight.png",
                    "pressed":"buttonFight.png",
                    "touchDelegateName":"fightStart"
                },
                "kikButton":{
                    "cell":3,
                    "anchor":['left'],
                    "padding":{
                        "top":10,
                        "left":-10
                    },
                    "type":"button",
                    "main":"buttonKikNormal.png",
                    "pressed":"buttonKikPressed.png",
                    "touchDelegateName":"kikStart"

                }
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

