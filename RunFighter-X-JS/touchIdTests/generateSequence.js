

function generateSequence(points){
    var diffs = [];
    for (var i =0;i<points.length;i++){
        for (var ii =0;ii<points.length;ii++){
            if (i==ii){continue;}
            diffs.push(diffPoints(points[i], points[ii]));
        }
    }

    diffs.sort();
    return diffs;
}



function diffPoints(pointa, pointb){
    var diffX = pointa.x - pointb.x;
    var diffY = pointa.y - pointb.y;
    return Math.floor(Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2)));

}


var points = [{x:0,y:1}, {x:1,y:2}, {x:3,y:2}]
console.log(generateSequence(points).join('-'));