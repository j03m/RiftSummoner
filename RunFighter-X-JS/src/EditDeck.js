var playerBlob = {
    id:1,
    grid:[1],
    myguys:[
        {   "name":"goblin",
            "status":"alive"
        },
        {   "name":"goblin",
            "status":"alive"
        },
        {   "name":"goblin",
            "status":"down"
        },
        {   "name":"blueKnight",
            "status":"alive"
        },
        {   "name":"goldKnight",
            "status":"alive"
        }]

}




var CustomTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);
    }
});

var EditDeck = jc.TouchLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
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
            this.bottomWindow = this.makeWindow(cc.size(150,150));
            this.slideInFromBottom(this.bottomWindow);
            this.topWindow = this.makeWindow(cc.size(150,150));
            this.slideInFromTop(this.topWindow);
            this.leftWindow = this.makeWindow(cc.size(150,150));
            this.slideInFromLeft(this.leftWindow);
            this.rightWindow = this.makeWindow(cc.size(150,150));
            this.slideInFromRight(this.rightWindow);

            return true;
        } else {
            return false;
        }
    },
    targetTouchHandler: function(type, touch, sprites) {
        if (sprites.length!=0){
            this.showTable(sprites[0]);
        }else{
            this.slideOutToRight(this.rightWindow);
            this.slideOutToLeft(this.leftWindow);
            this.slideOutToTop(this.topWindow);
            this.slideOutToBottom(this.bottomWindow);
        }
    },
    showTable: function(sprite){
        if (!this.tableView){
            //drop a background on this
            //# of cells is how many dudes I have
            //show idle dude in cell - meh
            //touch a dude, table closes, dude goes into card, persist
            this.darken();
            this.tableView = cc.TableView.create(this, cc.size(this.winSize.width, this.winSize.height/3));
            this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);

            this.tableView.setDelegate(this);
            this.addChild(this.tableView);
            this.tableView.reloadData();
            this.reorderChild(this.tableView, 1);
        }
        this.slide(this.tableView, cc.p(0,0),cc.p(0, (this.winSize.height / 2) - 150));
        if (!this.windowSprite){
            this.windowSprite = this.makeWindow(cc.Size(20,20));
        }
        this.slideInFromTop(this.windowSprite);

    },

    tableCellTouched:function (table, cell) {

    },

    cellSizeForTable:function (table) {
        return cc.size(80, 80);
    },

    tableCellAtIndex:function (table, idx) {
        //var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();
            //todo:load sprite with spinner, avoid load at front
            var entry = playerBlob.myguys[idx];
            console.log("idx:"+idx + " name:" + entry.name);
            var sprite = this.generateSprite(entry.name);
            if (entry.status == 'alive'){
                sprite.setState('idle');
            }else{
                sprite.setState('dead');
            }
            sprite.setAnchorPoint(cc.p(0.5,0.5));
            sprite.setPosition(cc.p(100, 50));
            cell.addChild(sprite);

//            label = cc.LabelTTF.create(strValue, "Helvetica", 20.0);
//            label.setPosition(cc.p(0,0));
//            label.setAnchorPoint(cc.p(0,0));
//            label.setTag(123);
//            cell.addChild(label);
        } else {
//            label = cell.getChildByTag(123);
//            label.setString(strValue);
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        if (!this.unitCount){
            this.unitCount = playerBlob.myguys.length;
        }
        return this.unitCount;
    },
    scrollViewDidScroll:function (view) {

        //whoever is in cell X on screen gets highlight
        //do cell highlight

        //grab sprite,
        //place in card
        //slide down window
        if (!this.windowSprite){
            var size = cc.size(200,200);
            this.windowSprite = this.makeWindow(size);
            //get character ccbi
            //plug in values
        }
        this.slideInFromTop(this.windowSprite);

    },
    scrollViewDidZoom:function (view) {
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

