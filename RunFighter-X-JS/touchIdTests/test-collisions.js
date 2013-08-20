var TouchIdHandler = require('../src/TouchId.js');
var CryptoJS = require('../src/sha256.js');
var handler = new TouchIdHandler({
    pointsPerMM:6.4,
    cellSizeMM:10,
    sha:CryptoJS
});
var points = 64;
var x = 5;
var y = 6;
var cells = 30; //30 choose 5
var guideX = 500.2;
var guideY = 600.4

var shas = [];
var holds = [];


for (var i =0; i<cells; i++){ //first
    for (var ii =0; ii<cells; ii++){ //second
        if (ii==i){continue;}
        for (var iii =0; iii<cells; iii++){ //third
            if (iii==ii || iii==i){continue;}
            for (var iv =0; iv<cells; iv++){ //fourth
                if (iv==iii || iv==ii || iv==i){continue;}
                for (var v =0; v<cells; v++){ //fifth
                    if (v==iv || v==iii || v==ii || v==i){continue;}

                    //else eval points
                    var theCells = [];
                    theCells.push(calcCell(i));
                    theCells.push(calcCell(ii));
                    theCells.push(calcCell(iii));
                    theCells.push(calcCell(iv));
                    theCells.push(calcCell(v));

                    var sha = handler.processTouches(theCells);
                    var index = shas.indexOf(sha);
                    var retainThis = {cells:theCells, sha:sha};
                    if (index!=-1){
                        console.log(JSON.stringify(holds[index]));
                        console.log(JSON.stringify(retainThis));
                        throw "collide";

                    }
                    holds.push({cells:theCells, sha:sha});
                    shas.push(shas);
                }
            }
        }
    }
}

function calcCell(cell){

    var xPoint = 0;
    var yPoint = 0;

    if (cell < y){
        xPoint = 0;
    }else{
        xPoint = cell/x;
    }
    var xLoc = (xPoint * guideX) + (guideX/2);

    if (xPoint == 0){
        yPoint = cell;
    }else{
        yPoint = cell/xPoint;
    }

    var yLoc = (yPoint * guideY) + (guideY/2);

    return {x:xLoc,y:yLoc}
}