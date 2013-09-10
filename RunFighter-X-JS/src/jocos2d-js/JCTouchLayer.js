var jc = jc || {};
jc.defaultTransitionTime = 0.25;
jc.defaultFadeLevel = 140;
jc.defaultNudge = 10;
jc.touchEnded = 'end';
jc.touchBegan = 'began';
jc.touchMoved = 'moved';
jc.touchCancelled = 'cancel';
jc.TouchLayer = cc.Layer.extend({
    touchTargets:[],
    init: function() {
        if (this._super()) {
            this.winSize = cc.Director.getInstance().getWinSize();
            cc.SpriteFrameCache.getInstance().addSpriteFrames(nightmarePlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(redlineContainerPlist);
            this.wireInput();

            return true;
        } else {
            return false;
        }
    },
    wireInput: function(){
        if ('mouse' in sys.capabilities) {
            this.setMouseEnabled(true);
        } else {
            this.setTouchEnabled(true);
        }
    },
    onTouchesBegan: function(touch) {
        this.hitSpriteTarget(jc.touchBegan, touch);
    },
    onTouchesMoved: function(touch) {
        this.hitSpriteTarget(jc.touchMoved, touch);
    },
    onTouchesEnded: function(touch) {
        this.hitSpriteTarget(jc.touchEnded, touch);
    },
    onMouseDown: function(event) {
        this.onTouchesBegan(event);
    },
    onMouseDragged: function(event) {
        this.onTouchesMoved(event);
    },
    onMouseUp: function(event) {
        this.onTouchesEnded(event);
    },
    onTouchCancelled: function(touch, event,sprite) {
        this.hitSpriteTarget(jc.touchCancelled, touch);
    },
    targetTouchHandler: function(type, touch, sprites) {
        throw "child must implement!"
    },
    hitSpriteTarget:function(type, touch, event){
        touch = this.touchToPoint(touch);
        if (this.doConvert){
            touch = this.convertToNodeSpace(touch);
        }
        var handled = [];
        for (var i=0;i<this.touchTargets.length;i++){
            var cs = this.touchTargets[i].getBoundingBox();
            var tr = this.touchTargets[i].getTextureRect();
            cs.with = tr.width;
            cs.height= tr.height;
            if (cc.rectContainsPoint(cs, touch)){
                handled.push(this.touchTargets[i]);
            }
        }
        this.targetTouchHandler(type, touch, handled);
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
    slide:function(item, from, to, time, nudge, when){
        if (!time){
            time = jc.defaultTransitionTime;
        }
        item.setPosition(from);
        item.setVisible(true);
        var moveAction = cc.MoveTo.create(time, to);
        var nudgeAction;

        //apply the inNudge first, then main move, then the out nudge
        if (nudge && when=='before'){
            var nudgePos = cc.pAdd(from, nudge); //apply inNudge to from
            nudgeAction = cc.MoveTo.create(time/2, nudgePos);
        }else if (nudge && when == 'after'){
            var nudgePos = cc.pAdd(to, nudge); //apply inNudge to from
            nudgeAction = cc.MoveTo.create(time/2, nudgePos);
        }

        if (nudgeAction && when == 'before'){
            action = cc.Sequence.create(nudgeAction, moveAction);
            item.runAction(action);
        }else if (nudgeAction && when == 'after'){
            action = cc.Sequence.create(moveAction, nudgeAction);
            item.runAction(action);
        }else if (nudgeAction){
            throw "when var must be before or after";
        }else{
            item.runAction(moveAction);
        }


    },
    slideInFromTop:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var fromX = this.winSize.width/2;
        var fromY = this.winSize.height+itemRect.height/2; //offscreen
        var toX = fromX;
        var toY = this.winSize.height - itemRect.height/2;
        this.slide(item, cc.p(fromX,fromY), cc.p(toX, toY), time, cc.p(0,jc.defaultNudge), 'after');
    },
    slideOutToTop:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = this.winSize.width/2;
        var toY = this.winSize.height+itemRect.height/2; //offscreen
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(0,jc.defaultNudge * -1), 'before');
    },
    slideInFromBottom:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var fromX = this.winSize.width/2;
        var fromY = 0 - itemRect.height; //offscreen bottom
        var toX = fromX;
        var toY = itemRect.height/2;
        this.slide(item, cc.p(fromX,fromY), cc.p(toX, toY), time, cc.p(0,jc.defaultNudge * -1), 'after');
    },
    slideOutToBottom:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = this.winSize.width/2;
        var toY = 0 - itemRect.height; //offscreen bottom
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(0,jc.defaultNudge), 'before');
    },
    slideInFromLeft:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var fromX = (0 - itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        var toX = itemRect.width/2;
        var toY = fromY;
        this.slide(item, cc.p(fromX,fromY), cc.p(toX, toY), time, cc.p(jc.defaultNudge * -1,0), 'after');
    },
    slideOutToLeft:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = (0 - itemRect.width); //offscreen left
        var toY = this.winSize.height/2;
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(jc.defaultNudge,0), 'before');
    },

    slideInFromRight:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var fromX = (this.winSize.width + itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        var toX = this.winSize.width - itemRect.width/2;
        var toY = fromY;
        this.slide(item, cc.p(fromX,fromY), cc.p(toX, toY), time, cc.p(jc.defaultNudge,0), 'after');
    },
    slideOutToRight:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = (this.winSize.width + itemRect.width); //offscreen left
        var toY = this.winSize.height/2;
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(jc.defaultNudge * -1,0), 'before');
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
        this.pauseSchedulerAndActions();
        var selChildren = this.getChildren();
        for (var i = 0; i < selChildren.length; i++) {
            selChildren[i].pauseSchedulerAndActions();
        }
    },
    resume:function () {
        var selChildren = this.getChildren();
        for (var i = 0; i < selChildren.length; i++) {
            selChildren[i].resumeSchedulerAndActions();
        }
        this.resumeSchedulerAndActions();
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
            spriteName = "window.png";
        }
        if (!rect){
            rect = cc.RectMake(45, 45, 350, 600)
        }
        var windowSprite  = cc.Scale9Sprite.create();
        windowSprite.initWithSpriteFrameName(spriteName, rect);
        windowSprite.setContentSize(size);
        this.addChild(windowSprite);
        windowSprite.setVisible(false);
        return windowSprite;
    }

});