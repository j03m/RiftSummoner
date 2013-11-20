var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();       
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();

        // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
//     director->enableRetinaDisplay(true);
	//cc.EGLView.getInstance().setDesignResolutionSize(320,480,cc.RESOLUTION_POLICY.SHOW_ALL);


        // turn on display FPS
        director.setDisplayStats(this.config.showFPS);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config.frameRate);

        //load resources
        console.log
        cc.LoaderScene.preload(g_maingame, function () {
            director.replaceScene(new this.startScene());

//            hotr.asyncLoader = new cc.Loader();
//            hotr.asyncLoader.setAsync(true);
//            hotr.asyncLoader.initWithResources(g_everything, function(){
//                console.log("***ASYNC LOAD DONE");
//            }, this);
        }, this);





        return true;
    }
});


var myApp = new cocos2dApp(MainGame.scene);

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    console.log("Error occured: " + errorMsg);
    console.log("url:" + url);
    console.log("line:" + lineNumber);
    return false;
}


