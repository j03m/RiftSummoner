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
var g_characterAssets = [];

var g_effectPngs = {};

//core resources
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
    }
}

for (var entry in missileConfig){
    g_characterPngs[entry] = missileConfig[entry].png;
    g_characterPlists[entry] = missileConfig[entry].plist;
}

for (var entry in effectsConfig){
    g_characterPngs[entry] = effectsConfig[entry].png;
    g_characterPlists[entry] = effectsConfig[entry].plist;
}
