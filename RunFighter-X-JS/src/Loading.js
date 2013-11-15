var Loading = jc.UiElementsLayer.extend({
    init: function(config) {

        this.assets = config.assets;
        this.nextScene = config.nextScene;
        this.apis = config.apis;
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
        this.spinner.setPosition(cc.p((this.winSize.width/2)-1, (this.winSize.height/2)+26));
        this.startLoading();
        this.schedule(this.checkPercent);
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
        if (this.apis){
            this.totalItemsToLoad +=this.apis.length;
        }
        this.schedule.checkPercent();

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
            })
        }else{
            this.startLoadingAssets();
        }

        //if there
        if (this.apis){
            this.startLoadingApis();
        }
    },
    startLoadingAssets:function(){
        cc.Loader.preload(this.assets, function(){
            jc.log(['loader'],"assets done");
        }.bind(this));
    },
    startLoadingApis:function(){
        var q = async.queue(function(task,callback){
            task.action(callback);
        },2);

        for (var i =0;i<this.apis.length;i++){
            q.push({"name":i, "action":this.apis[i]}, function(err){
                this.totalItemsCompleted++;
            });
        }

        q.drain= function(){
            jc.log(['loader'],"apis done");
        }
    },
    raiseComplete:function(val){
        if (!this.completedTasks){
            this.completedTasks = {};
        }
        this.completedTasks[val] = 1;
        if (this.completedTasks['assets']==1 && this.completedTasks['api']==1){
            hotr.changeScene(this.nextScene);
        }

        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader20.png");
        this.spinner.setDisplayFrame(frame);
        this.done();
        this.unschedule(this.checkPercent);
        this.scheduleOnce(function(){
            this.raiseComplete("assets");
        }.bind(this));

    },
    checkPercent:function(){
        //implement loading bar once we have the sprites
        if (this.animationDone){

            var parts = 20; //we have 20 animation states for the bar

            //first, what is the asset loader at?
            var loader = cc.Loader.getInstance();

            var percent = loader.getPercentage();

            //turn the loader percentage into a value
            var totalAssets = (percent*this.assets.length)/100;


            var part = Math.floor(val * parts/100);
            if (part < 1){
                part = 1;
            }
            if (part > total){
                part = parts;
            }
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader"+part+".png");
            this.spinner.setDisplayFrame(frame)
        }
    },
    windowConfig:{
        "leftDoor":{
            "type":"sprite",
            "transitionIn":"left",
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
            "transitionIn":"right",
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

