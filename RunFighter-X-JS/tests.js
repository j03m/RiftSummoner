require("jsb.js");
require("pathsNative.js");
require("resource.js");
require("underscore-min.js");
require("JCTrace.js");
require("JCSprite.js");
require("xmlhttp.js");
require("eventemitter2.js");
require("RequestManager.js");
require("testRunner.js");
require("testLayer.js");

//add test file here
require("test.RequestManager.js");
require("test.localStorage.js");


try {
    director = cc.Director.getInstance();
    winSize = director.getWinSize();
    centerPos = cc.p( winSize.width/2, winSize.height/2 );
    
    
    var GameCreator = function() {
        
        var self = {};
        self.callbacks = {};
        
        self.getPlayScene = function() {
            var scene = new cc.Scene();
            var layer = new TestLayer();
            layer.init();
            scene.addChild(layer);
            return scene;
        };
        return self;
        
    };
    
    var game = GameCreator();
    
    __jsc__.garbageCollect();
    
    // LOADING PLAY SCENE UNTILL CCBREADER IS FIXED
    
    director.runWithScene(game.getPlayScene());
    
} catch(e) {log(e);}
