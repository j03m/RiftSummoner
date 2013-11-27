var jc = jc || {};

jc.assetWildCard = "{v}";

//this assumes you want landscape. todo: mod for portrait
jc.resolutions = {};
jc.resolutions.iphone = cc.size(480,320);
jc.resolutions.iphone4 = cc.size(960,640);
//jc.resolutions.iphone5 = cc.size(1136,640);
//jc.resolutions.ipad = cc.size(1024, 768);
//jc.resolutions.ipadhd = cc.size(2048, 1536);

jc.setDesignSize = function(size){
    jc.designSize = size;
}

jc.setActualSize = function(size){
    jc.actualSize = size;
}

jc.bestAssetDirectory = function(window, screen){

    //height switched because screen always reports portrait,
    //you can use window.orientation to determine rotation, but I don't care
    //this game runs in landscape
    var dpr = Math.ceil(window.devicePixelRatio);
    var actualSize;
    if (window.orientation){
        actualSize = cc.size(screen.height*dpr, screen.width*dpr);
    }else{
        actualSize = cc.size(screen.width*dpr, screen.height*dpr);
    }

    //determine what asset size we should be using.
    //in our game we follow http://www.codeandweb.com/blog/2012/12/14/scaling-content-for-retina-display-iphone-and-ipad
    //we are designing for iphone 5, but scaling down from ipad 3
    //so we mostly care about width, our height will get cut.
    var max = 0;
    var maxSet = "";
    for(var res in jc.resolutions){
        if (jc.resolutions[res].width<= actualSize.width){
            if (jc.resolutions[res].width > max){
                max = jc.resolutions[res].width;
                maxSet = res;
            }
        }
    }

    return maxSet;
}