var jc = jc || {};
jc.dataTarget = 'http://www.riftsummoner.com:1337/';
if (!jc.isBrowser){
    var window = jc;

    jc.addEventListener = function(entry, method){
        method();
    }
    jc.removeEventListener = function(){

    }
    var document = {}
    document.readyState === 'complete'
    if (typeof screen === 'undefined') {
        var screen = jc;
    }

    if (typeof setTimeout === 'undefined') {
        var setTimeout = function(execute, duration){
            duration = duration/10000;
            cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, execute, 0, 0, duration, undefined);
        }
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

}