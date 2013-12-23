var jc = jc || {};
jc.WorldLayer = jc.TouchLayer.extend({
    init: function(worldMap) {
        if (this._super()) {
            //set background layer
            this.backDrop = cc.Sprite.create(worldMap);
            this.addChild(this.backDrop);
            this.backDrop.setPosition(this.winSize.width/2, this.winSize.height/2);
            this.reorderChild(this.backDrop,  jc.backDropZOrder);
            this.worldSize = this.backDrop.getContentSize();
            var x = this.worldSize.width/2;
            var y = this.worldSize.height/2;
            this.worldMidPoint = cc.p(x,y);
            this.screenMidPoint = cc.p(this.winSize.width/2, this.winSize.height/2);
            this.worldBoundary = cc.rect(this.worldSize.width/4, this.worldSize.height/4, this.worldSize.width/2 + this.worldSize.width/4, this.worldSize.height/2 + this.worldSize.height/4);
            this.setViewCenter(cc.p(this.worldSize.width/2,this.worldSize.height/2));
            this.bubbleAllTouches(true);
            this.worldScale = {x:this.winSize.width/this.worldSize.width, y:this.winSize.height/this.worldSize.height};
            var scaleX = 0;
            this.aspectRatio = this.winSize.width/this.winSize.height;
            this.scaleTable = [];
            var i = 1;
            var inc = 0.2;
            while(scaleX <= 1){
                var myScaleX = 0;
                scaleX = parseFloat((this.winSize.width/(this.worldSize.width/i)).toFixed(2));
                if (scaleX > 1 ){
                    myScaleX =1;

                }else{
                    myScaleX = scaleX;
                }

                this.scaleTable.push({x:myScaleX, y:myScaleX/this.aspectRatio});
                i+=inc;
            }
            this.whiteFlash = cc.LayerColor.create(cc.c4(255, 255, 255, 255));
            var worldPos = cc.p(this.worldSize.width/2, this.worldSize.height/2);
            worldPos.x -= this.winSize.width/2;
            worldPos.y -= this.winSize.height/2;
            var nodePos = this.convertToItemPosition(worldPos);
            this.whiteFlash.setPosition(nodePos);
            this.whiteFlash.setContentSize(this.winSize);
            this.whiteFlash.setVisible(false);
            this.addChild(this.whiteFlash);

            return true;
        } else {
            return false;
        }
    },
    getOkayScale:function(width,height){
        var okayHeight = width/this.aspectRatio;
        if (okayHeight >= height){
            return this.getScale(width,okayHeight);
        }else{
            while(okayHeight<height){
                width+=10;
                okayHeight = width/this.aspectRatio;
            }
            return this.getScale(width,okayHeight);
        }

    },
    panToWorldPoint:function(point, scale, rate, doneCallback){
        var converted = this.convertToLayerPosition(point)
        //console.log("Scale:" + JSON.stringify(scale));
        //Svar okScale = this.getClosestCorrectScale(scale);
        //console.log("Corrected Scale:" + JSON.stringify(okScale));
        this.doScale(scale, converted, rate, doneCallback);
    },
    fullZoomOut:function(rate, done){
        var scale = this.getScaleWorld();
        //scale = this.getClosestCorrectScale(scale);
        var converted = this.convertToLayerPosition(cc.p(this.worldSize.width/2, this.worldSize.height/2));

        this.doScale(scale, converted, rate, done);

    },
    doScale:function(scale, pos, rate, callback){
        var actionMove = cc.MoveTo.create(rate, pos);
        var scaleTo = cc.ScaleTo.create(rate, scale.x, scale.y);
        this.runActionWithCallback(actionMove, callback);
        this.runAction(scaleTo);

    },
    flash:function(){
        //layer color, full screen to white
        //fade out
        this.whiteFlash.setVisible(true);
        this.whiteFlash.setOpacity(255);

        jc.fadeOut(this.whiteFlash, jc.defaultTransitionTime);

    },
    shake:function(){
        if (!this.shaking){
            var rot1 = cc.RotateBy.create(0.04,4);
            var rot2 = cc.RotateBy.create(0.04,-4);
            var vibrateAction = cc.Sequence.create(rot1,rot2);

            var vb = cc.Repeat.create(vibrateAction,10);
            var dt = cc.DelayTime.create(0.05);

            var cb = cc.CallFunc.create(function(){
                console.log("shake done!");
                this.shaking=false;
                this.setRotation(0);
            }.bind(this));
            var vibrateAndWait = cc.Sequence.create(vb,dt,cb);

            this.runAction(vibrateAndWait);
            this.shaking = true;
        }

    },
    getClosestCorrectScale:function(scale){
        //don't allow a zoom further in than 1
        var minEntry=undefined;
        //loop through the "allow scale aspects"
        for(var i =0; i<this.scaleTable.length; i++){
            var entry = this.scaleTable[i];
            //if an entry in our array, is > then what we've supplied, then it is a candidate for use
            //because we don't want to zoom in far enough to clip anyone, but we want to zoom in as close as we can
            //to what was supplied, without messing up the aspect
            if (entry.x <= scale.x && entry.y <= scale.y){
                if (!minEntry){
                    minEntry = entry;
                }else{
                    //if this entry is smaller then what we have as our min, but still bigger then what was supplied
                    //capture it
                    if (entry.x > minEntry.x && entry.y > minEntry.y){
                        minEntry = entry;
                    }
                }
            }
        }

        if (!minEntry){
            minEntry = this.scaleTable[this.scaleTable.length-1]; //max zoom in
        }
        return minEntry;   //return
    },
    getScale:function(width,height){
        var scale = {x:this.winSize.width/width, y:this.winSize.height/height};
        if (scale.x > 2){
            scale.x = 2;
        }
        if (scale.y > 2){
            scale.y=2;
        }
        return scale;

    },
    getScaleOne:function(){
        return {"x":1, "y":1};
    },
    getScale2x:function(){
        return this.getScale(this.worldSize.width/2, this.worldSize.height/2);
    },
    getScale4x:function(){
        return this.getScale(this.worldSize.width/4, this.worldSize.height/4);
    },
    getScale8x:function(){
        return this.getScale(this.worldSize.width/16, this.worldSize.height/16);
    },
    getScaleFloor:function(){
        return this.getScale(this.worldSize.width * 0.5, this.worldSize.height * 0.5);
    },
    getScaleWorld:function(){
        return this.getScale(this.worldSize.width *0.9, this.worldSize.height*0.9);
    },
    convertToLayerPosition:function(point){
        jc.cap(point, this.worldBoundary);
        var pointAug = cc.pMult(point, -1);
        return cc.pAdd(pointAug, this.worldMidPoint);
    },
    convertToItemPosition:function(point){
        //get a screen position
        var screen = this.worldToScreen(point);

        //turn that screen position into a node position
        var node = this.convertToNodeSpace(screen);

        return node;

    },
    worldToScreen:function(point){

        //get the center of our view expressed as a world coord
        var viewWorldCenter = this.screenToWorld(this.screenMidPoint);

        //the difference from out world center to the world point in question
        var diff = cc.pSub(viewWorldCenter, point);

        diff.x *= this.getScaleX();
        diff.y *= this.getScaleY();

        //express this difference from our screen center
        var screendiff = cc.pSub(this.screenMidPoint, diff);

        return screendiff;

    },
    screenToWorld:function(point){
        return this.backDrop.convertToNodeSpace(point)

    },
    setViewCenter:function(point){
        var layerPoint = this.convertToLayerPosition(point);
        this.setPosition(layerPoint);
    },
    targetTouchHandler:function(type, touch, sprites){

    }
});
