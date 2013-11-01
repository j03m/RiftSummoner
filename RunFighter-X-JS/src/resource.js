var arenaSheet = dirImg + "arena.png";
var shadowPlist = dirImg + "shadowSheet.plist";
var shadowPng = dirImg + "shadowSheet.png";
var carduiPlist = dirImg + "cardui.plist";
var carduiPng = dirImg + "cardui.png";
var portraitsPlist = dirImg + "portraits-hd.plist";
var portraitsPng = dirImg + "portraits-hd.png";
var windowPlist = dirImg + "windows.plist";
var windowPng = dirImg + "windows.png";



//var myfont = dirImg + "georgiab.ttf";
var g_characterPngs = {};
var g_characterPlists = {};

var g_effectPngs = {};


var g_maingame = [
    //image
	{src:arenaSheet},
    {src:shadowPlist},
    {src:shadowPng},
    {src:carduiPng},
    {src:carduiPlist},
    {src:portraitsPlist},
    {src:portraitsPng},
    {src:windowPlist},
    {src:windowPng},
];


for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = dirImg + entry + 'Sheet.png';
        g_characterPlists[entry] = dirImg + entry + 'Sheet.plist';
        g_maingame.push({src:g_characterPngs[entry]});
        g_maingame.push({src:g_characterPlists[entry]});
    }
}

for (var entry in missileConfig){
    g_maingame.push({src:missileConfig[entry].png});
    g_maingame.push({src:missileConfig[entry].plist});
}

for (var entry in effectsConfig){
    g_maingame.push({src:effectsConfig[entry].png});
    g_maingame.push({src:effectsConfig[entry].plist});
}