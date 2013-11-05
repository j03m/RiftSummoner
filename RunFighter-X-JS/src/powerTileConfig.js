var powerTiles = {
    "fireBall":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Fire4.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"fireBall"
    },
    "poisonCloud":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Poison4.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"poisonCloud"
    },
    "lightningBolt":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Holy1.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"lightningBolt"
    },
    "healing":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Holy5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"healAll"
    },
    "leech":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Shadow4.png",
        "cooldown":2000,
        "type":"global",
        "offense":"leechAll"
    },
    "iceStorm":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Frost5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"iceStorm"
    },

}


var globalPowers = {
    "fireBall":function(){

    },
    "poisonCloud":function(touch, sprites){
        var behavior = jc.arenaScene.layer.teams['a'][0].behavior;
        var foes = behavior.allFoesWithinRadiusOfPoint(150, touch);

        jc.playEffectAtLocation("greenBang", touch , 1, jc.arenaScene.layer);

        //damage them
        for(var i=0;i<foes.length;i++){
                jc.genericPower('poison', undefined, undefined, foes[i], {
                    "damage": 50,
                    "duration": 5,
                    "interval": 0.5
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