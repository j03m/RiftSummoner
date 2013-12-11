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
            this.selectedIndex = 1;
            this.doUpdate = false;
            this.scheduleUpdate();
            return true;
        } else {
            return false;
        }
    },
    setIndex: function(val){
        jc.log(['scroller'],"set on: "+val);
        this.doUpdate = false;

        if (val == undefined){
            jc.log(['scroller'], "Bad val for setIndex:");
            jc.dumpStack(['scroller']);
            return;
        }
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
            jc.log(['scroller'],"touchbegan");
            this.initialTouch = touch;
            this.scrollDistance = undefined;
        }

        if (type == jc.touchEnded && this.initialTouch){
            jc.log(['scroller'],"touchend");
            this.fling(touch, sprites);
        }

        if (type == jc.touchMoved && this.initialTouch){
            jc.log(['scroller'],"touchmove");
            this.scroll(touch);
        }
        return true;
    },
    fling:function(touch, sprites){
        this.isMoving=false;
        jc.log(['scroller'],"fling");
        if (this.scrollDistance == undefined){ //normal touch
            jc.log(['scroller'],"fling touch");
            if (sprites[0]){
                var selected = this.sprites.indexOf(sprites[0]);
                this.setIndex(selected);
            }
        }else{
            //if first cell middle is past center line, stop, adjust to first cell middle on center line
            //fix this:

            this.doUpdate = !this.edgeAdjust();
        }

    },
    edgeAdjust:function(){
        var pos = this.calcAbsolutePos(0);

        var fs = 0;;
        if (this.def.isVertical){
            fs = pos.y;
        }else{
            fs = pos.x;
        }

        if (fs> this.midPoint){
            this.doUpdate = false;
            this.isMoving = false;
            this.setIndex(0);
            jc.log(['scroller'],"edge");
            return true;
        }

        //if last sprite is past middle rect, stop adjust to last cell middle on center line
        var pos =this.calcAbsolutePos(this.sprites.length-1);
        var ls = 0;

        if (this.def.isVertcal){
            ls = pos.y;
        }else{
            ls = pos.x;
        }

        if (ls < this.midPoint){
            this.doUpdate = false;
            this.isMoving = false;
            this.setIndex(this.sprites.length-1);
            jc.log(['scroller'],"edge2");
            return true;
        }
        return false;
    },
    centerOn: function(sprite){
        var pos = sprite.getPosition();
        var worldPos = this.convertToWorldSpace(pos);
        if (this.def.isVertical){
            var augment = this.midPoint - worldPos.y;
        }else{
            var augment = this.midPoint - worldPos.x;
        }

        jc.log(['scroller'],"Center needs:" + augment);
        if (augment !=0){
            this.runEndingAdjustment(cc.p(augment,0));
        }else{
            this.raiseSelected();
        }

    },
    runEndingAdjustment:function(augment){
        if (!this.endAdjustmentRunning){
            this.endAdjustmentRunning = true;
            jc.log(['scroller'],"runEndingAdjustment:" + this.doUpdate);
            var func = cc.CallFunc.create(this.raiseSelected.bind(this));
            var action = cc.MoveBy.create(jc.defaultTransitionTime/2, augment);
            var seq = cc.Sequence.create(action, func);
            this.runAction(seq);
        }

    },
    raiseSelected:function(){
        jc.log(['scroller'],"raiseSelected:" + this.doUpdate);
        this.doUpdate=false;
        this.endAdjustmentRunning = false;
        this.applyHighlight(this.sprites[this.selectedIndex]);
        this.def.selectionCallback(this.selectedIndex, this.sprites[this.selectedIndex], this.metaData[this.selectedIndex]);

    },
    applyHighlight:function(sprite){
        //todo: layer a nicer sprite
        var color = cc.c4f(255.0/255.0, 255.0/255.0, 0.0/255.0, 1.0);
        this.drawBorder(sprite,color,2);
    },
    update:function(dt){
        if (this.doUpdate){
            jc.log(['scroller'],"updating");
            if (!this.scrollDistance){
                this.doUpdate = false;
                return;
            }
            var scrollDistance =0;
            var cellSize = 0;
            if (this.def.isVertical){
                scrollDistance = this.scrollDistance.y;
                cellSize = this.def.cellHeight;
            }

            this.scrollDistance.x = 3 * this.def.cellWidth;

            this.setPosition(cc.pAdd(this.getPosition(), this.scrollDistance));
            if (!this.isMoving){
                var SCROLL_DEACCEL_RATE = 0.75;
                this.scrollDistance = cc.pMult(this.scrollDistance, SCROLL_DEACCEL_RATE);
                if (Math.abs(this.scrollDistance.x)<=1){
                    this.doUpdate = false;
                    this.adjust();
                }
            }

            this.doUpdate = !this.edgeAdjust();
        }
    },
    calcAbsolutePos:function(position){
          return this.convertToWorldSpace(this.sprites[position].getPosition());
    },
    adjust:function(){
        var min=-1;
        var closest;
        jc.log(['scroller'],"adjust");
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
        jc.log(['scroller'],"scroll");
        var bb = this.getBoundingBox();
        var moveDistance = cc.pSub(touch, this.initialTouch);
        var change = cc.p(moveDistance.x,0 );
        this.scrollDistance = change;
        this.doUpdate= true;
        this.isMoving = true;
    }

});