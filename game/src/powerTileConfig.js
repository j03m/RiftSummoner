var powerTiles = {
    "fireBall":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Fire4.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"fireBall"
    },
    "poisonCloud":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Poison4.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"poisonCloud"
    },
    "lightningBolt":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Holy1.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"lightningBolt"
    },
    "healall":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Holy5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"healAll"
    },
    "cureall":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Holy3.png",
        "cooldown":2000,
        "type":"global",
        "offense":"cureAll"
    },
    "leechall":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Shadow4.png",
        "cooldown":2000,
        "type":"global",
        "offense":"leechAll"
    },
    "raisedead":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Shadow2.png",
        "cooldown":2000,
        "type":"global",
        "offense":"raiseDead"
    },
    "iceStorm":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Frost5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"iceStorm"
    },
    "cannon":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"cannonballTile.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"cannon",
        "defense":"tripleCannon"
    },
    "firearm":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Fire5.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"firearm"
    }
}


var globalPowers = {
    "fireBall":function(){

    },
    "firearm":function(touch, sprites){
        var arena = hotr.arenaScene.layer;

        //play tap effect at touch

        var minSprite = this.getBestSpriteForTouch(touch, sprites, arena.selectedSprite.enemyTeam());
        if (!minSprite){
            return false;
        }else{

            jc.playEffectOnTarget("voidFire", arena.selectedSprite, arena, true);
            this.scheduleOnce(function(){
                arena.selectedSprite.behavior.setLock(minSprite);
                var pos = arena.selectedSprite.behavior.getWhereIShouldBe('front','faceing', minSprite );
                arena.selectedSprite.setBasePosition(pos);
                arena.selectedSprite.behavior.setState('special', 'special');
                GeneralBehavior.applyDamage( minSprite, arena.selectedSprite, minSprite.gameObject.MaxHP/2);
                arena.flash();

            });

            return true;
        }



    },
    "cannon":function(touch){
        var arena = hotr.arenaScene.layer;
        var behavior = hotr.arenaScene.layer.teams['a'][0].behavior;
        var cannonConfig = missileConfig['cannonball'];
        var cannonball = jc.makeSpriteWithPlist(cannonConfig.plist, cannonConfig.png, cannonConfig.start);
        var spin = jc.makeAnimationFromRange("cannonball", cannonConfig);
        cannonball.setScale(0.5, 0.5);
        cannonball.runAction(spin);
        var blinky = jc.playEffectAtLocation("enemySelection", touch, jc.shadowZOrder, arena);
        var swords = jc.makeSpriteWithPlist(touchUiPlist, touchUiPng, "swordsIcon.png");
        arena.addChild(swords);
        swords.setPosition(touch);
        swords.setZOrder(jc.topMost);

        //start it top left with an explosion
        var start = cc.p(0,arena.winSize.height/2);
        //first explosion
        jc.playEffectAtLocation("explo", start, 1, arena);
        arena.addChild(cannonball);
        cannonball.setPosition(start);
        var vector = behavior.getVectorTo(start, touch);
        var timeToImpact = vector.distance/cannonConfig.speed;
        var moveTo = cc.JumpTo.create(timeToImpact, touch, vector.distance/2, 1);
        var func = cc.CallFunc.create(function(layer, touch){
            jc.playEffectAtLocation("explo", touch, 1, layer);
            var exploRad = 100*jc.assetScaleFactor;
            var point2 = cc.p(touch.x, touch.y+exploRad);
            var point3 = cc.p(touch.x, touch.y-exploRad);
            var point4 = cc.p(touch.x+exploRad, touch.y);
            var point5 = cc.p(touch.x-exploRad, touch.y);

            jc.playEffectAtLocation("explo", touch, 1, layer);
            arena.scheduleOnce(function(){
                jc.playEffectAtLocation("explo", point2, 1, layer);
            }, 0.2);

            arena.scheduleOnce(function(){
                jc.playEffectAtLocation("explo", point3, 1, layer);
            }, 0.5);
            arena.scheduleOnce(function(){
                jc.playEffectAtLocation("explo", point4, 1, layer);
            },0.05);
            arena.scheduleOnce(function(){
                jc.playEffectAtLocation("explo", point5, 1, layer);
            }, 0.3);

            layer.removeChild(cannonball, true);
            layer.removeChild(swords, true);
            layer.removeChild(blinky, true);
            var foes = behavior.allFoesWithinRadiusOfPoint(400*jc.assetScaleFactor, touch);
            for (var i=0;i<foes.length;i++){
                GeneralBehavior.applyDamage(foes[i], undefined, 5000, jc.elementTypes.none);
            }
        }.bind(undefined, arena, touch));
        var seq = cc.Sequence.create(moveTo, func);
        cannonball.runAction(seq);
        return true;

    },
    "poisonCloud":function(touch, sprites){
        var behavior = hotr.arenaScene.layer.teams['a'][0].behavior;
        var foes = behavior.allFoesWithinRadiusOfPoint(150*jc.characterScaleFactor, touch);

        var effect = jc.playEffectAtLocation("explo", touch , 1, hotr.arenaScene.layer);

        //this function doesn't position us correctly, we need to add to it
        var pos = effect.getPosition();
        var tr = effect.getTextureRect();
        pos.y += tr.height;
        effect.setPosition(pos);

        var fillColor = new cc.Color3B();
        fillColor.r = 0;
        fillColor.b = 0;
        fillColor.g = 255;
        effect.setColor (fillColor);

        //damage them
        for(var i=0;i<foes.length;i++){
                jc.genericPower('poison', undefined, undefined, foes[i], {
                    "damage": 1000,
                    "duration": 2,
                    "interval": 0.25
                }, "life");
        }

        return true;
    },
    "lightningBolt":function(){

    },
    "healAll":function(){
        var arena = hotr.arenaScene.layer;
        arena.flash();
        arena.selectedSprite.behavior.setState('special', 'special');
        var team = hotr.arenaScene.layer.teams['a'];
        for(var i=0;i<team.length;i++){
            if (team[i].name != 'nexus'){
                jc.playEffectOnTarget('heal', team[i], arena, true );
                team[i].gameObject.hp = team[i].gameObject.MaxHP;
            }
        }
        return true;
    },
    "cureAll":function(){
        var arena = hotr.arenaScene.layer;
        arena.flash();
        arena.selectedSprite.behavior.setState('special', 'special');
        var team = hotr.arenaScene.layer.teams['a'];
        for(var i=0;i<team.length;i++){
            if (team[i].name != 'nexus' && team[i].isAlive()){
                team[i].clearEffects();
                jc.playEffectOnTarget('heal', team[i], arena, true );
            }
        }
        return true;
    },
    "leechAll":function(){
        return true;
    },
    "raiseDead":function(){
        //raise and place 5 skeletons on the board 3 sword, 2 archers
        var arena = hotr.arenaScene.layer;
        var necro = arena.selectedSprite;
        var pos = necro.getBasePosition();
        arena.flash();

        function makeSkel(arena, name, pos){
            var sprite = jc.Sprite.spriteGenerator(spriteDefs, name, hotr.arenaScene.layer);
            arena.teamASpritePrep(sprite);
            sprite.behavior.setState('special', 'rise');
            sprite.setPosition(cc.p(pos.x + jc.randomNum(-200, 200), pos.y + jc.randomNum(-200, 200)));
            arena.addChild(sprite);
        }

        for (var i =0;i<5;i++){
            arena.scheduleOnce(
                function(){makeSkel(arena, 'skeletonSwordsman', pos)}, i/100 + 0.05
            );
        }

        for (var i =0;i<5;i++){
            arena.scheduleOnce(
                function(){makeSkel(arena, 'skeletonArcher', pos)}, i/100 + 0.05
            );
        }
        return true;

    },
    "iceStorm":function(){
        return true;
    }

}