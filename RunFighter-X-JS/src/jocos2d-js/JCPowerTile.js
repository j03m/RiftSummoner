jc.PowerTile = jc.CompositeButton.extend({
    tileSize:cc.size(50,50),
    borderPos: cc.p(130,130), //wtf is wrong with cocos positioning
    initTile:function(){
        //make sprite from empty tile and border
        cc.SpriteFrameCache.getInstance().addSpriteFrames(powerTilesPlist);
        this.initWithSpriteFrameName("EmptyIcon.png");
        var cs = this.getContentSize();
        this.setScale(this.tileSize.width/cs.width, this.tileSize.height/cs.height);

        this.border = new cc.Sprite();
        this.border.initWithSpriteFrameName("Border5.png");
        this.addChild(this.border, 10);
        this.border.setPosition(this.borderPos); //wtf is wrong with cocos positioning

        this.borderSelect = new cc.Sprite();
        this.borderSelect.initWithSpriteFrameName("Border3.png");
        this.addChild(this.borderSelect, 10);
        this.borderSelect.setPosition(this.borderPos)
        this.borderSelect.setVisible(false);



        this.onTouchesBegan = function(){}; //not needed
        this.scheduleUpdate();

    },
    initFromName:function(name){
        if (!name){
            return;
        }
        cc.SpriteFrameCache.getInstance().addSpriteFrames(powerTiles[name].plist);
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(powerTiles[name].icon);
        this.setDisplayFrame(frame);

    },
    onTouch:function(){
        //apply the touched border sprite

        //play power effect

        //gray out

        //schedule update
    },
    update:function(dt){
        //slowly ungrayify

        //flash when available
    },
    onTouchesEnded: function(touch) {
        if(this.frameCheck(touch)){
            if (this.onTouch && !this.paused){
                this.onTouch();
            }
        }
    }

});

//place border

//place power behind border

//if power empty or length < display empty power

//add to sprite touch

//flash and fade (jc.utils)
