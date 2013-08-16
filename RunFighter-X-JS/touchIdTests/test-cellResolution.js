var TouchIdHandler = require('../src/TouchId.js');
//var assert = require(assert);
var CryptoJS = require('../src/sha256.js'); //cocos + browser compat crypto

var pointsPerMM = 6.4; //64 PPCM /10
var cellSize = 10; //1cm/10mm

var handler = new TouchIdHandler({
	pointsPerMM:pointsPerMM,
	cellSizeMM:cellSize,
	sha:CryptoJS
});


//sandity check cell resolution
var testOne = handler.convertCell({x:340, y:300}, {x:231, y:500}, cellSize*pointsPerMM);
//assert.equal(testOne.x,6);
//assert.equal(testOne.y,12);


//pass in pattern 1, expect ID of:
var touches = [
	{x:358.302734375,y:349.953125},
	{x:440.1773376464844,y:130.35086059570312},
	{x:587.8758544921875,y:573.608642578125},
 	{x:421.0462341308594,y:479.7365417480469},
	{x:877.4363403320312,y:366.9765625}
];
var testTwo = handler.processTouches(touches);
console.log(testTwo.toString());




var touches2 = [
    {x:357.302734375,y:348.953125},
    {x:441.1773376464844,y:134.35086059570312},
    {x:588.8758544921875,y:574.608642578125},
    {x:429.0462341308594,y:473.7365417480469},
    {x:875.4363403320312,y:364.9765625}
];

var testTwo = handler.processTouches(touches2);
console.log(testTwo.toString());




//pass in pattern 2, expect ID of:


//pass in pattern 3, expect ID of:


