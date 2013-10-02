var jc = jc || {};
jc.WorldLayer = jc.TouchLayer.extend({
    init: function(worldMap) {
        if (this._super()) {
            //set background layer
            this.backDrop = cc.Sprite.create(worldMap);
            this.addChild(this.backDrop);
            this.backDrop.setPosition(this.winSize.width/2, this.winSize.height/2);
            this.worldSize = this.backDrop.getContentSize();
            var x = this.worldSize.width/2;
            var y = this.worldSize.height/2;
            this.worldMidPoint = cc.p(x,y);
            this.worldBoundary = cc.RectMake(this.worldSize.width/4, this.worldSize.height/4, this.worldSize.width/2 + this.worldSize.width/4, this.worldSize.height/2 + this.worldSize.height/4);
            this.setViewCenter(cc.p(this.worldSize.width/2,this.worldSize.height/2));
            this.bubbleAllTouches(true);

            return true;
        } else {
            return false;
        }
    },
    panToWorldPoint:function(point, scale, rate, doneCallback){
        var converted = this.convertToViewCenter(point)
        this.doScale(scale, converted, rate, doneCallback);
    },
    fullZoomOut:function(rate, done){
        var scale = this.getScale(this.worldSize.width,this.worldSize.height);
        var converted = this.convertToViewCenter(cc.p(this.worldSize.width/2, this.worldSize.height/2));
        var action = jc.PanAndZoom.create(rate, converted, scale.x, scale.y );
        this.runActionWithCallback(action, done);
    },
    fitTo:function(width,height,rate, done){
        var scale = this.getScale(width,height);
        this.doScale(scale, this.getPosition(), rate, done);
    },
    doScale:function(scale, pos, rate, callback){
        var action = jc.PanAndZoom.create(rate, pos , scale.x, scale.y );
        this.runActionWithCallback(action, callback);
    },
    getScale:function(width,height){
        var scaleX = this.winSize.width/width;
        var scaleY = this.winSize.height/height;
        return {"x":scaleX, "y":scaleY};

    },
    convertToViewCenter:function(point){
        jc.cap(point, this.worldBoundary);
        var pointAug = cc.pMult(point, -1);
        return cc.pAdd(pointAug, this.worldMidPoint);
    },
    setViewCenter:function(point){
        var layerPoint = this.convertToViewCenter(point);
        this.setPosition(layerPoint);
    },
    targetTouchHandler:function(type, touch, sprites){

    }
});
