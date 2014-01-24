jc.bestAssetDirectory();
jc.setDesignSize(cc.size(2048,1154));

//todo {v}-ify these
var arenaSheet = transformAsset(dirImg + "arena{v}.{ext}",'-iphone4');
var landingPng = transformAsset(dirImg + "landing{v}.{ext}");
var landingPlist = transformAsset(dirImg + "landing{v}.plist");
var loadingPng = transformAsset(dirImg + "loading{v}.{ext}");
var loadingPlist = transformAsset(dirImg + "loading{v}.plist");

var cardsPngs = [transformAsset(dirImg + "cards{v}.{ext}"), transformAsset(dirImg + "cards2{v}.{ext}")];
var cardsPlists = [transformAsset(dirImg + "cards{v}.plist"), transformAsset(dirImg + "cards2{v}.plist")];
var uiPng = transformAsset(dirImg + "uiElements{v}.{ext}");
var uiPlist = transformAsset(dirImg + "uiElements{v}.plist");

var tutorialPng = transformAsset(dirImg + "tutorial{v}.{ext}")
var tutorialPlist = transformAsset(dirImg + "tutorial{v}.plist")

var powerTilesPng= transformAsset(dirImg + "powerTiles{v}.{ext}");
var powerTilesPlist= transformAsset(dirImg + "powerTiles{v}.plist");

var touchUiPlist = transformAsset(dirImg + "touch{v}.plist");
var touchUiPng = transformAsset(dirImg + "touch{v}.{ext}");


var effectsPlist = transformAsset(dirImg + "effects{v}.plist");
var effectsPng = transformAsset(dirImg + "effects{v}.{ext}");



var g_characterPngs = {};
var g_characterPlists = {};



//core resources - need these to launch ui, loader, etc

var g_maingame = [
    {src:loadingPlist},
    {src:loadingPng},
    {src:landingPng},
    {src:landingPlist},
    {fontName:"GODOFWAR",
        src:[{src:dirImg+"GODOFWAR.TTF",type:"truetype"}]
    }
];

var gameboardPlists = [];
var gameboardPngs = [];


var gameboardBatchNodes = [];
var gameboardFrames = [
    'board1.png',
    'board2.png',
    'board3.png',
    'board4.png',
    'board5.png',
    'board6.png'
]

var gameboardSprites = [];

jc.gameboardTiles = 1
if (jc.assetCategory == 'ipadhd'){
    jc.gameboardTiles = 2
}

if (jc.gameboardTiles.assetCategory == 'iphone5'){
    tiles = 6;
}

if (jc.assetCategory == 'iphone4'){
    jc.gameboardTiles = 2
}

if (jc.assetCategory == 'iphone'){
    jc.gameboardTiles = 1
}

for(var i =0;i<jc.gameboardTiles;i++){
    g_maingame.push({src:transformAsset(dirImg + 'gameboard{v}' + i + '.plist')});
    g_maingame.push({src:transformAsset(dirImg + 'gameboard{v}' + i + '.{ext}')});
    gameboardPlists.push(transformAsset(dirImg + 'gameboard{v}' + i + '.plist'));
    gameboardPngs.push(transformAsset(dirImg + 'gameboard{v}' + i + '.{ext}'));
}



jc.mainFont = "GODOFWAR";
jc.font = {};
jc.font.labelSize=cc.size(400*jc.assetScaleFactor,80*jc.assetScaleFactor);
jc.font.alignment=0;
if (jc.isBrowser){
    jc.font.fontSize=35*jc.assetScaleFactor;
    jc.font.fontSizeRaw = 40;
}else{
    jc.font.fontSize=45*jc.assetScaleFactor;
    jc.font.fontSizeRaw = 40;
}
jc.font.fontName='GODOFWAR';

//*****uncomment for designmode
if (jc.designMode){
    //var dirImg = "artIpad/";
    var cardsPngs = [transformAsset(dirImg + "cards-ipadhd.{ext}")];
    var cardsPlists = [transformAsset(dirImg + "cards-ipadhd.plist")];
    var uiPng = transformAsset(dirImg + "uiElements-ipadhd.{ext}");
    var uiPlist = transformAsset(dirImg + "uiElements-ipadhd.plist");
    var landingPng = transformAsset(dirImg + "landing-ipadhd.{ext}");
    var landingPlist = transformAsset(dirImg + "landing-ipadhd.plist");
    var loadingPng = transformAsset(dirImg + "loading-ipadhd.{ext}");
    var loadingPlist = transformAsset(dirImg + "loading-ipadhd.plist");
    var touchUiPlist = transformAsset(dirImg + "touch-ipadhd.plist");
    var touchUiPng = transformAsset(dirImg + "touch-ipadhd.{ext}");
    var guide = dirImg + "map.{ext}";
    var g_maingame = [
        {src:guide},
        {src:uiPng},
        {src:uiPlist},
        {src:touchUiPng},
        {src:touchUiPlist},
        {src:cardsPlists[0]},
        {src:cardsPngs[0]},
        {src:cardsPlists[1]},
        {src:cardsPngs[1]},
        {src:landingPng},
        {src:landingPlist},
        {src:loadingPng},
        {src:loadingPlist},
        {src:arenaSheet},
            {src:powerTilesPlist},
            {src:powerTilesPng},
            {fontName:jc.mainFont,
            src:[{src:dirImg+"GODOFWAR.TTF",type:"truetype"}]
        }
    ];
}

for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        var multipack = spriteDefs[entry]['multipack-'+jc.assetCategory];
        if (multipack){
            g_characterPngs[entry] = transformAsset(dirImg + entry + 'Sheet{v}.{n}.{ext}', '-iphone4');
            g_characterPlists[entry] = transformAsset(dirImg + entry + 'Sheet{v}.{n}.plist', '-iphone4');
        }else{
            g_characterPngs[entry] = transformAsset(dirImg + entry + 'Sheet{v}.0.{ext}', '-iphone4');
            g_characterPlists[entry] = transformAsset(dirImg + entry + 'Sheet{v}.0.plist', '-iphone4');

        }
    }
}

for (var entry in missileConfig){
    var png = transformAsset(missileConfig[entry].png, '-iphone4');
    g_characterPngs[entry] = png;
    missileConfig[entry].png = png;
	if (missileConfig[entry].plist){
		var missile = transformAsset(missileConfig[entry].plist, '-iphone4');
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


for (var entry in powerTiles){
    var png = transformAsset(powerTiles[entry].png);
    g_characterPngs[entry] =png;
    powerTiles[entry].png = png;
    if (powerTiles[entry].plist){
        var effect = transformAsset(powerTiles[entry].plist);
        g_characterPlists[entry] = effect;
        powerTiles[entry].plist = effect;
    }
}

var g_battleStuff =[
    {src:g_characterPngs['teleport']},
    {src:g_characterPlists['teleport']},
    {src:touchUiPlist},
    {src:touchUiPng},
    {src:powerTilesPlist},
    {src:powerTilesPng}
]

var g_ui =[
    {src:uiPlist},
    {src:uiPng},
    {src:cardsPlists[0]},
    {src:cardsPngs[0]},
    {src:cardsPlists[1]},
    {src:cardsPngs[1]},
    {src:tutorialPng},
    {src:tutorialPlist},
];


function transformAsset(input, force){
	if (!input){
		return; 
	}
    var token = "-" + jc.assetCategory;
    if (token == "-iphone"){
        token = "";
    }


    if (!jc.isBrowser){
        input = input.replace("{ext}", "pvr.ccz");
    }else{
        input = input.replace("{ext}", "png");
    }

    return input.replace(jc.assetWildCard, token);
}