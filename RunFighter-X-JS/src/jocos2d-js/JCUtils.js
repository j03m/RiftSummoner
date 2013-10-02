var jc = jc || {};



jc.moveActionWithCallback = function(point, rate, callback){
    var action = cc.MoveTo.create(rate, point);
    return jc.actionWithCallback(action, callback);

}

jc.cap = function(point, rect){
    if (point.x < rect.x){
        point.x = rect.x;
    }
    if (point.y < rect.y){
        point.y = rect.y
    }
    if (point.x > rect.width){
        point.x = rect.width;
    }
    if (point.y > rect.height){
        point.y = rect.height;
    }
}