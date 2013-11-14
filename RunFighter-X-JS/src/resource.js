var arenaSheet = dirImg + "arena.png";
var shadowPlist = dirImg + "shadowSheet.plist";
var shadowPng = dirImg + "shadowSheet.png";
var powerTilesPng= dirImg + "powerTiles.png";
var powerTilesPlist= dirImg + "powerTiles.plist";
var selectTeamUI = dirImg + "selectTeam.plist";
var selectTeamUIPng = dirImg + "selectTeam.png";
var editTeamUI = dirImg + "editTeam.plist";
var editTeamUIPng = dirImg + "editTeam.png";

var windowPng = dirImg + "windows.png";
var windowPlist = dirImg + "windows.plist";

var cardsPngs = [dirImg + "cards.png"];
var cardsPlists = [dirImg + "cards.plist"];
var portraitPlists = [dirImg + "portraits.plist"];
var portraitPngs = [dirImg + "portraits.png"];

var g_characterPngs = {};
var g_characterPlists = {};


//core resources - need these to launch ui, loader, etc
var g_maingame = [
    {src:arenaSheet},
    {src:shadowPlist},
    {src:shadowPng},
    {src:selectTeamUI},
    {src:selectTeamUIPng},
    {src:editTeamUI},
    {src:editTeamUIPng},
    {src:windowPlist},
    {src:windowPng}
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
