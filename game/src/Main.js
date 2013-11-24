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
    changeScene:function(key, assets, data){         //todo: change to layer manager


        switch(key){
            case 'selectTeam':
                cc.Director.getInstance().replaceScene(SelectTeam.scene());
                break;
            case 'editTeam':
                cc.Director.getInstance().replaceScene(EditTeam.scene());
                break;
            case 'arena':
                cc.Director.getInstance().replaceScene(hotr.arenaScene);
                break;
            case 'animationTest':
                cc.Director.getInstance().replaceScene(AnimationTest.scene());
                break;


        }
    },
    showLoader:function(config){
        var layer = new Loading();
        var runningScene = cc.Director.getInstance().getRunningScene();
        runningScene.addChild(layer);
        layer.init(config);

    },
    selectEditTeamPre: function(){

//        var testLoader =             {
//            "assets":[{src:g_characterPngs['blueKnight']}],
//            "assetFunc":function(callback){
//                hotr.blobOperations.getBlob(function(){
//                    var cardAssets = this.makeCardDictionary();
//                    callback(cardAssets);
//                }.bind(this))
//            }.bind(this),
//            "nextScene":'selectTeam',
//            "apiCalls":[
//                function(callback){
//                    hotr.blobOperations.getBlob(function(){
//                        console.log("aoi done");
//                        callback();
//                    })
//                },
//            ]
//        }

        this.showLoader({
            "assets":this.makeCardDictionary(),
            "nextScene":'selectTeam'
        });
    },
    arenaPre:function(){
        //todo: what level, get team
        //fight config
        ArenaGame.scene();
        var teamA = hotr.blobOperations.getTeam();
        var level = hotr.blobOperations.getLevel();
        var teamAFormation = hotr.blobOperations.getFormation();
        var teamAPowers = hotr.blobOperations.getPowers();

        if (cards.kik.message){
            var teamB = cards.kik.message.team;
            var teamBFormation = "4x4x4b";
            var teamBPowers = cards.kik.message.powers;

        }else{
            var teamB = hotr.levelLogic.getTeamForLevel(level);
            var teamBFormation = hotr.levelLogic.getFormationForLevel(level);
            var teamBPowers = hotr.levelLogic.getPowers();
        }

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
         cards.kik.getUser(function(token){
             jc.log(['mainLayer'], "getUser:" + token);
             this.startGame(token);
         }.bind(this));
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
    startGame:function(kikUser){

        //get signed data from kik
        //if !cached blob token
        var hasPlayed = hotr.blobOperations.hasPlayed();
        var hasToken = hotr.blobOperations.hasToken();
        var storedUser = hotr.blobOperations.getUserName();

        //if I have an auth token, I don't care, just go.
        if (hasToken && kikUser == storedUser){
            jc.log(['mainLayer'], "hasToken");
            this.initGame();
        }else if (hasPlayed && kikUser == storedUser) { //if I don't ahve a token, well - have I played? If so, don't create a user for me, just get a token and go
            jc.log(['mainLayer'], "hasPlayed");
            this.authorizeAndInitGame();
        }else{
            //I sort of look like a new player, take me through the new player flow
            jc.log(['mainLayer'], "newPlayer");
            this.authorizeNewPlayer(kikUser);
        }
    },
    authorizeNewPlayer:function(){
        jc.log(['mainLayer'], "authorizeNewPlayer");
        cards.kik.sign(this.signThis, function (signedData, username, host) {
            //send these to us, for authtoken
            jc.log(['mainLayer'], "sign");
            jc.log(['mainLayer'], "signedData:" + JSON.stringify(signedData));
            jc.log(['mainLayer'], "username:" + JSON.stringify(username));
            jc.log(['mainLayer'], "host:" + JSON.stringify(host));
            hotr.blobOperations.createNewPlayer(signedData, username, host, function(){
                this.selectEditTeamPre();
            }.bind(this));
        }.bind(this));
    },
    authorizeAndInitGame:function(){
        cards.kik.sign(this.signThis, function (signedData, username, host) {
            //send these to us, for authtoken
            hotr.blobOperations.getNewAuthTokenAndBlob(signedData, username, host, function(){
                this.selectEditTeamPre();
            }.bind(this));
        }.bind(this));
    },
    initGame:function(callback){
        hotr.blobOperations.getBlob(function(){
            this.selectEditTeamPre();
        });
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
    addAssetChain:function(assetAry, name){
        assetAry.pushUnique(g_characterPlists[name]);
        assetAry.pushUnique(g_characterPngs[name]);

        if (spriteDefs[name].effect){

            assetAry.pushUnique(g_characterPlists[spriteDefs[name].effect]);
            assetAry.pushUnique(g_characterPngs[spriteDefs[name].effect]);
        }

        if (spriteDefs[name].gameProperties && spriteDefs[name].gameProperties.missile){
            assetAry.pushUnique(g_characterPlists[spriteDefs[name].gameProperties.missile]);
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
                for (var i =0;i<animations.length;i++){
                    assetAry.pushUnique(g_characterPlists[animations[i]]);
                    assetAry.pushUnique(g_characterPngs[animations[i]]);

                }
            }

        }

        if (spriteDefs[name].damageMods){
            var powers = spriteDefs[name].damageMods;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                for (var i =0;i<animations.length;i++){
                    assetAry.pushUnique(g_characterPlists[animations[i]]);
                    assetAry.pushUnique(g_characterPngs[animations[i]]);

                }
            }
        }

        if (spriteDefs[name].deathMods){
            var powers = spriteDefs[name].deathMods;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                for (var i =0;i<animations.length;i++){
                    assetAry.pushUnique(g_characterPlists[animations[i]]);
                    assetAry.pushUnique(g_characterPngs[animations[i]]);

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
        hotr.mainScene.addChild(hotr.mainScene.layer );
    }
    hotr.changeScene = hotr.mainScene.layer.changeScene.bind(hotr.mainScene.layer);
    return hotr.mainScene;
};



