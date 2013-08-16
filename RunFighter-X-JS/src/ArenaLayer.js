

var ArenaLayer = cc.Layer.extend({
	sprites: [],
	touches: [],
    teams:{},
    handler: new TouchIdHandler({
        pointsPerMM:6.4,
        cellSizeMM:10,
        sha:CryptoJS
    }),
    init: function() {
		if (this._super()) {
			if ('mouse' in sys.capabilities) {
	            jc.log(['general'], 'mouse capabilities detected');
				this.setMouseEnabled(true);
			} else {
	            jc.log(['general'], 'defaulting to touch capabilities');
				this.setTouchEnabled(true);

			}
			return true;
		} else {
			return false;
		}
	},
	onTouchesBegan: function(touch, event) {
			//todo convert to [], move sprite

			//wait for N touches (there will be an exit button)
            if(touch[0].getLocation().x < 10){
                this.touches = [];
				jc.log(['touchcore'], 'cleanring....');                                
                return;
            }
            this.collectTouches(touch);
			jc.log(['touchcore'], 'Collected touches:' +this.touches.length);
			if (this.touches.length == 3){
                this.touches = this.touches.slice(0,3);
				jc.log(['touchcore'], 'processing....');
                this.printTouches(this.touches);
                jc.log(['touchcore'], 'sha: ' + this.handler.processTouches(this.touches));
                jc.log(['touchcore'], 'Exiting');
                this.touches = [];

			}else{
                jc.log(['touchcore'], 'Working. Touches:' + this.touches.length);
                

            }

			return true;
		},
		collectTouches: function(touch){
			for(var i =0;i<touch.length;i++){
				var location = touch[i].getLocation();
                this.touches.push({x:location.x, y:location.y});
			}
		},
		printTouches: function(touches){
			for(var i =0; i<touches.length;i++){
				jc.log(['touchcore'], i + ' : ' + touches[i].x + ',' + touches[i].y);
			}
		},

});

ArenaLayer.create = function() {
	var ml = new ArenaLayer();
	if (ml && ml.init()) {
		return ml;
	} else {
		throw "Couldn't create the main layer of the game. Something is wrong.";
	}
	return null;
};

ArenaLayer.scene = function() {
	var scene = cc.Scene.create();
	var layer = ArenaLayer.create();
	scene.addChild(layer);
	return scene;
};
