require("jsb.js");
require("src/jocos2d-js/JCBrowserMock.js");
require("src/underscore-min.js");
require("src/jocos2d-js/JCTrace.js");
require("src/async.js");
require("src/spriteVars.js");
require("src/missileConfig.js");
require("src/effectsConfig.js");
require("src/powerTileConfig.js");
require("src/powerConfig.js");
require("src/jocos2d-js/JCResolutions.js");
require("src/resource.js");
require("src/zerverStubs/blobApi.js");
require("src/blobOperations.js");
require("src/levelLogic.js");
require("src/kikClientMock.js");
require("src/jocos2d-js/JCUtils.js");
require("src/jocos2d-js/JCLocalStorage.js");
require("src/jocos2d-js/JCPanAndZoomAction.js");
require("src/jocos2d-js/JCLayerManager.js");
require("src/jocos2d-js/JCCompositeButton.js");
require("src/jocos2d-js/JCPowerTile.js");
require("src/jocos2d-js/JCTouchLayer.js");
require("src/jocos2d-js/JcUiElements.js");
require("src/jocos2d-js/JCScrollingLayer.js");
require("src/jocos2d-js/JCWorldLayer.js");
require("src/jocos2d-js/JCGameObject.js");
require("src/jocos2d-js/JCSprite.js");
require("src/jocos2d-js/eventemitter2.js");
require("src/jocos2d-js/xmlhttp.js");
require("src/jocos2d-js/RequestManager.js");
require("src/behaviors/GeneralBehavior.js");
require("src/behaviors/RangeBehavior.js");
require("src/behaviors/DefenderBehavior.js");
require("src/behaviors/FlankerBehavior.js");
require("src/behaviors/HealerBehavior.js");
require("src/behaviors/TankBehavior.js");
require("src/behaviors/BehaviorMap.js");
require("src/selectTeam.js");
require("src/editTeam.js");
require("src/victory.js");
require("src/defeat.js");
require("src/ArenaGame.js");
require("src/AnimationTest.js");
require("src/Loading.js");
require("src/Landing.js");
require("src/Main.js");
require("src/PowerHud.js");


try {
    
    director = cc.Director.getInstance();
    winSize = director.getWinSize();
    centerPos = cc.p( winSize.width/2, winSize.height/2 );
    
    __jsc__.garbageCollect();
    // LOADING PLAY SCENE UNTILL CCBREADER IS FIXED
    
    director.runWithScene(MainGame.scene());
    
    
} catch(e) {log(e);}