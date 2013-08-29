var arenaSheet = dirImg + "arena.png";
var arenaPlist = dirImg + "arena.plist";
var bloodPlist = dirImg + "blood.plist";

//remove us
var s_spineboy = dirImg + "spineboy.png";
var s_spineboyJSON = dirImg + "spineboy.json";
var s_spineboyATLAS = dirImg + "spineboy.atlas";


var g_characterPngs = {};
var g_characterPlists = {};

var g_mainmenu = [
    {type:"IMAGE", src:s_spineboy},
    {type:"XML", src:s_spineboyJSON},
    {type:"TEXT", src:s_spineboyATLAS}
];


var g_maingame = [
    //image
	{src:arenaSheet},
	{src:arenaPlist},
    {src:bloodPlist}

];


for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = dirImg + entry + 'Sheet.png';
        g_characterPlists[entry] = dirImg + entry + 'Sheet.plist';
        g_maingame.push({src:g_characterPngs[entry]});
        g_maingame.push({src:g_characterPlists[entry]});
    }
}