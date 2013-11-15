var jc = jc || {};
var RequestLite = function(){

}

RequestLite.parallel=function(methods, callback){
    _.map(methods, function(method){
        return function(err, value){
            method()
        }
    });
}

jc.RequestLite = RequestLite;
