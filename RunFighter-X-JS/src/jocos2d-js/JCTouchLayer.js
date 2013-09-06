var jc = jc || {};
jc.TouchLayer = cc.Layer.extend({
    touchTargets:[],
    init: function() {
        if (this._super()) {

            this.wireInput();

            return true;
        } else {
            return false;
        }
    },
    wireInput: function(){
        if ('mouse' in sys.capabilities) {
            jc.log(['general'], 'mouse capabilities detected');
            this.setMouseEnabled(true);
        } else {
            jc.log(['general'], 'defaulting to touch capabilities');
            this.setTouchEnabled(true);
        }
    },
    onTouchesBegan: function(touch, event,sprite) {
        throw "child must implement";
    },
    onTouchesMoved: function(touch, event,sprite) {
        throw "child must implement";
    },
    onTouchesEnded: function(touch, event,sprite) {
        throw "child must implement";
    },
    onMouseDown: function(event,sprite) {
        throw "child must implement";
    },
    onMouseDragged: function(event,sprite) {
        throw "child must implement";
    },
    onMouseUp: function(event,sprite) {
        throw "child must implement";
    },
    onTouchCancelled: function(touch, event,sprite) {
        throw "child must implement";
    },
    wireChildren:function(){
        for(var i=0;i<this.touchTargets.length;i++){
            this.touchTargets[i].onTouchesBegan = this.spriteTouchesBegan.bind(this.touchTargets[i], this);
            this.touchTargets[i].onTouchesMoved = this.spriteTouchesMoved.bind(this.touchTargets[i], this);
            this.touchTargets[i].onTouchesEnded = this.spriteTouchesEnded.bind(this.touchTargets[i], this);
            this.touchTargets[i].onMouseDown = this.spriteMouseDown.bind(this.touchTargets[i], this);
            this.touchTargets[i].onMouseDragged = this.spriteMouseDragged.bind(this.touchTargets[i], this);
            this.touchTargets[i].onMouseUp = this.spriteMouseUp.bind(this.touchTargets[i], this);
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this.touchTargets[i]);
        }
    },
    spriteTouchesBegan: function(touch, event, layer) {
        layer.onTouchBegan(touch,event,this);
    },
    spriteTouchesMoved: function(touch, event, layer) {
        layer.onTouchMoved(touch,event,this);
    },
    spriteTouchesEnded: function(touch, event, layer) {
        layer.onTouchEnded(touch,event,this);
    },
    spriteMouseDown: function(event, layer) {
        layer.onMouseDown(event,this);
    },
    spriteMouseDragged: function(event, layer) {
        layer.onMouseDragged(event,this);
    },
    spriteMouseUp: function(event, layer) {
        layer.onMouseUp(event,this);
    }
});