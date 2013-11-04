var PowerHud = jc.UiElementsLayer.extend({
    tiles:3,
    init:function(powers, gameLayer){
        if (this._super()) {
            this.initFromConfig(PowerHud.windowConfig);
            var len = this.tiles>powers.length?powers.length:this.tiles;
            for(var i=0;i<len;i++){
                this["tile"+i].initFromName(powers[i]);
            }
            this.game = gameLayer;
            return true;
        }else{
            return false;
        }
    },
    targetTouchHandler: function(type, touch, sprites) {
        //do nothing here
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