/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * resource type
 * @constant
 * @type Object
 */
cc.RESOURCE_TYPE = {
    "IMAGE": ["png", "jpg", "bmp","jpeg","gif"],
    "SOUND": ["mp3", "ogg", "wav", "mp4", "m4a"],
    "XML": ["plist", "xml", "fnt", "tmx", "tsx"],
    "BINARY": ["ccbi"],
    "FONT": "FONT",
    "TEXT":["txt", "vsh", "fsh","json"],
    "UNKNOW": []
};

/**
 * A class to pre-load resources before engine start game main loop.
 * @class
 * @extends cc.Scene
 */
cc.Loader = cc.Class.extend(/** @lends cc.Loader# */{
    _curNumber: 0,
    _totalNumber: 0,
    _loadedNumber: 0,
    _resouces: null,
    _animationInterval: 1 / 60,
    _interval: null,
    _isAsync: false,

    /**
     * Constructor
     */
    ctor: function () {
        this._resouces = [];
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} selector
     * @param {Object} target
     */
    initWithResources: function (resources, selector, target) {
        cc.Assert(resources != null, "resources should not null");

        if (selector) {
            this._selector = selector;
            this._target = target;
        }

        if ((resources != this._resouces) || (this._curNumber == 0)) {
            this._curNumber = 0;
            this._loadedNumber = 0;
            if (resources[0] instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    var each = resources[i];
                    this._resouces = this._resouces.concat(each);
                }
            } else
                this._resouces = resources;
            this._totalNumber = this._resouces.length;
        }

        //load resources
        this._schedulePreload();
    },

    setAsync: function (isAsync) {
        this._isAsync = isAsync;
    },

    /**
     * Callback when a resource file load failed.
     * @example
     * //example
     * cc.Loader.getInstance().onResLoaded();
     */
    onResLoadingErr: function (name) {
        cc.log("cocos2d:Failed loading resource: " + name);
    },

    /**
     * Callback when a resource file loaded.
     * @example
     * //example
     * cc.Loader.getInstance().onResLoaded();
     */
    onResLoaded: function () {
        this._loadedNumber++;
    },

    /**
     * Get loading percentage
     * @return {Number}
     * @example
     * //example
     * cc.log(cc.Loader.getInstance().getPercentage() + "%");
     */
    getPercentage: function () {
        var percent = 0;
        if (this._totalNumber == 0) {
            percent = 100;
        } else {
            percent = (0 | (this._loadedNumber / this._totalNumber * 100));
        }
        return percent;
    },

    /**
     * release resources from a list
     * @param resources
     */
    releaseResources: function (resources) {
        if (resources && resources.length > 0) {
            var sharedTextureCache = cc.TextureCache.getInstance();
            var sharedEngine = cc.AudioEngine.getInstance();
            var sharedParser = cc.SAXParser.getInstance();
            var sharedFileUtils = cc.FileUtils.getInstance();

            var resInfo;
            for (var i = 0; i < resources.length; i++) {
                resInfo = resources[i];
                var type = this._getResType(resInfo);
                switch (type) {
                    case "IMAGE":
                        sharedTextureCache.removeTextureForKey(resInfo.src);
                        break;
                    case "SOUND":
                        sharedEngine.unloadEffect(resInfo.src);
                        break;
                    case "XML":
                        sharedParser.unloadPlist(resInfo.src);
                        break;
                    case "BINARY":
                        sharedFileUtils.unloadBinaryFileData(resInfo.src);
                        break;
                    case "TEXT":
                        sharedFileUtils.unloadTextFileData(resInfo.src);
                        break;
                    case "FONT":
                        this._unregisterFaceFont(resInfo);
                        break;
                    default:
                        throw "cocos2d:unknown filename extension: " + type;
                        break;
                }
            }
        }
    },

    _preload: function () {
        this._updatePercent();
        if (this._isAsync) {
            var frameRate = cc.Director.getInstance()._frameRate;
            if (frameRate != null && frameRate < 20) {
                cc.log("cocos2d: frame rate less than 20 fps, skip frame.");
                return;
            }
        }

        if (this._curNumber < this._totalNumber) {
            this._loadOneResource();
            this._curNumber++;
        }
    },

    _loadOneResource: function () {
        var sharedTextureCache = cc.TextureCache.getInstance();
        var sharedEngine = cc.AudioEngine.getInstance();
        var sharedParser = cc.SAXParser.getInstance();
        var sharedFileUtils = cc.FileUtils.getInstance();

        var resInfo = this._resouces[this._curNumber];
        var type = this._getResType(resInfo);
        switch (type) {
            case "IMAGE":
                sharedTextureCache.addImage(resInfo.src);
                break;
            case "SOUND":
                sharedEngine.preloadSound(resInfo.src);
                break;
            case "XML":
                sharedParser.preloadPlist(resInfo.src);
                break;
            case "BINARY":
                sharedFileUtils.preloadBinaryFileData(resInfo.src);
                break;
            case "TEXT" :
                sharedFileUtils.preloadTextFileData(resInfo.src);
                break;
            case "FONT":
                this._registerFaceFont(resInfo);
                break;
            default:
                throw "cocos2d:unknown filename extension: " + type;
                break;
        }
    },

    _schedulePreload: function () {
        var _self = this;
        this._interval = setInterval(function () {
            _self._preload();
        }, this._animationInterval * 1000);
    },

    _unschedulePreload: function () {
        clearInterval(this._interval);
    },

    _getResType: function (resInfo) {
        var isFont = resInfo.fontName;
        if (isFont != null) {
            return cc.RESOURCE_TYPE["FONT"];
        } else {
            var src = resInfo.src;
            var ext = src.substring(src.lastIndexOf(".") + 1, src.length);

            var index = ext.indexOf("?");
            if(index > 0) ext = ext.substring(0, index);

            for (var resType in cc.RESOURCE_TYPE) {
                if (cc.RESOURCE_TYPE[resType].indexOf(ext) != -1) {
                    return resType;
                }
            }
            return ext;
        }
    },

    _updatePercent: function () {
        var percent = this.getPercentage();

        if (percent >= 100) {
            this._unschedulePreload();
            this._complete();
        }
    },

    _complete: function () {
        if (this._target && (typeof(this._selector) == "string")) {
            this._target[this._selector](this);
        } else if (this._target && (typeof(this._selector) == "function")) {
            this._selector.call(this._target, this);
        } else {
            this._selector(this);
        }

        this._curNumber = 0;
        this._loadedNumber = 0;
        this._totalNumber = 0;
    },

    _registerFaceFont: function (fontRes) {
        var srcArr = fontRes.src;
        var fileUtils = cc.FileUtils.getInstance();
        if (srcArr && srcArr.length > 0) {
            var fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            document.body.appendChild(fontStyle);

            var fontStr = "@font-face { font-family:" + fontRes.fontName + "; src:";
            for (var i = 0; i < srcArr.length; i++) {
                fontStr += "url('" + fileUtils.fullPathForFilename(encodeURI(srcArr[i].src)) + "') format('" + srcArr[i].type + "')";
                fontStr += (i == (srcArr.length - 1)) ? ";" : ",";
            }
            fontStyle.textContent += fontStr + "};";

            //preload
            //<div style="font-family: PressStart;">.</div>
            var preloadDiv = document.createElement("div");
            preloadDiv.style.fontFamily = fontRes.fontName;
            preloadDiv.innerHTML = ".";
            preloadDiv.style.position = "absolute";
            preloadDiv.style.left = "-100px";
            preloadDiv.style.top = "-100px";
            document.body.appendChild(preloadDiv);
        }
        cc.Loader.getInstance().onResLoaded();
    },

    _unregisterFaceFont: function (fontRes) {
        //todo remove style
    }
});

