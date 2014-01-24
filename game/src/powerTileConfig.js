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
    "healing":{
        "png":dirImg + "powerTiles{v}.png",
        "plist":dirImg + "powerTiles{v}.plist",
        "icon":"Holy5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"healAll"
    },
    "leech":{
        "png":dirImg + "powerTiles.png",
        "plist":dirImg + "powerTiles.plist",
        "icon":"Shadow4.png",
        "cooldown":2000,
        "type":"global",
        "offense":"leechAll"
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
    }
}


var globalPowers = {
    "fireBall":function(){

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
                GeneralBehavior.applyDamage(foes[i], undefined, 200, jc.elementTypes.none);
            }
        }.bind(undefined, arena, touch));
        var seq = cc.Sequence.create(moveTo, func);
        cannonball.runAction(seq);

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
                    "damage": 20,
                    "duration": 2,
                    "interval": 0.25
                }, "life");
        }


    },
    "lightningBolt":function(){

    },
    "healAll":function(){

    },
    "leech":function(){

    },
    "iceStorm":function(){

    }

}