var jc = jc || {};
jc.ScrollingLayer = jc.TouchLayer.extend({
    init: function(definition){
        if (this._super()) {
            this.def = definition;
            this.sprites = this.def.sprites;
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
            //this.setContentSize(this.getParent().getContentSize());
            //adjust my position so that center line is a sprite.
//
//            this.selected = cc.Scale9Sprite.create();
//            this.selected.initWithSpriteFrameName("buttonHover.png", cc.RectMake(10,10,200,40));
//            this.selected.setContentSize(cc.size(100,100));
//            this.addChild(this.selected);
//            this.reorderChild(this.selected,3);
//            this.selected.setPosition(this.sprites[0].getPosition());
            this.doUpdate = false;
            this.scheduleUpdate();
            var center = this.def.startOn | 0;
            this.centerOn(this.sprites[center]);

            return true;
        } else {
            return false;
        }
    },
    setInitialPos: function(val){
      if (!this.initialized){
          this.initialized = true;
          this.centerOn(this.sprites[val]);
      }else{
          this.centerOn(this.sprites[val]);
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
                this.centerOn(sprites[0]);
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
            var bb = sprite.getBoundingBox();
            bb.origin = this.convertToWorldSpace(bb.origin);
            if (cc.rectContainsPoint(bb, cc.p(this.midPoint, bb.origin.y))){
                this.applyHighlight(sprite);
                this.def.selectionCallback(i, sprite);
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
//        var pos = this.getPosition().x; //abs position of layer;
//        pos+=position*this.def.cellWidth/2 + this.def.cellWidth/2;
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
                closest = sprite;
            }
            if (cc.rectContainsPoint(bb, cc.p(this.midPoint, bb.origin.y))){
                this.centerOn(sprite);
                return;
            }
        }

        //if no one is on the rect, move the closest
        this.centerOn(closest);

//        var moveDistance = cc.pSub(this.lastTouch, this.initialTouch);
//
//        //once this is set, we need to think about fitting to cell
//        //the amount we've moved is equivalent to N cells of distance. So, lets handle that first.
//        var cellsMoved = moveDistance.x/this.def.cellWidth;
//
//        //now, we only care about the portion of the move that does not cover a whole cell
//        var remainder = cellsMoved % 1;
//        var remAbs = Math.abs(remainder);
//
//        //if in the end of our we have moved < 1/2 a cell, slide back this distance
//        var correction;
//        if (remAbs <= 0.5){
//            correction = remainder/2 * this.def.cellWidth * -1;
//            this.runEndingAdjustment(cc.p(correction, 0));
//        }else{ //if the remainder is > half a cell we finish out the move
//            var finish;
//            if (remainder < 0){
//                finish = -1 - remainder/2;
//            }else{
//                finish = 1 - remainder/2;
//            }
//            correction = finish * this.def.cellWidth;
//            this.runEndingAdjustment( cc.p(correction, 0));
//        }

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