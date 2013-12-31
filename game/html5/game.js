window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    console.log("Error occured: " + errorMsg);
    console.log("url:" + url);
    console.log("line:" + lineNumber);
    return false;
}

var hotrSrc = [
        '../src/jocos2d-js/JCBrowser.js',
        '../src/jocos2d-js/JCBrowserMock.js',
        '../src/underscore-min.js',
        '../src/async.js',
        '../src/spriteVars.js',
        '../src/missileConfig.js',
        '../src/effectsConfig.js',
        '../src/powerTileConfig.js',
        '../src/powerConfig.js',
        '../src/jocos2d-js/JCTrace.js',
        '../src/jocos2d-js/JCResolutions.js',
        '../src/resource.js',
        '../src/md5.js',
        '../src/blobOperations.js',
        '../src/multiplayerOperations.js',
        '../src/levelLogic.js',
        '../src/jocos2d-js/JCUtils.js',
        '../src/jocos2d-js/JCLocalStorage.js',
        '../src/jocos2d-js/JCPanAndZoomAction.js',
        '../src/jocos2d-js/JCLayerManager.js',
        '../src/jocos2d-js/JCCompositeButton.js',
        '../src/jocos2d-js/JCPowerTile.js',
        '../src/jocos2d-js/JCTouchLayer.js',
        '../src/jocos2d-js/JcUiElements.js',
        '../src/jocos2d-js/JCDesigner.js',
        '../src/jocos2d-js/JCScrollingLayer.js',
        '../src/jocos2d-js/JCWorldLayer.js',
        '../src/jocos2d-js/JCGameObject.js',
        '../src/jocos2d-js/JCSprite.js',
        '../src/jocos2d-js/eventemitter2.js',
        '../src/behaviors/GeneralBehavior.js',
        '../src/behaviors/RangeBehavior.js',
        '../src/behaviors/DefenderBehavior.js',
        '../src/behaviors/FlankerBehavior.js',
        '../src/behaviors/HealerBehavior.js',
        '../src/behaviors/TankBehavior.js',
        '../src/behaviors/BehaviorMap.js',
        '../src/api.js',
        '../src/selectTeam.js',
        '../src/editTeam.js',
        '../src/victory.js',
        '../src/defeat.js',
        '../src/Landing.js',
        '../src/ArenaGame.js',
        '../src/AnimationTest.js',
        '../src/Loading.js',
        '../src/Main.js',
        '../src/PowerHud.js',
        '../src/multiplayer.js',
        'html5/gameHtml5.js'
    ]

    var d = document;
    var c = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        showFPS:true,
        loadExtension:true,
        frameRate:60,
        tag:'gameCanvas', //the dom element to run cocos2d on
        engineDir:'platform/HTML5/cocos2d/',
        appFiles:hotrSrc
    };

    if(!d.createElement('canvas').getContext){
        var s = d.createElement('div');
        s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = d.getElementById(c.tag).parentNode;
        p.insertBefore(s);

    }

    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var s = d.createElement('script');
        /*********Delete this section if you have packed all files into one*******/
        if (c.SingleEngineFile && !c.engineDir) {
            s.src = c.SingleEngineFile;
        }
        else if (c.engineDir && !c.SingleEngineFile) {
            s.src = c.engineDir + 'platform/jsloader.js';
        }
        else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

            //s.src = 'Packed_Release_File.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        d.body.appendChild(s);
        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        //else if single file specified, load singlefile
    });

