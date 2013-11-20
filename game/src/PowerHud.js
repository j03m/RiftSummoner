var PowerHud = jc.UiElementsLayer.extend({
    tiles:3,
    init:function(powers){
        this.name = "powerHud";
        this.myTiles = [];
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(powerTilesPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(windowPlist);
            this.initFromConfig(PowerHud.windowConfig);

            var len = this.tiles>powers.length?powers.length:this.tiles;
            for(var i=0;i<len;i++){
                var name = "tile"+i;
                this[name].initFromName(powers[i], this);
                this.myTiles.push(this[name]);
            }

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
        console.log("onshow");
    }
});

PowerHud.windowConfig={
    "portraitFrame":{
        "cell":1,
        "anchor":['left'],
        "type":"scale9",
        "transitionIn":"bottom",
        "transitionOut":"bottom",
        "scaleRect":jc.UiConf.frame19Rect,
        "size":{ "width":50, "height":25},
        "sprite":"frame 19.png",
        "padding":{
            "left":0
        },
        "kids":{
            "tiles":{
                "isGroup":true,
                "type":"line",
                "cell":1,
                "size":{ "width":33, "height":33},
                "anchor":['left'],
                "padding":{
                    "left":15,
                    "top":-3
                },
                "itemPadding":{
                    "left":10,
                    "top":-25
                },
                "members":[
                    {
                        "type":"tile",
                        "name":"tile0"
                    },
                    {
                        "type":"tile",
                        "name":"tile1"
                    },
                    {
                        "type":"tile",
                        "name":"tile2"
                    }
                ]
            }
        }
    }
}