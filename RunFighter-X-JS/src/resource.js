var arenaSheet = dirImg + "arena.png";
var arenaPlist = dirImg + "arena.plist";
var bloodPlist = dirImg + "blood.plist";
var shadowPlist = dirImg + "shadowSheet.plist";
var shadowPng = dirImg + "shadowSheet.png";
var carduiPlist = dirImg + "cardui.plist";
var carduiPng = dirImg + "cardui.png";
var portraitsPlist = dirImg + "portraits-hd.plist";
var portraitsPng = dirImg + "portraits-hd.png";
var windowPlist = dirImg + "windows.plist";
var windowPng = dirImg + "windows.png";
var shrine1Png = dirImg + "shrine1.png";
var shrine2Png = dirImg + "shrine2.png";
var mapTmx = dirImg + "map.tmx";
var greenBulletPng = dirImg + "greenbullet.png"
var greenBulletPlist = dirImg + "greenbullet.plist"
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
    {src:portraitsPlist},
    {src:portraitsPng},

    {src:windowPlist},
    {src:windowPng},
    {src:shrine1Png},
    {src:shrine2Png},
    {src:greenBulletPlist},
    {src:greenBulletPng},

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