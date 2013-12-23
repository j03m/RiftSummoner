//todo: remove
//var transition = cc.TransitionSlideInR.create(EditDeck.scene, 2);
//cc.Director.getInstance().replaceScene(transition);
//return;
Array.prototype.pushUnique = function(value){
    if (!value){
        throw "Attempting to load undefined value.";
    }
    if (this.indexOf(value)==-1){
        this.push(value);
    }
}

var MainGame = cc.Layer.extend({
    state: 0,
    signThis:"yoyoyoyoyosignthissonsignitsignitsignit",
    init: function() {
        if (this._super()) {
            return true;
        } else {
            return false;
        }
    },
	goToReturnPoint:function(){
		if (!this.returnPoint){
			jc.log(['console'], "return point not defined, going to landing");
			this.changeScene('landing');			
		}else{
			this.returnPoint();			
		}


	},
    changeScene:function(key, assets, data){         //todo: change to layer manager

        if(this.loader){
            cc.Director.getInstance().getRunningScene().removeChild(this.loader,true)
        }
		if (!this.lastScene){
			this.lastScene = key;
		}else{
			this.lastScene =this.currentScene;
		}
        
		switch(key){
			case 'selectEditTeamPre':
				this.selectEditTeamPre();
				break;
            case 'selectTeam':
                cc.Director.getInstance().replaceScene(SelectTeam.scene());
                break;
            case 'editTeam':
                cc.Director.getInstance().replaceScene(EditTeam.scene());
                break;
            case 'arena':
                cc.Director.getInstance().replaceScene(hotr.arenaScene);
                break;
            case 'landing':
                cc.Director.getInstance().replaceScene(Landing.scene());
                break;
            case 'animationTest':
                cc.Director.getInstance().replaceScene(AnimationTest.scene());
                break;
            case 'multiplayer':
                cc.Director.getInstance().replaceScene(Multiplayer.scene());
                break;
        }
		this.currentScene = key;
    },
    showLoader:function(config){
        this.loader = new Loading();
        var runningScene = cc.Director.getInstance().getRunningScene();
        runningScene.addChild(this.loader);
        this.loader.init(config);

    },
    selectEditTeamPre: function(){
        var assets = this.makeCardDictionary();
        assets = assets.concat(g_ui);
        this.showLoader({
            "assets":assets,
            "nextScene":'selectTeam'
        });
    },
    arenaPre:function(){
		if (hotr.newOpponent){
			this.arenaMP();
		}else{
	    	this.arenaQuest();			
		}
		
    	
	},
	mpGetGames:function(){
        //make api call to get multiplayer games		
        var assets = [];
        assets = assets.concat(g_ui);
        this.showLoader({
            "assets":assets,
            "apiCalls":[
                function(callback){
                    hotr.multiplayerOperations.getGames(function(){
                        callback();
                    });
                }
            ],
            "nextScene":'multiplayer'
        });       		
	},
	mpTakeTurn:function(){
		this.returnPoint = this.mpGetGames.bind(this);
        var assets = this.makeCardDictionary();
        assets = assets.concat(g_ui);
		this.showLoader({           
            "assets":assets,
            "nextScene":'selectTeam'
        });						
	},
	mpStartGame:function(){		
		this.returnPoint = this.mpGetGames.bind(this);
        var assets = this.makeCardDictionary();
        assets = assets.concat(g_ui);
		this.showLoader({           
            "assets":assets,
            "apiCalls":[ //get opponent
                function(callback){                    				   
				    hotr.multiplayerOperations.findGame(function(result){
                        if (result){
                            callback();
                        }else{
                            //back to multiplayer
                            this.mpGetGames();
                        }

                    }.bind(this));
                }.bind(this)
            ],
            "nextScene":'selectTeam'
        });				
	},
	arenaMP:function(){
        ArenaGame.scene();
        var teamA = hotr.blobOperations.getTeam();
        var level = hotr.blobOperations.getLevel();
        var teamAFormation = hotr.blobOperations.getFormation();
        var teamAPowers = hotr.blobOperations.getPowers();
		
		//go to arena - show team dropdown attacker - VS -  defender
		this.showLoader(            {
			"assetFunc":function(assetCallback){
					hotr.multiplayerOperations.getTeam(hotr.newOpponent, function(err, data){
						//if fail, go back from whence we came.
						if (err){
							hotr.changeScene('landing');
						}else{
					        var fightConfig = {
                                op:hotr.newOpponent,
                                teamA:teamA,
					            teamAFormation:teamAFormation,
					            teamB:data.team,
					            teamBFormation:data.formation,
					            teamAPowers:teamAPowers,
					            teamBPowers:[],
					            offense:'a'
					        };	
							var assets = this.makeAssetDictionary(fightConfig.teamA, fightConfig.teamB, fightConfig.teamAPowers, fightConfig.teamBPowers);	
							hotr.arenaScene.data = fightConfig;
							assetCallback(assets);
						}											
					}.bind(this));	
			}.bind(this),
            "apiCalls":[
                function(callback){
                    hotr.blobOperations.saveBlob(function(){
                        callback();
                    });
                }
            ],
            "nextScene":'arena'
        });

	},
	arenaQuest:function(){	
	    //todo: what level, get team
        //fight config
        ArenaGame.scene();
        this.returnPoint = this.selectEditTeamPre.bind(this);
        var teamA = hotr.blobOperations.getTeam();
        var level = hotr.blobOperations.getLevel();
        var teamAFormation = hotr.blobOperations.getFormation();
        var teamAPowers = hotr.blobOperations.getPowers();

        var teamB = hotr.levelLogic.getTeamForLevel(level);
        var teamBFormation = hotr.levelLogic.getFormationForLevel(level);
        var teamBPowers = hotr.levelLogic.getPowers();

        teamA = teamA.concat(teamA);
        teamB = teamB.concat(teamB);

        var fightConfig = {
            teamA:teamA,
            teamAFormation:teamAFormation,
            teamB:teamB,
            teamBFormation:teamBFormation,
            teamAPowers:teamAPowers,
            teamBPowers:teamBPowers,
            offense:'a'
        };

        this.doArena(fightConfig);
    },
    arenaReplay:function(data){
        ArenaGame.scene();

        var fightConfig = {
            type:"replay",
            teamA:data.teamB,
            teamAFormation:"4x4x4a",
            teamB:data.teamA,
            teamBFormation:"4x4x4b",
            teamAPowers:[],
            teamBPowers:[],
            offense:'a'
        };

        var assets = this.makeAssetDictionary(fightConfig.teamA, fightConfig.teamB, fightConfig.teamAPowers, fightConfig.teamBPowers);
        hotr.arenaScene.data = fightConfig;
        //go to arena - show team dropdown attacker - VS -  defender
        this.showLoader(            {
            "assets":assets,
            "nextScene":'arena'
        });

    },
    doArena:function(fightConfig){
        hotr.arenaScene.data = fightConfig;
        var assets = this.makeAssetDictionary(fightConfig.teamA, fightConfig.teamB, fightConfig.teamAPowers, fightConfig.teamBPowers);
        this.showLoader(            {
            "assets":assets,
            "apiCalls":[
                function(callback){
                    hotr.blobOperations.saveBlob(function(){
                        callback();
                    });
                }
            ],
            "nextScene":'arena'
        });
    },
    onEnter:function(){
         jc.log(['mainLayer'], "main starting")
        this.startGame();

    },
    doArenaDev:function(){
        ArenaGame.scene();
        //from hc data for dev purposes
        var teamA = [{name:'dragonRed'}];
        var teamAFormation = "4x4x4a";
        var teamB = [{name:'orge'}];
        var teamBFormation = "4x4x4b";
        var fightConfig = {
            teamA:teamA,
            teamAFormation:teamAFormation,
            teamB:teamB,
            teamBFormation:teamBFormation,
            teamAPowers:[],
            teamBPowers:[],
            offense:'a'
        };
        hotr.arenaScene.data = fightConfig;
        var assets = this.makeAssetDictionary(fightConfig.teamA, fightConfig.teamB, fightConfig.teamAPowers, fightConfig.teamBPowers);
        this.showLoader(            {
            "assets":assets,
            "nextScene":'arena'
        });

    },
    startGame:function(){

        //get signed data from kik
        //if !cached blob token
        var hasPlayed = hotr.blobOperations.hasPlayed();
        var hasToken = hotr.blobOperations.hasToken();

        //if I have an auth token, I don't care, just go.
        if (hasToken){
            jc.log(['mainLayer'], "hasToken");
            this.initGame();
        }else if (hasPlayed) { //if I don't ahve a token, well - have I played? If so, don't create a user for me, just get a token and go
            jc.log(['mainLayer'], "hasPlayed");
            this.authorizeAndInitGame();
        }else{
            //I sort of look like a new player, take me through the new player flow
            jc.log(['mainLayer'], "newPlayer");
            this.authorizeNewPlayer();
        }
    },
    authorizeNewPlayer:function(){
        jc.log(['mainLayer'], "authorizeNewPlayer");
        hotr.blobOperations.createNewPlayer(function(){
            this.startingScene();
        }.bind(this));
    },
    authorizeAndInitGame:function(){
        //send these to us, for authtoken
        hotr.blobOperations.getNewAuthTokenAndBlob(function(){
            this.startingScene();
        }.bind(this));
    },
    initGame:function(){
        hotr.blobOperations.getBlob(function(result){
            if (result){
                this.startingScene();
            }else{
                this.authorizeNewPlayer();
            }
        }.bind(this));
    },
    startingScene:function(){
        this.changeScene('landing');
    },
    makeCardDictionary:function(){
        var names = hotr.blobOperations.getCharacterNames();
        var assets = [];
        _.map(names, function(name){
            var data = this.getCardAssets(name);
            assets.pushUnique(data.cardPng);
            assets.pushUnique(data.cardPlist);
        }.bind(this));
        for (var i =0;i<assets.length;i++){
            assets[i] = {src:assets[i]};
        }
        return assets;
    },
    getCardAssets:function(name){
        var cardIndex = spriteDefs[name].cardIndex;
        if (cardIndex == undefined){
            cardIndex = 0;
        }
        return {    cardPng:cardsPngs[cardIndex],
                    cardPlist:cardsPlists[cardIndex]
        };
    },
    makeAssetDictionary:function(teamA, teamB, teamAPowers, teamBPowers){
        var assets = [];
        for (var i=0;i<teamA.length;i++){
            if (teamA[i]){
                var name = teamA[i].name;
                this.addAssetChain(assets, name);
            }

        }

        for (var i=0;i<teamB.length;i++){
            if (teamB[i]){
                var name = teamB[i].name;
                this.addAssetChain(assets, name);
            }
        }

        for (var i=0;i<teamAPowers.length;i++){
            var name = teamAPowers[i];
            this.addPowerAssets(assets, name);
        }

        for (var i=0;i<teamAPowers.length;i++){
            var name = teamAPowers[i];
            this.addPowerAssets(assets, name);
        }


        assets.pushUnique(g_characterPlists["greenbullet"]);
        assets.pushUnique(g_characterPngs["greenbullet"]);
        assets.pushUnique(g_characterPlists["greenBang"]);
        assets.pushUnique(g_characterPngs["greenBang"]);

        //transform
        for (var i =0;i<assets.length;i++){
            assets[i] = {src:assets[i]};
        }

        for (var i=0;i<g_battleStuff.length;i++){
            assets.pushUnique(g_battleStuff[i]);
        }

        return assets;
    },
    addPowerAssets:function(assetAry, name){

        var animations = powerAnimationsRequired[name];
        if (animations){
            for (var i =0;i<animations.length;i++){
                assetAry.pushUnique(g_characterPlists[animations[i]]);
                assetAry.pushUnique(g_characterPngs[animations[i]]);
            }
        }
    },
    addAnimationChain: function (animations, assetAry) {
        for (var i = 0; i < animations.length; i++) {
            assetAry.pushUnique(g_characterPlists[animations[i]]);
            assetAry.pushUnique(g_characterPngs[animations[i]]);
        }
    },
    addAssetChain:function(assetAry, name){
        assetAry.pushUnique(g_characterPlists[name]);
        assetAry.pushUnique(g_characterPngs[name]);

        if (spriteDefs[name].effect){

            assetAry.pushUnique(g_characterPlists[spriteDefs[name].effect]);
            assetAry.pushUnique(g_characterPngs[spriteDefs[name].effect]);
        }

        if (spriteDefs[name].gameProperties && spriteDefs[name].gameProperties.missile){
			//missile may not have plists
			if (g_characterPlists[spriteDefs[name].gameProperties.missile]){
				assetAry.pushUnique(g_characterPlists[spriteDefs[name].gameProperties.missile]);				
			}
            assetAry.pushUnique(g_characterPngs[spriteDefs[name].gameProperties.missile]);

            //missiles, have effects - we need to add the missile effect here.
            var bulletConfig = missileConfig[spriteDefs[name].gameProperties.missile];
            if (bulletConfig.effect){
                assetAry.pushUnique(g_characterPlists[bulletConfig.effect]);
                assetAry.pushUnique(g_characterPngs[bulletConfig.effect]);
            }
        }

        if (spriteDefs[name].powers){
            var powers = spriteDefs[name].powers;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                this.addAnimationChain(animations, assetAry);
            }

        }

        if (spriteDefs[name].damageMods){
            var powers = spriteDefs[name].damageMods;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                this.addAnimationChain(animations, assetAry);
            }
        }

        if (spriteDefs[name].gameProperties.heal){
            var animations = powerAnimationsRequired['heal'];
            this.addAnimationChain(animations, assetAry);
        }

        if (spriteDefs[name].deathMods){
            var powers = spriteDefs[name].deathMods;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                this.addAnimationChain(animations, assetAry);
                for (var power2 in powers[power]){ // power can be an object
                    var animations2 = powerAnimationsRequired[power2];
                    if (animations2){
                        this.addAnimationChain(animations2, assetAry);
                    }

                }

            }
        }

    }

});

var hotr = hotr || {};
MainGame.create = function() {
    var ml = new MainGame();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

MainGame.scene = function() {
    if (!hotr.mainScene){
        hotr.mainScene = cc.Scene.create();
        hotr.mainScene.layer = MainGame.create();
        hotr.mainScene.layer.retain();
        hotr.mainScene.addChild(hotr.mainScene.layer );
    }
    hotr.changeScene = hotr.mainScene.layer.changeScene.bind(hotr.mainScene.layer);
    return hotr.mainScene;
};



