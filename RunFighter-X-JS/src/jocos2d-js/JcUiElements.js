var jc = jc || {};

jc.UiConf = {};
jc.UiConf.frame19Rect = cc.RectMake(30,30,200,100);
jc.UiConf.frame20Rect = cc.RectMake(25,25,125,150);

jc.UiElementsLayer = jc.TouchLayer.extend({
    windowConfig:{
        "window":{
            "cell":8,
            "type":"scale9",
            "anchor":['top'],
            "transitionIn":"top",
            "transitionOut":"bottom",
            "size":{ "width":50, "height":50},
            "scaleRect":jc.UiConf.frame19Rect,
            "sprite":"frame 19.png",
            "padding":{
                "all":0
            }
            ,
            "kids":{
                "subwindow1":{
                    "cell":8,
                    "type":"scale9",
                    "input":true,
                    "size":{ "width":50, "height":50},
                    "scaleRect":jc.UiConf.frame20Rect,
                    "sprite":"frame 20.png",
                    "padding":{
                        "all":0
                    }
                },
                "subwindow2":{
                    "cell":2,
                    "type":"scale9",
                    "input":true,
                    "size":{ "width":50, "height":50},
                    "scaleRect":jc.UiConf.frame20Rect,
                    "sprite":"frame 20.png",
                    "padding":{
                        "all":0
                    }
                }
            }
        }
    },
    windowConfigs:[],
    init: function() {
        if (this._super()) {
            //show some ui as tests
            cc.SpriteFrameCache.getInstance().addSpriteFrames(windowPlist);

            //test config
            //this.initFromConfig(this.windowConfig);
            //this.start();
            return true;
        }else{
            return false;
        }
    },
    done: function(){
        //transition windows out
        for(var i =0; i< this.windowConfigs.length; i++){
            var windowConfig = this.windowConfigs[i];
            if (windowConfig.config.transitionOut){
                this.doTransitionOut(windowConfig);
            }else{
                windowConfig.window.setVisible(false);
            }
        }
    },
    start: function(){
        //transition windows in
        for(var i =0; i< this.windowConfigs.length; i++){
            var windowConfig = this.windowConfigs[i];
            if (windowConfig.config.transitionIn){
                this.doTransitionIn(windowConfig);
            }else{
                windowConfig.window.setPosition(windowConfig.position);
                windowConfig.window.setVisible(true);
            }
        }
    },
    doTransitionIn:function(windowConfig){
        switch(windowConfig.config.transitionIn){
            case 'right':
                this.slideInFromRight(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position);
                break;
            case 'left':
                this.slideInFromLeft(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position);
                break;
            case 'top':
                this.slideInFromTop(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position);
                break;
            case 'bottom':
                this.slideInFromBottom(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position);
                break;
        }
    },
    doTransitionOut:function(windowConfig){
        switch(windowConfig.config.transitionOut){
            case 'right':
                this.slideOutToRight(windowConfig.window, windowConfig.config.transitionOutTime, windowConfig.position);
                break;
            case 'left':
                this.slideOutToLeft(windowConfig.window, windowConfig.config.transitionOutTime, windowConfig.position);
                break;
            case 'top':
                this.slideOutToTop(windowConfig.window, windowConfig.config.transitionOutTime, windowConfig.position);
                break;
            case 'bottom':
                this.slideOutToBottom(windowConfig.window, windowConfig.config.transitionOutTime, windowConfig.position);
                break;
        }
    },
    initFromConfig:function(configs, parent){
        for (var configName in configs){

            config = configs[configName];

            //parent is layer if parent doesn't exist
            if (!parent){
                parent = this;
            }

            //how big is it
            var size = this.calculateSize(config, parent);


            //what cell is it anchored to
            var position = this.getAnchorPosition(config, size, parent);


            //make it
            var window;
            if (config.type == "scale9"){
                window = this.makeWindow(size,config.sprite, config.scaleRect);
            }else{
                window = cc.Sprite.create();
                window.initWithSpriteFrameName(config.sprite);
            }

            window.setPosition(cc.p(-1000,-1000));

            //have a variable for it
            this[configName] = window;

            //add it to a collection
            this.windowConfigs.push({"window":window, "config":config, "position":position});

            //parent it
            parent.addChild(window);

            if (config.input){
                this.touchTargets.push(window);
            }

            //what does it contain?
            if (config.kids){
                this.initFromConfig(config.kids, window);
            }


        }

    },
    calculateSize:function(config, parent){
        var size = parent.getContentSize();

        if (!config.size){
            throw "Size must be specified.";
        }

        //width height expressed as percentage of parent
        var w = config.size.width/100 * size.width;
        var h = config.size.height/100 * size.height;

        if(config.padding){
            if (config.padding.all!=undefined){
                w -= config.padding.all;
                h -= config.padding.all;

            }else{
                w -= config.padding.right;
                h -= config.padding.bottom;
            };
        }
        return cc.size(w,h);
    },
    getAnchorPosition:function(config, size, parent){
        if (!config.cell){
            throw "Need a cell";
        }
        if (!config.anchor){
            config.anchor=[];
        }
        var top;
        var left;
        var bottom;
        var right;
        var center;
        var parentSize = parent.getContentSize();
        var row = this.getRow(config.cell);
        var col = this.getCol(config.cell)
        var cellWidth = parentSize.width/3;
        var cellHeight = parentSize.height/3;
        var x= (cellWidth*col) + cellWidth/2;
        var y= (cellHeight*row) + cellHeight/2;
        for(var i =0; i<config.anchor.length; i++){
            var value = config.anchor[i];
            switch(value){
                case "top":
                    y+=cellHeight/2;
                    y-=size.height/2;
                    break;
                case "left":
                    x-=cellWidth/2;
                    x+=size.width/2
                    break;
                case "right":
                    x+=cellWidth/2;
                    x-=size.width/2;
                    break;
                case "bottom":
                    y-=cellWidth/2;
                    y+=size.height/2
                    break;
                case "center":
                    //default, do nothing;
                    break;
            }
        }

        if(config.padding){
            if (config.padding.all!=undefined){
                x+= config.padding.all;
                y+= config.padding.all;

            }else{
                x+= config.padding.left;
                y+= config.padding.top;
            }
        }


        return cc.p(x,y);
    },
    getRow:function(cell){
        if (cell <= 3){
            return 0;
        }
        if (cell <= 6){
            return 1;
        }
        if (cell <= 9){
            return 2;
        }
        throw "Cell must be 1-9";
    },
    getCol:function(cell){
        if (cell == 1 || cell == 4 || cell == 7 ){
            return 0;
        }
        if (cell == 2 || cell == 5 || cell == 8 ){
            return 1;
        }
        if (cell == 3 || cell == 6 || cell == 9 ){
            return 2;
        }
        throw "Cell must be 1-9";


    }

});

jc.UiElementsLayer.create = function() {
    var ml = new jc.UiElementsLayer();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

jc.UiElementsLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = jc.UiElementsLayer.create();
    scene.addChild(layer);
    return scene;

};

