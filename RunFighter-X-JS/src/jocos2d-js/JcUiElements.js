var jc = jc || {};

jc.UiConf = {};
jc.UiConf.frame19Rect = cc.RectMake(34,34,167,206);
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
    init: function() {
        if (this._super()) {
            //show some ui as tests
            cc.SpriteFrameCache.getInstance().addSpriteFrames(windowPlist);
            //test config
            //this.initFromConfig(this.windowConfig);
            //this.start();

            this.windowConfigs = [];
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

            if (config.isGroup){
                this.initFromGroupConfig(configName, config, parent);

            }else{

                var size = undefined;
                if (config.type == "scale9"){
                    size = this.calculateSize(config, parent);
                }

                //make it
                var window = this.makeWindowByType(config, size);

                if (!size){
                    size = window.getTextureRect();
                }

                //what cell is it anchored to
                var position = this.getAnchorPosition(config, size, parent);

                window.setPosition(cc.p(-1000,-1000));

                //have a variable for it
                this[configName] = window;
                window.name = configName;

                //add it to a collection
                this.windowConfigs.push({"window":window, "config":config, "position":position});

                //parent it
                parent.addChild(window);
                config.z = config.z | 0;
                parent.reorderChild(window, config.z);

                if (config.input){
                    this.touchTargets.push(window);
                }

                //what does it contain?
                if (config.kids){
                    this.initFromConfig(config.kids, window);
                }
            }
        }
    },
    makeWindowByType:function(config, size){
        var window;
        if (config.type == "scale9"){
            window = this.makeWindow(size,config.sprite, config.scaleRect);
        }else if (config.type == "sprite"){
            window = cc.Sprite.create();
            window.initWithSpriteFrameName(config.sprite);
            if (config.scale){
                window.setScaleX(config.scale/100);
                window.setScaleY(config.scale/100);
            }
        }else if (config.type == "button"){
            window = new jc.CompositeButton();
            if (!this[config.touchDelegateName]){
                throw "supplied:" + config.touchDelegateName + " for button click but it doesn't exist.";
            }
            window.initWithDefinition(config,this[config.touchDelegateName].bind(this));
        }
        return window;
    },
    initFromGroupConfig:function(name, config, parent){
        var total = config.membersTotal | config.members.length;

        switch(config.type){
            case 'line':
                this.initGrid(name,config, parent, 1, total);
                break;
            case 'stack':
                this.initGrid(name,config, parent, total, 1);
                break;
            case 'grid':
                this.initGrid(name,config, parent, total/config.cols, config.cols);
                break;
        }
    },
    initGrid:function(name,config, parent, rows, cols){
        var total = config.membersTotal | config.members.length;
        var size = parent.getContentSize();
        var itemSize;
        if (config.itemSize){
            var itemWidth = size.width * config.itemSize.width/100;
            var itemHeight = size.height* config.itemSize.height/100;
            itemSize = cc.size(itemWidth, itemHeight);
        }

        var x = -1;
        var y = -1;
        var rowCount=0;
        var colCount=0;
        for(var i =0;i<total;i++){
            var member;
            if (config.membersTotal){
                member = config.members[0]; // use the first over and over
            }else{
                member = config.members[i];
            }

            var window = this.makeWindowByType(member, itemSize);
            if (x==-1 && y==-1){
                if (!itemSize){
                    itemSize = window.getTextureRect().size; //buttons and sprites set their own sizes
                }
                var position = this.getAnchorPosition(config, itemSize, parent);
                x = position.x;
                y = position.y;
            }

            //keep track
            parent.addChild(window);
            window.name=name;
            this[name]=window;


            if (config.input){
                this.touchTargets.push(window);
            }
            if (config.itemPadding){
                if (config.itemPadding.all){
                    x+=config.itemPadding.all;

                }else{
                    if (config.itemPadding.left){
                        x+=config.itemPadding.left;
                    }
                }
            }
            var gridPos = cc.p(x,y);

            this.windowConfigs.push({"window":window, "config":member, "position":gridPos});

            //augment position for the next cell
            colCount++;
            if (colCount>=cols){
                rowCount++;
                x=position.x;
                y-=itemSize.height;
                if (config.itemPadding){
                    if (config.itemPadding.all){
                        y+=config.itemPadding.all;
                    }else{
                        if (config.itemPadding.top){
                            y-=config.itemPadding.top;
                        }
                    }
                }
                colCount = 0;
            }else{
                x+=itemSize.width;
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
                if (config.padding.right){
                    w -= config.padding.right;
                }
                if (config.padding.bottom){
                    h -= config.padding.bottom;
                }
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
                if (config.padding.left){
                    x+= config.padding.left;
                }
                if (config.padding.top){
                    y-= config.padding.top;
                }
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
    },
    centerThis:function(centerMe, centerOn){
        var pos = this.getAnchorPosition({"cell":5}, centerMe, centerOn);
        centerMe.setPosition(pos);
    },
    scaleTo:function(scaleMe, toMe){
        var currentSize = scaleMe.getContentSize();
        var toSize = toMe.getContentSize();
        var scalex = toSize.width/currentSize.width;
        var scaley = toSize.height/currentSize.height;
        scaleMe.setScale(scalex, scaley);
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