/**
 * Preload resources in the background
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.Loader}
 * @example
 * //example
 * var g_mainmenu = [
 *    {src:"res/hello.png"},
 *    {src:"res/hello.plist"},
 *
 *    {src:"res/logo.png"},
 *    {src:"res/btn.png"},
 *
 *    {src:"res/boom.mp3"},
 * ]
 *
 * var g_level = [
 *    {src:"res/level01.png"},
 *    {src:"res/level02.png"},
 *    {src:"res/level03.png"}
 * ]
 *
 * //load a list of resources
 * cc.Loader.preload(g_mainmenu, this.startGame, this);
 *
 * //load multi lists of resources
 * cc.Loader.preload([g_mainmenu,g_level], this.startGame, this);
 */
cc.Loader.preload = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    this._instance.initWithResources(resources, selector, target);
    return this._instance;
};

/**
 * Preload resources async
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.Loader}
 */
cc.Loader.preloadAsync = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    this._instance.setAsync(true);
    this._instance.initWithResources(resources, selector, target);
    return this._instance;
};

/**
 * Release the resources from a list
 * @param {Array} resources
 */
cc.Loader.purgeCachedData = function (resources) {
    if (this._instance) {
        this._instance.releaseResources(resources);
    }
};

/**
 * Returns a shared instance of the loader
 * @function
 * @return {cc.Loader}
 */
