exports.error = function(code, msg, obj, callback){
	var debug = "error:" + code + " " + msg;
	if (obj){
		var additional = JSON.stringify(obj);
		debug += " Additional details: " + additional;
	}
	console.error(debug);
    if (callback){
        callback({code:code, msg:msg, obj:obj}, undefined);
    }else{
        console.log("Warning! No callback passed to error func!");
    }

	return;
}