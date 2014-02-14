var jc = jc || {};

jc.tutorials = {};
jc.tutorials.types = {};
jc.tutorials.types.character = 'character';
jc.tutorials.types.action = 'action';
jc.tutorials.types.msg = 'msg';
jc.tutorials.types.arrow = 'arrow';

jc.tutorials.actors = {};
jc.tutorials.actors.girl = 'girl';
jc.tutorials.actors.orc = 'orc';
jc.tutorials.actors.demon = 'demon';

var tutorialConfig = [
    [
        {
            "msg":"Summoner, you're here! We need you now! Orc warriors have set up a nexus outside the city - they're planning to invade!",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"left"
        },
        {
            "type":"arrow",
            "location":cc.p(1800,600),
            "direction":"down",
            "exit":jc.tutorials.actors.girl,
            "exitDir":"left",
            "pause": true,
            "check":"enableButtons",
            "hightlightRect":cc.rect(500, 100, 100, 100)
        },
        {
            "msg":"This gem is your nexus. It is the source of your power and you must protect it at all costs.",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "upause": true,
        },
        {
            "msg":"You can place Champions on the board near your nexus and use them to defeat the enemy. Here you have summoned - Drakkar. She is a powerful eleven assassin.",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
        },
        {
            "msg":"Move Drakkar by tapping a location on the game board.",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,


        },
        {
            "type":"arrow",
            "mask":cc.rect(1800, 600,100, 100),
            "location":cc.p(2000,1500),
            "direction":"down",
            "exit":jc.tutorials.actors.girl,
            "exitDir":"left",
            "check":"checkArrowCollision",
            "pause": true

        },
        {
            "msg":"Good - now use the selection bar below to summon me, Gaia, a powerful healer.",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "check":"makeSelectionBar",
            "unpause":true

        },
        {
            "type":"arrow",
            "mask":cc.rect(1800, 600,100, 100),
            "location":cc.p(1500,1500),
            "direction":"down",
            "exit":jc.tutorials.actors.girl,
            "exitDir":"left",
            "check":"checkForGaia",
            "pause": true
        },
        {
            "msg":"You can click on Drakkar to command me to heal her. ",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "unpause": true
        },
        {
            "exit":jc.tutorials.actors.girl,
            "exitDir":"left",
            "type":jc.tutorials.types.action,
            "check":"gaiaSupportsDrakkar",
            "pause": true
        },
        {
            "msg":"Well done. ",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "unpause": true
        },
        {
            "msg":"Uh oh, looks like some orcs - let's get rid of them. ",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "check":"spawnTwoOrcs"
        },
        {
            "msg":"This is the battle field. To defend the city, you must destroy the enemy nexus, before they destroy yours.",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "unpause": true,
            "check":"zoomOutFull"
        },
        {
            "msg":"An army of minions will spawn at your nexus. Use your champions to push your minions to victory.",
            "actor":jc.tutorials.actors.girl,
            "type":jc.tutorials.types.character,
            "direction":"right",
            "y":0,
            "unpause": true,
            "check":"makeCreeps"
        },
    ],
    []


];