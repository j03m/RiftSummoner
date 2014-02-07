jc.bestAssetDirectory();
jc.setDesignSize(cc.size(2048,1154));


var landingPng = transformAsset(dirImg + "landing{v}.{ext}");
var landingPlist = transformAsset(dirImg + "landing{v}.plist");
var loadingPng = transformAsset(dirImg + "loading{v}.{ext}");
var loadingPlist = transformAsset(dirImg + "loading{v}.plist");

var cardsPngs = [transformAsset(dirImg + "cards{v}.{ext}"), transformAsset(dirImg + "cards2{v}.{ext}")];
var cardsPlists = [transformAsset(dirImg + "cards{v}.plist"), transformAsset(dirImg + "cards2{v}.plist")];
var uiPng = transformAsset(dirImg + "uiElements{v}.{ext}");
var uiPlist = transformAsset(dirImg + "uiElements{v}.plist");

var tutorialPng = transformAsset(dirImg + "tutorial{v}.{ext}",  jc.characterAssetCategory)
var tutorialPlist = transformAsset(dirImg + "tutorial{v}.plist",  jc.characterAssetCategory)

var powerTilesPng= transformAsset(dirImg + "powerTiles{v}.{ext}",  jc.characterAssetCategory);
var powerTilesPlist= transformAsset(dirImg + "powerTiles{v}.plist",  jc.characterAssetCategory);

var touchUiPlist = transformAsset(dirImg + "touch{v}.plist",  jc.characterAssetCategory);
var touchUiPng = transformAsset(dirImg + "touch{v}.{ext}",  jc.characterAssetCategory);


var effectsPlist = transformAsset(dirImg + "effects{v}.plist",  jc.characterAssetCategory);
var effectsPng = transformAsset(dirImg + "effects{v}.{ext}",  jc.characterAssetCategory);

var effects2Plist = transformAsset(dirImg + "effects2{v}.plist",  jc.characterAssetCategory);
var effects2Png = transformAsset(dirImg + "effects2{v}.{ext}",  jc.characterAssetCategory);




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
]

var gameboardSprites = [];

jc.gameboardTiles = 1
if (jc.characterAssetCategory == 'ipadhd'){
    jc.gameboardTiles = 2
}

if (jc.characterAssetCategory == 'iphone5'){
    jc.gameboardTiles = 6;
}

if (jc.characterAssetCategory == 'iphone4'){
    jc.gameboardTiles = 6
}

if (jc.characterAssetCategory == 'iphone'){
    jc.gameboardTiles = 2
}

for(var i =0;i<jc.gameboardTiles;i++){
    g_maingame.push({src:transformAsset(dirImg + 'gameboard{v}' + i + '.plist',  jc.characterAssetCategory)});
    g_maingame.push({src:transformAsset(dirImg + 'gameboard{v}' + i + '.{ext}',  jc.characterAssetCategory)});
    gameboardPlists.push(transformAsset(dirImg + 'gameboard{v}' + i + '.plist',  jc.characterAssetCategory));
    gameboardPngs.push(transformAsset(dirImg + 'gameboard{v}' + i + '.{ext}',  jc.characterAssetCategory));
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
    var cardsPngs = [transformAsset(dirImg + "cards-ipadhd.{ext}"), transformAsset(dirImg + "cards2-ipadhd.{ext}",  jc.characterAssetCategory)];
    var cardsPlists = [transformAsset(dirImg + "cards-ipadhd.plist"), transformAsset(dirImg + "cards2-ipadhd.plist",  jc.characterAssetCategory)];
    var uiPng = transformAsset(dirImg + "uiElements-ipadhd.{ext}");
    var uiPlist = transformAsset(dirImg + "uiElements-ipadhd.plist");
    var landingPng = transformAsset(dirImg + "landing-ipadhd.{ext}");
    var landingPlist = transformAsset(dirImg + "landing-ipadhd.plist");
    var loadingPng = transformAsset(dirImg + "loading-ipadhd.{ext}");
    var loadingPlist = transformAsset(dirImg + "loading-ipadhd.plist");
    var touchUiPlist = transformAsset(dirImg + "touch-ipadhd.plist");
    var touchUiPng = transformAsset(dirImg + "touch-ipadhd.{ext}");
//    var guide = dirImg + "map.png";
    var g_maingame = [
//        {src:guide},
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
        {src:powerTilesPlist},
        {src:powerTilesPng},
        {fontName:jc.mainFont,
        src:[{src:dirImg+"GODOFWAR.TTF",type:"truetype"}]
        }
    ];
}

for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        var multipack = spriteDefs[entry][jc.multiSheetPrefix+jc.characterAssetCategory];
        jc.log('multipack', "Resource: " + entry + " is multipack:" + multipack);
        if (multipack){
            jc.log('multipack', "looping...");
            var multiplist = [];
            var multipng= [];
            for(var i=0;i<multipack;i++){
                var mplist = transformAsset(dirImg + entry + 'Sheet{v}.{n}.plist', jc.characterAssetCategory, i);
                var mpng = transformAsset(dirImg + entry + 'Sheet{v}.{n}.{ext}',  jc.characterAssetCategory, i);

                jc.log('multipack', "transformed plist:" +mplist);
                jc.log('multipack', "transformed png:" +mpng);
                multipng.push(mpng);
                multiplist.push(mplist);
            }
            g_characterPngs[entry] = multipng;
            g_characterPlists[entry]= multiplist;

        }else{
            g_characterPngs[entry] = transformAsset(dirImg + entry + 'Sheet{v}.0.{ext}', jc.characterAssetCategory);
            g_characterPlists[entry] = transformAsset(dirImg + entry + 'Sheet{v}.0.plist', jc.characterAssetCategory);
        }
    }
}

for (var entry in missileConfig){
    var png = transformAsset(missileConfig[entry].png, jc.characterAssetCategory);
    g_characterPngs[entry] = png;
    missileConfig[entry].png = png;
	if (missileConfig[entry].plist){
		var missile = transformAsset(missileConfig[entry].plist, jc.characterAssetCategory);
        g_characterPlists[entry] = missile;
        missileConfig[entry].plist = missile;

	}

}

for (var entry in effectsConfig){
    var png = transformAsset(effectsConfig[entry].png, jc.characterAssetCategory);
    g_characterPngs[entry] =png;
    effectsConfig[entry].png = png;
	if (effectsConfig[entry].plist){
        var effect = transformAsset(effectsConfig[entry].plist, jc.characterAssetCategory);
        g_characterPlists[entry] = effect;
        effectsConfig[entry].plist = effect;
	}
}


for (var entry in powerTiles){
    var png = transformAsset(powerTiles[entry].png, jc.characterAssetCategory);
    g_characterPngs[entry] =png;
    powerTiles[entry].png = png;
    if (powerTiles[entry].plist){
        var effect = transformAsset(powerTiles[entry].plist, jc.characterAssetCategory);
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
    {src:tutorialPlist}
];


function transformAsset(input, category, number){
	if (!input){
		return; 
	}
    if (!category){
        category = jc.assetCategory
    }

    var token = "-" + category;
    if (token == "-iphone"){
        token = "";
    }

    if (number!=undefined){
        input = input.replace(jc.multiSheetWildCard, number);
    }

    if (!jc.isBrowser){
        input = input.replace("{ext}", "pvr.ccz");
    }else{
        input = input.replace("{ext}", "png");
    }

    return input.replace(jc.assetWildCard, token);
}