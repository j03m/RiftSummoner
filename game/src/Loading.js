var Loading = jc.UiElementsLayer.extend({
    init: function(config) {

        if (this._super()) {
            this.assets = config.assets;
            this.nextScene = config.nextScene;
            this.apiCalls = config.apiCalls;
            this.doSpriteLoad = config.doSpriteLoad;
            this.spriteLoadItems = config.spriteLoadItems;
            this.assetFunc = config.assetFunc;
            this.loaderAdjust = cc.p(-8*jc.assetScaleFactor,13*jc.assetScaleFactor);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(loadingPlist);
            this.initFromConfig(this.windowConfig);
            this.bubbleAllTouches(true);
            this.start();
            this.totalBars = 21;
			this.blackBox(jc.designSize);     
			this.spinner.setVisible(false);
            return true;
        } else {
            return false;
        }
    },
    inTransitionsComplete:function(){
        //put the spinner in
        this.animationDone = true;
        this.spinner.setVisible(true);
		var pos = this.spinner.getPosition();
		pos = cc.pAdd(this.loaderAdjust, pos);
		this.spinner.setPosition(pos);
        this.startLoading();

    },
    startLoading:function(){

        //first thing calculate total items
       // this.letterBoxVertical();
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

        if (this.doSpriteLoad){
            this.totalItemsToLoad +=this.spriteLoadItems;
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

        this.schedule(this.checkPercent.bind(this));
        this.schedule(this.updateBar.bind(this),0.025);
    },
    startLoadingAssets:function(){
		if (!this.assets){
			this.ccLoaderDone = true;			
		}else{
	        cc.Loader.preload(this.assets, function(){
	            this.ccLoaderDone = true;
	        }.bind(this));			
		}
    },
    targetTouchHandler:function(type, touch,sprites, touches){
        jc.log(['loader'], "Loader - touch handler");
        return true;
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
    startPostCalls:function(){
        if (!this.spriteLoadStarted && this.doSpriteLoad){
            this.postProc(function(item, total){
                jc.log('loader', 'Sprite created...');
                this.totalItemsCompleted++;
            }.bind(this));
        }
        this.spriteLoadStarted = true;
    },
    postProc:function(statuscb){
//        if (!jc.parsed[effectsPlist]){
//            cc.SpriteFrameCache.getInstance().addSpriteFrames(effectsPlist);
//            jc.parsed[effectsPlist]= true;
//        }
//        hotr.arenaScene.layer.shadowBatchNode = cc.SpriteBatchNode.create(effectsPng);

        hotr.arenaScene.data.teamASprites = {};
        this.idsToSprites(hotr.arenaScene.data.teamA, 'a', statuscb);

        hotr.arenaScene.data.teamACreeps = [];
        this.makeCreeps(jc.totalCreeps, 'a',statuscb);

        hotr.arenaScene.data.teamBSprites = {};
        this.idsToSprites(hotr.arenaScene.data.teamB,'b', statuscb);

        hotr.arenaScene.data.teamBCreeps = [];
        this.makeCreeps(jc.totalCreeps, 'b',statuscb);
    },
    raiseComplete:function(){
        //this.done();
        this.unschedule(this.checkPercent);
        this.scheduleOnce(function(){
            hotr.changeScene(this.nextScene);
        },1);
    },
    getPercentage:function(){
        return 100;
    },
    checkPercent:function(){
        //implement loading bar once we have the sprites
        if (this.animationDone){

            var parts = this.totalBars; //we have 21 animation states for the bar

            //first, what is the asset loader at?
            var getPercentage;
            if (jc.isBrowser){
                 getPercentage = cc.Loader.getInstance().getPercentage;
            }else{
                getPercentage = this.getPercentage;
            }

            //ccLoader is a bit of a piece, so - we need to patch it up with some stuff...
            //first if it finished, it will report getPercentage lower than 100 forever. so we track that
            var percent = 0;
            var totalAssets = 0;
            if (this.assets){
                if (this.ccLoaderDone==true){
                    percent = 100;
                }else{
                    percent = getPercentage(); //it will also go over, so patch that down
                    if (percent> 100){
                        percent = 100;
                    }
                }
                //turn the loader percentage into a value representing the # of assets
                totalAssets = (percent*this.assets.length)/100;
            }else{
                totalAssets = 0;
            }

            if (percent == 100){ //ccLoader is done, postproc allowed
                this.startPostCalls();
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
            this.allowUntil = part;

        }
    },
    updateBar:function(){
        if(!this.currentPart){
            this.currentPart = 1;
        }

        if (this.currentPart < this.allowUntil){
            this.currentPart++;
        }

        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader." + this.currentPart + ".png");
        this.spinner.setDisplayFrame(frame);


        if (this.currentPart >= this.totalBars){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader.21.png");
            this.spinner.setDisplayFrame(frame);
            this.scheduleOnce(this.raiseComplete.bind(this));

        }

    },
    idsToSprites: function(datas, team, status){
        var sprites;
        var i =0;
        if (team == 'a'){
            sprites = hotr.arenaScene.data.teamASprites;
        }else{
            sprites = hotr.arenaScene.data.teamBSprites;
        }
        this.schedule(function(){
            if (datas[i]){
                var id = datas[i].id;
                var name = datas[i].name
                if (spriteDefs[name].creep){
                    for(var ii=0;ii<spriteDefs[name].number;ii++){
                        var sprite = jc.Sprite.spriteGenerator(spriteDefs, name, hotr.arenaScene.layer);
                        if (!sprites[id]){
                            sprites[id]= [];
                        }
                        sprite.id = id;
                        sprites[id].push(sprite);
                    }
                }else{
                    var sprite = jc.Sprite.spriteGenerator(spriteDefs, name, hotr.arenaScene.layer);
                    if (!sprites[id]){
                        sprites[id]= [];
                    }
                    sprite.id =id;
                    sprites[id].push(sprite);
                }
            }
            status(i, datas.length);
            i++;

        }, 0.05, datas.length-1);
    },
    makeCreeps: function(number, team, status){
        var creeps = [];
        var i =0;
        if (team == 'a'){
            creeps = hotr.arenaScene.data.teamACreeps;
        }else{
            creeps = hotr.arenaScene.data.teamBCreeps;
        }

        this.schedule(function(){
            var sprite = jc.Sprite.spriteGenerator(spriteDefs, 'goblinKnightNormal', hotr.arenaScene.layer);
            sprite.id = 'creep-'+team+'-'+i;
            creeps.push(sprite);
            status(i, number);
            i++;
        },0.05, number-1);

    },

    windowConfig:{
	"leftDoor": {
		
	"type": "sprite",		
			"transitionIn": "leftToMid",		
			"transitionOut": "left",		
			"sprite": "leftDoor.png",		
			"z": 0,		
			"pos": {	
						"x": 509.5,
						"y": 768
					}
	},
	"rightDoor": {
		"type": "sprite",
		"transitionIn": "rightToMid",
		"transitionOut": "right",
		"sprite": "rightDoor.png",
		"z": 0,
		"pos": {
			"x": 1533.500000000001,
			"y": 768
		}
	},
	"spinner": {
		"type": "sprite",
		"sprite": "loader.1.png",
		"z": 1
		}
} 
});

