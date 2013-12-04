var jc = jc || {};
jc.dataTarget = 'http://localhost/';
if (typeof window === 'undefined') {
    var window = jc;
    jc.isBrowser = false;
    jc.addEventListener = function(entry, method){
        method();
    }
    jc.removeEventListener = function(){

    }
    var document = {}
    document.readyState === 'complete'
}else{
    jc.isBrowser = true;
    jc.addEventListener = window.addEventListener;
    jc.removeEventListener = window.removeEventListener;
}

if (typeof screen === 'undefined') {
    var screen = jc;
}

var setTimeout = function(execute, duration){
    duration = duration/10000;
    cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, execute, 0, 0, duration, undefined);
}


var setInterval = function(execute, duration){
    duration = duration/10000;
    cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, execute, duration, 0, 0, undefined);
}

if (typeof console === 'undefined') {
    var console = function(printme){
        jc.log(['console'], printme);
    }
}

