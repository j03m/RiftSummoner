var playerBlob = {
    id:1,
    grid:[1],
    myguys:[
//        {   "name":"goblin",
//            "status":"alive"
//        },
//        {   "name":"dragonRed",
//            "status":"alive"
//        },
//        {   "name":"orge",
//            "status":"down"
//        },
//        {   "name":"blueKnight",
//            "status":"alive"
//        },
//        {   "name":"goldKnight",
//            "status":"alive"
//        },
//        {   "name":"goblin",
//            "status":"alive"
//        },
//        {   "name":"dragonRed",
//            "status":"alive"
//        },
//        {   "name":"orge",
//            "status":"down"
//        },
//        {   "name":"blueKnight",
//            "status":"alive"
//        },
//        {   "name":"goldKnight",
//            "status":"alive"
//        }
]

}



//todo: initial cell position
//todo: no repeat
//todo: max cells?
//todo: add frame + glow on selected card
//todo: select, populate card
//todo: select, okay button on card edits blob

var EditDeck = jc.TouchLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    init: function() {
        if (this._super()) {
            var sprites = this.getChildren();
            var cardCount = 0;
            for (var i =0; i<sprites.length;i++) {
                if (sprites[i].getTag() == -2){ //-2 is added in cocosbuilder and indicates a card
                    this.cards['card' + cardCount] = sprites[i];
                    this.touchTargets.push(sprites[i]);
                }
            }
            this.wireInput();
            this.scrollHeight = this.winSize.height/3;
            this.windowSprite = this.makeWindow(cc.size(450,250), "window.png"); //default rect
            this.scrollBarSprite = this.makeWindow(cc.size(this.winSize.width*1.2, this.scrollHeight), "window.png");
            this.tableView = new jc.ScrollingLayer();
            this.tableView.init({
                sprites:this.getDisplaySprites(),
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this)
            });
            this.reorderChild(this.tableView, 2);
            this.tableView.setVisible(false);
            this.addChild(this.tableView);
            this.tableView.setContentSize(this.winSize.width, 200);

            this.backButton = new cc.Sprite();
            this.backButton.initWithSpriteFrameName("back.png");
            this.addChild(this.backButton);
            this.backButton.setVisible(false);

            this.reorderChild(this.backButton, 3);
            this.adornWithSkulls(this.windowSprite);
            this.reorderChild(this.windowSprite, 2);
            this.reorderChild(this.scrollBarSprite, 1);
            this.enableCardClicks();

            return true;
        } else {
            return false;
        }
    },
    selectionCallback: function(index, sprite){
        console.log("Cell Selection:" + index);
    },
    adornWithSkulls: function(sprite){
        var header = cc.Sprite.create();
        var size = sprite.getContentSize();
        header.initWithSpriteFrameName("windowSkull.png")
        var headerSize = header.getContentSize();
        sprite.addChild(header);
        header.setPosition(cc.p(size.width/2,size.height-headerSize.height/4));
    },
    targetTouchHandler: function(type, touch, sprites) {
        if (!this.allowCardClicks){
            return;
        }

        if (type == jc.touchMoved){
            return;
        }
        console.log(type);
        if (sprites.length!=0 && type == jc.touchEnded){
            this.showTable(sprites[0]);
        }
    },
    showTable: function(sprite){
        this.darken();
        var pos = this.tableView.getPosition();
        this.slide(this.tableView, cc.p(pos.x,0),cc.p(pos.x, this.scrollBarSprite.getContentSize().height/2));
        this.tableView.setInitialPos();

        this.slideInFromBottom(this.scrollBarSprite);
        this.slideInFromTop(this.windowSprite);
        this.disableCardClicks();

    },
    disableCardClicks: function(){
        this.allowCardClicks = false;
    },
    enableCardClicks: function(){
        this.allowCardClicks = true;
    },
    getDisplaySprites: function(){
        var returnme = [];

//        for(var i=0;i<playerBlob.myguys.length;i++){
//            var entry = playerBlob.myguys[i];
//            var sprite = this.generateSprite(entry.name);
//            if (entry.status == 'alive'){
//                sprite.setState('idle');
//            }else{
//                sprite.setState('dead');
//            }
//            returnme.push(sprite);
//        }
        returnme = returnme.concat(this.getEmptyCells(this.cells - playerBlob.myguys.length));
        return returnme;
    } ,
    getEmptyCells:function(number){
        var returnme=[];
        for(var i =0;i<number;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("plus.png");
            returnme.push(sprite);
        }
        return returnme;
    }
});

EditDeck.create = function() {
    var ml = new EditDeck();
    if (ml && ml.init(playerBlob)) { //todo: dear joe, if you forget to replace this, the game won't be much fun.
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

EditDeck.scene = function() {
    if (!jc.editDeckScene){
        jc.editDeckScene = cc.Scene.create();
        cc.BuilderReader.setResolutionScale(1);
        jc.editDeckScene.layer = cc.BuilderReader.load("EditDeck.ccbi");
        var editDeck = new EditDeck();
        var finalScene = jc.inherit(editDeck,jc.editDeckScene.layer);
        jc.editDeckScene.layer = finalScene;
        jc.editDeckScene.addChild(jc.editDeckScene.layer );
        jc.editDeckScene.layer.init();

    }
    return jc.editDeckScene;
};

//            label = cc.LabelTTF.create(strValue, "Helvetica", 20.0);
//            label.setPosition(cc.p(0,0));
//            label.setAnchorPoint(cc.p(0,0));
//            label.setTag(123);
//            cell.addChild(label);

//testing
//            this.bottomWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromBottom(this.bottomWindow);
//            this.topWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromTop(this.topWindow);
//            this.leftWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromLeft(this.leftWindow);
//            this.rightWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromRight(this.rightWindow);
