var jc = jc || {};
jc.defaultTransitionTime = 0.25;
jc.defaultFadeLevel = 140;
jc.defaultNudge = 10;
jc.touchEnded = 'end';
jc.touchBegan = 'began';
jc.touchMoved = 'moved';
jc.touchCancelled = 'cancel';
jc.TouchLayer = cc.Layer.extend({
    init: function() {
        if (this._super()) {

            this.winSize =  jc.actualSize;
            this.superDraw = this.draw;
            this.draw = this.childDraw;
            this.superOnEnter = this.onEnter;
            this.onEnter = this.childOnEnter;
            this.superOnExit = this.onExit;
            this.onExit = this.childOnExit;
            this.touchTargets=[];
            this.retain();
            return true;
        } else {
            return false;
        }
    },
    bubbleAllTouches:function(val){
        this.bubbleAll = val;
    },
    childOnEnter:function(){
        this.superOnEnter();
        this.wireInput(true);
        this.onShow();
    },
    hackOn:function(){
        this.wireInput(true);
        this.onShow();
    },
    hackOff:function(){
        this.wireInput(false)
        this.onHide();
    },
    childOnExit:function(){
        this.superOnExit();
        this.wireInput(false)
        this.onHide();
    },
    onShow:function(){},
    onHide:function(){},
    wireInput: function(val){
        if ('mouse' in sys.capabilities) {
            if (val){
                cc.Director.getInstance().getMouseDispatcher().addMouseDelegate(this, 1);
            }else{
                cc.Director.getInstance().getMouseDispatcher().removeMouseDelegate(this);
            }
        } else {
            if (val){
                cc.registerTargetedDelegate(0,true, this);
                //cc.Director.getInstance().getTouchDispatcher()._addTargetedDelegate(this, 1, true);
            }else{
                cc.unregisterTouchDelegate(this);
                //cc.Director.getInstance().getTouchDispatcher()._removeDelegate(this);
            }
        }
    },
    onTouchBegan: function(touch) {
        return this.hitSpriteTarget(jc.touchBegan, touch);

    },
    onTouchMoved: function(touch) {
        return this.hitSpriteTarget(jc.touchMoved, touch);

    },
    onTouchEnded: function(touch) {
        return this.hitSpriteTarget(jc.touchEnded, touch);

    },
    onMouseDown: function(event) {
        return this.onTouchBegan(event);

    },
    onMouseDragged: function(event) {
        return this.onTouchMoved(event);

    },
    onMouseUp: function(event) {
        return this.onTouchEnded(event);

    },
    onTouchCancelled: function(touch, event,sprite) {
        return this.hitSpriteTarget(jc.touchCancelled, touch);

    },
    targetTouchHandler: function(type, touch, sprites) {
        throw "child must implement!"
    },
    hitSpriteTarget:function(type, touch, event){
        jc.log(['touchcore'], "Raw Touch:" + JSON.stringify(touch));

        touch = this.touchToPoint(touch);
        jc.log(['touchcore'], "Raw Touch Point:" + JSON.stringify(touch));

        var converted = this.convertToNodeSpace(touch);
        jc.log(['touchcore'], "Converted Touch:" + JSON.stringify(converted));

        if (this.doConvert){
            jc.log(['touchcore'], "Using converted touch.");
            touch = converted;
        }
        var handled = [];
        for (var i=0;i<this.touchTargets.length;i++){

            if ( this.touchTargets[i] instanceof jc.Sprite){ //jc.sprites in this game ahve like 512x512 - contentSize + boudningbox are unusable
                var rect = this.touchTargets[i].getTextureRect(); //texture rect gives us a width
                var pos = this.touchTargets[i].getBasePosition(); //base pos gives us bottom middle of sprite
                var cs = {};
                cs.width = rect.width *1.4;
                cs.height = rect.height*1.4;
                cs.x = pos.x - cs.width/2;
                cs.y = pos.y; //y should be bottom already

            }else if ( this.touchTargets[i] instanceof cc.LabelTTF){
                var cs = this.touchTargets[i].getBoundingBox();
                cs.width*=2;
                cs.height*=2;
            }else{
                var cs = this.touchTargets[i].getBoundingBox();
            }

            jc.log(['touchcore'], "Sprite:" + this.touchTargets[i].name);
            jc.log(['touchcore'], "Position:" + JSON.stringify(cs));
            var contains = cc.rectContainsPoint(cs, touch);

            if (contains){
                handled.push(this.touchTargets[i]);
            }
        }
        //if something of note was touched, raise it
        if ((handled.length>0 || this.bubbleAll) && !this.isPaused){
            return this.targetTouchHandler(type, touch, handled);
        }
        return false;
    },
    touchToPoint:function(touch){
        if (touch instanceof Array){
            return touch[0].getLocation()
        }else{
            return touch.getLocation();
        }
    },
    darken:function(){
        if (!this.shade){
            this.shade = cc.LayerColor.create(cc.c4(15, 15, 15, 255));
            this.addChild(this.shade);
        }
        this.shade.setPosition(new cc.p(0.0,0.0));

        this.shade.setOpacity(0);
        this.reorderChild(this.shade,0);
        this.fadeIn(this.shade, jc.defaultFadeLevel);
    },
    undarken:function(){
        this.fadeOut(this.shade);
    },
    fadeIn:function(item, opacity , time){
        if (!time){
            time = jc.defaultTransitionTime;
        }
        if (!opacity){
            opacity = jc.defaultFadeLevel;
        }
        if (!item){
            item = this;
        }

        var actionFadeIn = cc.FadeTo.create(time,opacity);
        item.runAction(actionFadeIn);
    },
    fadeOut:function(item, time){
        if (!time){
            time = jc.defaultTransitionTime;
        }
        if (!item){
            item = this;
        }
        var actionFadeOut = cc.FadeTo.create(time,0);
        item.runAction(actionFadeOut);

    },
    slide:function(item, from, to, time, nudge, when, doneDelegate){
        if (!time){
            time = jc.defaultTransitionTime;
        }
        item.setPosition(from);
        item.setVisible(true);
        var moveAction = cc.MoveTo.create(time, to);
        var nudgeAction;

        if (!doneDelegate){
            doneDelegate = function(){};
        }
        var callFunc = cc.CallFunc.create(doneDelegate);

        //apply the inNudge first, then main move, then the out nudge
        if (nudge && when=='before'){
            var nudgePos = cc.pAdd(from, nudge); //apply inNudge to from
            nudgeAction = cc.MoveTo.create(time/2, nudgePos);
        }else if (nudge && when == 'after'){
            var nudgePos = cc.pAdd(to, nudge); //apply inNudge to from
            nudgeAction = cc.MoveTo.create(time/2, nudgePos);
        }

        if (nudgeAction && when == 'before'){
            action = cc.Sequence.create(nudgeAction, moveAction, callFunc);
            item.runAction(action);
        }else if (nudgeAction && when == 'after'){
            action = cc.Sequence.create(moveAction, nudgeAction, callFunc);
            item.runAction(action);
        }else if (nudgeAction){
            throw "when var must be before or after";
        }else{
            action = cc.Sequence.create(moveAction, callFunc);
            item.runAction(action);
        }


    },
    slideInFromTop:function(item, time, to,doneDelegate){
        var itemRect = this.getCorrectRect(item);
        var fromX = this.winSize.width/2;
        var fromY = this.winSize.height+itemRect.height/2; //offscreen
        if (!to){
            var toX = fromX;
            var toY = this.winSize.height - ((itemRect.height/2)+ jc.defaultNudge);
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(0,jc.defaultNudge), 'after',doneDelegate);
    },
    slideTopToMid:function(item, time, doneDelegate){
        var itemRect = this.mainFrame.getTextureRect();
        var fromX = this.winSize.width/2;
        var fromY = (this.winSize.height + itemRect.width); //offscreen left
        var toX = fromX;
        var toY = this.winSize.height/2;
        var to = cc.p(toX, toY);
        this.slide(this.mainFrame, cc.p(fromX,fromY), to, jc.defaultTransitionTime, cc.p(0,jc.defaultNudge), "after",doneDelegate);
    },
    slideOutToTop:function(item, time,to,doneDelegate){
        var itemRect = this.getCorrectRect(item);
        if (!to){
            var toX = this.winSize.width/2;
            var toY = this.winSize.height+itemRect.height/2; //offscreen
            to = cc.p(toX,toY);
        }

        this.slide(item, item.getPosition(), to, time, cc.p(0,jc.defaultNudge * -1), 'before',doneDelegate);
    },
    slideInFromBottom:function(item, time, to,doneDelegate){
        var itemRect = this.getCorrectRect(item);
        var fromX = this.winSize.width/2;
        var fromY = 0 - itemRect.height; //offscreen bottom
        if (!to){
            var toX = fromX;
            var toY = itemRect.height/2 + jc.defaultNudge;;
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(0,jc.defaultNudge * -1), 'after',doneDelegate);
    },
    slideOutToBottom:function(item, time, to, doneDelegate){
        var itemRect = this.getCorrectRect(item);
        if (!to){
            var toX = this.winSize.width/2;
            var toY = 0 - itemRect.height; //offscreen bottom
            to = cc.p(toX,toY);
        }
        this.slide(item, item.getPosition(), to, time, cc.p(0,jc.defaultNudge), 'before',doneDelegate);
    },
    slideInFromLeft:function(item, time,to,doneDelegate){
        var itemRect = this.getCorrectRect(item);
        var fromX = (0 - itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        if (!to){
            var toX = (itemRect.width/2) + jc.defaultNudge;
            var toY = fromY;
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(jc.defaultNudge * -1,0), 'after',doneDelegate);
    },
    slideOutToLeft:function(item, time, to, doneDelegate){
        var itemRect = this.getCorrectRect(item);
        if (!to){
            var toX = (0 - itemRect.width); //offscreen left
            var toY = this.winSize.height/2;
            to = cc.p(toX,toY);
        }

        this.slide(item, item.getPosition(), to, time, cc.p(jc.defaultNudge,0), 'before',doneDelegate);
    },

    slideInFromRight:function(item, time,to,doneDelegate){
        var itemRect = this.getCorrectRect(item);
        var fromX = (this.winSize.width + itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        if (!to){
            var toX = this.winSize.width - ((itemRect.width/2) + jc.defaultNudge);
            var toY = fromY;
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(jc.defaultNudge,0), 'after',doneDelegate);
    },
    slideOutToRight:function(item, time,to,doneDelegate){
        var itemRect = this.getCorrectRect(item);
        if (!to){
            var toX = (this.winSize.width + itemRect.width); //offscreen left
            var toY = this.winSize.height/2;
            to = cc.p(toX, toY);
        }
        this.slide(item, item.getPosition(), to, time, cc.p(jc.defaultNudge * -1,0), 'before',doneDelegate);
    },
    getCorrectRect:function(item){
        if (item instanceof jc.Sprite){
            return item.getTextureRect();
        }else{
            return item.getContentSize();
        }
    },
    generateSprite:function(nameCreate){
        var sprite;
        sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, this);
        return sprite;
    },
    pause:function () {
        this.isPaused = true;
    },
    resume:function () {
        this.isPaused = false;
    },
    centerPoint:function(){
        return cc.p(this.getContentSize().width * this.getAnchorPoint().x,
            this.getContentSize().height * this.getAnchorPoint().y);
    },
    centerPointOffset:function(point){
            return cc.pAdd(this.centerPoint(),point);
    },
    makeWindow:function(size, spriteName, rect){
        if (!spriteName){
            throw "A window needs a sprite backdrop and a scale9 rect";
        }
        if (!rect){
            rect = cc.rect(45, 45, 350, 600)
        }
        var windowSprite  = cc.Scale9Sprite.create();
        windowSprite.initWithSpriteFrameName(spriteName, rect);
        windowSprite.setContentSize(size);
        windowSprite.setVisible(false);
        return windowSprite;
    },
    childDraw:function(){
        this.superDraw();
        //todo: reserve for later
    },
    drawBorder:function(sprite, color, width){
        var position = sprite.getPosition();
        var rect = sprite.getTextureRect();
        if (!this.drawNode){
            this.drawNode = cc.DrawNode.create();
            this.addChild(this.drawNode);
        }

        position.x = position.x - rect.width/2;
        position.y = position.y - rect.height/2;
        this.drawNode.setPosition(position);

        var fill = cc.c4f(0,0,0,0);
        var border = color;

        this.drawNode.clear();
        this.drawRect(this.drawNode, rect, fill, border,width);

    },
    drawRect:function(poly, rect, fill, border, borderWidth){
        var height = rect.height;
        var width = rect.width;
        var vertices = [cc.p(0, 0), cc.p(0, height), cc.p(width, height), cc.p(width, 0)];
        poly.drawPoly(vertices, fill, borderWidth, border);
    },
    runActionWithCallback: function(action, callback){
        var callbackAction = cc.CallFunc.create(callback);
        var seq = cc.Sequence.create(action, callbackAction);
        this.runAction(seq);
    }

});