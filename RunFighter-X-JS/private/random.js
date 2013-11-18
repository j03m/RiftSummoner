var async = require('async');
var crypto = require('crypto');

exports.cryptoInt = cryptoInt;

var maxAllowed = 255;
var reduction = 127;
exports.getCryptoInts = function(num, max, mainCb){
    if (max > maxAllowed){
        throw "No numbers larger then 16384 because I was too lazy to implement this full algo. mvp rules everything around me.";
    }

    var calls =[];
    for(var i=0;i<num;i++){
        calls.push(function(asyncCallback){
            cryptoInt(max, asyncCallback)
        });
    }

    async.parallel(calls, function(err, res){
        if (err) {
            throw err;
        }
        mainCb(res);
    });
}

//note: http://crypto.stackexchange.com/questions/8826/map-bytes-to-number
function cryptoInt(max, callback){
        var myInt = 0;
        //console.log("cryptoInt invoked ");
        crypto.randomBytes(1, function(ex, buf) {
            //console.log("cryptoInt returned ");
            if (ex){
                callback(ex, undefined);
            }

            var hex = buf.toString('hex');
            var val = parseInt(hex, 16);
            val = val % reduction;
            //console.log("val: " + val);
            if (val < max){
                callback(undefined, val);
            }else{
                //console.log("recurse");
                cryptoInt(max, callback);
            }

        });
}