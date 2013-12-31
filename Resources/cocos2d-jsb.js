require("jsb.js");
require("riftsummoner.js");
try {
    
    director = cc.Director.getInstance();
    winSize = director.getWinSize();
    centerPos = cc.p( winSize.width/2, winSize.height/2 );
    
    __jsc__.garbageCollect();
    // LOADING PLAY SCENE UNTILL CCBREADER IS FIXED
    
    director.runWithScene(MainGame.scene());
    
    
} catch(e) {log(e);}