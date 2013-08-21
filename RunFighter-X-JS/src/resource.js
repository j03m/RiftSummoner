var ryuPlist = dirImg + "ryu-packed.plist"
var ryuSheet = dirImg + "ryu-packed.png"
var wizardPlist = dirImg + "wizard.plist";
var wizardSheet = dirImg + "wizard.png";
var mapTiles = dirImg + "mymap.tmx";
var mapSheet = dirImg + "dontstarve.png";
var alexPlist = dirImg + "alex.plist"
var alexSheet = dirImg + "alex.png"
var ogrePlist = dirImg + "ogre.plist"
var ogreSheet = dirImg + "ogre.png"
var ibukiPlist = dirImg + "ibuki.plist"
var ibukiSheet = dirImg + "ibuki.png"
var arenaSheet = dirImg + "arena.png";
var arenaPlist = dirImg + "arena.plist";

//var blackGargoyleSheet = dirImg + 'blackGargoyleSheet.png';
//var dragonBlackSheet = dirImg + 'dragonBlackSheet.png';
//var blueKnightSheet =  dirImg + 'blueKnightSheet.png';
//var orcSheet =  dirImg + 'orcSheet.png';
//
//var blackGargoylePlist = dirImg + 'blackGargoyleSheet.plist';
//var dragonBlackPlist = dirImg + 'dragonBlackSheet.plist';
//var blueKnightPlist =  dirImg + 'blueKnightSheet.plist';
//var orcPlist =  dirImg + 'orcSheet.plist';

var g_characterPngs = {};
var g_characterPlists = {};


var g_maingame = [
    //image
	{src:arenaSheet},
	{src:arenaPlist}
//	{src:blackGargoyleSheet},
//	{src:blackGargoylePlist},
//	{src:blueKnightSheet},
//	{src:blueKnightPlist},
//	{src:dragonBlackSheet},
//	{src:dragonBlackPlist},
//	{src:orcPlist},
//	{src:orcSheet}

];


for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = dirImg + entry + 'Sheet.png';
        g_characterPlists[entry] = dirImg + entry + 'Sheet.plist';
        g_maingame.push({src:g_characterPngs[entry]});
        g_maingame.push({src:g_characterPlists[entry]});
    }
}