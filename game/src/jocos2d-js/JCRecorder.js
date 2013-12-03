var jc = jc || {};
jc.currentRecording = {};

jc.recordEntry = function(obj){
    jc.currentRecording[Date.now()] = obj;
}


