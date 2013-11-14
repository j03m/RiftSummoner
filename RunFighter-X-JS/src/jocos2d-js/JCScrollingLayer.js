var jc = jc || {};
jc.ScrollingLayer = jc.TouchLayer.extend({
    init: function(definition){
        if (this._super()) {
            this.def = definition;
            this.sprites = this.def.sprites;
            this.metaData = this.def.metaData;
            this.doConvert = true;
            this.name = "JCScrollingLayer";
            var h=0;
            for(var i=0;i<this.sprites.length;i++){
                this.touchTargets.push(this.sprites[i]);
                this.addChild(this.sprites[i]);
                var x = ((this.def.cellWidth/2) * i) + this.def.cellWidth;
                this.sprites[i].setPosition(cc.p(x,0));
                if (this.sprites[i].getTextureRect().height >h){
                    h =  this.sprites[i].getTextureRect().height;
                }
                this.reorderChild(this.sprites[i],3);
            }
            var w = this.sprites.length*this.def.cellWidth;
            this.midPoint = this.def.width/2;
            this.setContentSize(cc.size(w,h));

            this.doUpdate = false;
            this.scheduleUpdate();
            var center = this.def.startOn | 0;
            this.setIndex(center);

            return true;
        } else {
            return false;
        }
    },
    setIndex: function(val){
        this.selectedIndex = val;
        this.centerOn(this.sprites[val]);
    },
    left:function(){
        if (this.selectedIndex!=0){
            var next = this.selectedIndex-1;
            this.setIndex(next);
        }
    },
    right:function(){
        if (this.selectedIndex<this.sprites.length-1){
            var next = this.selectedIndex+1;
            this.setIndex(next);
        }
    },
    targetTouchHandler: function(type, touch, sprites) {
        if (!this.isVisible()){
            return;
        }

        if (this.drawNode){
            this.drawNode.clear();
        }

        if (type == jc.touchBegan){
            this.unschedule(this.doScroll);
            this.initialTouch = touch;
            this.scrollDistance = undefined;
        }

        if (type == jc.touchEnded && this.initialTouch){
            this.fling(touch, sprites);
        }

        if (type == jc.touchMoved && this.initialTouch){
            this.scroll(touch);
        }
    },
    fling:function(touch, sprites){
        this.isMoving=false;
        if (this.scrollDistance == undefined){ //normal touch
            if (sprites[0]){
                var selected = this.sprites.indexOf(sprites[0]);
                this.setIndex(selected);
            }
        }else{
            this.doUpdate = true;
        }

    },
    centerOn: function(sprite){
        var pos = sprite.getPosition();
        var worldPos = this.convertToWorldSpace(pos);
        var augment = this.midPoint - worldPos.x;
        this.runEndingAdjustment(cc.p(augment,0));
    },
    runEndingAdjustment:function(augment){
        var func = cc.CallFunc.create(this.raiseSelected.bind(this));
        var action = cc.MoveBy.create(jc.defaultTransitionTime/2, augment);
        var seq = cc.Sequence.create(action, func);
        this.runAction(seq);
    },
    raiseSelected:function(){
        for(var i =0;i<this.sprites.length;i++){ //todo: change to math based
            var sprite = this.sprites[i];
            var data = this.metaData[i];
            var bb = sprite.getBoundingBox();
            bb.origin = this.convertToWorldSpace(bb.origin);
            if (cc.rectContainsPoint(bb, cc.p(this.midPoint, bb.origin.y))){
                this.applyHighlight(sprite);
                this.def.selectionCallback(i, sprite, data);
            }
        }
    },
    applyHighlight:function(sprite){
        //todo: layer a nicer sprite
        var color = cc.c4f(255.0/255.0, 255.0/255.0, 0.0/255.0, 1.0);
        this.drawBorder(sprite,color,2);
    },
    update:function(dt){
        if (this.doUpdate){
            if (!this.scrollDistance){
                this.doUpdate = false;
                return;
            }


            if (this.scrollDistance.x/this.def.cellWidth > 3){
                //cap this
                this.scrollDistance.x = 3 * this.def.cellWidth;
            }
            this.setPosition(cc.pAdd(this.getPosition(), this.scrollDistance));
            if (!this.isMoving){
                var SCROLL_DEACCEL_RATE = 0.75;
                this.scrollDistance = cc.pMult(this.scrollDistance, SCROLL_DEACCEL_RATE);
                if (Math.abs(this.scrollDistance.x)<=1){
                    this.doUpdate = false;
                    this.adjust();
                }
            }

            //if first cell middle is past center line, stop, adjust to first cell middle on center line
            //fix this:
            var fsX = this.calcAbsolutePos(0).x;
            if (fsX> this.midPoint){
                this.doUpdate = false;
                this.isMoving = false;
                this.runEndingAdjustment(cc.p(this.midPoint-fsX , 0));
            }

            //if last sprite is past middle rect, stop adjust to last cell middle on center line
            var lsX = this.calcAbsolutePos(this.sprites.length-1).x;
            if (lsX < this.midPoint){
                this.doUpdate = false;
                this.isMoving = false;
                this.runEndingAdjustment(cc.p(this.midPoint-lsX , 0));

            }


        }
    },
    calcAbsolutePos:function(position){
          return this.convertToWorldSpace(this.sprites[position].getPosition());
    },
    adjust:function(){
        var min=-1;
        var closest;
        for(var i =0;i<this.sprites.length;i++){ //todo: change to math based
            var sprite = this.sprites[i];
            var bb = sprite.getBoundingBox();
            bb.origin = this.convertToWorldSpace(bb.origin);
            var diff = Math.abs(bb.origin.x - this.midPoint);
            if (min==-1 || min>diff){
                min = diff;
                closest = i;
            }
            if (cc.rectContainsPoint(bb, cc.p(this.midPoint, bb.origin.y))){
                this.setIndex(i);
                return;
            }
        }

        //if no one is on the rect, move the closest
        this.setIndex(closest);
    },
    scroll:function(touch){
        var bb = this.getBoundingBox();
        var moveDistance = cc.pSub(touch, this.initialTouch);
        var change = cc.p(moveDistance.x,0 );
        this.scrollDistance = change;
        this.doUpdate= true;
        this.isMoving = true;
    }

});