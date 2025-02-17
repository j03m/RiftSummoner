var jc = jc || {};
jc.WorldLayer = jc.UiElementsLayer.extend({
    init: function(size, mapTiles, batches) {
        if (this._super()) {


            //add batches, assume sprites are already childed.
            for(var i =0;i<batches.length;i++){
                this.addChild(batches[i]);
                this.reorderChild(batches[i], jc.backDropZOrder);
            }


            var tileX = mapTiles[0].getContentSize().width/2;
            var tileY = size.height/2;
            this.setContentSize(size);

            //arrange maptiles
            for(var i =0;i<mapTiles.length;i++){
                mapTiles[i].setPosition(cc.p(tileX,tileY));
                tileX+= mapTiles[i].getContentSize().width;
            }
            this.worldSize = size;
            this.worldMidPoint = cc.p(this.worldSize.width/2, this.worldSize.height/2);
            this.screenMidPoint = cc.p(this.winSize.width/2, this.winSize.height/2);
            this.worldBoundary = cc.rect(0,0, this.worldSize.width, this.worldSize.height);
            this.playableRect = cc.rect(0,0, this.worldSize.width, this.worldSize.height);

            this.setViewCenter(cc.p(this.worldSize.width/2,this.worldSize.height/2));
            this.bubbleAllTouches(true);
            //this.worldScale = {x:this.winSize.width/this.worldSize.width, y:this.winSize.width/this.worldSize.width};
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
            return true;
        } else {
            return false;
        }
    },
    createBackdropTexture:function(tile){

        var sprite = cc.Sprite.initWithFile(tile);
        //GL_LINEAR, GL_REPEAT
        sprite.getTexture().setTexParameters(0x2601,0x2601,0x2901,0x2901);
        return sprite;
    },
    getOkayScale:function(width,height){
        var okayHeight = width/this.aspectRatio;
        if (okayHeight >= height){
            return this.getScaleValue(width,okayHeight);
        }else{
            while(okayHeight<height){
                width+=10;
                okayHeight = width/this.aspectRatio;
            }
            return this.getScaleValue(width,okayHeight);
        }
    },
    panToWorldPoint:function(point, scale, rate, doneCallback){
        var converted = this.convertToLayerPosition(point)
        this.capBounds(converted);

        if (!rate){
            rate = jc.defaultTransitionTime;
        }

        this.doScale(scale, converted, rate, doneCallback);
    },
    fullZoomOut:function(rate, done){
        var scale = this.getScaleWorld();
        //scale = this.getClosestCorrectScale(scale);
        var converted = this.convertToLayerPosition(cc.p(this.worldSize.width/2, this.worldSize.height/2));

        this.doScale(scale, converted, rate, done);

    },
    capBounds:function(pos, atScale){

        if (!atScale){
            atScale = this.getScale();
        }

        var widthMinFactor =  ((this.worldSize.width * atScale) - this.winSize.width)/2;
        var heightMinFactor = ((this.worldSize.height * atScale) - this.winSize.height)/2;;
        var convertedMid = this.convertToLayerPosition(this.worldMidPoint);

        var widthMin = convertedMid.x + widthMinFactor;
        var heightMin = convertedMid.y + heightMinFactor;

        var widthMax = convertedMid.x - widthMinFactor;
        var heightMax = convertedMid.y - heightMinFactor;


        var capped = {x:false, y:false};


        if (pos.x <= widthMax){
            jc.log(['Borders'], 'capping x: ' + pos.x + ' to ' + widthMax);
            pos.x = widthMax;
            capped.x = true;
        }

        if (pos.y <= heightMax){
            jc.log(['Borders'], 'capping y: ' + pos.y + ' to ' + heightMax);
            pos.y = heightMax;
            capped.y = true;
        }

        if(pos.x >= widthMin){
            jc.log(['Borders'], 'capping x: ' + pos.x + ' to ' + widthMin);
            pos.x = widthMin;
            capped.x = true;
        }

        if (pos.y >= heightMin){
            jc.log(['Borders'], 'capping y: ' + pos.y + ' to ' + heightMin);
            pos.y = heightMin;
            capped.y = true;
        }

        return capped;
    },
    doScale:function(scale, pos, rate, callback){
        if (this.currentScaleTo){
            if (this.panRunning){
                this.stopAction(this.currentScaleTo);
            }

        }
        if (this.currentActionMove){
            if (this.panRunning){
                this.stopAction(this.currentActionMove);
            }

        }

        this.capBounds(pos, scale);

        this.currentActionMove = cc.MoveTo.create(rate, pos);

        this.panRunning = true;
        this.runActionWithCallback(this.currentActionMove, function(){
            this.panRunning = false;
            if (callback){
                callback();
            }
        }.bind(this));

        if (scale != undefined){
            this.currentScaleTo = cc.ScaleTo.create(rate, scale.x, scale.y);
            this.runActionWithCallback(this.currentScaleTo, function(){
                console.log("pan done");
            }.bind(this));
        }
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
    getScaleValue:function(width,height){
        var scale = {x:this.winSize.width/width, y:this.winSize.height/height};
        if (scale.x > 1.5){
            scale.x = 1.5;
        }
        if (scale.y > 1.5){
            scale.y=1.5;
        }
        return scale;

    },
    getScaleOne:function(){
        return {"x":1, "y":1};
    },
    getScale2x:function(){
        return this.getScaleValue(this.worldSize.width/2, this.worldSize.height/2);
    },
    getScale4x:function(){
        return this.getScaleValue(this.worldSize.width/4, this.worldSize.height/4);
    },
    getScale8x:function(){
        return this.getScaleValue(this.worldSize.width/16, this.worldSize.height/16);
    },
    getScaleFloor:function(){
        return this.getScaleValue(this.worldSize.width *0.7, this.worldSize.height*0.7);
    },
    getScaleWorld:function(){
        return cc.p(0.50, 0.50);
    },
    convertToLayerPosition:function(point){
        jc.cap(point, this.worldBoundary);
        var pointAug = cc.pMult(point, -1);

        return cc.pAdd(pointAug, this.screenMidPoint);
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
        return this.convertToNodeSpace(point)

    },
    setViewCenter:function(point){
        var layerPoint = this.convertToLayerPosition(point);
        this.setPosition(layerPoint);
    },
    targetTouchHandler:function(type, touch, sprites){

    },
    handlePinchZoom:function(type, touches){
        jc.log(['MultiTouch'], 'type:' +  type);
        if (type == jc.touchBegan){
            this.inDrag = false;
            this.initialTouch = this.screenToWorld(touches[0]);
        }

        if (type == jc.touchMoved){
            jc.log(['MultiTouch'], 'moved');
            if (touches.length > 1){
                //did the distance between two touches change?

                var world1 = this.screenToWorld(touches[0]);
                var world2 = this.screenToWorld(touches[1]);
                this.pinchMidPoint = cc.pMidpoint(world1, world2);
                var distance = this.sqrOfDistanceBetweenPoints(touches[0], touches[1]);
                distance = Math.sqrt(distance);


                if (this.lastDistance == undefined){
                    this.lastDistance = distance;
                }

                var diff = this.lastDistance - distance;
                if (Math.abs(diff)> 25*jc.characterScaleFactor){
                    if (diff<0){ //outward, grow
                        jc.log(['MultiTouchDetails'], 'diff growing:' + distance + " vs " + this.lastDistance );
                        this.handlePinch(distance);
                    }else if (distance < this.lastDistance){
                        jc.log(['MultiTouchDetails'], 'diff shrinking:' + distance + " vs " + this.lastDistance );
                        this.handlePinch(distance, true);
                    }
                }
                this.lastDistance = distance;
                return true;
            }else{
                var worldPoint = this.screenToWorld(touches[0]);
                this.handleDrag(worldPoint);
                return true;
            }


        }
        if (type == jc.touchEnded){
            jc.log(['MultiTouch'], 'ended' );
            this.lastDistance = undefined;
            this.lastLeadTouch = undefined;
            this.initialTouch = false;
            if (this.inDrag){
                return true;
            }

        }
        return false
    },
    checkDoubleClick:function(touch){
        if( !this.dbTouchA){
            this.dbTouchA = {touch:touch, when:Date.now()};
            return;
        }else{
            if (Date.now() - this.dbTouchA.when < 2000){
                if (Math.abs(this.dbTouchA.touch.x - touch.x) < 25 * jc.characterScaleFactor && Math.abs(this.dbTouchA.touch.y - touch.y) < 25 * jc.characterScaleFactor){
                    this.dbTouchA = undefined;
                    return true;
                }else{
                    this.dbTouchA = undefined;
                    return false;
                }
            }else{
                this.dbTouchA = undefined;
                return false;
            }
        }
        return false;

    },
    calculateScaleForSprites:function(sprites){
        var minX=this.worldSize.width;
        var maxX=0;
        var minY=this.worldSize.height;
        var maxY=0;

        for (var i =0; i<sprites.length;i++){
            if (sprites[i] && sprites[i].getParent()==this){
                var position = sprites[i].getBasePosition(); //where am i in the layer
                var tr = sprites[i].getTextureRect();
                var nodePos = this.convertToWorldSpace(position); //where is that on the screen?
                var worldPos = this.screenToWorld(nodePos); //where is that in the world?
                var compareMaxX = worldPos.x + tr.width;
                var compareMinX = worldPos.x - tr.width;
                var compareMaxY = worldPos.y + tr.height*1.5;
                var compareMinY = worldPos.y - (tr.height/2);

                if (compareMaxX > maxX){
                    maxX = compareMaxX;
                    //cosole.log("MaxX:"+this.sprites[i].name);
                }

                if (compareMinX < minX){
                    minX = compareMinX;
                    //cosole.log("MinX:"+this.sprites[i].name);
                }

                if (compareMaxY > maxY){
                    maxY = compareMaxY;
                    //cosole.log("MaxY:"+this.sprites[i].name);
                }

                if (compareMinY < minY){
                    minY = compareMinY;
                    //cosole.log("MinY:"+this.sprites[i].name);
                }
            }

        }

        var characterMid = cc.pMidpoint(cc.p(minX,minY), cc.p(maxX,maxY));
        var scale = this.getOkayScale(maxX-minX, maxY-minY);
        return {mid:characterMid, scale:scale};
    },
    handleDrag:function(newPoint){
        if (!this.initialTouch){
            return;
        }

        if (this.dragDelegate){
            this.dragDelegate();
        }

        jc.log(['DragDetails'], 'move raw:' + JSON.stringify(newPoint) );
        jc.log(['DragDetails'], 'initial touch:' + JSON.stringify(this.initialTouch) );
        var sub = cc.pSub(newPoint,this.initialTouch);
        sub.x*=this.getScale();
        sub.y*=this.getScale();
        jc.log(['DragDetails'], 'diff move:' + JSON.stringify(sub) );


        this.capDrag(sub);

        if (!this.dragUpdateSet){
            this.dragUpdateSet = true;
            this.schedule(this.handleDragMove.bind(this));
        }
        this.inDrag = true;
    },
    capDrag:function(delta){
        var pos = this.getPosition();
        jc.log(['DragDetails'], 'position before adjustment:' + JSON.stringify(pos) );
        pos.x+=delta.x;
        pos.y+=delta.y;
        jc.log(['DragDetails'], 'position after adjustment:' + JSON.stringify(pos) );

        var capped = this.capBounds(pos);

        jc.log(['DragDetails'], 'position after cap:' + JSON.stringify(pos) );


        this.adjustX = delta.x ;
        this.adjustY = delta.y ;

        //no dragging if the world is too small
        if (this.worldSize.width * this.getScale() < this.winSize.width){
            this.adjustX =0;
        }

        if (this.worldSize.height * this.getScale() < this.winSize.height){
            this.adjustY =0;
        }


        if (capped.x){
            this.adjustX =0;
        }

        if (capped.y){
            this.adjustY =0;
        }
    },
    handleDragMove:function(){
        if (this.inDrag){
            jc.log(['DragTaper'],"adj-x:" + this.adjustX + " adj-y:" + this.adjustY);
            this.capDrag(cc.p(this.adjustX, this.adjustY));
            this.adjustPosition(this.adjustX, this.adjustY);
            this.adjustX*=0.85;
            this.adjustY*=0.65;
            if (Math.abs(this.adjustX) < 0.25){
                this.adjustX = 0;
            }
            if (Math.abs(this.adjustY) <0.25){
                this.adjustY =0;
            }
            if (this.adjustY == 0 && this.adjustX == 0){
                this.inDrag = false;
            }
        }
    },
    handlePinch:function(distance, shrink){
        var scale = this.getScale();
        this.inDrag = false;
        jc.log(['MultiTouchDetails'], 'scale pre:' + scale );
        var kPinchZoomCoeff = 1.0/500.0;

        var scaleAug = Math.abs((distance-this.lastDistance) * kPinchZoomCoeff);
        jc.log(['MultiTouchDetails'], 'scaleAug:' + scaleAug );

        if (!shrink){
            var newscale = scale + scaleAug;
        }else{
            var newscale = scale - scaleAug;
        }

        jc.log(['MultiTouchDetails'], 'scale post raw:' + newscale );
        var worldScale = this.getScaleFloor();
        if (newscale>1.3){
            newscale = 1.3;
        }
        if (newscale<worldScale.x){
            newscale = worldScale.x;
        }
        jc.log(['MultiTouchDetails'], 'scale post cap:' + scale );
        if (newscale!=scale ){
            this.setScale(newscale);

            //now we need to adjust positions in the event that scale has taken us over.
            var pos = this.getPosition();
            var convertedMid = this.convertToLayerPosition(this.worldMidPoint);
            //tODO: HERE - for some reason, mobile pinch zoom out puts game at bottom of screen

            if (this.worldSize.width * this.getScale() < this.winSize.width){
                jc.log(['Borders'], "mid point x")
                pos.x = convertedMid.x;
            }

            this.capBounds(pos);
            if (this.worldSize.height * this.getScale() < this.winSize.height){
                jc.log(['Borders'], "mid point y")
                pos.y = convertedMid.y;
            }


            this.setPosition(pos);
        }


    },
    pinchZoomWithMovedTouch: function (movedTouch)
    {
        var minDistSqr = Number.MAX_VALUE;
        var nearestTouch = undefined;
        jc.log(['MultiTouch'], 'handling moved touch:' + JSON.stringify(movedTouch) );
        var worldTouchMoved = this.screenToWorld(movedTouch);
        jc.log(['MultiTouch'], 'converted moved touch:' + JSON.stringify(worldTouchMoved) );
        _.each(this.multiTouches, function(touch){
            if (touch.x != worldTouchMoved.x && touch.y!= worldTouchMoved.y){
                jc.log(['MultiTouch'], 'iterating:' + JSON.stringify(touch) );
                var worldTouch = this.screenToWorld(touch);
                jc.log(['MultiTouch'], 'converted iterated touch:' + JSON.stringify(worldTouch) );

                jc.log(['MultiTouch'], 'distance:' + JSON.stringify(distSqr) );
                if (distSqr < minDistSqr){
                    jc.log(['MultiTouch'], 'is min' );
                    minDistSqr = distSqr;
                    nearestTouch = worldTouch;
                }
            }
        }.bind(this));

        if (nearestTouch)
        {
            var pinchDiff = Math.sqrt(minDistSqr);
            jc.log(['MultiTouch'], 'pinchDiff:' + pinchDiff );
            if (this.lastPinchDiff){
                this.setScale(scale);
            }

            this.lastPinchDiff = pinchDiff;
        }
    },
    sqrOfDistanceBetweenPoints:function(p1, p2)
    {
        var diff = cc.pSub(p1, p2);
        return diff.x * diff.x + diff.y * diff.y;
    }
});
