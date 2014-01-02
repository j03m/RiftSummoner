
var jc = jc || {};
var tracers = {
	'general':0,
	'touch':0,
    'touchcore':0,
    'touchlayer':1,
    'touchid':0,
    'touchout':0,
	'mouse':0,
	'states':0,
	'sprite':0,
    'healthbar':0,
    'move':0,
    'updatetime':0,
	'memory':0,
	'tests':0,
    'arena':1,
	'requestManager':0,
    'gameplay':0 ,
    'mainLayer':0,
    'resource':0,
    'camera':0,
    'console':1,
    'zerverpipe':0,
    'resource':0,
    'ui':0,
    'scroller':1,
    'utilEffects':0,
    'rangeBehavior':0,
    'defenderBehavior':0,
    'designerout':1,
    'jc.shade':1,
    'setText':1,
    'missile':1
};

jc.log = function(categories, msg){
	for (var i =0;i<categories.length; i++){
		if (tracers[categories[i]]!=1){
			return;
		}
	}
	if (typeof msg == 'string' || msg instanceof String){
		cc.log(JSON.stringify(categories) + ': ' + msg);
	}else{
		cc.log(JSON.stringify(categories) + ': ' + JSON.stringify(msg, null,'\t'));
	}

};

jc.clone = function (obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = jc.clone(obj[key]);
    return temp;
}