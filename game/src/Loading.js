var Loading = jc.UiElementsLayer.extend({
    init: function(config) {

        this.assets = config.assets;
        this.nextScene = config.nextScene;
        this.apiCalls = config.apiCalls;
        this.assetFunc = config.assetFunc;


        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(loadingPlist);
            this.initFromConfig(this.windowConfig);
            this.start();
            return true;
        } else {
            return false;
        }
    },
    inTransitionsComplete:function(){
        //put the spinner in
        this.animationDone = true;
        this.spinner = jc.makeSpriteWithPlist(loadingPlist,loadingPng, "loader1.png");
        this.addChild(this.spinner);
        this.spinner.setPosition(cc.p((this.winSize.width/2)-3, (this.winSize.height/2) + 51));
        this.startLoading();

    },
    startLoading:function(){

        //first thing calculate total items
        this.totalItemsToLoad = 0;
        this.totalItemsCompleted=0;
        if (this.assets){
            this.totalItemsToLoad+=this.assets.length;
        }else if (this.assetFunc){
            this.totalItemsToLoad++;
        }
        if (this.apiCalls){
            this.totalItemsToLoad +=this.apiCalls.length;
        }


        //before anything we need to get the assetFunc out of the way
        if (this.assetFunc){
            this.assetFunc(function(assets){
                this.totalItemsCompleted++;
                if (this.assets){
                    this.assets = this.assets.concat(assets);
                }else{
                    this.assets = assets;
                }
                this.totalItemsToLoad+=assets.length;
                this.startLoadingAssets();
            }.bind(this))
        }else{
            this.startLoadingAssets();
        }

        //if there
        if (this.apiCalls){
            this.startLoadingApiCalls();
        }

        this.schedule(this.checkPercent);
    },
    startLoadingAssets:function(){
        cc.Loader.preload(this.assets, function(){
            this.ccLoaderDone = true;
        }.bind(this));
    },
    startLoadingApiCalls:function(){
        var q = async.queue(function(task,callback){
            task.action(callback);
        }.bind(this),2);

        for (var i =0;i<this.apiCalls.length;i++){
            q.push({"name":i, "action":this.apiCalls[i]}, function(err){
                this.totalItemsCompleted++;
            }.bind(this));
        }

        q.drain= function(){
            jc.log(['loader'],"apiCalls done");
        }.bind(this);
    },
    raiseComplete:function(){
        this.done();
        this.unschedule(this.checkPercent);
        hotr.changeScene(this.nextScene);

    },
    slideWallLeft:function(doneDelegate){
        var itemRect = this.leftDoor.getTextureRect();
        var fromX = (0 - itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        var toX = (this.winSize.width/2)-itemRect.width/2;
        var toY = fromY;
        var to = cc.p(toX, toY);

        this.slide(this.leftDoor, cc.p(fromX,fromY), to, jc.defaultTransitionTime, undefined, undefined,doneDelegate);

    },
    slideWallRight:function(doneDelegate){
        var itemRect = this.rightDoor.getTextureRect();
        var fromX = (this.winSize.width + itemRect.width); //offscreen right
        var fromY = this.winSize.height/2;
        var toX = (this.winSize.width/2)+itemRect.width/2;
        var toY = fromY;
        var to = cc.p(toX, toY);

        this.slide(this.rightDoor, cc.p(fromX,fromY), to, jc.defaultTransitionTime, undefined, undefined,doneDelegate);

    },
    checkPercent:function(){
        //implement loading bar once we have the sprites
        if (this.animationDone){

            var parts = 20; //we have 20 animation states for the bar

            //first, what is the asset loader at?
            var loader = cc.Loader.getInstance();


            //ccLoader is a bit of a piece, so - we need to patch it up with some stuff...
            //first if it finished, it will report getPercentage lower than 100 forever. so we track that
            var percent = 0;
            var totalAssets = 0;
            if (this.assets){
                if (this.ccLoaderDone==true){
                    percent = 100;
                }else{
                    percent = loader.getPercentage(); //it will also go over, so patch that down
                    if (percent> 100){
                        percent = 100;
                    }
                }
                //turn the loader percentage into a value representing the # of assets
                totalAssets = (percent*this.assets.length)/100;
            }else{
                totalAssets = 0;
            }


            //what does that represent?
            var tempDoneCount = totalAssets + this.totalItemsCompleted;

            //now convert that back to a percentage
            var percentDone = Math.floor((tempDoneCount/this.totalItemsToLoad) * 100);


            //calculate
            var part = Math.floor(percentDone * parts/100);
            if (part < 1){
                part = 1;
            }
            if (part > parts){
                part = parts;
            }
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader"+part+".png");
            this.spinner.setDisplayFrame(frame)

            if (tempDoneCount >= this.totalItemsToLoad){
                var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader20.png");
                this.spinner.setDisplayFrame(frame);
                this.scheduleOnce(this.raiseComplete.bind(this));

            }
        }
    },
    windowConfig:{
        "leftDoor":{
            "type":"sprite",
            "transitionIn":"custom",
            "executeIn":"slideWallLeft",
            "transitionOut":"left",
            "cell":4,
            "anchor":['left'],
            "sprite":"leftDoor.png",
            "padding":{
                left:10,
            }

        },
        "rightDoor":{
            "type":"sprite",
            "transitionIn":"custom",
            "executeIn":"slideWallRight",
            "transitionOut":"right",
            "cell":6,
            "anchor":['right'],
            "sprite":"rightDoor.png",
            "padding":{
                left:-10,
            }

        }
    }
});

