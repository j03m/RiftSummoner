var dirImg = "art/";
var dirMusic = "sounds/";

var arenaSheet = dirImg + "arena.png";
var shadowPlist = dirImg + "shadowSheet.plist";
var shadowPng = dirImg + "shadowSheet.png";
var powerTilesPng= dirImg + "powerTiles.png";
var powerTilesPlist= dirImg + "powerTiles.plist";

var windowPng = dirImg + "windows.png";
var windowPlist = dirImg + "windows.plist";

var cardsPngs = [dirImg + "cards.png"];
var cardsPlists = [dirImg + "cards.plist"];
var loadingPng = dirImg + "loading.png";
var loadingPlist = dirImg + "loading.plist";
var uiPng = dirImg + "uiElements.png";
var uiPlist = dirImg + "uiElements.plist";

var g_characterPngs = {};
var g_characterPlists = {};



//core resources - need these to launch ui, loader, etc
var g_maingame = [
    {src:arenaSheet},
    {src:shadowPlist},
    {src:shadowPng},
    {src:windowPlist},
    {src:windowPng},
    {src:loadingPlist},
    {src:loadingPng},
    {src:uiPlist},
    {src:uiPng}

];

//core character resources and effects - stuff we need for battles
var g_battleStuff =[
    {src:effectsConfig['teleport'].png},
    {src:effectsConfig['teleport'].plist},
    {src:powerTilesPlist},
    {src:powerTilesPng},

]

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

var g_everything = [];
g_everything = g_everything.concat(_.map(g_characterPngs, function(item){ return {src:item};}));
g_everything = g_everything.concat(_.map(g_characterPlists, function(item){ return {src:item};}));
g_everything = g_everything.concat(_.map(g_battleStuff, function(item){ return item;}));