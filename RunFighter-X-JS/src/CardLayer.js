var CardLayer = jc.UiElementsLayer.extend({
    cells:50,
    cellWidth:undefined,
    init: function(playerBlob, selectDelegate, cancelDelegate) {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(portraitsPlist);
            this.playerBlob = playerBlob;
            this.tableView = new jc.ScrollingLayer();
            this.addChild(this.tableView);
            var sprites = this.getDisplaySprites()
            this.tableView.init({
                sprites:sprites,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this)
            });

            this.name = "CardLayer";
            this.initFromConfig(this.windowConfig);
            this.raiseSelected = selectDelegate;
            this.raiseCancel = cancelDelegate;
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        console.log("onshow");
        var tableSize = this.tableView.getContentSize();
        var pos = this.getAnchorPosition({
                                    "cell":2,
                                    "anchor":['bottom'],
                                    "padding":{
                                        "top":-35
                                    }
                                },tableSize,this);

        pos.x =0;
        this.reorderChild(this.tableView,3);
        this.slide(this.tableView, cc.p(0,-1000),pos);
        this.start();
    },
    onHide:function(){


    },
    onDone:function(){
        //tableview is not in window config, gotta get rid of it ourselves
        this.raiseSelected(this.lastIndex);
        this.slide(this.tableView, this.tableView.getPosition(), cc.p(0,-1000));
        this.done(); //transition everyone out


    },
    outTransitionsComplete:function(){
        jc.layerManager.pop();
    },
    onCancel:function(){
        this.raiseCancel();
        this.slide(this.tableView, this.tableView.getPosition(), cc.p(0,-1000));
        this.done(); //transition everyone out
        jc.layerManager.pop();

    },
    selectionCallback: function(index, sprite){
        //todo: should be a global character list
        this.swapCharacter(this.playerBlob.myguys[index]);
        this.updateStats(this.playerBlob.myguys[index]);
        this.lastIndex = index;
    },
    swapCharacter:function(characterEntry){
        if (this.char){
            var f1 =  cc.FadeOut.create(jc.defaultTransitionTime/4, 0)
            this.nextEntry = characterEntry;
            this.char.runAction(cc.Sequence.create(f1,cc.CallFunc.create(this.displayNewCard.bind(this))))
        }else{
            var portraitFrame = jc.getCharacterPortrait(characterEntry);
            this.char = cc.Sprite.create();
            this.char.initWithSpriteFrameName(portraitFrame);
            this["portraitWindow"].addChild(this.char);

            var pos = this.getAnchorPosition({"cell":5}, this.portraitSprite, this.portraitWindow);
            this.char.setPosition(pos);
        }

    },
    displayNewCard:function(){
        var portraitFrame = jc.getCharacterPortrait(this.nextEntry);
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(portraitFrame);
        this.char.setDisplayFrame(frame);
        var f2 =  cc.FadeIn.create(jc.defaultTransitionTime/4, 255);
        this.char.runAction(f2);
    },
    updateStats:function(){

    },
    getDisplaySprites: function(){
        var returnme = [];
        for(var i=0;i<this.playerBlob.myguys.length;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("lock.png");
            var pic = jc.getCharacterPortrait(this.playerBlob.myguys[i]);
            var picSprite = new cc.Sprite();
            picSprite.initWithSpriteFrameName(pic);
            sprite.addChild(picSprite);
            this.scaleTo(picSprite, sprite);
            this.centerThis(picSprite, sprite);

            returnme.push(sprite);
        }

        returnme = returnme.concat(this.getEmptyCells(this.cells - this.playerBlob.myguys.length));
        return returnme;
    } ,
    getEmptyCells:function(number){
        var returnme=[];
        for(var i =0;i<number;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("lock.png");
            if (!this.cellWidth){
                this.cellWidth = sprite.getTextureRect().width + 100;
            }
            returnme.push(sprite);
        }
        return returnme;
    },
    targetTouchHandler:function(type, touch, sprites){

    },
    windowConfig:{
        "scrollFrame":{
            "cell":1,
            "type":"scale9",
            "anchor":['left'],
            "transitionIn":"bottom",
            "transitionOut":"bottom",
            "size":{ "width":100, "height":20},
            "scaleRect":jc.UiConf.frame19Rect,
            "sprite":"frame 19.png",
            "padding":{
                "top":7
            },
            "z":0
        },
        "portraitFrame":{
            "cell":7,
            "anchor":['top','left'],
            "type":"scale9",
            "transitionIn":"right",
            "transitionOut":"right",
            "scaleRect":jc.UiConf.frame19Rect,
            "size":{ "width":100, "height":80},
            "sprite":"frame 19.png",
            "padding":{
              "left":-7
            },
            "kids":{
                "decor":{
                    "cell":7,
                    "anchor":['top','left'],
                    "type":"sprite",
                    "transitionIn":"top",
                    "transitionOut":"top",
                    "sprite":"decor.png",
                    "padding":{
                        "left":-30
                    },
                    "z":5,
                    "scale":70
                },
                "portraitWindow":{
                    "cell":7,
                    "anchor":['top', 'left'],
                    "type":"scale9",
                    "transitionIn":"top",
                    "transitionOut":"top",
                    "size":{"width":45, "height":70},
                    "scaleRect":jc.UiConf.frame20Rect,
                    "sprite":"frame 20.png",
                    "padding":{
                        "top":40,
                        "left":35
                    }
                },
                "stats":{
                    "isGroup":true,
                    "type":"stack",
                    "cell":9,
                    "size":{ "width":33, "height":10},
                    "anchor":['left'],
                    "padding":{
                        "top":30,
                        "left":-30
                    },
                    "members":[
                        {
                            "type":"sprite",
                            "sprite":"sl 1.png"
                        },
                        {
                            "type":"sprite",
                            "sprite":"sl2.png"

                        },
                        {
                            "type":"sprite",
                            "sprite":"sl3.png"

                        },
                        {
                            "type":"sprite",
                            "sprite":"sl4.png"

                        }
                    ]
                },
                "doneCancel":{
                    "isGroup":true,
                    "type":"line",
                    "cell":2,
                    "size":{ "width":33, "height":10},
                    "anchor":['right'],
                    "padding":{
                        "left":80,
                        "top":0
                    },
                    "members":[
                        {
                            "type":"button",
                            "main":"check.png",
                            "pressed":"check1.png",
                            "touchDelegateName":"onDone"
                        },
                        {
                            "type":"button",
                            "main":"close.png",
                            "pressed":"close1.png",
                            "touchDelegateName":"onCancel"
                        }
                    ]
                }
            }
        }
    }
});

jc.getCharacterPortrait=function(entry){
    //TODO: Mod to correct portrait - alive vs hurt based on state
    //todo implement me
    switch(entry.name){
        case "orc":
            return "btn_mon_orcWrrior.png";
        case "orge":
            return "btn_mon_orgeHitter.png";
        case "troll":
            return "btn_mon_trolCurer.png";
        case "wizard":
            return "btn_mon_goblinWizard.png";
        default:
            return "crunch-portrait.png";
    }

}