cc.Loader.getInstance = function () {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    return this._instance;
};

cc.Loader._instance = null;


/**
 * Used to display the loading screen
 * @class
 * @extends cc.Scene
 */
cc.LoaderScene = cc.Scene.extend(/** @lends cc.LoaderScene# */{
    _logo: null,
    _logoTexture: null,
    _texture2d: null,
    _bgLayer: null,
    _label: null,
    _winSize:null,

    /**
     * Constructor
     */
    ctor: function () {
        cc.Scene.prototype.ctor.call(this);
        this._winSize = cc.Director.getInstance().getWinSize();
    },
    init:function(){
        cc.Scene.prototype.init.call(this);

        //logo
        var logoHeight = 200;
        var centerPos = cc.p(this._winSize.width / 2, this._winSize.height / 2);

        this._logoTexture = new Image();
        var _this = this;
        this._logoTexture.addEventListener("load", function () {
            _this._initStage(centerPos);
            this.removeEventListener('load', arguments.callee, false);
        });
        //this._logoTexture.src = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAlAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM4MDBEMDY2QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM4MDBEMDY1QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RTk0OEM4OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RTk0OEM5OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQADQkJCQoJDQoKDRMMCwwTFhENDREW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";
        this._logoTexture.src ="data:image/png;base64,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";
        //this._logoTexture.width = 160;
        //this._logoTexture.height = 200;

        // bg
        this._bgLayer = cc.LayerColor.create(cc.c4(32, 32, 32, 255));
        this._bgLayer.setPosition(0, 0);
        this.addChild(this._bgLayer, 0);

        //loading percent
        this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 14);
        this._label.setColor(cc.c3(180, 180, 180));
        this._label.setOpacity(0);
        this._label.setPosition(cc.pAdd(centerPos, cc.p(0, -logoHeight / 2 - 10)));
        this._bgLayer.addChild(this._label, 10);
    },

    _initStage: function (centerPos) {
        this._texture2d = new cc.Texture2D();
        this._texture2d.initWithElement(this._logoTexture);
        this._texture2d.handleLoadedTexture();
        this._logo = cc.Sprite.createWithTexture(this._texture2d);

        this._logo.setPosition(centerPos);
        this._bgLayer.addChild(this._logo, 10);

        //load resources
        this._logoFadeIn();
    },

    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.schedule(this._startLoading, 0.3);
    },

    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} selector
     * @param {Object} target
     */
    initWithResources: function (resources, selector, target) {
        this.resources = resources;
        this.selector = selector;
        this.target = target;
    },

    _startLoading: function () {
        this.unschedule(this._startLoading);
        cc.Loader.preload(this.resources, this.selector, this.target);
        this.schedule(this._updatePercent);
    },

    _logoFadeIn: function () {
        var logoAction = cc.Spawn.create(
            cc.EaseBounce.create(cc.MoveBy.create(0.25, cc.p(0, 10))),
            cc.FadeIn.create(0.5));

        var labelAction = cc.Sequence.create(
            cc.DelayTime.create(0.15),
            logoAction.clone());

        this._logo.runAction(logoAction);
        this._label.runAction(labelAction);
    },

    _updatePercent: function () {
        var percent = cc.Loader.getInstance().getPercentage();
        var tmpStr = "Loading... " + percent + "%";
        this._label.setString(tmpStr);

        if (percent >= 100)
            this.unschedule(this._updatePercent);
    }
});

/**
 * Preload multi scene resources.
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.LoaderScene}
 * @example
 * //example
 * var g_mainmenu = [
 *    {src:"res/hello.png"},
 *    {src:"res/hello.plist"},
 *
 *    {src:"res/logo.png"},
 *    {src:"res/btn.png"},
 *
 *    {src:"res/boom.mp3"},
 * ]
 *
 * var g_level = [
 *    {src:"res/level01.png"},
 *    {src:"res/level02.png"},
 *    {src:"res/level03.png"}
 * ]
 *
 * //load a list of resources
 * cc.LoaderScene.preload(g_mainmenu, this.startGame, this);
 *
 * //load multi lists of resources
 * cc.LoaderScene.preload([g_mainmenu,g_level], this.startGame, this);
 */
cc.LoaderScene.preload = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.LoaderScene();
        this._instance.init();
    }

    this._instance.initWithResources(resources, selector, target);

    var director = cc.Director.getInstance();
    if (director.getRunningScene()) {
        director.replaceScene(this._instance);
    } else {
        director.runWithScene(this._instance);
    }

    return this._instance;
};