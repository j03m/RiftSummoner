var jc = jc || {};

jc.assetWildCard = "{v}";

//this assumes you want landscape. todo: mod for portrait
jc.resolutions = {};


jc.resolutions.iphone = cc.size(480,320);
jc.resolutions.iphone.scale =   0.234375;
jc.resolutions.iphone.adjusty = -30;
jc.resolutions.iphone.adjustx = 80;

jc.resolutions.iphone5 = cc.size(1136,640);
jc.resolutions.iphone5.scale = 0.554688;
jc.resolutions.iphone5.adjusty = -120;
jc.resolutions.iphone5.adjustx = 0;


jc.resolutions.iphone4 = cc.size(960,640);
jc.resolutions.iphone4.scale = 0.46875;
jc.resolutions.iphone4.adjusty = -60;
jc.resolutions.iphone4.adjustx = 0;

jc.resolutions.ipadhd = cc.size(2048, 1536);
jc.resolutions.ipadhd.scale = 1;
jc.resolutions.ipadhd.adjusty = -100;
jc.resolutions.ipadhd.adjustx = 0;



jc.setDesignSize = function(size){
    jc.designSize = size;
}


jc.bestAssetDirectory = function(){
    //height switched because screen always reports portrait,
    //you can use window.orientation to determine rotation, but I don't care
    //this game runs in landscape
    if (jc.isBrowser){
        var dpr = Math.ceil(window.devicePixelRatio);

        if (window.orientation){
            jc.screenSize = cc.size(screen.height*dpr, screen.width*dpr);
        }else{
            jc.screenSize = cc.size(screen.width*dpr, screen.height*dpr);
        }

        var canvas =  window.document.getElementById("gameCanvas");
        jc.actualSize = cc.size(canvas.width, canvas.height);

    }else{
        jc.actualSize = cc.Director.getInstance().getWinSize();
        jc.screenSize = jc.actualSize;

    }

    var actualSize = jc.actualSize;
    //determine what asset size we should be using.
    //in our game we follow http://www.codeandweb.com/blog/2012/12/14/scaling-content-for-retina-display-iphone-and-ipad
    //we are designing for iphone 5, but scaling down from ipad 3
    //so we mostly care about width, our height will get cut.
    var maxSet = "";
    var max = 0;
    var scaleFactor;
    for(var res in jc.resolutions){
        if (jc.resolutions[res].width<= actualSize.width){
            if (jc.resolutions[res].width > max){
                max = jc.resolutions[res].width;
                maxSet = res;
                scaleFactor = jc.resolutions[res].scale;
            }
        }
    }
    jc.log(['resource'], "selected: " + maxSet + " for assets dir.");
    jc.assetCategory = maxSet;
    jc.assetScaleFactor = scaleFactor;
    jc.assetCategoryData = jc.resolutions[maxSet];


};

if (!jc.isBrowser){
    jc.bestAssetDirectory();
}