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
            case 'editTeam-pre':
                cc.Director.getInstance().replaceScene(Loading.scene(assets, 'editTeam'));
                break;
            case 'editTeam':
                cc.Director.getInstance().replaceScene(EditTeam.scene());
                break;
            case 'arena-pre':
                ArenaGame.scene();
                jc.arenaScene.data=data;
                cc.Director.getInstance().replaceScene(Loading.scene(assets, 'arena'));
                break;
            case 'arena':
                cc.Director.getInstance().replaceScene(jc.arenaScene);
                break;

            case 'animationTest':
                cc.Director.getInstance().replaceScene(AnimationTest.scene());
                break;


        }
    },
    onEnter:function(){
        //fight config
        var fightConfig = {
            teamA:[
                "orge",
                "forestElf",
            ],
            teamAFormation:"4x4x4a",
            teamB:[
                "forestElf",
                "orge",

            ],
            teamBFormation:"4x4x4b",
            teamAPowers:['poisonCloud', 'healing'],
            teamBPowers:['lightningBolt', 'fireBall'],
            offense:'a'
        };

        //def - effect
        //def - gameObject - missile
        //missile - effect
        //powers - powerAnimationsRequired
       var assets = this.makeAssetDictionary(fightConfig.teamA, fightConfig.teamB, fightConfig.teamAPowers, fightConfig.teamBPowers);
       var cardAssets = this.makeCardDictionary();
       this.changeScene('editTeam-pre', cardAssets);


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
            var name = teamA[i];
            this.addAssetChain(assets, name);
        }

        for (var i=0;i<teamB.length;i++){
            var name = teamB[i];
            this.addAssetChain(assets, name);
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
    if (!jc.mainScene){
        jc.mainScene = cc.Scene.create();
        jc.mainScene.layer = MainGame.create();
        jc.mainScene.addChild(jc.mainScene.layer );
    }
    return jc.mainScene;
};