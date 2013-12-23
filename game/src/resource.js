

var dirImg = "art/";
var dirMusic = "sounds/";

jc.bestAssetDirectory();
jc.setDesignSize(cc.size(2048,1154));

//todo {v}-ify these
var arenaSheet = transformAsset(dirImg + "arena{v}.png");
var landingPng = transformAsset(dirImg + "landing{v}.png");
var landingPlist = transformAsset(dirImg + "landing{v}.plist");
var loadingPng = transformAsset(dirImg + "loading{v}.png");
var loadingPlist = transformAsset(dirImg + "loading{v}.plist");


var cardsPngs = [transformAsset(dirImg + "cards{v}.png")];
var cardsPlists = [transformAsset(dirImg + "cards{v}.plist")];
var uiPng = transformAsset(dirImg + "uiElements{v}.png");
var uiPlist = transformAsset(dirImg + "uiElements{v}.plist");


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

//*****uncomment for designmode
if (jc.designMode){

    var cardsPngs = [transformAsset(dirImg + "cards-ipadhd.png")];
    var cardsPlists = [transformAsset(dirImg + "cards-ipadhd.plist")];
    var uiPng = transformAsset(dirImg + "uiElements-ipadhd.png");
    var uiPlist = transformAsset(dirImg + "uiElements-ipadhd.plist");
    var landingPng = transformAsset(dirImg + "landing-ipadhd.png");
    var landingPlist = transformAsset(dirImg + "landing-ipadhd.plist");
    var loadingPng = transformAsset(dirImg + "loading-ipadhd.png");
    var loadingPlist = transformAsset(dirImg + "loading-ipadhd.plist");
    var guide = dirImg + "multiplayerScreen.png";
    var g_maingame = [
    {src:guide},
    {src:uiPng},
    {src:uiPlist},
    {src:cardsPlists[0]},
    {src:cardsPngs[0]},
    {src:landingPng},
    {src:landingPlist},
    {src:loadingPng},
    {src:loadingPlist},
    {fontName:"gow",
        src:[{src:dirImg+"GODOFWAR.TTF",type:"truetype"}]
    }
];
}

for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = transformAsset(dirImg + entry + 'Sheet{v}.png');
        g_characterPlists[entry] = transformAsset(dirImg + entry + 'Sheet{v}.plist');
    }
}

for (var entry in missileConfig){
    var png = transformAsset(missileConfig[entry].png);
    g_characterPngs[entry] = png;
    missileConfig[entry].png = png;
	if (missileConfig[entry].plist){
		var missile = transformAsset(missileConfig[entry].plist);
        g_characterPlists[entry] = missile;
        missileConfig[entry].plist = missile;

	}

}

for (var entry in effectsConfig){
    var png = transformAsset(effectsConfig[entry].png);
    g_characterPngs[entry] =png;
    effectsConfig[entry].png = png;
	if (effectsConfig[entry].plist){
        var effect = transformAsset(effectsConfig[entry].plist);
        g_characterPlists[entry] = effect;
        effectsConfig[entry].plist = effect;
	}
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
    {src:uiPng},
];


function transformAsset(input){
	if (!input){
		return; 
	}
    var token = "-" + jc.assetCategory;
    if (token == "-iphone"){
        token = "";
    }

    return input.replace(jc.assetWildCard, token);
}