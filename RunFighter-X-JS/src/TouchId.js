if (typeof jc === 'undefined'){
    var jc = {};
    jc.log = function(array, msg){
        console.log(msg);
    }
}

var TouchIdHandler =  function(params){
	this.pointsPerMM = params.pointsPerMM;
	this.cellSizeMM = params.cellSizeMM;
	this.cellSizePoints = this.cellSizeMM*this.pointsPerMM;
	this.sha = params.sha;
}

TouchIdHandler.prototype.mapCells = function(touches){
    var diffs = [];
    //touches.sort(this.compare);
    var guide = touches[0];
    for (var i =1; i<touches.length; i++){
        var diff = this.convertCell(touches[i], guide, this.cellSizePoints);
        diffs.push(diff);
    }
    jc.log(['touchcore'],'returning');
    return diffs;
}

TouchIdHandler.prototype.processTouches = function(touches){
	//locate the guide
	//guide is the closest point to 0, maxy
	//sort by xy
	touches.sort(this.compare);
    var guide = touches[0];
    jc.log(['touchcore'], 'Guide:');
    jc.log(['touchcore'], guide.x + "," + guide.y);
    jc.log(['touchcore'], 'Touches:');
    for (var i =0;i<touches.length;i++){
        jc.log(['touchcore'], touches[i].x + "," + touches[i].y);
    }

			
	//use the guide to position our grid.
	//the guide is assumed to be the location of cell 0			
	//every other point from the guide, falls into a given cell considering cell width and cell height

 	var keyRaw = "";
    var diffs = [];
	//convert these to cell positions based on their distance from 0,0.
	for (var i =0; i<touches.length; i++){
		for(var ii=0; ii<touches.length; ii++){
            if (i != ii){
                var diff = this.convertCell(touches[i], touches[ii], this.cellSizePoints);
                jc.log(['touchcore'], "Diff Input: " + diff);
                diff = Math.floor(diff/this.cellSizePoints);
                jc.log(['touchcore'], "Diff Flat: " + diff);
                //var diffId = i + '-' + ii + '-' + diff;
                //jc.log(['touchcore'], "Cell Diff Id:: " + diffId);
                diffs.push(diff);
            }
        }
	}
    diffs.sort();
    jc.log(['touchcore'], 'Coverted:');
    for (var i =0;i<diffs.length;i++){
        jc.log(['touchcore'], diffs[i]);
        keyRaw+=this.serializeCell(diffs[i]);
    }

    //sha-256 the string
	return this.sha.SHA256(keyRaw);
	
}

TouchIdHandler.prototype.serializeCell = function(diff){
	return "-" + diff;
}

TouchIdHandler.prototype.convertCell = function (cell, guide, pointSize){
    var diffX = guide.x - cell.x;
    var diffY = guide.y - cell.y;

    var diff = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    return diff;
}

TouchIdHandler.prototype.printTouches = function (){
	for(var i =0; i<this.touches.length;i++){
		jc.log(['touchcore'], i + ' : ' + this.touches[i].x + "," + this.touches[i].y);
	}
}


TouchIdHandler.prototype.compare = function (a, b){
	   	var colA = a.x;
	    var colB = b.x;
	   	var rowA = a.y;
	    var rowB = b.y;

	    // Sort by row
	    if (colA < colB) {
			return -1;
		}
	    if (colB < colA) {
			return 1;
		}

		if (rowA > rowB) return -1;
		if (rowB > rowA) return 1;


		return 0; //same exact point should actually be impossible
}


if (typeof module !== 'undefined'){
    if (module.exports){
        module.exports = TouchIdHandler;
    }

}
