var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var SpriteTest = cc.Layer.extend({
	sprites: [],
    teams:{},
    init: function() {
		if (this._super()) {							
			this.background = new jc.Sprite();
			this.background.layer = this;
            this.background.initWithPlist(arenaPlist, arenaSheet, 'Colosseum_02.png', 'arena');
			this.background.centerOnScreen();
			this.addChild(this.background);
            //var test = new jc.tests.SpriteAnimationTest('blueKnight', 'attack', this);
            var test = new jc.tests.StateMachineTest('blueKnight', 'orge', this);
            this.scheduleUpdate();
			return true;
		} else {
			return false;
		}
	}

});

SpriteTest.create = function() {
	var ml = new SpriteTest();
	if (ml && ml.init()) {
		return ml;
	} else {
		throw "Couldn't create the main layer of the game. Something is wrong.";
	}
	return null;
};

SpriteTest.scene = function() {
	var scene = cc.Scene.create();
	var layer = SpriteTest.create();
	scene.addChild(layer);
	return scene;
};
