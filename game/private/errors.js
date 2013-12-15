exports.error = function(code, msg, obj, callback){
	callback({code:code, msg:msg, obj:obj}, undefined);
	return;
}