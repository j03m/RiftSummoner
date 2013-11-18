var cardGen = require('../cardGen.js');
var maxRun = 100;



for(var i =0;i<maxRun;i++){
    cardGen.generateCard(10, function(res){
        console.log("Name: " + res.name);
        console.log("Tier:" + res.tier);
    });
}