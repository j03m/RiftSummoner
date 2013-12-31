var sourceMap = require('source-map');
var fs = require('fs');

var map  = fs.readFileSync('/Users/jmordetsky/summoner/game/sourcemap');

var smc = new sourceMap.SourceMapConsumer(JSON.parse(map));
console.log(smc.sources);

for (var i =0; i< 1000; i++){
    console.log(smc.originalPositionFor({
        line: 124,
        column: i
    }));
}



