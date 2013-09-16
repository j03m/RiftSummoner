var jc = jc || {};
jc.CompositeButton = cc.Sprite.extend({
    initWithDefinition:function(def, onTouch){
        if (!def){
            throw "Must supply a definition";
        }
        if (!onTouch){
            throw "Must supply delegate for touch.";
        }
        if (!def.main){
            throw "Must supply main button state.";
        }
        if (!def.pressed){
            throw "Must supply pressed button state.";
        }
        this.def = def;
        this.onTouch = onTouch;
        this.initWithSpriteFrameName(def.main);
        if (this.def.subs){
            for(var i=0; i<def.subs.length;i++){
                var child = cc.Sprite.create();
                child.initWithSpriteFrameName(def.subs[i].name);
                this.addChild(child);
                child.setPosition(cc.p(def.subs[i].x,def.subs[i].y));
            }
        }
        if (this.def.text){
            this.label = cc.LabelTTF.create(this.def.text, this.def.font, this.def.fontSize);
            this.addChild(this.label);
            var size = this.getContentSize();
            this.label.setPosition(cc.p(size.width/2, size.height/2));
        }
    },
    onEnter: function(){
        if ('mouse' in sys.capabilities) {
            cc.Director.getInstance().getMouseDispatcher().addMouseDelegate(this, 0);
        } else {
            cc.Director.getInstance().getTouchDispatcher().addStandardDelegate(this, 0);
        }
    },
    onExit: function(){
        if ('mouse' in sys.capabilities) {
            cc.Director.getInstance().getMouseDispatcher().removeDelegate(this);
        } else {
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        }
    },
    onTouchBegan: function(touch) {
        if(this.frameCheck(touch)){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.def.pressed);
            this.setDisplayFrame(frame);
        }
    },
    frameCheck:function(touch){

        if (this.isVisible() && this.isTouchInside(touch)){
            return true;
        }else{
            return false;
        }

    },
    getTouchLocation:function (touch) {
        var touchLocation = touch.getLocation();                      // Get the touch position
        touchLocation = this.getParent().convertToNodeSpace(touchLocation);  // Convert to the node space of this class

        return touchLocation;
    },
    isTouchInside:function (touch) {
        return cc.rectContainsPoint(this.getBoundingBox(), this.getTouchLocation(touch));
    },
    onTouchMoved: function(touch) {

    },
    onTouchEnded: function(touch) {
        if(this.frameCheck(touch)){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.def.main);
            this.setDisplayFrame(frame);
            this.onTouch();
        }
    },
    onMouseDown: function(event) {
        this.onTouchBegan(event);
    },
    onMouseUp: function(event) {
        this.onTouchEnded(event);
    }
});