var PowerHud = jc.UiElementsLayer.extend({
    tiles:3,
    init:function(powers){
        this.name = "powerHud";
        this.myTiles = [];
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(powerTilesPlist);
            this.initFromConfig(this.windowConfig);
            this.powerBarOpenPos = cc.p(413* jc.assetScaleFactor, 287*jc.assetScaleFactor);
            this.powerBarClosePos = cc.p(-305* jc.assetScaleFactor, 287*jc.assetScaleFactor);
            this.powers = powers;

            return true;
        }else{
            return false;
        }
    },
    setSelected:function(tile){
        for (var i=0;i<this.tiles;i++){
            if (this["tile"+i]!=tile){
                this["tile"+i].setUnselected();
            }
        }
        tile.setSelected();
    },
    scheduleThisOnce:function(method,delay){
        this.scheduleOnce(method, delay);
    },
    targetTouchHandler: function(type, touch, sprites) {
        return false; //the tiles are swallowing touches, so this should never get called.
    },
    onShow:function(){

        var len = this.tiles>this.powers.length?this.powers.length:this.tiles;
        for(var i=0;i<len;i++){
            var name = "tile"+i;
            this[name].initFromName(this.powers[i], this);
            this.myTiles.push(this[name]);
        }


    },
    windowConfig: {
        "powerBar": {
            "type": "sprite",
            "sprite": "powersBackground.png",
            "kids": {
                "tiles": {
                    "isGroup": true,
                    "type": "line",
                    "members": [
                        {
                            "type": "tile",
                            "name": "tile0",
                            "sprite": "powerFrame.png"
                        },
                        {
                            "type": "tile",
                            "name": "tile1",
                            "sprite": "powerFrame.png"
                        },
                        {
                            "type": "tile",
                            "name": "tile2",
                            "sprite": "powerFrame.png"
                        }
                    ],
                    "sprite": "powerFrame.png",
                    "z": 0,
                    "pos": {
                        "x": 159,
                        "y": 99
                    }
                }
            },
            "z": 0,
            "pos": {
                "x": 413,
                "y": 287
            }
        }
    }
});

