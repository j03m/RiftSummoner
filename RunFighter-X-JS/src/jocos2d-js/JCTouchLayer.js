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
            this.superDraw = this.draw;
            this.draw = this.childDraw;
            this.superOnEnter = this.onEnter;
            this.onEnter = this.childOnEnter;
            this.superOnExit = this.onExit;
            this.onExit = this.childOnExit;
            return true;
        } else {
            return false;
        }
    },
    childOnEnter:function(){
        this.superOnEnter();
        this.wireInput(true);
        this.onShow();
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
            this.setMouseEnabled(val);
        } else {
            this.setTouchEnabled(val);
        }
    },
    onTouchesBegan: function(touch) {
        this.hitSpriteTarget(jc.touchBegan, touch);
        return true;
    },
    onTouchesMoved: function(touch) {
        this.hitSpriteTarget(jc.touchMoved, touch);
        return true;
    },
    onTouchesEnded: function(touch) {
        this.hitSpriteTarget(jc.touchEnded, touch);
        return true;
    },
    onMouseDown: function(event) {
        this.onTouchesBegan(event);
        return true;
    },
    onMouseDragged: function(event) {
        this.onTouchesMoved(event);
        return true;
    },
    onMouseUp: function(event) {
        this.onTouchesEnded(event);
        return true;
    },
    onTouchCancelled: function(touch, event,sprite) {
        this.hitSpriteTarget(jc.touchCancelled, touch);
        return true;
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
            var tr;
            if (this.touchTargets[i].getTextureRect){
                tr = this.touchTargets[i].getTextureRect();
                cs.with = tr.width;
                cs.height= tr.height;
            }

            if (cc.rectContainsPoint(cs, touch)){
                handled.push(this.touchTargets[i]);
            }
        }
        //if something of note was touched, raise it
        if (handled.length>0 && !this.isPaused){
            this.targetTouchHandler(type, touch, handled);
        }
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
    slideInFromTop:function(item, time, to){
        var itemRect = this.getCorrectRect(item);
        var fromX = this.winSize.width/2;
        var fromY = this.winSize.height+itemRect.height/2; //offscreen
        if (!to){
            var toX = fromX;
            var toY = this.winSize.height - ((itemRect.height/2)+ jc.defaultNudge);
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(0,jc.defaultNudge), 'after');
    },
    slideOutToTop:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = this.winSize.width/2;
        var toY = this.winSize.height+itemRect.height/2; //offscreen
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(0,jc.defaultNudge * -1), 'before');
    },
    slideInFromBottom:function(item, time, to){
        var itemRect = this.getCorrectRect(item);
        var fromX = this.winSize.width/2;
        var fromY = 0 - itemRect.height; //offscreen bottom
        if (!to){
            var toX = fromX;
            var toY = itemRect.height/2 + jc.defaultNudge;;
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(0,jc.defaultNudge * -1), 'after');
    },
    slideOutToBottom:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = this.winSize.width/2;
        var toY = 0 - itemRect.height; //offscreen bottom
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(0,jc.defaultNudge), 'before');
    },
    slideInFromLeft:function(item, time,to){
        var itemRect = this.getCorrectRect(item);
        var fromX = (0 - itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        if (!to){
            var toX = (itemRect.width/2) + jc.defaultNudge;
            var toY = fromY;
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(jc.defaultNudge * -1,0), 'after');
    },
    slideOutToLeft:function(item, time){
        var itemRect = this.getCorrectRect(item);
        var toX = (0 - itemRect.width); //offscreen left
        var toY = this.winSize.height/2;
        this.slide(item, item.getPosition(), cc.p(toX, toY), time, cc.p(jc.defaultNudge,0), 'before');
    },

    slideInFromRight:function(item, time,to){
        var itemRect = this.getCorrectRect(item);
        var fromX = (this.winSize.width + itemRect.width); //offscreen left
        var fromY = this.winSize.height/2;
        if (!to){
            var toX = this.winSize.width - ((itemRect.width/2) + jc.defaultNudge);
            var toY = fromY;
            to = cc.p(toX, toY);
        }
        this.slide(item, cc.p(fromX,fromY), to, time, cc.p(jc.defaultNudge,0), 'after');
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
//        this.pauseSchedulerAndActions();
//        var selChildren = this.getChildren();
//        for (var i = 0; i < selChildren.length; i++) {
//            selChildren[i].pauseSchedulerAndActions();
//        }
        this.isPaused = true;
    },
    resume:function () {
//        var selChildren = this.getChildren();
//        for (var i = 0; i < selChildren.length; i++) {
//            selChildren[i].resumeSchedulerAndActions();
//        }
//        this.resumeSchedulerAndActions();
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
            rect = cc.RectMake(45, 45, 350, 600)
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
    }
});