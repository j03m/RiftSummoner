var sourceMap = require('source-map');
var fs = require('fs');

var map  = fs.readFileSync('/Users/jmordetsky/summoner/game/sourcemap');

var smc = new sourceMap.SourceMapConsumer(JSON.parse(map));



    console.log(smc.originalPositionFor({
        line: 287,
        column: 304
    }));





