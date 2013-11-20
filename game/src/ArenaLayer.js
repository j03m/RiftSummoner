var ArenaLayer = cc.Layer.extend({
	sprites: [],
	touches: [],
    teams:{},
    touchCheckScheduled:false,
    expectedTouches:3,
    checkLimit:5,
    checks:0,
    leftPad:0,
    topPad:0,
    handler: new TouchIdHandler({
        pointsPerMM:6.4,
        cellSizeMM:10,
        sha:CryptoJS
    }),
    init: function() {
		if (this._super()) {
            var layerColor = cc.LayerColor.create(cc.c4(128, 128, 128, 255));
            layerColor.setPosition(new cc.p(0.0,0.0));
            this.addChild(layerColor);
            this.superDraw = this.draw;
            this.draw = this.customDraw();


            if ('mouse' in sys.capabilities) {
	            jc.log(['general'], 'mouse capabilities detected');
				this.setMouseEnabled(true);
			} else {
	            jc.log(['general'], 'defaulting to touch capabilities');
				this.setTouchEnabled(true);
			}
            this.gargoyle = jc.Sprite.spriteGenerator(spriteDefs, 'blackGargoyle', blackGargoyleSheet, blackGargoylePlist);
            this.setSpritePos(this.gargoyle);
            this.gargoyle.setState('idle');
            this.dragon = jc.Sprite.spriteGenerator(spriteDefs, 'dragonBlack', dragonBlackSheet, dragonBlackPlist);
            this.setSpritePos(this.dragon);
            this.dragon.setState('move');
            this.knight = jc.Sprite.spriteGenerator(spriteDefs, 'blueKnight', blueKnightSheet, blueKnightPlist);
            this.setSpritePos(this.knight);
            this.knight.setState('idle');
            this.knight.retain();
            this.dragon.retain();
            this.gargoyle.retain();
            this.addChild(this.dragon);
            this.dragon.setVisible(false);
            this.addChild(this.dragon.batch);
            this.addChild(this.knight);
            this.knight.setVisible(false);
            this.addChild(this.knight.batch);
            this.addChild(this.gargoyle);
            this.gargoyle.setVisible(false);
            this.addChild(this.gargoyle.batch);
            this.sprites =  {
                '405d3207d90193d6ec94a4c9eeb1ffd59770127df916e23e7a877917e20ca497':this.dragon,
                '05b0c50f835add1ddfc8158e6b4cdfa589fd37e3c43a8eec1d933fd20d55e279':this.knight,
                '0d18f14b365a95facf002049494a83b8c713afa6f2d2278e58e8dbb08a75e346':this.gargoyle
            };

            this.dragon.setScale(2);
            this.gargoyle.setScale(2);
            this.knight.setScale(2);

            //spawn scheduler, cycle animations by setting state every N seconds.
            this.schedule(this.cycleAnimations,3);
            return true;
		} else {
			return false;
		}
	},
    cycleAnimations:function(){
        this.cycleAnimation('gargoyle', this.gargoyle);
        this.cycleAnimation('knight', this.knight);
        this.cycleAnimation('dragon', this.dragon);
    },
    cycleAnimation:function(name, sprite){
        for(var animation in spriteDefs[name].animations){
            var i = jc.randomNum(0,2);
            if (i==2 && animation !=undefined){
               // jc.log(['touchcore'], 'Setting:' + animation + ' for ' + name);
                sprite.setState(animation);
                return;
            }
        }
    },
    setSpritePos:function(sprite){
        var size = cc.Director.getInstance().getWinSize();
        var box = sprite.getBoundingBox();
        sprite.setPosition(size.width-(box.width + this.leftPad), size.height - (box.height+this.topPad));
    },
    unscheduleChecks:function(){
        this.touches = [];
        this.checks =0;
        this.touchCheckScheduled = false;
        this.unschedule(this.checkTouches);

    },
    checkTouches:function(){
        jc.log(['touchcore'], 'checking. touches:' + this.touches.length);
        this.checks++;
        if (this.touches.length == this.expectedTouches){
            this.touches = this.touches.slice(0,this.expectedTouches);
            jc.log(['touchcore'], 'processing....');
            this.printTouches(this.touches);
            var id = this.handler.processTouches(this.touches);
            jc.log(['touchcore'], 'sha: ' + id);

            //given an id, load the sprite and show it in a wizbanging way
            var sprite = this.sprites[id];
            if (sprite){
                if (this.currentChild){
                    this.currentChild.setVisible(false);
                }
                this.currentChild = sprite;

                sprite.setVisible(true);
                //cycle animations

            }else{
                //do something to the particles, visual cue
            }



            this.unscheduleChecks();
            //this.disableCloud
        }else if (this.checks>this.checkLimit){
            this.unscheduleChecks();
            //this.disableCloud

        }else{
            //keep checking, move the cloud to encompass where-ever the touches are
        }

    },
	onTouchesBegan: function(touch) {

            //spawn particles at location of first touch

            //use the scheduler to check if touches have been collected
            if (!this.touchCheckScheduled){
                this.touchCheckScheduled =true;
                this.schedule(this.checkTouches,.2);
            }

            this.collectTouches(touch);
			jc.log(['touchcore'], 'Collected touches:' +this.touches.length);

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
		}
});

ArenaLayer.create = function() {
	var ml = new ArenaLayer();
	if (ml && ml.init()) {
		return ml;
	} else {
		throw "Couldn't create the main layer of the game. Something is wrong.";
	}
};

ArenaLayer.scene = function() {
	var scene = cc.Scene.create();
	var layer = ArenaLayer.create();
	scene.addChild(layer);
	return scene;
};
