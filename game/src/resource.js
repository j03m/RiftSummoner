

var dirImg = "art/";
var dirMusic = "sounds/";

jc.bestAssetDirectory();
jc.setDesignSize(cc.size(2048,1154));

//todo {v}-ify these
var arenaSheet = transformAsset(dirImg + "arena{v}.png",'-iphone4');
var landingPng = transformAsset(dirImg + "landing{v}.png");
var landingPlist = transformAsset(dirImg + "landing{v}.plist");
var loadingPng = transformAsset(dirImg + "loading{v}.png");
var loadingPlist = transformAsset(dirImg + "loading{v}.plist");

var cardsPngs = [transformAsset(dirImg + "cards{v}.png"), transformAsset(dirImg + "cards2{v}.png")];
var cardsPlists = [transformAsset(dirImg + "cards{v}.plist"), transformAsset(dirImg + "cards2{v}.plist")];
var uiPng = transformAsset(dirImg + "uiElements{v}.png");
var uiPlist = transformAsset(dirImg + "uiElements{v}.plist");

var tutorialPng = transformAsset(dirImg + "tutorial{v}.png")
var tutorialPlist = transformAsset(dirImg + "tutorial{v}.plist")

var shadowPlist = transformAsset(dirImg + "shadowSheet.plist");
var shadowPng = transformAsset(dirImg + "shadowSheet.png");
var powerTilesPng= transformAsset(dirImg + "powerTiles{v}.png");
var powerTilesPlist= transformAsset(dirImg + "powerTiles{v}.plist");

var touchUiPlist = transformAsset(dirImg + "touch{v}.plist");
var touchUiPng = transformAsset(dirImg + "touch{v}.png");




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

if (jc.assetCategory == 'ipadhd'){
    g_maingame.push({src:dirImg + 'gameboard-ipadhd0.png'})
    g_maingame.push({src:dirImg + 'gameboard-ipadhd0.plist'})
    gameboardPlists.push(dirImg + 'gameboard-ipadhd0.plist');
    gameboardPngs.push(dirImg + 'gameboard-ipadhd0.png');

}

if (jc.assetCategory == 'iphone5'){
    g_maingame.push({src:dirImg + 'gameboard-iphone50.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone50.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone50.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone50.png');
    g_maingame.push({src:dirImg + 'gameboard-iphone51.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone51.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone51.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone51.png');
    g_maingame.push({src:dirImg + 'gameboard-iphone52.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone52.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone52.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone52.png');
    g_maingame.push({src:dirImg + 'gameboard-iphone53.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone53.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone53.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone53.png');
    g_maingame.push({src:dirImg + 'gameboard-iphone54.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone54.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone54.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone54.png');
    g_maingame.push({src:dirImg + 'gameboard-iphone55.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone55.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone55.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone55.png');





}
if (jc.assetCategory == 'iphone4'){
    g_maingame.push({src:dirImg + 'gameboard-iphone40.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone40.plist'});
    g_maingame.push({src:dirImg + 'gameboard-iphone41.png'});
    g_maingame.push({src:dirImg + 'gameboard-iphone41.plist'});
    gameboardPlists.push(dirImg + 'gameboard-iphone40.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone40.png');
    gameboardPlists.push(dirImg + 'gameboard-iphone41.plist');
    gameboardPngs.push(dirImg + 'gameboard-iphone41.png');
}

if (jc.assetCategory == 'iphone'){
    g_maingame.push({src:dirImg + 'gameboard0.png'});
    g_maingame.push({src:dirImg + 'gameboard0.plist'});
    gameboardPlists.push(dirImg + 'gameboard0.plist');
    gameboardPngs.push(dirImg + 'gameboard0.png');
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
    var cardsPngs = [transformAsset(dirImg + "cards-ipadhd.png")];
    var cardsPlists = [transformAsset(dirImg + "cards-ipadhd.plist")];
    var uiPng = transformAsset(dirImg + "uiElements-ipadhd.png");
    var uiPlist = transformAsset(dirImg + "uiElements-ipadhd.plist");
    var landingPng = transformAsset(dirImg + "landing-ipadhd.png");
    var landingPlist = transformAsset(dirImg + "landing-ipadhd.plist");
    var loadingPng = transformAsset(dirImg + "loading-ipadhd.png");
    var loadingPlist = transformAsset(dirImg + "loading-ipadhd.plist");
    var touchUiPlist = transformAsset(dirImg + "touch-ipadhd.plist");
    var touchUiPng = transformAsset(dirImg + "touch-ipadhd.png");
    var guide = dirImg + "map.png";
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
        g_characterPngs[entry] = transformAsset(dirImg + entry + 'Sheet{v}.png', '-iphone4');
        g_characterPlists[entry] = transformAsset(dirImg + entry + 'Sheet{v}.plist', '-iphone4');
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
    {src:powerTilesPng},
    {src:shadowPlist},
    {src:shadowPng}
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

    if (jc.isBrowser && force != undefined) {
        //token = force;
    }

    return input.replace(jc.assetWildCard, token);
}