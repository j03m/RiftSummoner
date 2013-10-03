var jc = jc || {};
jc.WorldLayer = jc.TouchLayer.extend({
    init: function(worldMap) {
        if (this._super()) {
            //set background layer
            this.backDrop = cc.Sprite.create(worldMap);
            this.addChild(this.backDrop);
            this.backDrop.setPosition(this.winSize.width/2, this.winSize.height/2);
            this.reorderChild(this.backDrop,  (this.winSize.height+10) * -1);
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
        var converted = this.convertToLayerPosition(point)
        this.doScale(scale, converted, rate, doneCallback);
    },
    fullZoomOut:function(rate, done){
        var scale = this.getScaleWorld();
        var converted = this.convertToLayerPosition(cc.p(this.worldSize.width/2, this.worldSize.height/2));
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
        return {"x":parseFloat(scaleX.toFixed(2)), "y":parseFloat(scaleY.toFixed(2))};

    },
    getScaleOne:function(){
        return {"x":1, "y":1};
    },
    getScaleWorld:function(){
        return this.getScale(this.worldSize.width, this.worldSize.height);
    },
    convertToLayerPosition:function(point){
        jc.cap(point, this.worldBoundary);
        var pointAug = cc.pMult(point, -1);
        return cc.pAdd(pointAug, this.worldMidPoint);
    },
    convertToItemPosition:function(point){
        var zoomedOutScale = this.getScaleWorld();
        var outPoint = cc.p(0,0);
        outPoint.x = point.x;
        outPoint.y = point.y;

        //get a window position if we were fully scaled out
        outPoint.x *= zoomedOutScale.x;
        outPoint.y *= zoomedOutScale.y;

        var currentScaleX = this.getScaleX();
        var currentScaleY = this.getScaleY();

        //what is the window position at our current scale
        if (currentScaleX != zoomedOutScale.x){
            outPoint.x*=currentScaleX;
        }

        if (currentScaleY != zoomedOutScale.y){
            outPoint.y*=currentScaleY;
        }
        return this.convertToNodeSpace(outPoint);
    },
    screenToWorld:function(point){
        var worldPosition = cc.pAdd(point, this.getPosition());
        var zoomedOutScale = this.getScaleWorld();
        worldPosition.x *=zoomedOutScale.x
        var currentScaleX = this.getScaleX();
        var currentScaleY = this.getScaleY();

        //what is the window position at our current scale
        if (currentScaleX != zoomedOutScale.x){
            worldPosition.x*=currentScaleX;
        }

        if (currentScaleY != zoomedOutScale.y){
            worldPosition.y*=currentScaleY;
        }
        return worldPosition;
    },
    setViewCenter:function(point){
        var layerPoint = this.convertToLayerPosition(point);
        this.setPosition(layerPoint);
    },
    targetTouchHandler:function(type, touch, sprites){

    }
});
