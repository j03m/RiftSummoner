var dirImg = "art/";
var dirMusic = "sounds/";
var dirLocal = "localArt/";


jc.setDesignSize(jc.resolutions.iphone4);

jc.assetCategory = jc.bestAssetDirectory();


//todo {v}-ify these
var arenaSheet = transformAsset(dirLocal + "arena.png");
var landingPng = transformAsset(dirLocal + "landing{v}.png");
var landingPlist = transformAsset(dirLocal + "landing{v}.plist");
var loadingPng = transformAsset(dirLocal + "loading{v}.png");
var loadingPlist = transformAsset(dirLocal + "loading{v}.plist");
var cardsPngs = [transformAsset(dirLocal + "cards{v}.png")];
var cardsPlists = [transformAsset(dirLocal + "cards{v}.plist")];
var uiPng = transformAsset(dirLocal + "uiElements{v}.png");
var uiPlist = transformAsset(dirLocal + "uiElements{v}.plist");


var shadowPlist = transformAsset(dirImg + "shadowSheet.plist");
var shadowPng = transformAsset(dirImg + "shadowSheet.png");
var powerTilesPng= transformAsset(dirImg + "powerTiles.png");
var powerTilesPlist= transformAsset(dirImg + "powerTiles.plist");


var g_characterPngs = {};
var g_characterPlists = {};

//core resources - need these to launch ui, loader, etc
var g_maingame = [
    {src:loadingPlist},
    {src:arenaSheet},
    {src:loadingPng},
    {src:landingPng},
    {src:landingPlist},
    {fontName:"gow",
        src:[{src:dirImg+"GODOFWAR.TTF",type:"truetype"}]
    }
];


for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = transformAsset(dirImg + entry + 'Sheet{v}.png');
        g_characterPlists[entry] = transformAsset(dirImg + entry + 'Sheet{v}.plist');
    }
}

for (var entry in missileConfig){
    g_characterPngs[entry] = transformAsset(missileConfig[entry].png);
    g_characterPlists[entry] = transformAsset(missileConfig[entry].plist);
}

for (var entry in effectsConfig){
    g_characterPngs[entry] = transformAsset(effectsConfig[entry].png);
    g_characterPlists[entry] = transformAsset(effectsConfig[entry].plist);
}

var g_battleStuff =[
    {src:g_characterPngs['teleport']},
    {src:g_characterPlists['teleport']},
    {src:g_characterPngs['characterSelect']},
    {src:g_characterPlists['characterSelect']},
    {src:powerTilesPlist},
    {src:powerTilesPng},
    {src:shadowPlist},
    {src:shadowPng}
]

var g_ui =[
    {src:uiPlist},
    {src:uiPng}]

//todo async background loading
var g_everything = [];
g_everything = g_everything.concat(_.map(g_characterPngs, function(item){ return {src:item};}));
g_everything = g_everything.concat(_.map(g_characterPlists, function(item){ return {src:item};}));
g_everything = g_everything.concat(_.map(g_battleStuff, function(item){ return item;}));

function transformAsset(input){
    var token = "-" + jc.assetCategory;
    if (token == "-iphone"){
        token = "";
    }

    return input.replace(jc.assetWildCard, token);
}