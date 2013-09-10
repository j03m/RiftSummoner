var arenaSheet = dirImg + "arena.png";
var arenaPlist = dirImg + "arena.plist";
var bloodPlist = dirImg + "blood.plist";
var shadowPlist = dirImg + "shadowSheet.plist";
var shadowPng = dirImg + "shadowSheet.png";
var carduiPlist = dirImg + "cardui.plist";
var carduiPng = dirImg + "cardui.png";
var editDeck = dirImg + "MainScene.ccbi";
var battleFlagPlist = dirImg + "battleFlag.plist";
var battleFlagPng = dirImg + "battleFlag.png";
var nightmarePlist = dirImg + "nightmare.plist";
var nightmarePng = dirImg + "nightmare.png";
var redlineContainerPlist = dirImg + "redLineContainer.plist";
var redlineContainerPng = dirImg + "redlineContainer.png";

//var myfont = dirImg + "georgiab.ttf";
var g_characterPngs = {};
var g_characterPlists = {};



var g_maingame = [
    //image
	{src:arenaSheet},
	{src:arenaPlist},
    {src:bloodPlist},
    {src:shadowPlist},
    {src:shadowPng},
    {src:carduiPng},
    {src:carduiPlist},
    {src:editDeck},
    {src:battleFlagPlist},
    {src:battleFlagPng},
    {src:nightmarePlist},
    {src:nightmarePng},
    {src:redlineContainerPlist},
    {src:redlineContainerPng},

    //{src:myfont}
];


for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = dirImg + entry + 'Sheet.png';
        g_characterPlists[entry] = dirImg + entry + 'Sheet.plist';
        g_maingame.push({src:g_characterPngs[entry]});
        g_maingame.push({src:g_characterPlists[entry]});
    }
}