var hotr = hotr || {};
var jc = jc || {};



var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var AnimationTest = jc.TouchLayer.extend({
    //character:"dwarvenKnightWater",
    effect:"fire",
    //missile:"greenbullet",
    init: function() {

        if (this._super()) {
            if (AnimationTest.loaded){
                this.go();
                jc.playEffectOnTarget(this.effect, this.sprite, this, false);
                this.bubbleAllTouches(true);
            }else{
                AnimationTest.loaded = true;
                var assets = [];
                if (this.character){
                    hotr.mainScene.layer.addAssetChain(assets, this.character);
                }

                if (this.effect){
                    assets.pushUnique(g_characterPlists[this.effect]);
                    assets.pushUnique(g_characterPngs[this.effect]);

                }

                if (this.missile){
                    assets.pushUnique(g_characterPlists[this.missile]);
                    assets.pushUnique(g_characterPngs[this.missile]);
                }


                //transform
                for (var i =0;i<assets.length;i++){
                    assets[i] = {src:assets[i]};
                }

                for (var i=0;i<g_battleStuff.length;i++){
                    assets.push(g_battleStuff[i]);
                }
                cc.Director.getInstance().replaceScene(Loading.scene(assets, undefined, 'animationTest'));
            }

            return true;
        } else {
            return false;
        }
    },
    go:function(){
        if (this.sprite){
            this.removeChild(this.sprite);
            if (this.sprite.cleanUp){
                this.sprite.cleanUp();
            }

            this.sprite = undefined;
        }
        if (this.character){
            this.makeChar(this.character);
        }else if (this.effect){
            this.makeEffect(this.effect);
        }else if (this.missile){
            this.makeMissile(this.missile);
        }else{
            throw "must set character, missile or effect"
        }
    },
    makeChar:function(){
        this.sprite = jc.Sprite.spriteGenerator(spriteDefs,this.character, this);
        this.addChild(this.sprite);
        this.sprite.setBasePosition(cc.p(this.winSize.width/2, this.winSize.height/2));
        this.sprite.setState('idle');

    },
    makeIt:function(it, inConfig){
        var config = inConfig;
        this.sprite = jc.makeSpriteWithPlist(config.plist, config.png, config.start);
        this.sprite.setPosition(cc.p(this.winSize.width/2, this.winSize.height/2));
        this.sprite.setVisible(true);
        this.addChild(this.sprite);


        var action = jc.makeAnimationFromRange(it, config);
        this.sprite.runAction(action);

    },
    makeEffect:function(){
        this.makeIt(this.effect, effectsConfig[this.effect]);
    },
    makeMissile:function(){
        this.makeIt(this.missile, missileConfig[this.missile]);
    },
    targetTouchHandler:function(type, touch, sprites){
        this.go();
        return true;
    }
});

AnimationTest.create = function() {
    var ml = new AnimationTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

AnimationTest.scene = function() {

    var scene = cc.Scene.create();
    var layer = AnimationTest.create();
    scene.addChild(layer);
    jc.animationTest = layer;
    return scene;

};

var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var ArenaGame = jc.WorldLayer.extend({
	teamASprites: [],
    teamBSprites: [],
    sprites:[],
    teams:{},
    teamAPowers:undefined,
    teamBPowers:undefined,
    presentationSpeed:0.2,
    init: function() {
        this.name = "Arena";
        if (this._super(arenaSheet)) {
            this.teams['a'] = [];
            this.teams['b'] = [];
            this.scheduleUpdate();
			return true;
		} else {
			return false;
		}
	},
    onShow:function(){
        if(!hotr.arenaScene.data){
            this.runScenario0();
        }else{
            this.runScenario();
        }
    },
    runScenario:function(){

        this.teamASprites = hotr.arenaScene.data.teamA;
        this.teamAFormation = jc.formations[hotr.arenaScene.data.teamAFormation];
        this.teamBSprites = hotr.arenaScene.data.teamB;
        this.teamBFormation = jc.formations[hotr.arenaScene.data.teamBFormation];
        this.teamAPowers = hotr.arenaScene.data.teamAPowers;
        this.teamBPowers = hotr.arenaScene.data.teamBPowers;
        this.setUp();
    },
    runScenario0:function(){

        this.teamASprites.push('orge');
        this.teamASprites.push('orge');
        this.teamASprites.push('orge');
        this.teamASprites.push('orge');

        this.teamASprites.push('orge');
        this.teamASprites.push('blueKnight');
        this.teamASprites.push('blueKnight');
        this.teamASprites.push('orge');

        this.teamASprites.push('voidElf');
        this.teamASprites.push('forestElf');
        this.teamASprites.push('voidElf');
        this.teamASprites.push('forestElf');



        this.teamAFormation = jc.formations["4x4x4a"];

        //this.teamBSprites.push('elementalWind');

        this.teamBSprites.push('elementalStone');
        this.teamBSprites.push('elementalStone');
        this.teamBSprites.push('elementalStone');
        this.teamBSprites.push('elementalStone');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('voidElf');
        this.teamBFormation = jc.formations["4x4x4b"];
        this.setUp();
    },
    getSprite:function(nameCreate){
        var sprite;
        sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, this);
        sprite.setState('idle');
		this.addChild(sprite.batch);
		this.addChild(sprite);
        sprite.layer = this;
        return sprite;
	},

    setUp:function(){
        var sprite;

        //todo refactor these loops into 1 func
        for (var i =0; i<this.teamASprites.length;i++){
            if (this.teamASprites[i])
            {
                sprite = this.getSprite(this.teamASprites[i].name);
                //todo: augment sprite using data fetched via the id
                sprite.homeTeam = this.getTeam.bind(this,'a');
                sprite.enemyTeam = this.getTeam.bind(this, 'b');
                sprite.team = 'a';
                sprite.setVisible(false);
                this.teams['a'][i]=sprite;
                this.touchTargets.push(sprite);
            }

        }


        for (var i =0; i<this.teamBSprites.length;i++){
            if (this.teamBSprites[i])
            {
                sprite = this.getSprite(this.teamBSprites[i].name);
                //todo: augment sprite using data fetched via the id
                sprite.setFlippedX(true);
                sprite.homeTeam = this.getTeam.bind(this,'b');
                sprite.enemyTeam = this.getTeam.bind(this, 'a');
                sprite.team = 'b';
                sprite.setVisible(false);
                this.teams['b'][i]=sprite;
                this.touchTargets.push(sprite);
            }
        }

        this.present(function(){
            function goodSprite(sprite){
                return sprite!=undefined;
            }
            this.teams['a']=_.filter(this.teams['a'],goodSprite);
            this.teams['b']=_.filter(this.teams['b'],goodSprite);
            this.sprites = this.teams['a'].concat(this.teams['b']);

            this.started=true;
        }.bind(this));

    },
    getTeam:function(who){
        return this.teams[who];
    },
    present:function(cb){
        //todo modify this to use teamASprites to know what formation slots are actually filled
        this.presentTeam(this.teams['a'], this.teamAFormation, cc.p(this.worldSize.width/4, this.worldSize.height/2), function(){
            this.presentTeam(this.teams['b'], this.teamBFormation, cc.p((this.worldSize.width/4)*3, this.worldSize.height/2), function(){
                this.presentHud(this.teamAPowers, function(){
                    cb();
                }.bind(this));
            }.bind(this));
        }.bind(this));

    },
    nextTouchDo:function(action){
        this.nextTouchAction = action;
    },
    presentHud:function(powers, callback){
        this.panToWorldPoint(this.worldMidPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
            this.placePowerTokens(powers, callback);

        }.bind(this));
    },
    placePowerTokens:function(powers, callback){

        //create power layer
        this.powerLayer = new PowerHud();

        //place layer  add to scene
        hotr.arenaScene.addChild(this.powerLayer, this.getZOrder()+1);

        this.powerLayer.init(powers);

        this.powerLayer.inTransitionsComplete = function(){
            this.powerLayer.hackOn();
            callback();
        }.bind(this);

        this.powerLayer.start();

    },
    presentTeam:function(team, formation, point, callback){
            this.placeNextCharacter(team, formation, callback);
    },
    placeNextCharacter:function(team, formation, callback){
        if (this.nextChar==undefined){
            this.nextChar = 0;
        }

        this.placeCharacter(team[this.nextChar], formation[this.nextChar], function(){
            this.nextChar++;
            if (this.nextChar>=team.length){
                this.nextChar = undefined
                callback();
            }else{
                this.placeNextCharacter(team, formation, callback);
            }
        }.bind(this));


    },
    placeCharacter:function(sprite, formationPoint, done){
            if (sprite){
                this.scheduleOnce(function(){
                    this.panToWorldPoint(formationPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
                        var worldPos = formationPoint;
                        var nodePos = this.convertToItemPosition(worldPos);
                        sprite.setBasePosition(nodePos);
                        sprite.setVisible(true);
                        jc.playEffectOnTarget("teleport", sprite, this);
                        done();
                    }.bind(this));
                }, this.presentationSpeed);
            }
            else{
                done();
            }
    },
    update:function (dt){
        //pulse each sprite
        var minX=this.worldSize.width;
        var maxX=0;
        var minY=this.worldSize.height;
        var maxY=0;
        var shouldScale = false;
        if (this.started){
            for (var i =0; i<this.sprites.length;i++){
                if (this.sprites[i].isAlive() && this.sprites[i].isVisible()){
                    var position = this.sprites[i].getPosition(); //where am i in the layer
                    var shouldScale = true;
                    var tr = this.sprites[i].getTextureRect();
                    var nodePos = this.convertToWorldSpace(position); //where is that on the screen?
                    var worldPos = this.screenToWorld(nodePos); //where is that in the world?
                    var compareMaxX = worldPos.x+(tr.width*2);
                    var compareMinX = worldPos.x-tr.width*2;
                    var compareMaxY = worldPos.y+tr.height*2;
                    var compareMinY = worldPos.y-tr.height*2;


                    if (compareMaxX > maxX){
                        maxX = compareMaxX;
                        //cosole.log("MaxX:"+this.sprites[i].name);
                    }

                    if (compareMinX < minX){
                        minX = compareMinX;
                        //cosole.log("MinX:"+this.sprites[i].name);
                    }

                    if (compareMaxY > maxY){
                        maxY = compareMaxY;
                        //cosole.log("MaxY:"+this.sprites[i].name);
                    }

                    if (compareMinY < minY){
                        minY = compareMinY;
                        //cosole.log("MinY:"+this.sprites[i].name);
                    }
                }
                this.sprites[i].think(dt);
            }
            var scaleLimit = 50;
            if (!this.scaleGate && shouldScale){


                var characterMid = cc.pMidpoint(cc.p(minX,minY), cc.p(maxX,maxY));
                var scale = this.getOkayScale(maxX-minX, maxY-minY);

                //todo: based on characterMid, select camera 1-9
                //todo: based on scale, select right scale ratio

                //smooth
                if (!this.lastPan){
                    this.lastPan = characterMid;
                    var diff = cc.p(scaleLimit+1,scaleLimit+1);
                }else{
                    var diff = cc.pSub(this.lastPan, characterMid);
                }
                if (Math.abs(diff.x) > scaleLimit || Math.abs(diff.y)>scaleLimit){
                    this.lastPan = characterMid;

                    this.panToWorldPoint(characterMid, scale, jc.defaultTransitionTime, function(){
                        this.scaleGate = false;
                    }.bind(this));
                }

            }
        }
    },
    doBlood:function(sprite){
//        var flower = cc.ParticleSystem.create(bloodPlist);
//        this.addChild( flower );
//        flower.setPosition( this.getRandomBloodSpot(sprite));
    },
    getRandomBloodSpot:function(sprite){
        var pos = sprite.getPosition();    //explicity use getPosition, not getBasePoisition here
        var rect = sprite.getTextureRect();
        var offset = jc.randomNum((rect.width/2)*-1, rect.width/2);
        pos.x+=offset;
        offset = jc.randomNum((rect.height/2)*-1, rect.height/2);
        pos.y+=offset;
        return pos;

    },
    targetTouchHandler:function(type, touch,sprites){
        if (this.nextTouchAction){
            if (type == jc.touchEnded){
                var nodePos = this.convertToNodeSpace(touch);
                this.nextTouchAction(nodePos, sprites);
                this.nextTouchAction = undefined;
            }
            return true;
        }
    }

});

ArenaGame.create = function() {
	var ml = new ArenaGame();
	if (ml && ml.init()) {
		return ml;
	} else {
		throw "Couldn't create the main layer of the game. Something is wrong.";
	}
	return null;
};

ArenaGame.scene = function() {
	if (!hotr.arenaScene){
        hotr.arenaScene = cc.Scene.create();
        hotr.arenaScene.layer = ArenaGame.create();
        hotr.arenaScene.addChild(hotr.arenaScene.layer);
    }
    return hotr.arenaScene;

};

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

/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = setImmediate;
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());


var AirToGroundBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.handleTankIdle = this.handleIdle;
    this.handleIdle = this.handleA2GIdle;
    this.init(sprite);
}

//seeks ground units like a tank
//floats at a higher position then the target at all times 45 degree angle
//then shoots down with each attack
//only targettable by range and air2air

//add drop shadow to all sprites


//AirToGroundBehavior.prototype.










var BehaviorMap = {
    'tank':TankBehavior
    ,'range':RangeBehavior
    ,'healer':HealerBehavior //supports a tank, if not supports a range
    ,'flanker':FlankerBehavior //b-lines for a non-tank
    ,'defender':DefenderBehavior  //defends a non-tank till death
    //,'airtoground':AirToGroundBehavior //flying tank that can be deadly to ground units
}


var DefenderBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.handleTankIdle = this.handleIdle;
    this.handleIdle = this.handleDefenderIdle;
    this.think = this.defendThink;
}

//Find a support or range to defend

//follow

//attack anyone how comes in attack radius

DefenderBehavior.prototype.handleSeek = function(dt){

    //glade would not approve :(
    if (this.support && this.support.behavior.damager && this.support.behavior.damager.isAlive()){
        this.locked = this.support.behavior.damager;
        this.setState('attackmove', 'move');
        return;
    }

    this.locked = this.lockOnEnemyInRadius();
    if (this.locked){
        this.setState('attackmove','move');
        return;
    }

    if (this.support){
        if(!this.targetWithinSeekRadius(this.support)){
            this.setState('move', 'move');
        }
    }


}

DefenderBehavior.prototype.handleDefenderMove = function(dt){
    var point = this.getWhereIShouldBe('front', 'away', this.support);
    point = this.seek(point);
    if (point.x == 0 && point.y == 0){
        this.setState('seek', 'idle');
        return;
    }
    this.setState('idle', 'move');
    this.moveToward(point, dt);
}



DefenderBehavior.prototype.handleDefenderDamage = function(dt){
    if (this.damager && this.damager.isAlive() && this.damager != this.locked && this.isNot(['range', 'mage'], this.damager)){
        this.locked = this.damager;
        this.setState('attackmove', 'move');
    }else{
        this.resume();
    }
}

DefenderBehavior.prototype.defendThink = function(dt){

    var state= this.getState();
    this.handleDeath();

    switch(state.brain){
        case 'idle':this.handleDefenderIdle(dt);
            break;
        case 'move':
            this.handleDefenderMove(dt);
            break;
        case 'attackmove':
            this.handleMove(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'seek':this.handleSeek(dt);
            break;
        case 'damage':this.handleDefenderDamage(dt);
            break;
    }
    this.afterEffects();
}

DefenderBehavior.prototype.handleDefenderIdle = function(dt){
    if (!this.support){
        this.support = this.lockOnClosestFriendlyNonTank();
    }

    if (!this.support || !this.support.isAlive()){
        this.support = undefined;
        this.locked = this.lockOnClosestFriendlyNonTank();
    }


    if (!this.support){
        this.handleTankIdle(dt);
    }else{
        this.setState('move', 'move');
    }
}

var FlankerBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.handleTankIdle = this.handleIdle;
    this.handleIdle = this.handleFlankerIdle;
}


FlankerBehavior.prototype.handleFlankerIdle = function(dt){
    if (!this.locked){
        this.locked = this.lockOnClosestNonTank();
    }else{
        this.handleTankIdle(dt);
    }

    if (this.locked && !this.locked.isAlive()){
            this.locked = undefined;
            this.locked = this.lockOnClosestNonTank();
    }else{
        this.handleTankIdle(dt);
    }

    if (!this.locked){
        return; //wait
    }else{
        this.setState('move', 'move');
    }
}



var GeneralBehavior = cc.Node.extend({});


GeneralBehavior.prototype.getState = function(){
    //some behaviors have aiStates, which are in addition to sprite states, this is shitty. I know this.
    if (!this.brainState){
        this.setState('idle');
    }

    if (!this.animationState){
        this.owner.setState('idle');
    }
    return {brain:this.brainState, anim:this.animationState};
}

GeneralBehavior.prototype.resume = function(){
    this.setState(this.lastBrain, this.lastAnim);
}

//sets a state
GeneralBehavior.prototype.setState = function(brainState, animationState, callback){
    this.lastBrain = this.brainState;
    this.lastAnim = this.animationState;
    if (brainState){
        this.brainState = brainState;
    }
    if (animationState){
        this.animationState = animationState;
        this.owner.setState(this.animationState, function(newState){
            if (this.animationState == 'damage'){
                this.resume();
            }else{
                this.animationState = newState;
                this.owner.setState(this.animationState);
            }
            if (callback){
                callback();
            }
        }.bind(this));
    }
}




//init
GeneralBehavior.prototype.init = function(sprite){
    this.owner = sprite;
    this.directions = [0, 45, 90, 135, 180, 225, 270];
    this.stateQueue = [];
    this.owner = sprite;
}


GeneralBehavior.prototype.targetWithinRadius = function(target){
    return this.withinRadius(target.getBasePosition());
}

GeneralBehavior.prototype.targetWithinVariableRadius = function(radius, target){
    return this.withinThisRadius(target.getBasePosition(), radius, radius);
}


GeneralBehavior.prototype.targetWithinVariableRadiusAndLocation = function(radius, point, target){
    return this.withinThisRadiusOf(target.getBasePosition(), point, radius, radius);
}


GeneralBehavior.prototype.withinRadius = function(toPoint){
    return this.withinThisRadius(toPoint, this.owner.getTargetRadius(), this.owner.getTargetRadiusY());
}

GeneralBehavior.prototype.whosCloser = function(first, second){
    var vector1 = this.getVectorTo(first.getBasePosition(), this.owner.getBasePosition());
    var vector2 =  this.getVectorTo(second.getBasePosition(), this.owner.getBasePosition());
    if (vector2.distance < vector1.distance){
        return -1;
    }
    if (vector1.distance < vector2.distance){
        return 1;
    }
    return 0;

}
GeneralBehavior.prototype.withinThisRadiusOf = function(fromPoint, toPoint, xRad, yRad){
    var vector = this.getVectorTo(toPoint, fromPoint);
    if (vector.xd <= xRad && vector.yd <= yRad){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.withinThisRadius = function(toPoint, xRad, yRad){
    var feet = this.owner.getBasePosition();
    var vector = this.getVectorTo(toPoint, feet);
    if (vector.xd <= xRad && vector.yd <= yRad){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.targetWithinSeekRadius = function(target){
    var feet = this.owner.getBasePosition();
    var vector = this.getVectorTo(target.getBasePosition(), feet);
    if (vector.distance <= this.owner.getSeekRadius()){
        return true;
    }else{
        return false;
    }
}

//find an enemy that that is within my attack radius
GeneralBehavior.prototype.lockOnEnemyInRadius = function(){
    return this.lockOnClosest(this.targetWithinSeekRadius.bind(this), this.owner.enemyTeam());
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    return this.lockOnClosest(this.isUnlocked.bind(this), this.owner.enemyTeam());
}

GeneralBehavior.prototype.lockOnClosestFriendlyNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.homeTeam());
}

GeneralBehavior.prototype.lockOnClosestNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.enemyTeam());
}

GeneralBehavior.prototype.isNot = function(nots,target){
    if (nots.indexOf(target.behaviorType) == -1){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.is = function(iss,target){
    if (iss.indexOf(target.behaviorType) != -1){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.getClosestFriendToSupport = function(){
    return this.lockOnClosest(this.is.bind(this, ['tank', 'range']), this.owner.homeTeam());
}

//loops through all homeTeam() sprites and checks to see if any of them are locked onto the target
GeneralBehavior.prototype.isUnlocked = function(target){
    for (var i =0; i< this.owner.homeTeam().length; i++){
        var sprite = this.owner.homeTeam()[i];
        if (sprite!=this.owner){
            //check locked
            if (sprite.behavior.locked == target){
                return false;
            }
        }
    }
    return true;
}

//lock onto the closest bad guy but use the check function for exceptions
GeneralBehavior.prototype.lockOnClosest = function(checkFunc, team){
    var currentlyLocked = undefined;
    var winSize = this.getWorldSize();
    var minDistance = winSize.width;
    for (var i =0; i< team.length; i++){
        var sprite = team[i];
        if (sprite.isAlive() && this.canTarget(sprite)){
            var vector = this.getVectorTo(sprite.getBasePosition(), this.owner.getBasePosition());
            if (vector.distance < minDistance){
                if (checkFunc != undefined){
                    if (checkFunc(sprite)){
                        minDistance = vector.distance;
                        currentlyLocked = sprite;
                    }
                }else{
                    minDistance = vector.distance;
                    currentlyLocked = sprite;
                }
            }
        }
    }

    return currentlyLocked;
}

GeneralBehavior.prototype.canTarget = function(sprite){
    if (sprite.gameObject.movementType == this.owner.gameObject.targets || this.owner.gameObject.targets == jc.targetType.both ){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.allPassCheck = function(checkFunc, team){
    var success = [];
    for (var i =0; i< team.length; i++){
        var sprite = team[i];
        if (sprite.isAlive() && sprite != this.owner){
            if (checkFunc(sprite)){
                success.push(sprite);
            }
        }
    }
    return success;
}

GeneralBehavior.prototype.allFriendsWithinRadius = function(radius){
    return this.allPassCheck(this.targetWithinVariableRadius.bind(this, radius), this.owner.homeTeam());
}


GeneralBehavior.prototype.allFoesWithinRadius = function(radius){
    return this.allPassCheck(this.targetWithinVariableRadius.bind(this, radius), this.owner.enemyTeam());
}

GeneralBehavior.prototype.allFoesWithinRadiusOfPoint = function(radius, point){
    return this.allPassCheck(this.targetWithinVariableRadiusAndLocation.bind(this, radius, point), this.owner.enemyTeam());
}


GeneralBehavior.prototype.seekEnemy = function(){
    if (!this.locked){
        throw "invalid state, character must be locked to seek.";
    }

    var attackPosition = this.getWhereIShouldBe('front', 'facing', this.locked);
    attackPosition = this.adjustFlock(attackPosition);

    //apply a position augment if it's there - usually for flying animals to be far off their targets
    if (this.owner.gameObject.flightAug){
        if (!this.owner.isFlippedX()){
            this.owner.gameObject.flightAug.x*=-1;
        }
        attackPosition = cc.pAdd(attackPosition, this.owner.gameObject.flightAug);
    }


    //if the place im trying to go is outside of the elipse, send me to center.
    //this sort of blows.
    if (this.owner.gameObject.movementType == jc.movementType.ground){
        var center = cc.p(this.owner.layer.winSize.width/2, this.owner.layer.winSize.height/2);
        if (!jc.insideEllipse(600,300, attackPosition,center)){
            attackPosition = center;
        }
    }

    return this.seek(attackPosition);
}


GeneralBehavior.prototype.getWhereIShouldBe = function(position, facing, target){


    if (!target){
        return this.owner.getBasePosition();
    }
    var mySize = this.owner.getTextureRect();
    var toPoint = target.getBasePosition();
    var supportPos;

    if (position == 'front'){
        //if my target is flip x and i am supposed to be infront of them, that means
        //I need to position myself to their right, ortherwise left
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x - mySize.width, toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x + mySize.width, toPoint.y);
        }

    }

    if (position == 'behind'){
        //if my target is flip x and i am supposed to be behind of them, that means
        //I need to position myself to their left, otherwise right
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x + mySize.width, toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x - mySize.width, toPoint.y);
        }

    }

    //if I am to face the character and I am in front of them, I need to be the opposite flipx
    if (facing == 'facing' && position == 'front'){
        this.owner.setFlippedX(!target.isFlippedX())
    }

    //if I am to face the character and i am behind them I need to be the same flipx
    if (facing == 'facing' && position == 'behind'){
        this.owner.setFlippedX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am front of them I need to be same flipx
    if (facing == 'away' && position == 'font'){
        this.owner.setFlippedX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am behind them of them I need to be opposite flipx
    if (facing == 'away' && position == 'behind'){
        this.owner.setFlippedX(!target.isFlippedX())
    }


    return supportPos;
}

GeneralBehavior.prototype.adjustFlock = function(toPoint){
    var friends = this.allFriendsWithinRadius(10);
    var pos = this.owner.getBasePosition();
    if (friends.length!=0){
        for (var i =0; i<friends.length;i++){
            //if we're locked onto the same person
            var diff = Math.abs(friends[i].getBasePosition().y-pos.y);

            if (diff<10 && this.owner.flockedOff !=friends[i]){
                //adjust my seek position by 10px y north
                friends[i].flockedOff = this.owner;
                toPoint.y+=25;
                break;
            }
        }
    }
    return toPoint;

}

GeneralBehavior.prototype.seek = function(toPoint){

    if (!this.owner){
        throw "Owning game object required";
    }

    if (this.withinRadius(toPoint)){
        return cc.p(0,0);
    }

    var myFeet = this.owner.getBasePosition();

    var vector = this.getVectorTo(toPoint, myFeet);


    var speed = this.owner.gameObject.speed;
    if (!speed){
        throw "Character: " + this.owner.name + " speed not defined.";
    }

    var raw = cc.pMult(cc.pNormalize(vector.direction), speed);


    return raw;
}


GeneralBehavior.prototype.getVectorTo= function(to, from){
    if (!to || !from){
        throw "To and From positions required!";
    }
    var direction = cc.pSub(to,from);
    var xd = Math.abs(to.x - from.x);
    var yd = Math.abs(to.y - from.y);
    var distance = cc.pLength(direction);
    return {direction:direction, distance:distance, xd:xd, yd:yd};
}


GeneralBehavior.prototype.moveToward = function(point, dt){

    // Update position based on velocity
//    var separate = this.separate();
//    var point = cc.pAdd(separate, point);

    var newPosition = cc.pAdd(this.owner.getBasePosition(), cc.pMult(point, dt));
    this.owner.setBasePosition(newPosition);
}

GeneralBehavior.prototype.getRandomFleePosition = function(){
    //find a random spot, targetRadius away
    var randomAngle = jc.randomNum(0,this.directions.length);
    var direction = cc.pForAngle(randomAngle);
    var destination = cc.pMult(direction, this.owner.getTargetRadius());
    return this.clamp(destination);

}
GeneralBehavior.prototype.getWorldSize=function(){
    return this.owner.layer.worldSize;
}
GeneralBehavior.prototype.clamp=function(point){
    var winSize = this.getWorldSize();
    var mySize = this.owner.getTextureRect();
    var rightLimit = winSize.width - mySize.width;
    var leftLimit = mySize.width;
    var topLimit = winSize.height - mySize.height;
    var bottomLimit = mySize.height;

    if (point.x > rightLimit){
        point.x = rightLimit;
    }

    if (point.x < leftLimit){
        point.x = leftLimit;
    }

    if( point.y > topLimit){
        point.y = topLimit;
    }

    if (point.y < bottomLimit){
        point.y = bottomLimit;
    }
    return point;
}

GeneralBehavior.prototype.healLogic = function(){
    if (!this.support){
        return;
    }

    GeneralBehavior.heal(this.owner, this.support, this.owner.gameObject.heal);

}

GeneralBehavior.heal = function(healer, target, value){
    //can't heal a dead guy or full hp
    if (target.gameObject.hp<0 || target.gameObject.hp >= target.gameObject.MaxHP){
        return false;
    }

    if (target.gameObject.hp + value < target.gameObject.MaxHP){
        target.gameObject.hp+= value;
    }else{
        target.gameObject.hp= target.gameObject.MaxHP;
    }

    return true;
}

GeneralBehavior.prototype.hitLogic = function(){
    if (!this.locked){
        return;
    }

    //apply damage to the target
    GeneralBehavior.applyDamage(this.locked, this.owner, this.owner.gameObject.damage);

    //if the character in question has damageMod effects, we need to do them here
    this.damageEffects();
}

GeneralBehavior.prototype.damageEffects = function(){
    var config = spriteDefs[this.owner.name];
    var powers = config.damageMods;
    for(var power in powers){
        powers[power].name = power;
        this.doDamageMod(powers[power]);
    }
};


GeneralBehavior.prototype.deathEffects = function(){
    var config = spriteDefs[this.owner.name];
    var powers = config.deathMods;
    for(var power in powers){
        powers[power].name = power;
        this.doDamageMod(powers[power]);
    }
};

GeneralBehavior.prototype.doDamageMod=function(power){
    var powerFunc = powerConfig[power.name].bind(this);
    powerFunc(this.owner.name); //one time
}

GeneralBehavior.applyDamage = function(target, attacker, amount, elementType){

    if (!elementType && !attacker){
        throw "must supply an attacker or an elementType";
    }

    if (!elementType){
        var attackDef = spriteDefs[attacker.name];
        elementType = attackDef.elementType;
    }

    //apply elemental defenses
    if (target.gameObject.defense){
        for(var element in target.gameObject.defense){
            if (element == elementType){
                var reduction = amount * (target.gameObject.defense[element]/100);
                amount -=reduction;
                if (amount<0){
                    amount = 0;
                }
            }
        }
    }

    //apply flank bonus
    if (attacker){
        if (target.behavior.locked != attacker && attacker.behaviorType != "range"){
            amount += amount * 0.2;
        }
    }

   return  GeneralBehavior.applyGenericDamage(target, attacker, amount)

}

GeneralBehavior.applyGenericDamage = function(target, attacker, amount){
    if (target.gameObject.hp>0){
        target.gameObject.hp-=amount;
        if (target.gameObject.hp <=0){
            target.behavior.setState('dead', 'dead');
        }else{
            if (attacker){
                target.behavior.damager = attacker;
            }
        }
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.think = function(dt){
    //todo remove this:
    this.handleState(dt);

}

GeneralBehavior.prototype.handleDeath = function(){

    if (!this.callbacksDisabled){
        var state= this.getState();
        if (!this.owner.isAlive() && state.brain!='dead'){
            this.setState('dead','dead');
        }

        if (!this.owner.isAlive()){
            this.owner.unscheduleAllCallbacks();
            this.deathEffects();
            this.callbacksDisabled = 1;
        }
    }else{
        if (this.callbacksDisabled == 1){
            this.owner.scheduleOnce(this.deadForGood.bind(this), 3);
            this.callbacksDisabled++;
        }

    }

}

GeneralBehavior.prototype.deadForGood = function(){
    this.owner.die();
//    this.homeTeam() = _.reject(this.homeTeam(), function(member){
//        return member == this.owner;
//    });
}

GeneralBehavior.prototype.handleState = function(dt){
    this.handleDeath();
    var state= this.getState();
    switch(state.brain){
        case 'idle':this.handleIdle(dt);
            break;
        case 'move':this.handleMove(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'damage':this.handleDamage(dt);
            break;
    }
    this.afterEffects();
}

GeneralBehavior.prototype.handleDamage = function(dt){

//    if (this.damager && this.damager.isAlive() && this.damager != this.locked){
//        this.resume();
//    }else{
//        this.resume();
//    }


    //otherwise do nothing and recheck
}

GeneralBehavior.prototype.handleFight = function(dt){

    //is my target alive?
    var state= this.getState();
    if (!this.locked && state.anim.indexOf('attack')==-1){
        this.setState('idle', state.anim);
        return;
    }

    if (!this.locked.isAlive() && state.anim.indexOf('attack')==-1){
        this.setState('idle', state.anim);
        return;
    }

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['attack'];
    var damageDelay = this.owner.gameObject.effectDelays['attack'];
    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1){
        this.setAttackAnim('fighting', function(){
            var point = this.seekEnemy();
            if (point.x != 0 || point.y != 0){
                //out of range, they fled or we got knocked back
                this.setState('move', 'move');
                return;
            }
        }.bind(this));
        this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

GeneralBehavior.prototype.setAttackAnim = function(state, callback){
    if (this.attackSequence==undefined){
        this.attackSequence = 1;
    }

    if (this.attackSequence == 1){
        this.setState(state, 'attack');

    }else{
        var nextAttack = 'attack'+this.attackSequence;
        if (this.owner.animations[nextAttack]){
            this.setState(state, nextAttack, callback);
        }else{
            this.attackSequence = 0;
            this.setState(state, 'attack', callback);
        }
    }
    this.attackSequence++;
}

GeneralBehavior.prototype.handleIdle = function(dt){
    //lock on who-ever is closest
    if (this.locked && this.damager && this.locked!=this.damager){ //if im being attacked and I'm locked, and they are not the same person
        var closer = this.whosCloser(this.locked, this.damager);
        if (closer == 1){
            this.damager = undefined; //stop worrying about damage, stay on target
        }

        if (closer == -1){ //switch targets
            this.locked = this.damager;
            this.damager = undefined;
        }

        if (closer == 0){
            //don't change anything for now, but check again later.
        }

    }

    if (!this.locked || !this.withinRadius(this.locked.getBasePosition())){
        this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam());
    }

    if (this.locked){
        this.setState('move', 'move');
    }

}

GeneralBehavior.prototype.handleMove = function(dt){
    var point = this.seekEnemy();
    if (point.x == 0 && point.y == 0){
        //arrived - attack
        this.setState('fighting', 'move'); //switch to fight, but keep animation the same
        return;
    }
    this.moveToward(point, dt);
}

GeneralBehavior.prototype.separate = function(){
    var steering = cc.p(0,0);
    var myTeam = this.owner.homeTeam();
    for (var i =0; i< myTeam.length; i++) {
        if (myTeam[i] != this.owner){
            var ally = myTeam[i];
            var vector = this.getVectorTo(this.owner.getBasePosition(), ally.getBasePosition());
            var SEPARATE_THRESHHOLD = 100;

            if (vector.xd < SEPARATE_THRESHHOLD || vector.yd < SEPARATE_THRESHHOLD) {
                steering = cc.pAdd(steering, vector.direction);
            }
        }
    }
    return steering;
}

GeneralBehavior.prototype.doPower = function(power){
    var powerFunc = powerConfig[power.name].bind(this);
    powerFunc(this.owner.name);
}

GeneralBehavior.prototype.afterEffects = function(){
    //apply my power
    if (!this.owner.isAlive()){
        return; //no need
    }
//    var config = spriteDefs[this.owner.name];
//    var powers = config.powers;
//    for(var power in powers){
//        powers[power].name = power;
//        this.doPower(powers[power]);
//    }
//
//    //removes effects that have expired
//    var effect;
//    for (var effectName in this.owner.effects){
//        effect = this.owner.effects[effectName];
//        if (effect.total > effect.duration){
//            this.removeEffects(effect);
//            delete this.owner.effects[effectName]
//        }
//    }
//
//    //apply anything still effecting me
//    for (var effectName in this.owner.effects){
//        effect = this.owner.effects[effectName];
//        this.applyEffects(effect);
//    }

    if (!this.scheduledPowers){
        this.scheduledPowers = {};
    }
    var config = spriteDefs[this.owner.name];
    var powers = config.powers;
    //llp through powers
    for(var power in powers){
        //if it's not scheduled
        if (!this.scheduledPowers[power]){
            //create a bound function with the power
            powers[power].name = power;
            var powerFunc = this.doPower.bind(this, powers[power]);
            //schedule it
            this.owner.schedule(powerFunc, powers[power].interval);
            //mark it as scheduled
            this.scheduledPowers[power] = powers[power];
        }
    }

    if (!this.scheduledEffects){
        this.scheduledEffects = {};
    }
    //for each effect on the user
    for (var effectName in this.owner.effects){
        //get the effect
        var effect = this.owner.effects[effectName];
        if (!this.scheduledEffects[effectName]){
            var effectFunc = this.applyEffects.bind(this, effect);
            var removeEffectFunc = this.removeEffects.bind(this, effect, effectFunc, effectName);
            //why -2? cocos2d scheduler goes over by 1, so we pull back 2 to make sure this is over before remove fires.
            //ghetto...but - have you built an RTS on your own?
            this.owner.schedule(effectFunc, effect.interval, (effect.duration/effect.interval)-2, undefined);
            if (effect.duration){
                this.owner.scheduleOnce(removeEffectFunc, effect.duration);
            }
            this.scheduledEffects[effectName] = effect;
        }
    }



};

GeneralBehavior.prototype.removeEffects = function(effect, effectFunc, effectName){
    var func = powerConfig[effect.name + "-remove"].bind(this);
    func(effect);
    this.unschedule(effectFunc);
    this.owner.removeEffect(effectName);
    this.scheduledEffects[effectName] = undefined;

}

GeneralBehavior.prototype.applyEffects = function(effect){
    var func = powerConfig[effect.name + "-apply"].bind(this);
    func(effect);
}

var HealerBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.handleTankIdle = this.handleIdle;
    this.think = this.healThink;
    this.init(sprite);
}


HealerBehavior.prototype.healThink = function(dt){

    var state= this.getState();
    this.handleDeath();

    switch(state.brain){
        case 'idle':this.handleHealerIdle(dt);
            break;
        case 'move':
            if (this.support){
                this.handleHealMove(dt);
            }else{
                this.handleMove(dt);
            }
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'healing':this.handleHeal(dt);
            break;
        case 'damage':this.handleDamage(dt);
            break;
    }

    this.afterEffects();
}


HealerBehavior.prototype.handleHealerIdle = function(dt){
    if (!this.support || !this.support.isAlive()){
        this.support = this.getClosestFriendToSupport();
    }

    if (!this.support){
        this.handleTankIdle(dt);
    }else{
        //get close
        if(!this.withinThisRadius(this.support.getBasePosition(), this.owner.getTargetRadius()*2, this.owner.getTargetRadiusY()/2)){
            this.setState('move', 'move');
            return;
        }

        if (this.support.gameObject.hp>0 && this.support.gameObject.hp < this.support.gameObject.MaxHP){
            //needs a heal.
            var state = this.getState();
            this.setState('healing', 'attack');
        }

    }
}


HealerBehavior.prototype.handleHealMove = function(dt){
    var point = this.getWhereIShouldBe('behind', 'facing', this.support);
    point = this.seek(point);
    if (point.x == 0 && point.y == 0){
        //arrived - heal
        this.setState('healing', 'idle');
        return;
    }

    this.setState('move', 'move');
    this.moveToward(point, dt);

}

HealerBehavior.prototype.handleHeal = function(dt){

    var state= this.getState();
    if (state.anim == 'attack'){
        //return - let it finish
        return;
    }

    //is my target alive?
    if (!this.support){
        this.setState('idle', 'idle');
        return;
    }

    if (!this.support.isAlive()){
        this.setState('idle', 'idle');
        return;
    }

    if (this.support.gameObject.hp >= this.support.gameObject.MaxHP){
        //does not needs a heal.
        this.setState('idle', 'idle');
    }

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['heal'];
    var damageDelay = this.owner.gameObject.effectDelays['heal'];

    if (this.lastHeal==undefined){
        this.lastHeal = actionDelay;
    }


    //can heal?
    if (this.support.gameObject.hp<0 || this.support.gameObject.hp >= this.support.gameObject.MaxHP){
        this.setState('idle', 'idle');
        this.lastHeal+=dt;
        return;
    }


    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastHeal >= actionDelay && state.anim != 'attack'){
        this.owner.scheduleOnce(this.healLogic.bind(this), damageDelay);
        this.setState('healing', 'attack');
        this.lastHeal = 0;
    }else{
        this.lastHeal+=dt;
        this.setState('healing', state.anim);

    }
}
var RangeBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);

    this.handleIdle = this.handleRangeIdle;
    this.handleFight = this.handleRangeFight;
    this.withinRadius= this.withinRangeRadius;

}


RangeBehavior.prototype.handleRangeFight = function(dt){

    //is my target alive?
    var state= this.getState();
    if (!this.locked && state.anim.indexOf('attack')==-1){
        this.setState('idle', state.anim);
        return;
    }

    if (!this.locked.isAlive() && state.anim.indexOf('attack')==-1){
        this.setState('idle', state.anim);
        return;
    }

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['attack'];
    var effectDelay = this.owner.gameObject.effectDelays['attack'];

    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1){
        this.setAttackAnim('fighting');
        this.owner.scheduleOnce(this.doMissile.bind(this),effectDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

RangeBehavior.prototype.doMissile = function(){

    //make missile sprite
    if (!this.firing){ //do missile

        this.firing = true;
        var missileName = this.owner.gameObject.missile;
        if (!missileName){
            missileName = "greenbullet"; //todo temp, remove
        }

        var missileType = missileConfig[missileName];
        var vector = this.getVectorTo(this.locked.getBasePosition(), this.owner.getBasePosition());
        var timeToImpact = vector.distance/missileType.speed;
        if (!this.missile){
            this.missile = jc.makeSpriteWithPlist(missileType.plist, missileType.png, missileType.start);
            this.missileAnimation = jc.makeAnimationFromRange(missileName, missileType );

        }

        this.owner.layer.addChild(this.missile);
        var ownerPos = this.owner.getBasePosition();
        var tr = this.owner.getTextureRect();
        if (this.owner.isFlippedX()){
            ownerPos.x -=tr.width/2;
        }else{
            ownerPos.x +=tr.width/2;
        }

        ownerPos.y += tr.height/2;

        if (missileType.offset){
            ownerPos = cc.pAdd(ownerPos, missileType.offset);
        }

        if (this.owner.gameObject.missileOffset){
            ownerPos = cc.pAdd(ownerPos, this.owner.gameObject.missileOffset);
        }


        this.missile.setFlippedX(this.owner.isFlippedX());

        this.missile.setPosition(ownerPos);
        this.missile.runAction(this.missileAnimation);

        //move it to the target at damageDelay speed
        var targetPos;
        if (this.owner.gameObject.missleTarget == "base"){
            targetPos = this.locked.getBasePosition()
        }else{
            targetPos = this.locked.getPosition()
        }


        var moveTo = cc.MoveTo.create(timeToImpact, targetPos);
        var callback = cc.CallFunc.create(function(){
            this.hitLogic();
            this.owner.layer.removeChild(this.missile);
            this.firing = false;
            if (this.locked){
                jc.playEffectOnTarget(missileType.effect, this.locked, this.owner.layer);
            }


        }.bind(this));
        var seq = cc.Sequence.create(moveTo, callback);
        this.missile.runAction(seq);

    }else{
        this.hitLogic();
    }

}

RangeBehavior.prototype.handleRangeIdle = function(dt){
    //always lock on who-ever is closest
    this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam);

    if (this.locked){
        this.setState('move', 'move');
    }

}

RangeBehavior.prototype.withinRangeRadius = function(toPoint){
    return this.withinThisRadius(toPoint, this.owner.getTargetRadius(), this.owner.getTargetRadius());
}











var TankBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
}











var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.formationSize = 12;
hotr.authTokenLocalStoreKey = "x1xauthTokenx1x";
hotr.haveSeenLocalStoreKey = "x1xhaveseenx1x";
hotr.blobOperations.getBlob = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    blobApi.getBlob(authToken.token,function(err, data){
        hotr.playerBlob = data;
        callback();
    });
}

hotr.blobOperations.saveBlob = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    hotr.playerBlob.version++;
    blobApi.saveBlob(authToken.token, hotr.playerBlob, function(err, res){
        callback(err, res);
    });
}

hotr.blobOperations.getFormation = function(){
    return "4x4x4a";
}

hotr.blobOperations.getTeam = function(){
    var characterMap = {};
    _.each(hotr.playerBlob.myguys, function(character){
        characterMap[character.id] = character;
    });

    var formation = hotr.playerBlob.formation;
    var team = [];
    for (var i=0;i<formation.length; i++){
        if (formation[i]!=undefined){
            if (characterMap[formation[i]]){       //no invalid ids
                team[i]=characterMap[formation[i]];
            }

        }
    }
    return team;
}

hotr.blobOperations.createNewPlayer = function(signedData, userToken, host, callback){
    blobApi.createNewPlayer(signedData, userToken, host, function(blob, token){
        hotr.playerBlob = blob;
        hotr.blobOperations.setAuthToken(token);
        hotr.blobOperations.setHasPlayed();
        callback();
    });
}

hotr.blobOperations.getNewAuthTokenAndBlob = function(signedData, userToken, host, callback){
    blobApi.getNewAuthTokenAndBlob(signedData, userToken, host, function(){
        hotr.playerBlob = blob;
        hotr.setAuthToken(token);
        callback();
    });
}



hotr.blobOperations.getNewAuthToken = function(signedData, userToken, host, callback){
    blobApi.getAuthToken(signedData, userToken, host, callback);
}

hotr.blobOperations.setAuthToken = function(token){
    jc.setLocalStorage(hotr.authTokenLocalStoreKey, token);
}

hotr.blobOperations.getCachedAuthToken = function(){
    return jc.getLocalStorage(hotr.authTokenLocalStoreKey);
}

hotr.blobOperations.hasToken = function(){
    var token = hotr.blobOperations.getCachedAuthToken();
    if (!token){
        return false;
    }
    if (token.expires - Date.now() < 0){
        return false; //token expired
    }
}


hotr.blobOperations.hasPlayed = function(){
    return jc.getLocalStorage(hotr.haveSeenLocalStoreKey)!=undefined;
}

hotr.blobOperations.setHasPlayed=function(){
    jc.setLocalStorage(hotr.haveSeenLocalStoreKey, {"haveSeenMe":true});
}

hotr.blobOperations.getLevel = function(){
    //todo implement me
    return 0;
}

hotr.blobOperations.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}

hotr.blobOperations.indexToId = function(index){
    hotr.blobOperations.validate();
    return hotr.playerBlob.myguys[index].id;
}

hotr.blobOperations.getFormationOrder = function(){
    hotr.blobOperations.validate();
    if (!hotr.playerBlob.formation){
        hotr.playerBlob.formation=[];
    }
    return hotr.playerBlob.formation;
}

hotr.blobOperations.getCurrentFormationPosition = function(id){
    hotr.blobOperations.validate();
    if (!hotr.playerBlob.formation){
        return -1;
    }else{
        return hotr.playerBlob.formation.indexOf(id);
    }
}

hotr.blobOperations.placeCharacterFormation = function(id, cell){
    hotr.blobOperations.validate();
    var characterMap = {};
    _.each(hotr.playerBlob.myguys, function(character){
        characterMap[character.id] = character;
    });

    if (!hotr.playerBlob.formation){
        hotr.playerBlob.formation = [];
    }
    var index = hotr.playerBlob.formation.indexOf(id);
    if (index!=-1){
        hotr.playerBlob.formation[index]=undefined;
    }
    if (characterMap[id]){ //no illegal ids
        hotr.playerBlob.formation[cell]=id;
    }else{
        throw "Id: " + id + " not valid for player";
    }

}

hotr.blobOperations.validate= function(){
    if (!hotr.playerBlob){
        throw "Blob not initialized, call getBlob first.";
    }
}

hotr.blobOperations.getEntryWithId = function(id){
    hotr.blobOperations.validate();
    var entry = _.find(hotr.playerBlob.myguys, function(character){
        return character.id == id;
    });

    if (!entry){
        throw "Could not locate a character with id:"+id;
    }

    return entry;
}

hotr.blobOperations.getCharacterIdsAndTypes = function(){
    hotr.blobOperations.validate();
    return hotr.playerBlob.myguys;
}

hotr.blobOperations.getCharacterNames = function(){
    hotr.blobOperations.validate();
    return _.pluck(hotr.playerBlob.myguys, 'name');
}



//get blob from redis
//persist blob


var CardLayer = jc.UiElementsLayer.extend({
    cells:50,
    cellWidth:undefined,
    init: function(playerBlob, selectDelegate, cancelDelegate) {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(portraitsPlist);
            this.playerBlob = playerBlob;
            this.tableView = new jc.ScrollingLayer();
            this.addChild(this.tableView);
            var sprites = this.getDisplaySprites()
            this.tableView.init({
                sprites:sprites,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this)
            });

            this.name = "CardLayer";
            this.initFromConfig(CardLayerConf.windowConfig);
            this.raiseSelected = selectDelegate;
            this.raiseCancel = cancelDelegate;
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        console.log("onshow");
        var tableSize = this.tableView.getContentSize();
        var pos = this.getAnchorPosition({
                                    "cell":2,
                                    "anchor":['bottom'],
                                    "padding":{
                                        "top":-35
                                    }
                                },tableSize,this);

        pos.x =0;
        this.reorderChild(this.tableView,3);
        this.slide(this.tableView, cc.p(0,-1000),pos);
        this.start();
    },
    onHide:function(){


    },
    onDone:function(){
        //tableview is not in window config, gotta get rid of it ourselves
        this.raiseSelected(this.lastIndex);
        this.slide(this.tableView, this.tableView.getPosition(), cc.p(0,-1000));
        this.done(); //transition everyone out


    },
    outTransitionsComplete:function(){
        jc.layerManager.pop();
    },
    onCancel:function(){
        this.raiseCancel();
        this.slide(this.tableView, this.tableView.getPosition(), cc.p(0,-1000));
        this.done(); //transition everyone out
        jc.layerManager.pop();

    },
    selectionCallback: function(index, sprite){
        //todo: should be a global character list
        this.swapCharacter(this.playerBlob.myguys[index]);
        this.updateStats(this.playerBlob.myguys[index]);
        this.lastIndex = index;
    },
    swapCharacter:function(characterEntry){
        if (this.char){
            var f1 =  cc.FadeOut.create(jc.defaultTransitionTime/4, 0)
            this.nextEntry = characterEntry;
            this.char.runAction(cc.Sequence.create(f1,cc.CallFunc.create(this.displayNewCard.bind(this))))
        }else{
            var portraitFrame = jc.getCharacterPortrait(characterEntry);
            this.char = cc.Sprite.create();
            this.char.initWithSpriteFrameName(portraitFrame);
            this["portraitWindow"].addChild(this.char);

            var pos = this.getAnchorPosition({"cell":5}, this.portraitSprite, this.portraitWindow);
            this.char.setPosition(pos);
        }

    },
    displayNewCard:function(){
        var portraitFrame = jc.getCharacterPortrait(this.nextEntry);
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(portraitFrame);
        this.char.setDisplayFrame(frame);
        var f2 =  cc.FadeIn.create(jc.defaultTransitionTime/4, 255);
        this.char.runAction(f2);
        this.updateStats(this.nextEntry);

    },
    updateStats:function(entry){
        this.labelNameValue.setString(spriteDefs[entry.name].formalName);
        this.labelNameValue.setContentSize(this.labelNameValue.getTexture().getContentSize());
        this.labelDamageValue.setString(spriteDefs[entry.name].gameProperties.damage);
        this.labelLifeValue.setString(spriteDefs[entry.name].gameProperties.MaxHP);
        this.labelSpeedValue.setString(spriteDefs[entry.name].gameProperties.speed);
        var rad = spriteDefs[entry.name].gameProperties.targetRadius;
        if (rad < 0){
            rad = "Hand to Hand";
        }
        this.labelRangeValue.setString(rad);
        var type = jc.getUnitType(spriteDefs[entry.name].unitType).title;
        var element = jc.getElementType(spriteDefs[entry.name].elementType);

        this.labelUnitTypeValue.setString(type);
        this.labelElementTypeValue.setString(element);
        this.labelSpecialValue.setString(spriteDefs[entry.name].special);



    },
    getDisplaySprites: function(){
        var returnme = [];
        for(var i=0;i<this.playerBlob.myguys.length;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("lock.png");
            var pic = jc.getCharacterPortrait(this.playerBlob.myguys[i]);
            sprite.pic = new cc.Sprite();
            sprite.pic.initWithSpriteFrameName(pic);
            sprite.addChild(sprite.pic);
            this.scaleTo(sprite.pic, sprite);
            this.centerThis(sprite.pic, sprite);
            returnme.push(sprite);
        }

        returnme = returnme.concat(this.getEmptyCells(this.cells - this.playerBlob.myguys.length));
        return returnme;
    } ,
    getEmptyCells:function(number){
        var returnme=[];
        for(var i =0;i<number;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("lock.png");
            if (!this.cellWidth){
                this.cellWidth = sprite.getTextureRect().width + 100;
            }
            returnme.push(sprite);
        }
        return returnme;
    },
    targetTouchHandler:function(type, touch, sprites){

    }
});



var CardLayerConf={};
CardLayerConf.font = "Helvetica";
CardLayerConf.fontSize = 12.0;
CardLayerConf.color = cc.c4f(255.0/255.0, 255.0/255.0, 255.0/255.0, 1.0);
CardLayerConf.labelWidth = 75;
CardLayerConf.labelValueWidth = 175;
CardLayerConf.labelHeight = 15;

CardLayerConf.windowConfig={
    "scrollFrame":{
        "cell":1,
        "type":"scale9",
        "anchor":['left'],
        "transitionIn":"bottom",
        "transitionOut":"bottom",
        "size":{ "width":100, "height":20},
        "scaleRect":jc.UiConf.frame19Rect,
        "sprite":"frame 19.png",
        "padding":{
            "top":7
        },
        "z":0
    },
    "portraitFrame":{
        "cell":7,
        "anchor":['top','left'],
        "type":"scale9",
        "transitionIn":"right",
        "transitionOut":"right",
        "scaleRect":jc.UiConf.frame19Rect,
        "size":{ "width":100, "height":80},
        "sprite":"frame 19.png",
        "padding":{
            "left":-7
        },
        "kids":{
            "decor":{
                "cell":7,
                "anchor":['top','left'],
                "type":"sprite",
                "transitionIn":"top",
                "transitionOut":"top",
                "sprite":"decor.png",
                "padding":{
                    "left":-50
                },
                "z":5,
                "scale":70
            },
            "portraitWindow":{
                "cell":7,
                "anchor":['top', 'left'],
                "type":"scale9",
                "transitionIn":"top",
                "transitionOut":"top",
                "size":{"width":35, "height":60},
                "scaleRect":jc.UiConf.frame20Rect,
                "sprite":"frame 20.png",
                "padding":{
                    "top":40,
                    "left":35
                }
            },
            "stats":{
                "isGroup":true,
                "type":"grid",
                "cell":8,
                "cols":2,
                "size":{ "width":33, "height":CardLayerConf.labelHeight},
                "padding":{
                    "top":10,
                    "left":5

                },
                "members":[
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"lableName",
                        "text":"Name:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelNameValue",
                        "text":"Joe is cool",
                        "width":CardLayerConf.labelValueWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelDamage",
                        "text":"Damage:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelDamageValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelLife",
                        "text":"Life:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelLifeValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpeed",
                        "text":"Speed:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpeedValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelRange",
                        "text":"Range:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelRangeValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelUnitType",
                        "text":"Unit Type:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelUnitTypeValue",
                        "text":"10",
                        "width":CardLayerConf.labelValueWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelElementType",
                        "text":"Element:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelElementTypeValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpecial",
                        "text":"Special:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpecialValue",
                        "text":"10",
                        "width":CardLayerConf.labelValueWidth,
                        "height":CardLayerConf.labelHeight
                    }



                ]
            },
            "doneCancel":{
                "isGroup":true,
                "type":"line",
                "cell":2,
                "size":{ "width":33, "height":CardLayerConf.labelHeight},
                "anchor":['right'],
                "padding":{
                    "left":80,
                    "top":0
                },
                "members":[
                    {
                        "type":"button",
                        "main":"check.png",
                        "pressed":"check1.png",
                        "touchDelegateName":"onDone"
                    },
                    {
                        "type":"button",
                        "main":"close.png",
                        "pressed":"close1.png",
                        "touchDelegateName":"onCancel"
                    }
                ]
            }
        }
    }
}








/**
 * Kik Cards v0.11.0
 * Copyright (c) 2013 Kik Interactive, http://kik.com
 * All rights reserved
 * http://cards.kik.com/terms.html
 *
 * classList.js: Cross-browser full element.classList implementation.
 * By Eli Grey, http://eligrey.com
 * Public Domain
 * No warranty expressed or implied. Use at your own risk.
*/
(function(a){var b={};b.enabled=false;b.version="0.11.0";b._={};a.cards=b})(window);(function(){if(!Object.keys){Object.keys=function(c){var b=[];for(var a in c){b.push(a)}return b}}if(!Array.isArray){Array.isArray=function(a){return Object.prototype.toString.call(a)=="[object Array]"}}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c,d){for(var b=d||0,a=this.length;b<a;b++){if((b in this)&&(this[b]===c)){return b}}return -1}}if(!Array.prototype.forEach){Array.prototype.forEach=function(d,b){for(var c=0,a=this.length;c<a;c++){if(c in this){d.call(b,this[c],c,this)}}}}if(!Array.prototype.map){Array.prototype.map=function(e,b){var a=this.length,c=new Array(a);for(var d=0;d<a;d++){if(d in this){c[d]=e.call(b,this[d],d,this)}}return c}}if(!Array.prototype.filter){Array.prototype.filter=function(e,c){var b=[];for(var f,d=0,a=this.length;d<a;d++){f=this[d];if((d in this)&&e.call(c,f,d,this)){b.push(f)}}return b}}if(!Array.prototype.reduce){Array.prototype.reduce=function(c,d){var b=0,a=this.length;if(typeof d=="undefined"){d=this[0];b=1}for(;b<a;b++){if(b in this){d=c(d,this[b],b,this)}}return d}}if(!String.prototype.trim){String.prototype.trim=function(){var a=/^\s+|\s+$/g;return function(){return String(this).replace(a,"")}}()}})();if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(s){var B="classList",w="prototype",p=(s.HTMLElement||s.Element)[w],A=Object,r=String[w].trim||function(){return this.replace(/^\s+|\s+$/g,"")},z=Array[w].indexOf||function(a){var b=0,c=this.length;for(;b<c;b++){if(b in this&&this[b]===a){return b}}return -1},o=function(b,a){this.name=b;this.code=DOMException[b];this.message=a},v=function(a,b){if(b===""){throw new o("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(b)){throw new o("INVALID_CHARACTER_ERR","String contains an invalid character")}return z.call(a,b)},y=function(a){var b=r.call(a.className),c=b?b.split(/\s+/):[],d=0,e=c.length;for(;d<e;d++){this.push(c[d])}this._updateClassName=function(){a.className=this.toString()}},x=y[w]=[],t=function(){return new y(this)};o[w]=Error[w];x.item=function(a){return this[a]||null};x.contains=function(a){a+="";return v(this,a)!==-1};x.add=function(a){a+="";if(v(this,a)===-1){this.push(a);this._updateClassName()}};x.remove=function(a){a+="";var b=v(this,a);if(b!==-1){this.splice(b,1);this._updateClassName()}};x.toggle=function(a){a+="";if(v(this,a)===-1){this.add(a)}else{this.remove(a)}};x.toString=function(){return this.join(" ")};if(A.defineProperty){var q={get:t,enumerable:true,configurable:true};try{A.defineProperty(p,B,q)}catch(u){if(u.number===-2146823252){q.enumerable=false;A.defineProperty(p,B,q)}}}else{if(A[w].__defineGetter__){p.__defineGetter__(B,t)}}}(self))}(function(f,h,d){var j=false,g=[];c();d._.onLog=i;function i(k){if(typeof k!=="function"){throw TypeError("log listener must be a function, got "+k)}g.push(k)}function e(l,k){if(j){return}j=true;g.forEach(function(n){try{n(l,k)}catch(m){}});j=false}function c(){var k=f.console;if(typeof k!=="object"){k={}}k.log=b(k.log,"log");k.warn=b(k.warn,"warn");k.error=b(k.error,"error");a();f.console=k}function b(k,l){switch(typeof k){case"undefined":k=function(){};case"function":break;default:return k}return function(){var m=Array.prototype.map.call(arguments,function(n){if((typeof n==="object")&&(n!==null)&&f.JSON&&JSON.stringify){try{return JSON.stringify(n)}catch(o){}}return n+""}).join(" ");e(l,m);k.apply(this,arguments)}}function a(){if(!f.addEventListener){return}f.addEventListener("error",function(k){e("exception",k.message+"")},false)}})(window,document,cards);(function(d,a,c){var b={};c.utils=b;b.error=function(e){if(d.console&&d.console.error){if((typeof e==="object")&&e.stack){d.console.error(e.stack)}else{d.console.error(e+"")}}};b.platform={};b.platform.os=function(){var h=d.navigator.userAgent,g,f,e;if((e=/\bCPU.*OS (\d+(_\d+)?)/i.exec(h))){g="ios";f=e[1].replace("_",".")}else{if((e=/\bAndroid (\d+(\.\d+)?)/.exec(h))){g="android";f=e[1]}else{if((e=/\bWindows Phone OS (\d+(\.\d+)?)/.exec(h))){g="winphone";f=e[1]}else{if((e=/\bMac OS X (\d+(_\d+)?)/.exec(h))){g="osx";f=e[1].replace("_",".")}else{if((e=/\bWindows NT (\d+(.\d+)?)/.exec(h))){g="windows";f=e[1]}else{if((e=/\bLinux\b/.exec(h))){g="linux";f=null}else{if((e=/\b(Free|Net|Open)BSD\b/.exec(h))){g="bsd";f=null}}}}}}}var i={name:g,version:f&&d.parseFloat(f),versionString:f};i[g]=true;return i}();b.os=b.platform.os;b.platform.browser=function(){var h=d.navigator.userAgent,g,f,e;if((e=/\bMSIE (\d+(\.\d+)?)/i.exec(h))){g="msie";f=e[1]}else{if((e=/\bOpera\/(\d+(\.\d+)?)/i.exec(h))){g="opera";f=e[1];if((e=/\bVersion\/(\d+(\.\d+)?)/i.exec(h))){f=e[1]}}else{if((e=/\bChrome\/(\d+(\.\d+)?)/i.exec(h))){g="chrome";f=e[1]}else{if((h.indexOf("Safari/")!=-1)&&(e=/\bVersion\/(\d+(\.\d+)?)/i.exec(h))){if(b.platform.os.android){g="android"}else{g="safari"}f=e[1]}else{if((e=/\bFirefox\/(\d+(\.\d+)?)/i.exec(h))){g="firefox";f=e[1]}}}}}var i={name:g,version:f&&d.parseFloat(f),versionString:f};i[g]=true;return i}();b.browser=b.platform.browser;b.platform.engine=function(){var h=d.navigator.userAgent,g,f,e;if((e=/\bTrident\/(\d+(\.\d+)?)/i.exec(h))){g="trident";f=e[1]}else{if((e=/\bMSIE 7/i.exec(h))){g="trident";f="3.1"}else{if((e=/\bPresto\/(\d+(\.\d+)?)/i.exec(h))){g="presto";f=e[1]}else{if((e=/\bAppleWebKit\/(\d+(\.\d+)?)/i.exec(h))){g="webkit";f=e[1]}else{if((e=/\brv\:(\d+(\.\d+)?)/i.exec(h))){g="gecko";f=e[1]}}}}}var i={name:g,version:f&&d.parseFloat(f),versionString:f};i[g]=true;return i}();b.engine=b.platform.engine;b.random={};b.random.name=function(e){return("____"+(e||"")+"____"+Math.random()).replace(/\.|\-/g,"")};b.random.num=function(){return Math.floor((Math.random()*18014398509481984)-9007199254740992)};b.random.uuid=function(){var e=36,g=new Array(e),h="0123456789abcdef",f;for(f=0;f<e;f++){g[f]=Math.floor(Math.random()*16)}g[14]=4;g[19]=(g[19]&3)|8;for(f=0;f<e;f++){g[f]=h[g[f]]}g[8]=g[13]=g[18]=g[23]="-";return g.join("")};b.enumerate=function(f){if(typeof f!=="object"){f=Array.prototype.slice.call(arguments)}var h={};for(var g=0,e=f.length;g<e;g++){h[f[g]]=g}return h};b.preloadImage=function(){var f={};return e;function e(){var h=arguments;cards.ready(function(){g.apply(b,h)})}function g(j,l){if(typeof j!="string"){b.asyncJoin(j.map(function(m){return function(n){b.preloadImage(m,n)}}),l||function(){});return}if(f[j]===true){if(l){setTimeout(function(){l(true)},0)}return}else{if(f[j]){f[j].push(l);return}}f[j]=[l];var h=false;function k(o){if(h){return}h=true;var q=f[j];f[j]=o;for(var n,p=0,m=q.length;p<m;p++){n=q[p];if(n){n(o)}}}var i=new Image();i.onload=function(){k(true)};i.onerror=function(){k(false)};i.src=j}}();b.url={};b.url.dir=function(){var e=/\/[^\/]*$/;return function(f){switch(typeof f){case"undefined":f=d.location.href;case"string":break;default:throw TypeError("url "+f+" must be string if defined")}f=((f.split("?")[0]||"").split("#")[0]||"");return f.replace(e,"/")}}();b.url.host=function(){var e=/^https?\:\/\/([^\/]+)\/.*$/;return function(g){switch(typeof g){case"undefined":return d.location.host;case"string":break;default:throw TypeError("url "+g+" must be string if defined")}var f=e.exec(g);return f&&f[1]}}();b.url.path=function(){var e=/^https?\:\/\/[^\/]+(\/.*)$/;return function(g){switch(typeof g){case"undefined":return d.location.pathname;case"string":break;default:throw TypeError("url "+g+" must be string if defined")}var f=e.exec(g);return f&&f[1]}}();b.url.dataToQuery=function(){var e=/%20/g;return function(k){var h=[],j,f,i;for(var g in k){j=k[g];if((j!==null)&&(j!==undefined)){f=encodeURIComponent(g);i=encodeURIComponent(j);h.push(f+"="+i)}}return h.join("&").replace(e,"+")}}();b.url.queryToData=function(){var f=/([^&=]+)=([^&]+)/g,e=/\+/g;return function(k){var h={},g,i,j;if(k){k=k.replace(e,"%20");while((g=f.exec(k))){i=decodeURIComponent(g[1]);j=decodeURIComponent(g[2]);h[i]=j}}return h}}();b.url.withQuery=function(e,f){if(!f){f=e;e=d.location.href}e=e.split("?")[0];var g=b.url.dataToQuery(f);if(g){e+="?"+g}return e};b.url.updateQuery=function(e,f){if(!f){f=e;e=d.location.href}var g=b.url.parseQuery(e);b.obj.extend(g,f);return b.url.withQuery(e,g)};b.url.parseQuery=function(e){e=e||d.location.href;return b.url.queryToData(e.split("?")[1])};b.url.query=b.url.parseQuery();b.jsonp=function(s){var q=false,l=function(){},h=b.random.name("PICARD_UTILS_JSONP_CALLBACK"),e=s.url,i=b.obj.copy(s.data),m=s.callbackName||"callback",p=s.callback||l,f=s.success||l,j=s.error||l,o=s.complete||l,r=a.getElementsByTagName("script")[0],k=a.createElement("script");i[m]="window."+h;k.type="text/javascript";k.async=true;k.onerror=g;k.src=b.url.updateQuery(e,i);function n(){d[h]=l;try{r.parentNode.removeChild(k)}catch(t){}}function g(){if(q){return}n();p=l;f=l;j();j=l;o();o=l}d[h]=function(){q=true;n();p.apply(this,arguments);p=l;f.apply(this,arguments);f=l;j=l;o();o=l};if(s.timeout){setTimeout(g,s.timeout)}r.parentNode.insertBefore(k,r)};b.asyncJoin=function(e,k){var g=true;if(!Array.isArray(e)){g=false;e=Array.prototype.slice.call(arguments);k=e.pop()}var f=false,j=e.length,i=new Array(j);if(j===0){h();return}e.forEach(function(m,l){setTimeout(function(){var n=false;m(function(){if(n){return}n=true;if(i[l]){return}var o=Array.prototype.slice.call(arguments);i[l]=o;j--;h()})},0)});function h(){if((j!==0)||f){return}f=true;setTimeout(function(){if(g){k.call(d,i)}else{k.apply(d,i)}},0)}};b.obj={};b.obj.extend=function(g,f){for(var e in f){val1=g[e];val2=f[e];if(val1!==val2){g[e]=val2}}return g};b.obj.copy=function(e){return b.obj.extend({},e)};b.obj.forEach=function(g,h,e){for(var f in g){h.call(e,f,g[f],g)}};b.obj.inverse=function(g){var e={};for(var f in g){e[g[f]]=f}return e};b.obj.values=function(g){var e=[];for(var f in g){e.push(g[f])}return e};b.obj.has=function(g,f){for(var e in g){if(g[e]===f){return true}}return false};b.windowReady=function(f){if(a.readyState==="complete"){setTimeout(function(){f()},0);return}d.addEventListener("load",e,false);function e(){d.removeEventListener("load",e);setTimeout(function(){f()},0)}};b.ready=function(){var g=false,f=[];function h(){if(g){return}g=true;for(var k;(k=f.shift());){try{k()}catch(j){b.error(j)}}}function e(k){try{a.documentElement.doScroll("left")}catch(j){setTimeout(function(){e(k)},1);return}if(k){k()}}function i(l){if(a.readyState==="complete"){setTimeout(l,0);return}if(a.addEventListener){a.addEventListener("DOMContentLoaded",l,false);d.addEventListener("load",l,false)}else{if(a.attachEvent){a.attachEvent("onreadystatechange",l);d.attachEvent("onload",l);var j=false;try{j=(d.frameElement===null)}catch(k){}if(a.documentElement.doScroll&&j){setTimeout(function(){e(l)},0)}}}}i(h);return function(j){if(typeof j!=="function"){throw TypeError("callback "+j+" must be a function")}if(g){setTimeout(function(){j()},0)}else{f.push(j)}}}()})(window,document,cards);(function(f,a,e){e.events=d;e.events.handlers=g;function b(){this.handlers={};this.onceHandlers={};this.globalHandlers=[];this.globalOnceHandlers=[]}b.prototype.insureNamespace=function(i){if(!this.handlers[i]){this.handlers[i]=[]}if(!this.onceHandlers[i]){this.onceHandlers[i]=[]}};b.prototype.bind=function(i,j){this.insureNamespace(i);this.handlers[i].push(j)};b.prototype.bindToAll=function(i){this.globalHandlers.push(i)};b.prototype.bindOnce=function(i,j){this.insureNamespace(i);this.onceHandlers[i].push(j)};b.prototype.bindToAllOnce=function(i){this.globalOnceHandlers.push(i)};b.prototype.unbind=function(i,j){this.insureNamespace(i);h(this.handlers[i],j);h(this.onceHandlers[i],j)};b.prototype.unbindFromAll=function(j){h(this.globalHandlers,j);h(this.globalOnceHandlers,j);for(var i in this.handlers){h(this.handlers[i],j);h(this.onceHandlers[i],j)}};b.prototype.trigger=function(j,k,i){this.insureNamespace(j);if(typeof i==="undefined"){i=this}function l(m){try{m.call(i,k,j)}catch(n){e.utils.error(n)}}this.handlers[j].forEach(l);this.globalHandlers.forEach(l);this.onceHandlers[j].forEach(l);this.globalOnceHandlers.forEach(l);this.onceHandlers[j].splice(0);this.globalOnceHandlers.splice(0)};function h(j,l){for(var k=j.length;k--;){if(j[k]===l){j.splice(k,1)}}}function d(j){if(typeof j==="undefined"){j={}}var i=new b();j.on=function(k,l){if(Array.isArray(k)){k.forEach(function(m){j.on(m,l)});return}if(typeof l==="undefined"){l=k;k=""}if(typeof k!=="string"){throw TypeError("name "+k+" must be a string")}if(typeof l!=="function"){throw TypeError("handler "+l+" must be a function")}if(k){i.bind(k,l)}else{i.bindToAll(l)}};j.off=function(k,l){if(Array.isArray(k)){k.forEach(function(m){j.off(m,l)});return}if(typeof l==="undefined"){l=k;k=""}if(typeof k!=="string"){throw TypeError("name "+k+" must be a string")}if(typeof l!=="function"){throw TypeError("handler "+l+" must be a function")}if(k){i.unbind(k,l)}else{i.unbindFromAll(l)}};j.once=function(k,l){if(Array.isArray(k)){k.forEach(function(m){j.once(m,l)});return}if(typeof l==="undefined"){l=k;k=""}if(typeof k!=="string"){throw TypeError("name "+k+" must be a string")}if(typeof l!=="function"){throw TypeError("handler "+l+" must be a function")}if(k){i.bindOnce(k,l)}else{i.bindToAllOnce(l)}};j.trigger=function(l,m,k){if(Array.isArray(l)){l.forEach(function(n){j.trigger(n,m,k)});return}if(typeof l!=="string"){throw TypeError("name "+l+" must be a string")}i.trigger(l,m,k)};return j}function c(){this.handlers=[];this.events=[]}c.prototype.addHandler=function(i){this.handlers.push(i);return this.processEvents()};c.prototype.triggerEvent=function(i){this.events.push(i);this.processEvents()};c.prototype.triggerEvents=function(i){this.events=this.events.concat(i);this.processEvents()};c.prototype.processEvents=function(){if(!this.events.length||!this.handlers.length){return}var j=this.events.splice(0),i=this.handlers;j.forEach(function(k){i.forEach(function(l){l(k)})});return true};function g(){var i=new c();return{handler:function(j){return i.addHandler(j)},trigger:function(j){i.triggerEvent(j)},triggerMulti:function(j){i.triggerEvents(j)}}}})(window,document,cards);cards.ready=function(d,e){var b=[];a();return c;function c(g){if(b){b.push(g)}else{f(g)}}function a(){e.utils.windowReady(function(){setTimeout(function(){var g=b.slice();b=null;g.forEach(f)},3)})}function f(h){try{h()}catch(g){e.utils.error(g)}}}(window,cards);cards.open=function(c,f){var e=f.utils.platform.os,a=f.utils.platform.browser;c.open=function(g){d(g)};d.card=b;return d;function d(i,h){if(typeof i!=="string"){throw TypeError("url must be a string, got "+i)}switch(typeof h){case"object":h=JSON.stringify(h);case"undefined":case"string":break;default:throw TypeError("linkData must be a string of JSON if defined, got "+h)}if(f.browser&&f.browser.open){f.browser.open(i,h);return}if(h){i=i.split("#")[0]+"#"+encodeURIComponent(h)}var g=i.substr(0,7)==="card://",j=i.substr(0,8)==="cards://";if(!g&&!j){c.location.href=i;return}b(i,"http"+i.substr(4))}function b(i,g,h){if(!e.ios&&!e.android){if(g){c.location.href=g}return}if(e.ios||a.chrome){if(g){setTimeout(function(){if(!document.webkitHidden){c.location.href=g}},e.ios?25:1000)}if(h){f.ready(function(){setTimeout(function(){c.location.href=i},0)})}else{c.location.href=i}return}var k;if(g){k=setTimeout(function(){c.location=g},1000)}var j=document.createElement("iframe");j.style.position="fixed";j.style.top="0";j.style.left="0";j.style.width="1px";j.style.height="1px";j.style.border="none";j.style.opacity="0";j.onload=function(){if(g){clearTimeout(k)}try{document.documentElement.removeChild(j)}catch(l){}};j.src=i;document.documentElement.appendChild(j)}}(window,cards);(function(b,c){var a="__PICARD_ID__";if(!b.localStorage){return}if(!b.localStorage[a]){b.localStorage[a]=c.utils.random.uuid()}c._.id=b.localStorage[a]})(window,cards);(function(b,a){if(navigator.userAgent.indexOf("Kik/")===-1){return}if(!/\bandroid/i.test(navigator.userAgent)){return}if(!a||b.CardsBridge){return}var c=b.CardsBridge={};["invokeAsyncFunction","invokeFunction","poll"].forEach(function(d){c[d]=function(){var e=Array.prototype.slice.call(arguments);e.unshift(d);return a("CardsBridge",JSON.stringify(e))||""}})})(window,window.prompt);(function(window){if(!window.chrome){return}if(!window.chrome.app){return}if(window.shimsham){return}var shimshamMeta=document.getElementById("shimsham-meta");if(shimshamMeta&&(shimshamMeta.nodeName==="META")){var url=shimshamMeta.content;try{var xhr=new XMLHttpRequest();xhr.open("GET",url,false);xhr.send(null);if(xhr.status===200){eval(xhr.responseText)}else{console.log("Failed to load shimsham, extension not installed get it at cards.kik.com")}}catch(e){}}})(window);(function(window,document,picard){var BRIDGE_SIGNAL_URL=window.location.protocol+"//cardsbridge.kik.com/",PLUGIN_REQUEST_BATCH="batch-call",PLUGIN_REQUEST_NAME="requestPlugin",PLUGIN_REQUEST_VERSION="requestVersion",PLUGIN_LOG="log";var plugins={},os=picard.utils.platform.os,androidBridge=window.CardsBridge;function getBridge(){var bridgeInfo=getAndroidBridge();if(bridgeInfo){return bridgeInfo}if(os.ios&&!looksLikeChrome()){return getIPhoneBridge()}return false}function looksLikeChrome(){try{return(typeof window.chrome.send==="function")}catch(err){return false}}function getAndroidBridge(){if(!androidBridge){return false}if(typeof androidBridge.invokeFunction!=="function"){return false}if(typeof androidBridge.poll!=="function"){return false}return makeBridgeCall(PLUGIN_REQUEST_VERSION).data}function getIPhoneBridge(){var bridgeInfo;try{bridgeInfo=makeBridgeCall(PLUGIN_REQUEST_VERSION).data}catch(err){}return bridgeInfo?bridgeInfo:false}function sendIFrameSignal(bridgeFunctionName,argData,asyncCallbackName){var callbackName=picard.utils.random.name("PICARD_BRIDGE_CALLBACK"),status,data;window[callbackName]=function(callbackStatus,callbackData){delete window[callbackName];status=callbackStatus;data=callbackData};var url=BRIDGE_SIGNAL_URL+bridgeFunctionName+"/"+callbackName+"?args="+encodeURIComponent(argData)+"&async="+(asyncCallbackName||"");var doc=document.documentElement,iframe=document.createElement("iframe");iframe.style.display="none";iframe.src=url;doc.appendChild(iframe);doc.removeChild(iframe);if(window[callbackName]){delete window[callbackName];throw Error("bridge call "+bridgeFunctionName+" failed to return")}return{status:status,data:data}}function sendBatchIFrameSignal(urls){var calls=urls.map(function(url){return encodeURIComponent(url)}).join(",");var url=BRIDGE_SIGNAL_URL+PLUGIN_REQUEST_BATCH+"?calls="+calls;var doc=document.documentElement,iframe=document.createElement("iframe");iframe.style.display="none";iframe.src=url;doc.appendChild(iframe);doc.removeChild(iframe)}function androidBridgeCall(bridgeFunctionName,argData,asyncCallbackName){var response,result;if(!asyncCallbackName){response=androidBridge.invokeFunction(bridgeFunctionName,argData)}else{if(androidBridge.invokeAsyncFunction){response=androidBridge.invokeAsyncFunction(bridgeFunctionName,argData,asyncCallbackName)}else{throw TypeError("bridge: android bridge does not support async callbacks")}}try{result=JSON.parse(response)}catch(err){throw TypeError("bridge call for "+bridgeFunctionName+" responded with invalid JSON")}return{status:result.status,data:result.data}}function makeBridgeCall(bridgeFunctionName,args,asyncCallback){if(typeof bridgeFunctionName!=="string"){throw TypeError("bridge call "+bridgeFunctionName+" must be a string")}switch(typeof args){case"function":asyncCallback=args;args=undefined;case"undefined":args={};case"object":break;default:throw TypeError("bridge call arguments "+args+" must be a JSON object if specified")}switch(typeof asyncCallback){case"undefined":case"function":break;default:throw TypeError("bridge async callback must be a function if defined, got "+asyncCallback)}var argData;try{argData=JSON.stringify(args)}catch(err){throw TypeError("bridge call arguments "+args+" must be a JSON object")}var asyncCallbackName;if(asyncCallback){asyncCallbackName=setupAsyncCallback(asyncCallback)}var result;if(androidBridge){result=androidBridgeCall(bridgeFunctionName,argData,asyncCallbackName)}else{result=sendIFrameSignal(bridgeFunctionName,argData,asyncCallbackName)}if(asyncCallbackName&&(!result||!result.status||(result.status!==202))){setTimeout(function(){if(!window[asyncCallbackName]){return}if(androidBridge){window[asyncCallbackName](JSON.stringify({status:500,data:null}))}else{window[asyncCallbackName](500,null)}},0);result={status:202,data:{}}}return result}function setupAsyncCallback(asyncCallback){var callbackName=picard.utils.random.name("PICARD_BRIDGE_ASYNC_CALLBACK");window[callbackName]=function(status,data){delete window[callbackName];if(androidBridge){try{var response=JSON.parse(status);status=response.status;data=response.data}catch(err){throw Error("bridge failed to parse android async data, "+status)}}if((typeof data!=="object")||(data===null)){asyncCallback()}else{if(!status||(status<200)||(status>=300)){asyncCallback()}else{asyncCallback(data)}}};return callbackName}function setupEventCallback(eventCallback){var callbackName=picard.utils.random.name("PICARD_BRIDGE_EVENT_CALLBACK");window[callbackName]=function(name,data){if(androidBridge){try{data=JSON.parse(data)}catch(err){throw Error("bridge failed to parse android event data, "+data)}}eventCallback(name,data)};return callbackName}function setupAndroidPoll(){window.addEventListener("keyup",function(e){if(e.which!==0){return}performAndroidPoll();return false})}function performAndroidPoll(){var result=androidBridge.poll();if(!result){return}var code=result+"";if(!code){return}try{eval(code)}catch(err){if(window.console&&window.console.error){window.console.error("android poll failed to evaluate "+code+", "+err)}}performAndroidPoll()}function setupIOSLogging(){picard._.onLog(function(level,message){try{makeBridgeCall(PLUGIN_LOG,{level:level,message:message})}catch(err){}})}function bridgeFunctionCall(bridgeFunctionName,args,callback){var data=makeBridgeCall(bridgeFunctionName,args,callback);if(!data){throw Error("bridge call "+bridgeFunctionName+" did not return")}if(!data.status||(data.status<200)||(data.status>=300)){throw Error("bridge call "+bridgeFunctionName+" did not complete successfully, "+data.status)}if(typeof data.data!=="object"){throw TypeError("bridge call "+bridgeFunctionName+" did not return an object, "+data.data)}return data.data}function setupFunction(bridgeFunctionName){return function(args,callback){return bridgeFunctionCall(bridgeFunctionName,args,callback)}}function setupFunctions(namespace,functionNames,pluginObj){if(!Array.isArray(functionNames)){throw TypeError("functions "+functionNames+" must be an array")}if(typeof pluginObj==="undefined"){pluginObj={}}functionNames.forEach(function(functionName){if(typeof functionName!=="string"){throw TypeError("function "+functionName+" must be a string")}pluginObj[functionName]=setupFunction(namespace+"."+functionName)})}function setupPlugin(pluginName){var pluginObj=picard.events(),pluginData=makeBridgeCall(PLUGIN_REQUEST_NAME,{name:pluginName,eventCallback:setupEventCallback(pluginObj.trigger)});if(pluginData.status!==200){throw TypeError("plugin "+pluginName+" failed to initialize")}setupFunctions(pluginName,pluginData.data.functions,pluginObj);return pluginObj}function bridge(pluginName){if(typeof pluginName!=="string"){throw TypeError("plugin name must be a string, got "+pluginName)}if(!plugins[pluginName]){var plugin=setupPlugin(pluginName);plugins[pluginName]=plugin}return plugins[pluginName]}function batchRequest(calls){if(!Array.isArray(calls)){throw TypeError("batch calls must be an array, got "+calls)}calls.forEach(function(data){if(typeof data!=="object"){throw TypeError("batch call must be an object, got "+data)}if(typeof data.name!=="string"){throw TypeError("batch call name must be a string, got "+data.name)}switch(typeof data.args){case"undefined":case"object":break;default:throw TypeError("batch call args must be an object if defined, got "+data.args)}switch(typeof data.callback){case"function":case"undefined":break;default:throw TypeError("batch call callback must be a function if defined, got "+data.callback)}});if(androidBridge){return calls.map(function(data){try{if(data.name.indexOf(".")===-1){return bridge(data.name)}else{return bridgeFunctionCall(data.name,data.args,data.callback)}}catch(err){}})}var batchCalls=[],responses=new Array(calls.length);calls.forEach(function(data,index){var isPluginRequest=(data.name.indexOf(".")===-1);if(!isPluginRequest){batchCalls.push(generateBatchSegment(data,function(responseData){responses[index]=responseData}))}else{if(plugins[data.name]){responses[index]=plugins[data.name]}else{batchCalls.push(generatePluginBatchSegment(data,function(responseData){responses[index]=responseData}))}}});sendBatchIFrameSignal(batchCalls);return responses}function generateBatchSegment(data,callback){var argData=JSON.stringify(data.args);var asyncCallbackName;if(data.callback){asyncCallbackName=setupAsyncCallback(data.callback)}var callbackName=picard.utils.random.name("PICARD_BRIDGE_CALLBACK");setTimeout(function(){delete window[callbackName]},0);window[callbackName]=function(callbackStatus,callbackData){delete window[callbackName];if(asyncCallbackName&&callbackStatus!==202){delete window[asyncCallbackName]}if(callbackStatus>=200&&callbackStatus<300){callback(callbackData)}};var url=BRIDGE_SIGNAL_URL+data.name+"/"+callbackName+"?args="+encodeURIComponent(argData)+"&async="+(asyncCallbackName||"");return url}function generatePluginBatchSegment(data,callback){var pluginObj=picard.events(),argData=JSON.stringify({name:data.name,eventCallback:setupEventCallback(pluginObj.trigger)});var callbackName=picard.utils.random.name("PICARD_BRIDGE_CALLBACK");setTimeout(function(){delete window[callbackName]},0);window[callbackName]=function(callbackStatus,callbackData){delete window[callbackName];if(callbackStatus===200){setupFunctions(data.name,callbackData.functions,pluginObj);plugins[data.name]=pluginObj;callback(pluginObj)}};var url=BRIDGE_SIGNAL_URL+PLUGIN_REQUEST_NAME+"/"+callbackName+"?args="+encodeURIComponent(argData)+"&async=";return url}function redirectToCards(){var os=picard.utils.platform.os,urllib=picard.utils.url;if(!urllib.query.kikme||(!os.ios&&!os.android)){return}try{var iframe=document.createElement("iframe");iframe.src="card"+urllib.updateQuery({kikme:null}).substr(4);iframe.style.display="none";var cleanup=function(){try{document.documentElement.removeChild(iframe)}catch(err){}};iframe.onload=cleanup;iframe.onerror=cleanup;setTimeout(cleanup,1000);document.documentElement.appendChild(iframe)}catch(err){}}function main(){var bridgeInfo=getBridge();if(!bridgeInfo){redirectToCards();return}picard._.bridge=bridge;picard._.bridge.batch=batchRequest;if(androidBridge){setupAndroidPoll();picard._.bridge.forceAndroidPoll=performAndroidPoll}else{setupIOSLogging()}picard.enabled=true;bridge.info=bridgeInfo;bridge.version=bridgeInfo.version;picard.utils.platform.browser.name="cards";picard.utils.platform.browser.cards=true;picard.utils.platform.browser.version=window.parseFloat(bridge.version);picard.utils.platform.browser.versionString=bridge.version}main()})(window,document,cards);(function(b,g){var c="kik-transform-fix";if(a()){d()}function a(){var h=true;if(!g.enabled){h=false}else{if(!g.utils.platform.os.android){h=false}else{Array.prototype.forEach.call(b.getElementsByTagName("meta"),function(i){if((i.name===c)&&(i.content==="false")){h=false}})}}return h}function d(){var h=b.documentElement;e(h,"translate3d(0,0,0)");setTimeout(function(){f(h,"transform 10ms linear");setTimeout(function(){e(h,"translate3d(0,0,1px)");setTimeout(function(){f(h,"");setTimeout(function(){e(h,"")},0)},10)},0)},0)}function e(i,h){i.style["-webkit-transform"]=h;i.style["-moz-transform"]=h;i.style["-ms-transform"]=h;i.style["-o-transform"]=h;i.style.transform=h}function f(h,i){if(i){h.style["-webkit-transition"]="-webkit-"+i;h.style["-moz-transition"]="-moz-"+i;h.style["-ms-transition"]="-ms-"+i;h.style["-o-transition"]="-o-"+i;h.style.transition=i}else{h.style["-webkit-transition"]="";h.style["-moz-transition"]="";h.style["-ms-transition"]="";h.style["-o-transition"]="";h.style.transition=""}}})(document,cards);(function(){try{var a=document.querySelector('meta[name="viewport"]');if(cards.enabled&&a&&/\bipad\b/i.test(navigator.userAgent)){a.setAttribute("content","initial-scale=1.0, maximum-scale=1.0, user-scalable=no")}}catch(b){}})();(function(c,a,b){if(b._.bridge){c.alert=function(){};c.confirm=function(){};c.prompt=function(){}}})(window,document,cards);(function(c,a,e){var d=e.utils.platform.os,b=e.utils.platform.browser;if(c.navigator&&b.cards&&(b.version<6.7)&&d.android){c.navigator.geolocation=undefined}})(window,document,cards);(function(d){var b={};d._.firstBatch=b;if(!d._.bridge||!d.utils.platform.os.ios||(d.utils.platform.browser.version<6.5)){return}var a=[{name:"Metrics"},{name:"Browser"},{name:"Media"},{name:"Kik"},{name:"Profile"},{name:"UserData"},{name:"Auth"},{name:"Photo"},{name:"Keyboard"},{name:"Push"},{name:"Picker"}];var c=[{name:"Browser.getLastLinkData",args:{}},{name:"Browser.isPopupMode",args:{}},{name:"Kik.getLastMessage",args:{}},{name:"Push.getNotificationList",args:{}},{name:"Picker.getRequest",args:{}}];d._.bridge.batch(a.concat(c)).slice(a.length).forEach(function(e,g){var f=c[g];b[f.name]=e;if(!e){}else{if(!d._.secondBatch){d._.secondBatch=[]}}})})(cards);(function(i,a){var f;try{f=a._.bridge("Metrics")}catch(e){}var k=a.events(),h=[];a.metrics=k;k.loadTime=null;k.coverTime=null;if(f){f.on("loadData",function(o){if(typeof o.loadTime==="number"){k.loadTime=o.loadTime;k.trigger("loadTime",o.loadTime)}if(typeof o.coverTime==="number"){k.coverTime=o.coverTime;k.trigger("coverTime",o.coverTime)}})}var n=false;k.enableGoogleAnalytics=m;k.event=j;k._cardsEvent=c;function m(q,o,p){if(n){return}n=true;if(q){if(!p){d(q,o)}else{l(q)}}g()}function d(p,o){if(typeof p!=="string"){throw TypeError("google analytics ID must be a string, got "+p)}if(typeof o!=="string"){throw TypeError("google analytics host must be a string, got "+o)}i.GoogleAnalyticsObject="ga";i.ga=i.ga||function(){(i.ga.q=i.ga.q||[]).push(arguments)},i.ga.l=+new Date();a.ready(function(){var q=document.createElement("script"),r=document.getElementsByTagName("script")[0];q.async=1;q.src="//www.google-analytics.com/analytics.js";r.parentNode.insertBefore(q,r)});i.ga("create",p,o);i.ga("send","pageview")}function l(o){if(typeof o!=="string"){throw TypeError("google analytics ID must be a string, got "+o)}var p=i._gaq=[];p.push(["_setAccount",o]);p.push(["_trackPageview"]);a.ready(function(){var r=document.createElement("script");r.async=true;r.defer=true;r.id="ga";r.src="//www.google-analytics.com/ga.js";var q=document.getElementsByTagName("script")[0];q.parentNode.insertBefore(r,q)})}function g(){i.addEventListener("error",function(q){var p=q.message||"";p+=" ("+(q.filename||i.location.href);if(q.lineno){p+=":"+q.lineno}p+=")";c("error",p)},false);if((typeof App==="object")&&(typeof App.enableGoogleAnalytics==="function")){App.enableGoogleAnalytics()}if(f){b("loadTime");b("coverTime")}var o=h.slice();h=null;o.forEach(function(p){j(p[0],p[1],p[2],p[3])})}function j(q,p,o,r){if(typeof q!=="string"){throw TypeError("event category must be a string, got "+q)}if(typeof p!=="string"){throw TypeError("event name must be a string, got "+p)}switch(typeof o){case"string":break;case"number":r=o;default:o=""}switch(typeof r){case"number":r=Math.floor(r);break;default:r=0}if(h){h.push([q,p,o,r]);return}if(typeof i.ga==="function"){i.ga("send","event",q,p,o,r)}else{if(!i._gaq){i._gaq=[]}if(typeof i._gaq.push==="function"){i._gaq.push(["_trackEvent",q,p,o,r,true])}}}function c(p,o,q){j("Cards",p,o,q)}function b(o){if(k[o]){c(o,k[o])}else{k.once(o,function(){c(o,k[o])})}}})(window,cards);(function(k,q,p){function u(D,H){var C=k.applicationCache,G=false;if(!C||!C.addEventListener||!C.swapCache||!C.update){H(false);return}if(C.status===C.UPDATEREADY){B();return}if((C.status!==C.IDLE)&&(C.status!==C.CHECKING)&&(C.status!==C.DOWNLOADING)){H(false);return}C.addEventListener("noupdate",E,false);C.addEventListener("updateready",B,false);C.addEventListener("error",B,false);C.addEventListener("obsolete",B,false);setTimeout(B,30*1000);if(C.status===C.IDLE){try{C.update()}catch(F){B()}}function E(){if(G){return}G=true;if(!D&&k.console&&k.console.log){k.console.log("refresh requested but no update to manifest found");k.console.log("** update your manifest to see changes reflected")}setTimeout(function(){H(true)},1000)}function B(){if(G){return}G=true;var I=false;if(C.status===C.UPDATEREADY){try{C.swapCache();I=true}catch(J){}}H(I)}}if(p.utils.platform.os.ios){setTimeout(function(){u(true,function(B){})},5000)}k.ZERVER_REFRESH=function(){c();u(true,function(){k.location.reload()})};function c(){try{k.ZERVER_KILL_STREAM()}catch(B){}}function j(D){if(typeof D!=="string"){return undefined}D=decodeURIComponent(D);var B;try{B=JSON.parse(D)}catch(C){}if((typeof B==="object")&&(B!==null)){return B}else{return D||undefined}}if(k.location.hash){p.linkData=j(k.location.hash.substr(1))}var a;try{a=p._.bridge("Browser")}catch(d){return}var y=p.events();p.browser=y;var A={};if(a.setCardInfo){var n=/(^|\s)icon(\s|$)/i,w,g,z,i;Array.prototype.forEach.call(q.getElementsByTagName("link"),function(B){if(!w){if((B.rel==="kik-icon")||(n.test(B.rel)&&!w)){w=B.href}}if(!g){if(B.rel==="kik-tray-icon"){g=B.href}}if(!z){if(B.rel==="privacy"){z=B.href}}if(!i){if(B.rel==="terms"){i=B.href}}});var m={title:q.title,icon:w,mediaTrayIcon:g,privacy:z,terms:i};if(cards._.secondBatch){cards._.secondBatch.push({name:"Browser.setCardInfo",args:m})}else{a.setCardInfo(m)}}if(a.pageLoaded){p.utils.windowReady(function(){if(q.body){var B=q.body.offsetWidth;(function(C){return C})(B)}setTimeout(function(){a.pageLoaded()},1)})}k.addEventListener("unload",function(){try{a.navigationAttempted()}catch(B){}},false);var s=true;if(a.setStatusBarVisible){var l=false;y.statusBar=function(B){l=true;a.setStatusBarVisible({visible:!!B});s=!!B}}if(a.setStatusBarTransparent){y.statusBarTransparent=function(C){var B;if(C==="black"){B=false}else{if(C){B=true}}try{if(a.setStatusBarTransparent({transparent:!!C,light:B})){return true}}catch(D){}return false};var t;Array.prototype.forEach.call(q.getElementsByTagName("meta"),function(B){if(B.name==="kik-transparent-statusbar"){t=(B.content||"").trim()}});if(t&&(t!=="false")&&y.statusBarTransparent(t)){k.APP_ENABLE_IOS_STATUSBAR=true;try{if(typeof App._enableIOSStatusBar==="function"){App._enableIOSStatusBar()}}catch(d){}}}if(a.getOrientationLock&&a.setOrientationLock){y.getOrientationLock=function(){var B=a.getOrientationLock().position;return(B==="free")?null:B};y.setOrientationLock=function(B){switch(B){case"free":case"portrait":case"landscape":break;default:if(!B){B="free";break}throw TypeError("if defined, position "+B+' must be one of "free", "portrait", or "landscape"')}try{a.setOrientationLock({position:B});if(!l&&a.setStatusBarVisible&&(s!==(B!=="landscape"))){a.setStatusBarVisible({visible:(B!=="landscape")});s=(B!=="landscape")}return true}catch(C){return false}}}a.on("orientationChanged",function(){try{k.App._layout()}catch(B){}});if(a.setBacklightTimeoutEnabled){y.backlightTimeout=function(B){a.setBacklightTimeoutEnabled({enabled:!!B})}}if(a.forceRepaint){y.paint=function(){if(q.body){var B=q.body.offsetWidth;(function(C){return C})(B)}a.forceRepaint()}}var e=[];y.back=function(B){if(typeof B!=="function"){throw TypeError("back handler "+B+" must be a function")}e.push(B)};y.unbindBack=function(C){if(typeof C!=="function"){throw TypeError("back handler "+C+" must be a function")}for(var B=e.length;B--;){if(e[B]===C){e.splice(B,1)}}};a.on("back",function(E){var C=false;for(var B=e.length;B--;){try{if(e[B]()===false){C=true;break}}catch(D){p.utils.error(D)}}a.handleBack({requestToken:E.requestToken,override:C})});y.back(function(){if(k.App&&(typeof k.App.back==="function")){try{if(App.back()!==false){return false}}catch(B){}}});if(a.refresh&&a.refreshPlanned){y.refresh=function(){var B=k.applicationCache;c();if(!B||(B.status===B.UNCACHED)){a.refresh({withCache:false});return}u(false,function(C){a.refresh({withCache:true})})};a.on("refresh",function(){setTimeout(function(){a.refreshPlanned();y.refresh()},0)});k.ZERVER_REFRESH=function(){y.refresh()}}if(a.openCard&&a.openExternal){y.open=function(D,C,E){if(typeof D!=="string"){throw TypeError("url "+D+" must be a string")}switch(typeof C){case"undefined":case"string":break;case"object":C=JSON.stringify(C);break;default:throw TypeError("card linkData must be a string or JSON if defined, got "+C)}switch(typeof E){case"undefined":E={};break;case"object":break;default:throw TypeError("card data must be an object if defined, got "+E)}var B=D.substr(0,7)==="card://",F=D.substr(0,8)==="cards://";if(!B&&!F){a.openExternal({url:D});return}D="http"+D.substr(4);if(C){D=D.split("#")[0]+"#"+encodeURIComponent(C)}a.openCard({url:D,title:E.title||undefined,icon:E.icon||undefined,clearHistory:!!E.clearHistory})}}var h=false;Array.prototype.forEach.call(q.getElementsByTagName("meta"),function(B){if(B.name==="kik-https"){h=B.content}});if(h===k.location.host){if(k.location.protocol==="https:"){try{a.performHttpsUpgradeCleanup()}catch(d){}}else{try{a.openCard({url:k.location.href.split("#")[0].replace(/^http\:/,"https:"),title:q.title,icon:w,clearHistory:true})}catch(d){}}}function r(C,B){y.linkData=j(C&&C.data);p.linkData=y.linkData;if((B!==false)&&y.linkData){y.trigger("linkData",y.linkData)}}y._processLinkData=r;if(a.getLastLinkData){r(cards._.firstBatch["Browser.getLastLinkData"]||a.getLastLinkData(),false)}a.on("linkData",r);var o=true,x=false,v=true;y.background=o;a.on("pause",function(B){x=true;f()});a.on("unpause",function(B){x=false;f()});a.on("conceal",function(B){v=true;f()});a.on("reveal",function(B){v=false;f()});function b(){return x||v}function f(){var B=o;o=b();y.background=o;if(B!==o){y.trigger(o?"background":"foreground")}}})(window,document,cards);(function(g,c,f){var d;try{d=f._.bridge("Media")}catch(e){}if(!d||!d.setMediaCategory||!d.unsetMediaCategory){f._mediaEnabled=function(){}}else{f._mediaEnabled=a;b()}function b(){var h=false;Array.prototype.forEach.call(c.getElementsByTagName("meta"),function(i){if((i.name==="kik-media-enabled")&&(i.content==="true")){h=true}});a(h)}function a(h){if(cards._.secondBatch){cards._.secondBatch.push({name:"Media."+(h?"":"un")+"setMediaCategory",args:{}})}else{try{if(h){d.setMediaCategory()}else{d.unsetMediaCategory()}}catch(i){}}}})(window,document,cards);(function(j,k,i){var c;try{c=i._.bridge("Kik")}catch(f){return}var b=i.events();i.kik=b;b._formatMessage=e;function e(o){var m;if(typeof o!=="object"){throw TypeError("message "+o+" must be an object")}switch(typeof o.big){case"undefined":case"boolean":break;default:throw TypeError("message size (big) "+o.big+" must be a boolean if defined")}switch(typeof o.title){case"undefined":case"string":if(!o.big&&!o.title){throw TypeError("message title must be a string")}o.title=o.title||"";break;default:throw TypeError("message title "+o.title+" must be a string")}switch(typeof o.text){case"string":case"undefined":break;default:throw TypeError("message text "+o.text+" must be a string")}switch(typeof o.pic){case"undefined":case"string":break;default:throw TypeError("message pic "+o.pic+" must be a string if defined")}switch(typeof o.noForward){case"undefined":case"boolean":break;default:throw TypeError("message noForward flag must be a boolean if defined, got "+o.noForward)}switch(typeof o.fallback){case"undefined":case"string":break;default:throw TypeError("message fallback URL must be a string if defined, got "+o.fallback)}switch(typeof o.linkData){case"undefined":case"string":break;case"object":try{m=JSON.stringify(o.linkData)}catch(n){throw TypeError("message linkData must be a string or JSON if defined, got "+o.linkData)}break;default:throw TypeError("message linkData must be a string or JSON if defined, got "+o.linkData)}var p=m||o.linkData;if(typeof p==="string"){p=encodeURIComponent(p)}var m;switch(typeof o.data){case"object":if(o.data!==null){try{m=JSON.stringify(o.data)}catch(n){throw TypeError("message data must be a json object if defined, got "+o.data)}}case"undefined":break;default:throw TypeError("message data must be a json object if defined, got "+o.data)}var l;if((typeof o.data==="object")&&(o.data!==null)&&o.data.id){l=o.data.id+""}cards.metrics._cardsEvent("kikSend",l);return{title:o.title,text:o.text,image:o.pic,forwardable:!o.noForward,fallbackUrl:o.fallback,layout:o.big?"photo":"article",extras:{sender:i._.id,dataID:l,messageID:i.utils.random.uuid(),linkData:p||"",jsonData:m||""}}}b.send=function(m,l){if(typeof m!=="string"){l=m;m=undefined}l=e(l);l.targetUser=m;if(m&&c.sendKikToUser){c.sendKikToUser(l)}else{c.sendKik(l)}};var h=i.events.handlers();b.handler=function(l){return h.handler(l)};function g(o,l){a();if(!o.extras.sender||(o.extras.sender!==i._.id)){cards.metrics._cardsEvent("kikReceive",o.extras.dataID)}if(o.extras.jsonData){var m;try{m=JSON.parse(o.extras.jsonData)}catch(n){}if((typeof m==="object")&&(m!==null)){b.message=m;h.trigger(m);b.trigger("message",m)}}if(o.extras&&o.extras.linkData&&i.browser&&i.browser._processLinkData){i.browser._processLinkData({data:o.extras.linkData},l)}}if(c.getLastMessage){var d=cards._.firstBatch["Kik.getLastMessage"]||c.getLastMessage();if(d&&d.message){g(d.message,false)}}c.on("message",g);if(c.openConversation){b.open=function(){c.openConversation()}}if(c.openConversationWithUser){b.openConversation=function(m,l){c.openConversationWithUser({username:m},function(n){l&&l(n)})}}function a(){if(!c.openConversation){return}b.returnToConversation=function(l){b.returnToConversation=null;if(!l){c.openConversation({returnToSender:true});return}l=e(l);l.returnToSender=true;c.sendKik(l)}}})(window,document,cards);(function(f,a,e){var b;try{b=e._.bridge("Profile")}catch(d){return}var c=e.kik;if(!c){c=e.events();e.kik=c}if(b.openProfile){c.showProfile=function(h){if(typeof h!=="string"){throw TypeError("username must be a string, got "+h)}try{b.openProfile({username:h})}catch(g){}}}})(window,document,cards);(function(h,i,b){var k;try{k=b._.bridge("UserData")}catch(e){return}var c=b.kik;if(!c){c=b.events();b.kik=c}function j(l){if(!l){return undefined}l.fullName=(l.displayName||"");var m=l.fullName.indexOf(" ");if(m===-1){l.firstName=l.fullName;l.lastName=""}else{l.firstName=l.fullName.substr(0,m);l.lastName=l.fullName.substr(m+1)}delete l.displayName;l.pic=f(l.pic);l.thumbnail=f(l.thumbnail);return l}function f(l){if(typeof l!=="string"){return l}var m=l.replace(/^https?\:\/\/[^\/]*/,"");return"//d33vud085sp3wg.cloudfront.net"+m}var g;if(k.getUserData){c.getUser=function(n){switch(typeof n){case"undefined":n=function(){};case"function":break;default:throw TypeError("callback must be a function if defined, got "+n)}if(g){n(g);return}var m=c.hasPermission(),l=b.utils.platform.os;k.getUserData({fields:["profile"]},function(p){var o=j(p&&p.userData);if(o){g=o}if(l.ios&&!m){setTimeout(function(){n(o)},600)}else{n(o)}})}}c.hasPermission=function(){try{return !!k.checkPermissions({fields:["profile"]}).permitted}catch(l){return false}};if(k.pickUsers||k.pickFilteredUsers){c.pickUsers=function(l,m){switch(typeof l){case"function":m=l;case"undefined":l={};case"object":break;default:throw TypeError("options must be an object if defined, got "+l)}if(typeof m!=="function"){throw TypeError("callback must be a function, got "+m)}switch(typeof l.preselected){case"undefined":l.preselected=[];break;default:if(!Array.isArray(l.preselected)){throw TypeError("preselected users must be an array of users if defined, got "+l.preselected)}l.preselected.forEach(function(n){if(typeof n!=="object"){throw TypeError("user must be an object, got "+n)}if(typeof n.username!=="string"){throw TypeError("user.username must be a string, got "+n.username)}});break}switch(typeof l.filtered){case"undefined":l.filtered=[];break;default:if(!Array.isArray(l.filtered)){throw TypeError("filtered users must be an array of users if defined, got "+l.filtered)}l.filtered=l.filtered.map(function(n){switch(typeof n){case"string":return n;case"object":if(n!==null&&typeof n.username==="string"){return n.username}default:throw TypeError("filtered user didnt have a username, got "+n)}});break}switch(typeof l.filterSelf){case"undefined":l.filterSelf=true;case"boolean":break;default:throw TypeError("filterSelf must be a boolean if defined, got "+l.filterSelf)}switch(typeof l.minResults){case"undefined":break;case"number":if(l.minResults<0){throw TypeError("minResults must be non-negative if defined, got "+l.minResults)}break;default:throw TypeError("minResults must be a number if defined, got "+l.minResults)}switch(typeof l.maxResults){case"undefined":break;case"number":if(l.maxResults<1){throw TypeError("maxResults must be greater than 1 if defined, got "+l.maxResults)}break;default:throw TypeError("maxResults must be a number if defined, got "+l.maxResults)}switch(typeof m){case"undefined":m=function(){};break;case"function":break;default:throw TypeError("callback must be a function if defined, got "+m)}if(l.preselected.length&&l.filtered.length){throw TypeError("can only preselect or filter users, not both")}if(k.pickFilteredUsers&&!l.preselected.length){d(l,m)}else{a(l,m)}}}function d(l,m){l.minResults=l.minResults||1;k.pickFilteredUsers({minResults:l.minResults,maxResults:l.maxResults,filtered:l.filtered,filterSelf:l.filterSelf},function(n){if(!n||!n.userDataList){m();return}var o=n.userDataList.map(j);if(l.filtered){o=o.filter(function(p){return l.filtered.indexOf(p.username)===-1})}m(o)})}function a(n,r){var p=false;if(!n.preselected||!n.preselected.length){n.minResults=n.minResults||1}var l={},o=[];n.preselected.forEach(function(s){l[s.username]=s;o.push(s.username)});k.pickUsers({minResults:n.minResults,maxResults:n.maxResults,preselected:o,filterSelf:n.filterSelf},function(s){if(p){return}if(!s||!s.userDataList){p=true;r();return}var t=s.userDataList.map(function(u){if(u.username in l){return l[u.username]}else{return j(u)}});if(n.filtered){t=t.filter(function(u){return n.filtered.indexOf(u.username)===-1})}p=true;r(t)});var q=b.utils.platform.os,m=b.utils.platform.browser;if(q.ios&&m.cards&&m.version<6.5){b.browser.once("foreground",function(){setTimeout(function(){if(!p){p=true;r()}},0)})}}})(window,document,cards);(function(e,a,g){var b;try{b=g._.bridge("Auth")}catch(d){}if(!b||!b.signRequest){return}var c=g.kik;if(!c){c=g.events();g.kik=c}c.sign=function(j,l,h){if(typeof j!=="string"){throw TypeError("data to be signed must be a string, got "+j)}if(typeof l!=="function"){throw TypeError("callback must be a function, got "+l)}h=!!h;var k=g.utils.platform.os,i=g.utils.platform.browser;if(k.android&&i.version<6.5){g.ready(function(){f(j,l,h)})}else{f(j,l,h)}};function f(i,j,h){b.signRequest({request:i,skipPrompt:h},function(l){if(!l||!l.signedRequest){j()}else{var k=l.host||e.location.host;j(l.signedRequest,l.username,k)}})}if(b.getAnonymousId){c.getAnonymousUser=function(h){b.getAnonymousId(function(i){if(i&&i.anonymousId){h(i.anonymousId)}else{h()}})}}if(b.signAnonymousRequest){c.anonymousSign=function(h,i){if(typeof h!=="string"){throw TypeError("data to be signed must be a string, got "+h)}if(typeof i!=="function"){throw TypeError("callback must be a function, got "+i)}b.signAnonymousRequest({request:h},function(j){if(!j||!j.signedRequest){i()}else{i(j.signedRequest,j.anonymousId,j.host)}})}}})(window,document,cards);(function(f,h,d){var i;try{i=d._.bridge("Photo")}catch(b){return}var a=d.events();d.photo=a;if(i.getPhoto){a.get=function(j,k){e(j,k)};a.getFromCamera=function(j,k){e("camera",j,k)};a.getFromGallery=function(j,k){e("gallery",j,k)}}function c(j,k){switch(typeof k){case"undefined":case"function":break;default:throw TypeError(j+" must be a function if defined, got "+k)}}function g(j,l,k,m){switch(typeof l){case"undefined":break;case"number":if(l<k||l>m){throw TypeError(j+" must be within "+k+" and "+m+" if defined, got "+l)}break;default:throw TypeError(j+" must be a number if defined, got "+l)}}function e(j,y,x){if(typeof j!=="string"){x=y;y=j;j=undefined}switch(typeof y){case"function":x=y;y={};case"object":break;default:throw TypeError("options must be an object, got "+y)}c("callback",x);c("onCancel",y.onCancel);c("onSelect",y.onSelect);c("onPhoto",y.onPhoto);c("onComplete",y.onComplete);g("quality",y.quality,0,1);g("minResults",y.minResults,0,25);g("maxResults",y.maxResults,1,25);g("maxHeight",y.maxHeight,0,1280);g("maxWidth",y.maxWidth,0,1280);var r=y.onSelect,t=y.onCancel,v=y.onPhoto,l=y.onComplete,s=false,m=d.utils.platform.os,o=d.utils.platform.browser,q,u;if(y.minResults===0){y.minResults=1}i.getPhoto({source:j,quality:y.quality,minResults:y.minResults,maxResults:y.maxResults,maxHeight:y.maxHeight,maxWidth:y.maxWidth,autoSave:y.saveToGallery},n);if(m.android&&(o.version<6.7)){d.browser.once("foreground",function(){setTimeout(function(){if(s){return}s=true;p(t);p(x)},0)})}function n(z){if(s){return}s=true;q=z&&z.photoIds;var A=q&&q.length;if(!A){p(t);p(x);return}p(r,A);u=new Array(A);i.on("photo",w)}function w(D){if(!D){return}var B=q.indexOf(D.id);if(B===-1){return}D.url=D.url||null;q[B]=null;u[B]=D.url;var A=0;for(var C=0,z=q.length;C<z;C++){if(q[C]!==null){A++}}p(v,D.url,B);if(A===0){k()}}function k(){i.off("photo",w);p(l,u);p(x,u)}function p(C,A,z){if(!C){return}try{C(A,z)}catch(B){d.utils.error(B)}}}if(i.savePhoto){a.saveToGallery=function(j,m){switch(typeof m){case"undefined":m=function(){};case"function":break;default:throw TypeError("callback must be a function, got "+m)}try{i.savePhoto({url:j},function(n){k(!!n)})}catch(l){k(false)}function k(n){k=function(){};m(n)}}}})(window,document,cards);(function(i,j,a){var b;try{b=a._.bridge("Keyboard")}catch(f){}var k="kik-hide-form-helpers";var h=a.utils.platform.browser;l();a.formHelpers={show:g,hide:e,isEnabled:c};function l(){var m;Array.prototype.forEach.call(j.getElementsByTagName("meta"),function(n){if(n.name===k){m=(n.content||"").trim()}});if(m!=="true"){return}if(h.cards&&h.version<=6.5){a.ready(function(){d(false)})}else{d(false)}}function e(){d(false)}function g(){d(true)}function d(m){if(a._.secondBatch){a._.secondBatch.push({name:"Keyboard.setFormNavigationEnabled",args:{enabled:m}})}else{try{b.setFormNavigationEnabled({enabled:m})}catch(n){}}}function c(){try{return !!b.isFormNavigationEnabled().enabled}catch(m){return !!a.utils.platform.os.ios}}})(window,document,cards);(function(e,f,a){var g;try{g=a._.bridge("Picker")}catch(b){return}if(!g.startRequest){return}var d=a.events(h);a.picker=d;function h(k,j,l){if(typeof k!=="string"){throw TypeError("picker url must be a string, got "+k)}switch(typeof j){case"function":l=j;case"undefined":j={};case"object":break;default:throw TypeError("picker options must be an object if defined, got "+j)}if(typeof l!=="function"){throw TypeError("picker callback must be a function, got "+l)}g.startRequest({requestUrl:k,requestData:j},function(m){l(m&&m.responseData)})}if(g.getRequest&&g.completeRequest){var c,i;try{c=(a._.secondBatch?a._.firstBatch["Picker.getRequest"]:g.getRequest()).requestData}catch(b){}if(c&&f.referrer){i=!!(c&&c.kik&&(f.referrer.split("?")[0]==="https://kik.com/"));d.url=f.referrer;d.data=c;d.fromKik=i;d.reply=function(k){if(i&&k){k=a.kik._formatMessage(k)}try{g.completeRequest({responseData:k})}catch(j){}};d.cancel=function(){try{g.cancelRequest()}catch(j){}if(!d.isPopup){d.url=undefined;d.data=undefined;d.reply=undefined;d.cancel=undefined;d.trigger("cancel")}}}else{}}else{}try{if(a._.firstBatch&&a._.firstBatch["Browser.isPopupMode"]){d.isPopup=a._.firstBatch["Browser.isPopupMode"].popup}else{d.isPopup=a._.bridge("Browser").isPopupMode().popup}}catch(b){d.isPopup=false}})(window,document,cards);(function(g,b,h){var a;try{a=h._.bridge("Push")}catch(f){return}var c=h.events();h.push=c;if(a.setBadgeVisibility){c.badge=function(i){a.setBadgeVisibility({visible:!!i,blue:true});c.trigger("badge",!!i)}}if(a.getPushToken){c.getToken=function(i){if(typeof i!=="function"){throw TypeError("callback must be a function, got "+i)}a.getPushToken(function(j){i(j&&j.token)})}}if(a.getNotificationList){var d=h.events.handlers();var e=function(){var p;try{if(h._.firstBatch&&h._.firstBatch["Push.getNotificationList"]){p=h._.firstBatch["Push.getNotificationList"]}else{p=a.getNotificationList()}}catch(o){}var k=(h.picker&&h.picker.isPopup),r=true;if(!k){r=false;try{a.setBadgeVisibility({visible:false});c.trigger("badge",false)}catch(o){}}else{c.once("badge",function(){r=false})}var n=[];if(p&&p.notifications){for(var m=0,j=p.notifications.length;m<j;m++){if(typeof p.notifications[m]==="object"){switch(typeof p.notifications[m].data){case"object":n.push(p.notifications[m].data);break;case"string":try{var q=JSON.parse(p.notifications[m].data);if(typeof q==="object"){n.push(q)}else{}}catch(o){}break;default:break}}}}if(n.length){d.triggerMulti(n);n.forEach(function(i){c.trigger("push",i)})}else{r=false}if(r){try{a.setBadgeVisibility({visible:true,blue:true});c.trigger("badge",true)}catch(o){}}};c.handler=function(i){return d.handler(i)};a.on("notificationReceived",function(){var i=h.utils.platform;if(i.os.ios&&i.browser.version<6.4){setTimeout(e,0)}else{e()}});e()}})(window,document,cards);(function(f,g,b){var h;try{h=b._.bridge("IAP")}catch(d){return}if(!h.purchase||!h.markTransactionStored||!h.getTransactionList){return}var c=b.events(a);c.init=i;b.purchase=c;function i(j,n){if(typeof arguments[0]==="string"){j=Array.prototype.slice.call(arguments)}if(!Array.isArray(j)){throw TypeError("list of SKUs must be an array")}j.forEach(function(o){if(typeof o!=="string"){throw TypeError("SKU must be a string, got "+o)}});if(typeof n==="function"){if(!h.getAvailableItemsAsynchronously){var m;try{m=h.getAvailableItems({skus:j})}catch(k){}l(m)}else{h.getAvailableItemsAsynchronously({skus:j},l)}}else{if(!h.getAvailableItems){l()}else{var m;try{m=h.getAvailableItems({skus:j})}catch(k){}l(m)}}function l(q){var o;try{o=q.items}catch(p){}if(!o||!Array.isArray(o)){o=[]}var r;try{r=h.getTransactionList({skus:j}).transactions}catch(p){r=[]}r.forEach(function(t){if(!t.sku){try{t.sku=JSON.parse(f.atob(t.content.split(".")[1])).item.sku}catch(s){}}});c.init=null;c.complete=e;c.items=o;c.pending=r;if(typeof n==="function"){n()}}}function a(n,l,m,j){switch(typeof n){case"object":if(n===null){throw TypeError("SKU must be a string, got "+n)}if(typeof n.sku!=="string"){throw TypeError("SKU must be a string, got "+n.sku)}n=n.sku;case"string":break;default:throw TypeError("SKU must be a string, got "+n)}var k=c.items.map(function(o){return o.sku}).indexOf(n);if(k===-1){throw TypeError("SKU not available, got "+n)}switch(typeof l){case"boolean":m=l;l=undefined;case"function":j=m;m=l;case"undefined":l={};case"object":break;default:throw TypeError("purchase data must be a JSON object if defined, got "+l)}switch(typeof m){case"boolean":j=m;case"undefined":m=function(){};case"function":break;default:throw TypeError("purchase callback must be a function if defined, got "+m)}switch(typeof j){case"undefined":j=false;case"boolean":break;default:throw TypeError("skipPrompt must be a boolean if defined, got "+j)}h.purchase({sku:n,data:l,skipPrompt:j},function(o){if(!o){m(undefined,true);return}if(!o.transaction){m();return}c.pending.push(o.transaction);m(o.transaction)})}function e(k){if(typeof k!=="string"){throw TypeError("transactionId must be a string, got "+k)}h.markTransactionStored({transactionId:k});for(var j=c.pending.length;j--;){if(c.pending[j].transactionId===k){c.pending.splice(j,1)}}}})(window,document,cards);(function(c,a,d){if(b()){e()}function b(){var g=d.utils.platform.os,f=d.utils.platform.browser;return(g.ios&&f.cards&&(f.version<6.5))}function e(){a.documentElement.addEventListener("click",function(g){if(!g.defaultPrevented&&g.target&&g.target.nodeName==="A"&&g.target.href&&!g.target._clickable){var f=d.browser;if(f){f.open(g.target.href);g.preventDefault();return false}}})}})(window,document,cards);(function(a){delete a._.firstBatch;if(a._.secondBatch){a._.bridge.batch(a._.secondBatch);delete a._.secondBatch}})(cards);(function(h,i,a){var c="kik-prefer",f="kik-more",d="kik-unsupported";b();k();function b(){if(a.enabled){return}var m=a.utils.url;if(m.query._app_platform){return}var n="card"+m.updateQuery({kikme:null}).substr(4),l=!!m.query.kikme,o;if(!l){Array.prototype.forEach.call(i.getElementsByTagName("meta"),function(p){if((p.name===c)&&(p.content||"").trim()){l=true}else{if(p.name===f){o=(p.content||"").trim();if(o.substr(0,7)==="http://"){o=o.substr(7)}else{if(o.substr(0,8)==="https://"){o=o.substr(8)}}}}});if(o&&(o.substr(0,h.location.host.length)!==h.location.host)){l=false}}if(l){a.ready(function(){a.open.card(n,undefined,true)})}}function e(){var s=a.utils.platform.os,o;Array.prototype.forEach.call(i.getElementsByTagName("meta"),function(l){if(l.name===d){o=(l.content||"").trim()}});if(!o){return true}var m=true;var t=o.split(",");for(var q=0,n=t.length;q<n;q++){var r=t[q].trim();var p=g(r);if(r&&p){if(p.ios&&s.ios){if(s.version<(p.version+1)){m=false}}else{if(p.android&&s.android){if(s.version<=p.version){m=false}}}}}return m}function g(l){var o=-1,n=false,m=false;if(l.indexOf("android-")===0){m=true;o=parseFloat(l.replace("android-",""));if(o>=2.3){return j(l)}}else{if(l.indexOf("ios-")===0){n=true;o=parseFloat(l.replace("ios-",""));if(o>=5){return j(l)}}else{return j(l)}}return{ios:n,android:m,version:o}}function j(l){if(h.console&&h.console.error){h.console.error('"'+l+'" is an unsupported value for the "'+d+'" meta tag')}return false}function k(){if(e()){return}var m=a.utils.platform.os,t=i.documentElement;Array.prototype.forEach.call(t.childNodes,function(w){t.removeChild(w)});t.style["min-height"]="0";t.style["min-width"]="0";t.style.height="0";t.style.width="0";t.style.padding="0";t.style.border="none";t.style.margin="0";t.style.overflow="hidden";var r=i.createElement("head"),v=i.createElement("meta");v.name="viewport";v.content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";r.appendChild(v);t.appendChild(r);var n=i.createElement("body");n.style.margin="0";n.style.padding="0";var l=i.createElement("div");l.style.position="absolute";l.style.top="0";l.style.left="0";l.style.height="0";l.style.width="0";l.style.background="#31333B";l.style.zIndex="100000000000";l.style.fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif';if(m.android){l.style.fontFamily='"Roboto", sans-serif'}var o=i.createElement("div");o.style.position="fixed";o.style.left="0";o.style.zIndex="100000000000";var q=i.createElement("div");q.style.backgroundImage="url('http://cdn.kik.com/cards/unsupported_icon.png')";q.style["background-size"]="100%";q.style.width="100px";q.style.height="100px";q.style.margin="0 auto";var s=i.createElement("div");s.style.color="#E0E0E0";s.style.padding="20px";s.style.textAlign="center";s.style.margin="0 auto";s.style.fontSize="16px";s.innerHTML="Oh no! This Card isn't supported on your phone.";var u=i.createElement("div");u.style.color="#979799";u.style.padding="0 20px";u.style.textAlign="center";u.style.margin="0 auto";u.innerHTML="This card is not available for your phone. But don't worry! You can still use the Kik Messenger you know and love :)";o.appendChild(q);o.appendChild(s);o.appendChild(u);l.appendChild(o);if(m.android&&m.version<2.3){Array.prototype.forEach.call(t.childNodes,function(w){t.removeChild(w)})}n.appendChild(l);t.appendChild(n);t.style["-webkit-user-select"]="none";t.style["user-select"]="none";t.style.background="#31333B";function p(){t.style.height=screen.height+"px";t.style.width=screen.width+"px";t.style["max-height"]=screen.height+"px";t.style["max-width"]=screen.width+"px";n.style.height=screen.height+"px";n.style.width=screen.width+"px";l.style.height=screen.height+"px";l.style.width=screen.width+"px";o.style.width=screen.width+"px";o.style.top=screen.height*0.15+"px";s.style.width=screen.width*0.65+"px";u.style.width=screen.width*0.65+"px"}h.onorientationchange=function(w){if(w.stopImmediatePropagation){w.stopImmediatePropagation()}w.preventDefault();w.stopPropagation();w.cancelBubble=true;w.returnValue=false;return false};setTimeout(p,50);if(t.addEventListener){t.addEventListener("resize",p,false)}delete h.cards;throw TypeError("OS Version is not supported.")}})(window,document,cards);
var EditDeck = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function(playerBlob) {

        if (this._super()) {
            this.initFromConfig(this.windowConfig);
            this.start();
            this.playerBlob = playerBlob;
            this.cardLayer= new CardLayer();
            this.cardLayer.init(this.playerBlob, this.selectionMade.bind(this), this.selectionCancelled.bind(this));
            jc.layerManager.push(this);
            this.name = "EditDeck";
            return true;
        } else {
            return false;
        }
    },
    selectionMade:function(index){
        var portraitFrame = jc.getCharacterPortrait(this.playerBlob.myguys[index]);
        if (!this.touchedSprite.portrait){
            this.touchedSprite.portrait = cc.Sprite.create();
            this.touchedSprite.portrait.initWithSpriteFrameName(portraitFrame);
            this.touchedSprite.addChild(this.touchedSprite.portrait);
            this.scaleTo(this.touchedSprite.portrait, this.touchedSprite);
            this.centerThis(this.touchedSprite.portrait, this.touchedSprite);
            this.playMap[this.touchedSprite.name] = index;
        }
    },
    selectionCancelled:function(){
         this.touchedSprite = undefined;
    },
    onDone:function(){
        if (!this.isPaused){
            //todo: transition to battle
            jc.editDeckResult = this.playMap;
            hotr.changeScene('arena');
        }
    },
    onCancel:function(){
        if (!this.isPaused){
            //todo: transition to map

        }
    },
    targetTouchHandler:function(type, touch, sprites){
        if (type == jc.touchEnded){
            this.touchedSprite = sprites[0];
            jc.layerManager.push(this.cardLayer);
            this.reorderChild(this.cardLayer, 3);
        }
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"scale9",
            "transitionIn":"top",
            "transitionOut":"top",
            "size":{ "width":100, "height":100},
            "scaleRect":jc.UiConf.frame19Rect,
            "sprite":"frame 19.png",
            "padding":{
                "top":12,
                "left":2
            }
            ,
            "kids":{
                "gridCells":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":3,
                    "cell":7,
                    "anchor":['bottom'],
                    "padding":{
                        "top":-35,
                        "left":35
                    },
                    "itemPadding":{
                        "left":10,
                        "top":5
                    },
                    "size":{ "width":90, "height":90},
                    "itemSize":{ "width":15, "height":15},
                    "input":true,
                    "members":[
                        {
                            "type":"scale9",
                            "input":true,
                            "scaleRect":jc.UiConf.frame20Rect,
                            "sprite":"frame 20.png"
                        }
                    ],
                    "membersTotal":12
                },
                "doneCancel":{
                    "isGroup":true,
                    "type":"line",
                    "cell":2,
                    "size":{ "width":33, "height":10},
                    "anchor":['right'],
                    "padding":{
                        "left":80,
                        "top":20
                    },
                    "members":[
                        {
                            "type":"button",
                            "main":"check.png",
                            "pressed":"check1.png",
                            "touchDelegateName":"onDone"
                        },
                        {
                            "type":"button",
                            "main":"close.png",
                            "pressed":"close1.png",
                            "touchDelegateName":"onCancel"
                        }
                    ]
                }
            }
        }
    }
});



EditDeck.scene = function() {
    if (!jc.editDeckScene){
        jc.editDeckScene = cc.Scene.create();
        jc.editDeckScene.layer = new EditDeck();
        jc.editDeckScene.addChild(jc.editDeckScene.layer);
        jc.editDeckScene.layer.init(jc.playerBlob); //todo: must come from remote

    }
    return jc.editDeckScene;
};

//            label = cc.LabelTTF.create(strValue, "Helvetica", 20.0);
//            label.setPosition(cc.p(0,0));
//            label.setAnchorPoint(cc.p(0,0));
//            label.setTag(123);
//            cell.addChild(label);

//testing
//            this.bottomWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromBottom(this.bottomWindow);
//            this.topWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromTop(this.topWindow);
//            this.leftWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromLeft(this.leftWindow);
//            this.rightWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromRight(this.rightWindow);

var EditTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:120,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.name = "EditTeam";
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
        if (!this.tableView){
            this.tableView = new jc.ScrollingLayer();
            this["characterPortraitsFrame"].addChild(this.tableView);
            var scrollData = this.getDisplaySpritesAndMetaData();
            this.tableView.init({
                sprites:scrollData.sprites,
                metaData:scrollData.ids,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this),
                width:this.winSize.width
            });

            var pos = this.tableView.getPosition();
            pos.y+=28;
            this.tableView.setPosition(pos);
            this.reorderChild(this.tableView, 3);
            this.tableView.hackOn();
            this.tableView.setIndex(0);
        }
    },
    inTransitionsComplete:function(){
        if (this.statsFrame.card){
            jc.fadeIn(this.statsFrame.card, 255);
        }
    },
    outTransitionsComplete:function(){
        jc.layerManager.popLayer();
    },
    makeScrollSprites: function(names){
       return _.map(names, function(name){
            return this.makeScrollSprite(name);
       }.bind(this));

    },
    makeScrollSprite: function(name){
        var sprite = new cc.Sprite();
        sprite.initWithSpriteFrameName("characterPortraitFrame.png");
        sprite.pic = jc.getCharacterPortrait(name, sprite.getContentSize());
        sprite.addChild(sprite.pic);
        this.scaleTo(sprite.pic, sprite);
        this.centerThis(sprite.pic, sprite);
        return sprite;
    },
    getDisplaySpritesAndMetaData: function(){
        var characters = hotr.blobOperations.getCharacterIdsAndTypes();
        var names = _.pluck(characters, 'name');
        var ids = _.pluck(characters, 'id');
        var sprites = this.makeScrollSprites(names);
        return {ids:ids, sprites:sprites};
    },
    getEmptyCells:function(number){
        var returnme=[];
        for(var i =0;i<number;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("characterPortraitFrame.png");
            if (!this.cellWidth){
                this.cellWidth = sprite.getTextureRect().width + 100;
            }
            returnme.push(sprite);
        }
        return returnme;
    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
        return false;
    },
    "trainPower": function(){
        console.log("trainPower");
    },
    "doneButton": function(){
        hotr.scratchBoard.selectedCharacter = this.tableView.selectedIndex;
        this.close();
    },
    selectionCallback:function(index, sprite, data){
        //index of card, data = character id
        var characterEntry = hotr.blobOperations.getEntryWithId(data);

        //get card image from jc.getCharacterCard
        var card = jc.getCharacterCard(characterEntry.name);

        //put this card sprite in the frame
        this.swapCharacterCard(card);

        //fade in/fade out card
        //update labels
    },
    swapCharacterCard:function(card){
        var pos = this.statsFrame.getPosition();
        card.setPosition(cc.p(185,pos.y));
        var swapFade = jc.swapFade.bind(this);
        swapFade(this.statsFrame.card, card);
        this.statsFrame.card = card;
    },
    previousChar:function(){
        this.tableView.left();
    },
    nextChar:function(){
        this.tableView.right();
    },
    close:function(){
        this.done();
        jc.fadeOut(this.statsFrame.card,1);
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"top",
            "transitionOut":"top",
            "sprite":"genericBackground.png",
            "kids":{
                "closeButton":{
                    "cell":9,
                    "anchor":['center', 'right'],
                    "padding":{
                        "top":-15,
                        "left":0
                    },
                    "type":"button",
                    "main":"closeButton.png",
                    "pressed":"closeButtonPressed.png",
                    "touchDelegateName":"close"

                },
                "statsFrame":{
                    "cell":4,
                    "anchor":['center', 'right'],
                    "type":"sprite",
                    "sprite":"statsFrame.png",
                    "padding":{
                        "top":-37,
                        "left":95,
                    }
                },
                "powerLevels":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":5,
                    "cell":8,
                    "anchor":['right'],
                    "padding":{
                        "top":28,
                        "left":-21
                    },
                    "itemPadding":{
                        "top":0,
                        "left":-1
                    },
                    "members":[
                        {
                            "type":"sprite",
                            "sprite":"powerIconLargeFrame.png"
                        }
                    ],
                    "membersTotal":5
                },
                "powerIcons":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":5,
                    "cell":8,
                    "anchor":['right', 'bottom'],
                    "padding":{
                        "top":12,
                        "left":-21
                    },
                    "itemPadding":{
                        "top":0,
                        "left":-1
                    },
                    "input":true,
                    "members":[
                        {
                            "type":"sprite",
                            "input":true,
                            "sprite":"powerIconSmallFrame.png"
                        }
                    ],
                    "membersTotal":5
                },
                "powerDesc":{
                    "type":"sprite",
                    "sprite":"powerIconsDescription.png",
                    "cell":6,
                    "anchor":['center'],
                    "padding":{
                        "top":-5,
                        "left":-45
                    }
                },
                "nextLevel":{
                    "cell":6,
                    "anchor":['left', 'bottom'],
                    "padding":{
                        "top":-28,
                        "left":-47
                    },
                    "type":"sprite",
                    "sprite":"nextLevelCostFrame.png"
                },
                "trainButton":{
                    "type":"button",
                    "main":"buttonTrain.png",
                    "pressed":"buttonTrainPressed.png",
                    "touchDelegateName":"trainPower",
                    "cell":6,
                    "anchor":['right', 'bottom'],
                    "padding":{
                        "top":-22,
                        "left":-36
                    }
                },
                "doneButton":{
                    "type":"button",
                    "main":"buttonDone.png",
                    "pressed":"buttonDonePressed.png",
                    "touchDelegateName":"doneButton",
                    "cell":3,
                    "anchor":['center'],
                    "padding":{
                        "top":23,
                        "left":5
                    }
                },
                "characterPortraitsFrame":{
                    "type":"sprite",
                    "sprite":"characterPortraitsFrame.png",
                    "cell":2,
                    "anchor":['top'],
                    "padding":{
                        "top":2,
                        "left":0
                    }
                },
                "characterPortraitsLeft":{
                    "type":"button",
                    "main":"characterPortraitsButtonLeft.png",
                    "pressed":"characterPortraitsButtonLeftPressed.png",
                    "touchDelegateName":"previousChar",
                    "cell":1,
                    "anchor":['top', 'left'],
                    "padding":{
                        "top":2,
                        "left":0
                    }
                },
                "characterPortraitsRight":{
                    "type":"button",
                    "main":"characterPortraitsButtonRight.png",
                    "pressed":"characterPortraitsButtonRightPressed.png",
                    "touchDelegateName":"nextChar",
                    "cell":3,
                    "anchor":['top', 'right'],
                    "padding":{
                        "top":2,
                        "left":0
                    }
                }
            }
        },
    }
});


EditTeam.getInstance = function() {
    if (!hotr.editTeam){
        hotr.editTeam = new EditTeam();
        hotr.editTeam.init();
    }
    return hotr.editTeam;
};


var effectsConfig = {
    "greenBang":{
        "png":"art/greenBang.png",
        "plist":"art/greenBang.plist",
        "start":"greenBang.1.png",
        "placement":"center",
        "frames":28,
        "delay":0.02,
        "times":1
    },
    "explosion":{
        "png":"art/explosion.png",
        "plist":"art/explosion.plist",
        "start":"explosion.1.png",
        "placement":"bottom",
        "zorder":"behind",
        "frames":27,
        "delay":0.01,
        "offset":{
            "x":0,
            "y":50
        },
        "times":1
    },
    "blueRadius":{
        "png":"art/blueRadius.png",
        "plist":"art/blueRadius.plist",
        "start":"blueRadius.1.png",
        "frames":23,
        "delay":0.05,
        "zorder":"behind",
        "placement":"bottom",
        "offset":{
            "x":-5,
            "y":-110
        }

    },
    "heal":{
        "png":"art/heal.png",
        "plist":"art/heal.plist",
        "start":"heal.5.png",
        "frames":17,
        "delay":0.05,
        "placement":"bottom",
        "times":5,
    },
    "teleport":{
        "png":"art/teleport.png",
        "plist":"art/teleport.plist",
        "start":"teleport.1.png",
        "frames":14,
        "delay":0.02,
        "placement":"base2base",
        "times":1,
    },
    "fire":{
        "png":"art/fire.png",
        "plist":"art/fire.plist",
        "start":"fire.1.png",
        "frames":44,
        "delay":0.02,
        "placement":"base2base",
        "zorder":"behind",
    },
    "fireLoop":{
        "name":"fire",
        "png":"art/fire.png",
        "plist":"art/fire.plist",
        "start":"fire.1.png",
        "frames":44,
        "delay":0.02,
        "placement":"base2base",
        "zorder":"behind",
        "times":15,
    },
    "poison":{
        "png":"art/poison.png",
        "plist":"art/poison.plist",
        "start":"poison.1.png",
        "frames":50,
        "delay":0.02,
//        "offset":{
//            "x":0,
//            "y":100
//        },
        "placement":"bottom",
    }
}


var jc = jc || {};
var RequestLite = function(){

}

RequestLite.parallel=function(methods, callback){
    _.map(methods, function(method){
        return function(err, value){
            method()
        }
    });
}

jc.RequestLite = RequestLite;

//EventEmitter2 forked and modified slightly from - https://github.com/hij1nx/EventEmitter2
//All licenses apply.

;!function(exports, undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      
      this._conf = conf;
      
      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }
    
    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }
        
        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
    
    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;
            
            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  };

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    };

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {
    
    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      
      if (!this._all && 
        !this._events.error && 
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || this._all;
    }
    else {
      return this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {
    
    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;
        
        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if(!this._all) {
      this._all = [];
    }

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          return this;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1)
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return EventEmitter;
    });
  } else {
    exports.EventEmitter2 = EventEmitter; 
  }

}(jc);




var Consts = {};
Consts.stateIdle=0;
Consts.stateWalking=1;
Consts.statePunching=2;
var ExampleLayer = cc.Layer.extend({
	ryu: null,
	ryuBatch: null,
	wizardBatch: null,
	badguys: [],
	init: function() {
		if (this._super()) {
			
			//make tilemap
			this.tilemap();
			
			//make ryu
			this.hero();
						
			//make 80 wizards arranged in a circle around ryu
			this.baddies();
									
			//onmouse or touch move ryu
			this.wireInput();
			
			this.lastFlip = 0;
			this.scheduleUpdate();
			
		
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
	baddies: function(){
		var numBaddies = 3;
	    for (var i=0; i<numBaddies; i++){
	        var sliceSize = 360/numBaddies; //size of slice
			this.makeAndPlaceBaddy(sliceSize*i);
	    }
	 
	},
	makeAndPlaceBaddy: function(angle){
		var spriteGen = [this.makeAndPlaceAlex.bind(this), this.makeAndPlaceOrge.bind(this), this.makeAndPlaceIbuki.bind(this), this.makeAndPlaceWizard.bind(this)];
		var number = Math.floor(Math.random()*spriteGen.length);
		spriteGen[number](angle);
	},
	makeAndPlaceSprite: function(states, name, start, plist, png, angle){		
			var baddy = new jc.Sprite();
			baddy.initWithPlist(plist,png, start, name+angle);
			baddy.addDef(states.idle);
			baddy.addDef(states.walk);
			baddy.setPosition(this.getSpot(this.ryu.getPosition(),angle));
			baddy.idle = Consts.stateIdle;
			baddy.moving = Consts.stateWalking;
			baddy.setState(Consts.stateIdle);
			this.badguys.push(baddy);
			this.addChild(baddy.batch);			
			this.addChild(baddy);
	},
	makeAndPlaceAlex: function(angle){
		var states = {
			idle:{
				state:Consts.stateIdle,
				nameFormat:'stance{0}.png',
				frames:11,
				delay:0.03,
				type:jc.AnimationTypeLoop			
			},
			walk:{
				state:Consts.stateWalking,
				nameFormat:'walkf0{0}.png',
				frames:10,
				delay:0.03,
				type:jc.AnimationTypeLoop						
			}
		};
		this.makeAndPlaceSprite(states, 'alex', 'stance00.png', alexPlist, alexSheet, angle);
	},
	makeAndPlaceOrge: function(angle){
			var states = {
				idle:{
					state:Consts.stateIdle,
					nameFormat:'Orge.Idle.{0}.png',
					frames:24,
					delay:0.03,
					type:jc.AnimationTypeLoop			
				},
				walk:{
					state:Consts.stateWalking,
					nameFormat:'Orge.Idle.{0}.png',
					frames:24,
					delay:0.03,
					type:jc.AnimationTypeLoop						
				}
			};
			this.makeAndPlaceSprite(states, 'ogre', 'Orge.Idle.1.png', ogrePlist, ogreSheet, angle);
	},
	makeAndPlaceIbuki: function(angle){
		var states = {
			idle:{
				state:Consts.stateIdle,
				nameFormat:'stance0{0}.png',
				frames:10,
				delay:0.03,
				type:jc.AnimationTypeLoop			
			},
			walk:{
				state:Consts.stateWalking,
				nameFormat:'walkf{0}.png',
				frames:16,
				delay:0.03,
				type:jc.AnimationTypeLoop						
			}
		};
		this.makeAndPlaceSprite(states, 'ibuki', 'stance00.png', ibukiPlist, ibukiSheet, angle);
		
	},
	makeAndPlaceWizard: function(angle){
		var wizStates = {
			idle:{
				state:Consts.stateIdle,
				nameFormat:'wizard.Idle.{0}.new.png',
				frames:24,
				delay:0.03,
				type:jc.AnimationTypeLoop			
			},
			walk:{
				state:Consts.stateWalking,
				nameFormat:'wizard.Run.{0}.new.png',
				frames:24,
				delay:0.03,
				type:jc.AnimationTypeLoop						
			}
		};

		this.makeAndPlaceSprite(wizStates, 'wizard', 'wizard.Idle.1.new.png', wizardPlist, wizardSheet, angle);
	},
	getSpot: function(location,angle){
			var a = angle*(180/Math.PI); //angle to rads
		    var r = 200; //hard coded radius @ 200
		    var x = location.x + r * Math.cos(a);
		    var y = location.y + r * Math.sin(a);
		    return cc.p(x,y);
	},
	hero: function(){
		//make ryu
		var size = cc.Director.getInstance().getWinSize();
		this.ryu = new jc.Sprite();
		this.ryu.initWithPlist(ryuPlist, ryuSheet, 'stance00.png', 'ryu');
		var idle = {
			state:Consts.stateIdle,
			nameFormat:"stance0{0}.png",
			frames: 10,
			delay:.1,
			type:jc.AnimationTypeLoop			
		};
		
		var walk = {
			state:Consts.stateWalking,
			nameFormat:"walkf0{0}.png",
			frames: 11,
			delay:.1,
			type:jc.AnimationTypeLoop			
		};		
		
							
		this.ryu.addDef(idle);
		this.ryu.addDef(walk);

		this.ryu.idle = Consts.stateIdle;
		this.ryu.moving = Consts.stateWalking;	
		this.ryu.setState(this.ryu.idle);
		this.addChild(this.ryu.batch);
		this.addChild(this.ryu);	
		this.ryu.setPosition(this.heroSpawn);
		this.centerOnRyu();
		
	},
	tilemap:function(){
		this.tileMap = cc.TMXTiledMap.create(mapTiles);
		this.background = this.tileMap.getLayer("Background");
		this.addChild(this.tileMap, -1);
		this.heroSpawn = this.getHeroSpawn();		
	},
	getHeroSpawn:function(){
		var group = this.tileMap.getObjectGroup('Objects');
		if (!group){
			throw "Couldn't get the object group from the tilemap layer.";			
		}else{
			var spawn = group.objectNamed('SpawnPoint');
			return cc.p(spawn['x'], spawn['y']);
		}
	},
	moveHandler:function(){
        jc.log(['move'], 'moveHandler invoked');
        if (this.currentTouch){
        		jc.log(['move'], 'current touch is not null');
        		jc.log(['move'], 'current touch is:' + JSON.stringify(this.currentTouch));
				var touchLocation = this.convertToNodeSpace(this.currentTouch);
        		jc.log(['move'], 'mapped to node touch is:' + JSON.stringify(touchLocation));
				var size = cc.Director.getInstance().getWinSize();
				var velocity = size.width/3.0;
				this.ryu.moveTo(touchLocation, Consts.stateWalking, velocity, this.ryuMoveEnded.bind(this));		
				this.moveBaddiesRandom();		
				this.schedule(this.updateFunction.bind(this));			
		}

	},
	update:function (dt){
		var addMe =1;
		// for(var i = 0; i < 50; i++){
		// 		for(var j = 0; j < 50; j++){
		//             	var res = Math.cos(i) * Math.sin(j);
		// 			if (res>addMe){
		// 				addMe = res;
		// 			}
		// 		}	
		// 	}		

        this.lastFlip+=addMe;
		if (this.lastFlip>50){
			cc.log("*********FLIP");
			this.lastFlip = 0;
			this.moveBaddiesRandom();
			this.cycleBaddy();			

		}
	},
	moveBaddiesRandom:function(){
        for(var i=0;i<this.badguys.length;i++){
			var size = cc.Director.getInstance().getWinSize();
			var randX = Math.floor(Math.random()*size.width);
			var randY = Math.floor(Math.random()*size.height);			
			var velocity = size.width/(Math.floor(Math.random()*10)+5);
			var location = this.convertToNodeSpace(cc.p(randX,randY));
			this.badguys[i].moveTo(location, Consts.stateWalking, velocity);						
		}		
	},
	cycleBaddy:function(){
		var toSplice = Math.floor(Math.random()*this.badguys.length);
		var baddyToCycle = this.badguys.splice(toSplice,1)[0];
		baddyToCycle.cleanUp();
		this.removeChild(baddyToCycle);
		baddyToCycle = null;
		this.makeAndPlaceBaddy(Math.floor(Math.random()*360));
		cc.log("*****BAD GUYS:" + this.badguys.length);
	},
	moveBaddies:function(){
		var touchLocation = this.convertToNodeSpace(this.currentTouch);
		var size = cc.Director.getInstance().getWinSize();
		var velocity = size.width/5.0;
		var sliceSize = 360/this.badguys.length;

		for(var i=0;i<this.badguys.length;i++){
			var spot = this.getSpot(touchLocation, sliceSize*i);
			this.badguys[i].moveTo(spot, Consts.stateWalking, velocity);						
		}
	},
	onTouchesBegan: function(touch, event) {
		//todo convert to [], move sprite
		jc.log(['touchcore'], 'Touch began');
		jc.log(['touchcore'], 'Touch is: ' + JSON.stringify(touch[0].getLocation()));
		jc.log(['touchcore'], 'Event is: ' + JSON.stringify(event));
		this.currentTouch = touch[0].getLocation();
		this.moveHandler();
		return true;
	},
	onTouchesMoved: function(touch, event) {
		jc.log(['touchcore'], 'Touch moved');

		this.currentTouch = touch[0].getLocation();
	//	this.schedule(this.moveHandler.bind(this), .05, 1, 0);
		return true;

	},
	onTouchesEnded: function(touch, event) {
		jc.log(['touchcore'], 'Touch ended');
		this.currentTouch = null;
		return true;
	},
	onMouseDown: function(event) {
		jc.log(['mouse'], 'mouse down');
		this.onTouchesBegan([event], event);
		return true;
	},
	onMouseDragged: function(event) {
		jc.log(['mouse'], 'mouse moved');
		this.onTouchesMoved([event], event);
		return true;
	},
	onMouseUp: function(event) {
		jc.log(['mouse'], 'mouse up');
		this.onTouchesEnded([event], event);
		return true;
	},
	onTouchCancelled: function(touch, event) {
		jc.log(['touch'], 'touch cancelled up');
		return true;
	},
	ryuMoveEnded: function(){
		jc.log(['move'], 'ryu move ended');
		this.unschedule(this.updateFunction);
		if (this.currentTouch){
			jc.log(['move'], 'current touch is still defined, re-exec movehandler');
			this.moveHandler();
		}else{
			jc.log(['move'], 'returning ryu to idle');
			this.ryu.setState(Consts.stateIdle);
		}
	},
	updateFunction: function(){
		this.centerOnRyu();
	},
	centerOnRyu:function(){
		this.setViewCenter(this.ryu.getPosition());		
	},
	setViewCenter:function(point){
		var size = cc.Director.getInstance().getWinSize();
		var x = Math.max(point.x, size.width/2);
		var y = Math.max(point.y, size.height/2);
		x = Math.min(x, (this.tileMap.getMapSize().width* this.tileMap.getTileSize().width)-size.width/2);
		y = Math.min(y, (this.tileMap.getMapSize().height* this.tileMap.getTileSize().height)-size.height/2);
		var actualPosition = cc.p(x,y);
		var centerOfView = cc.p(size.width/2,size.height/2);
		var viewPoint = cc.pSub(centerOfView, actualPosition);
		this.setPosition(viewPoint);	
	}

});

ExampleLayer.create = function() {
	var ml = new ExampleLayer();
	if (ml && ml.init()) {
		return ml;
	} else {
		throw "Couldn't create the main layer of the game. Something is wrong.";
	}
	return null;
};

ExampleLayer.scene = function() {
	var scene = cc.Scene.create();
	var layer = ExampleLayer.create();
	scene.addChild(layer);
	return scene;
};


var jc = jc || {};
jc.CompositeButton = cc.Sprite.extend({
    initWithDefinition:function(def, onTouch){
        if (!def){
            throw "Must supply a definition";
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
        this.scheduleUpdate();
    },
    onEnter: function(){
        if ('mouse' in sys.capabilities) {
            cc.Director.getInstance().getMouseDispatcher().addMouseDelegate(this, 0);
        } else {
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
        }
    },
    onExit: function(){
        if ('mouse' in sys.capabilities) {
            cc.Director.getInstance().getMouseDispatcher().removeMouseDelegate(this);
        } else {
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        }
    },
    onTouchBegan: function(touch) {
        if(this.frameCheck(touch)){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.def.pressed);
            this.setDisplayFrame(frame);
            return true;
        }else{
            return false
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
        var touchLocation = this.getParent().convertToNodeSpace(touch);  // Convert to the node space of this class

        return touchLocation;
    },
    isTouchInside:function (touch) {
        //todo: these touches not registering on mobile - debug with safari
        if (touch instanceof Array){
            touch= touch[0].getLocation()
        }else{
            touch= touch.getLocation();
        }

        return cc.rectContainsPoint(this.getBoundingBox(), this.getTouchLocation(touch));
    },
    onTouchMoved: function(touch) {
        return false;
    },
    onTouchEnded: function(touch) {
        if(this.frameCheck(touch)){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.def.main);
            this.setDisplayFrame(frame);
            if (this.onTouch && !this.paused){
                this.onTouch();
            }
            return true;
        }else{
            return false;
        }
    },
    onMouseDown: function(event) {
        return this.onTouchBegan(event);
    },
    onMouseUp: function(event) {
        return this.onTouchEnded(event);
    },
    setTouchDelegate:function(inFunc){
        this.onTouch = inFunc;
    },
    pause:function(){
        this.paused = true;
    },
    resume:function(){
        this.paused = false;
    }


});
var jc = jc || {};
jc.GameObject = function(){

}

jc.GameObject.prototype.init = function(){
    this.hp = this.MaxHP;
}

//modified version of _.extend
jc.inherit = function(child, parent){
    for (var prop in parent) {
        if (child[prop]==undefined){
            child[prop] = parent[prop];
        }
    }
    return child;
}

var jc = jc || {};
var LayerManager = function(){
    this.layers = [];
}

LayerManager.prototype.pushLayer = function(layer, z){
    layer.resume();
    if (this.currentLayer){
        this.currentLayer.darken();
        this.currentLayer.pause();
        this.currentLayer.addChild(layer, z);
    }else{
        this.currentLayer = layer;
    }

    layer.setPosition(cc.p(0,0));
    this.layers.push(layer);

//    layer.start();

}

LayerManager.prototype.popLayer = function(){
    var layer = this.layers.pop();
    if (this.layers.length>0){
        this.currentLayer = this.layers[this.layers.length-1];
    }else{
        throw "No Layers"; //TODO: transition to previous scene using scene manager?
    }

    layer.pause();
    this.currentLayer.removeChild(layer);
    this.currentLayer.undarken();
    this.currentLayer.resume();
    this.currentLayer.onShow();
}


jc.layerManager = new LayerManager();
var jc = jc || {};
jc.localstorage = {};
jc.setLocalStorage = function(key, value){
    //ignore result - hack around chrome bugs, must read to set
    jc.getLocalStorage(key);
    sys.localStorage.setItem(key,JSON.stringify(value));
}

jc.getLocalStorage = function(key){
    var val;

    val = jc.localstorage[key];

    if (!val){
        try{
            val = JSON.parse(sys.localStorage.getItem(key));
        }catch(e){
            return undefined;
        }
        if (val){
            jc.localstorage[key]=val;
        }
    }

    return val;

}
jc.PanAndZoom = cc.ActionInterval.extend(/** @lends cc.PanAndZoom# */{
    /**
     * @param {Number} duration duration in seconds
     * @param {cc.Point} position
     * @return {Boolean}
     */
    initWithDuration:function (duration, position, sx, sy) {
        if (position.x == undefined || position.y==undefined){
            throw "Position is not a point";
        }
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
//            if (sx >1 ){
//                sx = 1;
//            }
//            if (sy>1){
//                sy = 1;
//            }
            position.x = position.x*sx;
            position.y = position.y*sy;
            this._endPosition = position;
            this._endScaleX = sx;
            this._endScaleY = (sy != null) ? sy : sx;

            return true;
        }

        return false;
    },

    /**
     * @param {Number} target
     */
    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._previousPosition = this._startPosition = target.getPosition();
        this._delta = cc.pSub(this._endPosition, this._startPosition);
        this._startScaleX = target.getScaleX();
        this._startScaleY = target.getScaleY();
        this._deltaX = this._endScaleX - this._startScaleX;
        this._deltaY = this._endScaleY - this._startScaleY;

    },

    /**
     * @param {Number} time time in seconds
     */
    update:function (time) {
        if (this._target) {
            var currentPos = this._target.getPosition();
            var diff = cc.pSub(currentPos, this._previousPosition);
            this._startPosition = cc.pAdd(this._startPosition, diff);
            var newPos = cc.p(this._startPosition.x + this._delta.x * time,
                this._startPosition.y + this._delta.y * time);
            this._target.setPosition(newPos);
            this._previousPosition = newPos;
            this._target.setScale(this._startScaleX + this._deltaX * time, this._startScaleY + this._deltaY * time);
        }
    },
    _endPosition:cc.p(0, 0),
    _startPosition:cc.p(0, 0),
    _delta:cc.p(0, 0),
    _scaleX:1,
    _scaleY:1,
    _startScaleX:1,
    _startScaleY:1,
    _endScaleX:0,
    _endScaleY:0,
    _deltaX:0,
    _deltaY:0
});

/**
 * @param {Number} duration duration in seconds
 * @param {cc.Point} position
 * @return {cc.MoveTo}
 * @example
 * // example
 * var actionTo = cc.MoveTo.create(2, cc.p(windowSize.width - 40, windowSize.height - 40));
 */
jc.PanAndZoom.create = function (duration, position, scaleX, scaleY) {
    var go = new jc.PanAndZoom();
    go.initWithDuration(duration, position, scaleX, scaleY);

    return go;
};


jc.PowerTile = jc.CompositeButton.extend({
    tileSize:cc.size(50,50),
    borderPos: cc.p(130,130), //wtf is wrong with cocos positioning
    coolCheck: 0.05,
    initTile:function(){
        this.initWithSpriteFrameName("EmptyIcon.png");
        var cs = this.getContentSize();
        this.setScale(this.tileSize.width/cs.width, this.tileSize.height/cs.height);

        this.border = new cc.Sprite();
        this.border.initWithSpriteFrameName("Border5.png");
        this.addChild(this.border, 10);
        this.border.setPosition(this.borderPos); //wtf is wrong with cocos positioning

        this.onTouchBegan = this.touchBeganOverride;
        this.onTouchEnded = this.touchEndedOverride;


    },
    initFromName:function(name, parentLayer){
        if (!name){
            return;
        }
        this.parentLayer = parentLayer;
        this.name = name;
        cc.SpriteFrameCache.getInstance().addSpriteFrames(powerTiles[name].plist);
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(powerTiles[name].icon);
        this.setDisplayFrame(frame);
        this.on=true;

    },
    setSelected:function(){
        //apply the touched border sprite
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("Border3.png");
        this.border.setDisplayFrame(frame);

    },
    setUnselected:function(){
        //apply the touched border sprite
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("Border5.png");
        this.border.setDisplayFrame(frame);
    },
    onTouch:function(){
        //if I'm cooling down, just exit
        if (this.cooling){
            return;
        }

        if (!this.on){
            return;
        }

        this.cooling = true;

        var shadeOp = 225;

        this.parentLayer.setSelected(this);

        //get config
        var config = powerTiles[this.name];
        this.executed = Date.now();
        var func = globalPowers[config['offense']].bind(this);
        if (config.type == "direct"){
            hotr.arenaScene.layer.nextTouchDo(function(touch, sprites){
                func(touch, sprites);
                jc.shade(this, shadeOp);
                this.parentLayer.scheduleThisOnce(this.doCoolDown.bind(this),this.coolCheck);
            }.bind(this));

        }else if (config.type == "global"){
            func();
            jc.shade(this, shadeOp);
            this.parentLayer.scheduleThisOnce(this.doCoolDown.bind(this),this.coolCheck);
        }else{
            throw "Unknown power type.";
        }

        return false;
    },
    doCoolDown:function(){
        var config = powerTiles[this.name];
        var time = Date.now() - this.executed;

        var ratio = time/config.cooldown;
        if (ratio >=1){
            this.shade.setContentSize(cc.size(this.tileSize.width, this.tileSize.height));
            this.cooling = false;
            jc.unshade(this);
        }else{
            //reduce height of this.shade by the percent of the cooldown that has passed
            var size = this.shade.getBoundingBox().size;
            size.height = this.tileSize.height - (this.tileSize.height* ratio);
            this.shade.setContentSize(size);
            this.parentLayer.scheduleThisOnce(this.doCoolDown.bind(this),this.coolCheck);

        }





    },
    touchBeganOverride: function(touch){
        if(this.frameCheck(touch)){
            return true;
        }
    },
    touchEndedOverride: function(touch) {
        if(this.frameCheck(touch)){
            if (this.onTouch && !this.paused){
                this.onTouch();

            }
            return true;
        }else{
            return false;
        }
    }

});

//place border

//place power behind border

//if power empty or length < display empty power

//add to sprite touch

//flash and fade (jc.utils)

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

            this.doUpdate = false;
            this.scheduleUpdate();
            return true;
        } else {
            return false;
        }
    },
    setIndex: function(val){
        console.log("set on: "+val);
        this.doUpdate = false;
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
            console.log("touchbegan");
            this.initialTouch = touch;
            this.scrollDistance = undefined;
        }

        if (type == jc.touchEnded && this.initialTouch){
            console.log("touchend");
            this.fling(touch, sprites);
        }

        if (type == jc.touchMoved && this.initialTouch){
            console.log("touchmove");
            this.scroll(touch);
        }
        return true;
    },
    fling:function(touch, sprites){
        this.isMoving=false;
        console.log("fling");
        if (this.scrollDistance == undefined){ //normal touch
            console.log("fling touch");
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
        var fsX = this.calcAbsolutePos(0).x;
        if (fsX> this.midPoint){
            this.doUpdate = false;
            this.isMoving = false;
            this.setIndex(0);
            console.log("edge");
            return true;
        }

        //if last sprite is past middle rect, stop adjust to last cell middle on center line
        var lsX = this.calcAbsolutePos(this.sprites.length-1).x;
        if (lsX < this.midPoint){
            this.doUpdate = false;
            this.isMoving = false;
            this.setIndex(this.sprites.length-1);
            //this.runEndingAdjustment(cc.p(this.midPoint-lsX , 0));
            console.log("edge2");
            return true;
        }
        return false;
    },
    centerOn: function(sprite){
        var pos = sprite.getPosition();
        var worldPos = this.convertToWorldSpace(pos);
        var augment = this.midPoint - worldPos.x;
        console.log("Center needs:" + augment);
        this.runEndingAdjustment(cc.p(augment,0));
    },
    runEndingAdjustment:function(augment){
        if (!this.endAdjustmentRunning){
            this.endAdjustmentRunning = true;
            console.log("runEndingAdjustment:" + this.doUpdate);
            var func = cc.CallFunc.create(this.raiseSelected.bind(this));
            var action = cc.MoveBy.create(jc.defaultTransitionTime/2, augment);
            var seq = cc.Sequence.create(action, func);
            this.runAction(seq);
        }

    },
    raiseSelected:function(){
        console.log("raiseSelected:" + this.doUpdate);
        this.endAdjustmentRunning = false;
        for(var i =0;i<this.sprites.length;i++){ //todo: change to math based
            var sprite = this.sprites[i];
            var data = this.metaData[i];
            var bb = sprite.getBoundingBox();
            bb.origin = this.convertToWorldSpace(bb.origin);
            if (cc.rectContainsPoint(bb, cc.p(this.midPoint, bb.origin.y))){
                this.applyHighlight(sprite);
                if (i != this.selectedIndex){
                    this.selectedIndex = i;
                    this.def.selectionCallback(i, sprite, data);
                }
                console.log("Found:"+i);
                return;
            }
        }

        //if we're here we're really far out and need to readjust
        this.setIndex(this.selectedIndex);
    },
    applyHighlight:function(sprite){
        //todo: layer a nicer sprite
        var color = cc.c4f(255.0/255.0, 255.0/255.0, 0.0/255.0, 1.0);
        this.drawBorder(sprite,color,2);
    },
    update:function(dt){
        if (this.doUpdate){
            console.log("updating");
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

            this.doUpdate = !this.edgeAdjust();
        }
    },
    calcAbsolutePos:function(position){
          return this.convertToWorldSpace(this.sprites[position].getPosition());
    },
    adjust:function(){
        var min=-1;
        var closest;
        console.log("adjust");
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
        console.log("scroll");
        var bb = this.getBoundingBox();
        var moveDistance = cc.pSub(touch, this.initialTouch);
        var change = cc.p(moveDistance.x,0 );
        this.scrollDistance = change;
        this.doUpdate= true;
        this.isMoving = true;
    }

});
var jc = jc || {};
jc.AnimationTypeOnce=1;
jc.AnimationTypeLoop=0;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
  
jc.Sprite = cc.Sprite.extend({
    layer:undefined, //parent reference
	alive:true,
    initWithPlist: function(plist, sheet, firstFrame, config) {
        this.HealthBarWidth = 20;
        this.HealthBarHeight = 5;
        this.animations = {};
		this.batch = null;
		this.state = -1;
		this.moving = 0;
		this.currentMove = null;
		this.idle = 0;
		this.name = config.name;
        this.baseOffset = config.baseOffset;
		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist);
		this.batch = cc.SpriteBatchNode.create(sheet);
        this.batch.retain();
        this.effects = {};
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(firstFrame);

		this.initWithSpriteFrame(frame);
        this.type = config.type;
        if(this.type != 'background'){
            this.superDraw = this.draw;
            this.draw = this.customDraw;
            this.initHealthBar();
            this.initShadow();
        }

        this.debug = false;

        //if we don't have a behavior, default to tank
        if (!config.behavior){
            config.behavior = 'tank';
        }

        //look up behavior
        var behaviorClass = BehaviorMap[config.behavior];
        if (!behaviorClass){
            throw 'Unrecognized behavior name: ' + config.behavior;
        }

        //set it
        var behavior = new behaviorClass(this);

        this.behavior = behavior;
        this.behaviorType = config.behavior;


        this.gameObject = new jc.GameObject();
        if(config.gameProperties){
            _.extend(this.gameObject, config.gameProperties);
        }
        this.gameObject.init();

		return this;
	},
    die:function(){
        this.imdeadman=true;
        this.layer.removeChild(this);
        this.layer.removeChild(this.shadow);
        this.layer.removeChild(this.healthBar);
        this.cleanUp();
    },
    disableHealthBar:function(){
        this.hideHealthbar = true;
    },
    initShadow:function(){
        this.shadow = new cc.Sprite();
        cc.SpriteFrameCache.getInstance().addSpriteFrames(shadowPlist);
        cc.SpriteBatchNode.create(shadowPng);
        //todo change to size of sprite
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("shadowSmall.png");
        this.shadow.initWithSpriteFrame(frame);
        this.shadow.setScaleX(0.5);
        this.layer.addChild(this.shadow);
        this.layer.reorderChild(this.shadow, jc.shadowZOrder);
        this.updateShadowPosition();
    },
    initHealthBar:function(){
        this.healthBar = cc.DrawNode.create();
        this.healthBar.contentSize = cc.SizeMake(this.HealthBarWidth, this.HealthBarHeight);
        this.layer.addChild(this.healthBar);
        this.updateHealthBarPos();
    },
	cleanUp: function(){
		if (this.currentMove){
            this.stopAction(this.currentMove);
            this.currentMove.release();
            this.currentMove = undefined;
        }

        //this.stopAction(this.animations[this.state].action);
		this.state = -1;
        this.layer.removeChild(this.shadow);
        this.layer.removeChild(this.healthBar);
        for(var i =0; i<this.animations.length; i++){
			this.animations[i].action.release();
		}
        this.batch.release();

	},
	addDef: function(entry) {
		if (entry.nameFormat==undefined){
            throw "Nameformat is required in a sprite definition.";
        }
        if (entry.state==undefined){
            throw "State is required in a sprite definition.";
        }
        if (entry.type==undefined){
            throw "Animation type 'type' is required in a sprite definition.";
        }
        if (entry.delay==undefined){
            throw "Animation delay 'delay' is required in a sprite definition.";
        }

        var action = this.makeAction(entry);
        action.retain();
		entry.action = action;
		this.animations[entry.state] = entry;				
	},
	makeAction: function(entry){
		var animFrames = [];
		var str = "";
		var frame;
		var start = entry.start;
        var end = entry.end;
        if (start == undefined){
            start = 0;
        }
        if (end == undefined){
            if (entry.frames == undefined){
                throw "You must provide either an end range or a number of frames when creating an entry.";
            }
            end = entry.frames-1;
        }

		//loop through the frames using the nameFormat and init the animation
        for (var i = start; i <= end; i++) {
			str = entry.nameFormat.format(i); 
			frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
			if (!frame){
				throw "Couldn't get frame. What is: " + str;
			}
			animFrames.push(frame);			
		}
    	//make the animation
		var animation = cc.Animation.create(animFrames, entry.delay);		
		var action;
		//if the entry type is a loop create a forver action
		if (entry.type == jc.AnimationTypeLoop){
 			action = cc.RepeatForever.create(cc.Animate.create(animation));
			action.tag = entry.state;

		}else{
			//otherwise assume a one play with animationDone as an ending func
	        //we'll extend this with more types later. This is all I need right now
	        var ftAction = cc.Animate.create(animation);
			var repeater = cc.Repeat.create(ftAction, 1);
			var onDone = cc.CallFunc.create(this.animationDone, this);
			action = cc.Sequence.create(repeater, onDone);
			action.tag = entry.state;

		}
		return action;
	},
    update: function(dt){
        if (!this.isAlive()){
            this.think(dt);
        }
    },
    getTargetRadius:function(){
        return this.gameObject.targetRadius;
    },
    getTargetRadiusY:function(){
        return this.gameObject.targetRadius/4;
    },
    getSeekRadius: function(){
        return this.gameObject.seekRadius;
    },
    getBasePosition:function(){
        //get the position of this sprite, push the y coord down to the base (feet)
        var point = this.getPosition();
        var box = this.getContentSize();
        point.y -= box.height/2;
        return point;
    },
    setBasePosition:function(point){
        var box = this.getContentSize();
        point.y += box.height/2;
        this.setPosition(point);
        this.layer.reorderChild(this, point.y*-1);
        this.updateHealthBarPos();
        this.updateShadowPosition();
    },
    moveTo: function(point, state, velocity, callback){
		jc.log(['sprite', 'move'],"Moving:"+ this.name);
		var moveDiff = cc.pSub(point, this.getPosition());
		var distanceToMove = cc.pLength(moveDiff);
		var moveDuration = distanceToMove/velocity;

		//todo: update this to transition
		if (this.currentMove != undefined){
			jc.log(['sprite', 'move'],'Stopping move in process.');
			this.stopAction(this.currentMove);
			this.currentMove.release();
			this.currentMove = undefined;
		}
		
		//set our moving state    
		jc.log(['sprite', 'move'],'Setting state to required move.');
		this.setState(state);
		
		//if a callback wasn't supplied, set callback to the internal moveEnded
		if (!callback){
			callback = this.moveEnded.bind(this);
		}
		
		//bust a move
		var moveAction = cc.MoveTo.create(moveDuration, point);
		
		jc.log(['sprite', 'move'],'creating the move sequence');
		this.currentMove = cc.Sequence.create(moveAction, cc.CallFunc.create(callback));
		this.currentMove.retain();
		
		//run it
		jc.log(['sprite', 'move'],'running move sequence');
		this.runAction(this.currentMove);		
	},
    isAlive: function(){
        if (this.gameObject.hp>0){
            return true;
        }else{
            return false;
        }
    },
	moveEnded: function(){
		this.setState(this.idle);
		this.stopAction(this.currentMove);		
	},
	animationDone:function(){
        var call;
        if (this.animations[this.state].callback){
            call = this.animations[this.state].callback;
        }
        //this.setState(this.nextState);
        if (call){
            call(this.nextState);
        }
	},
    getState:function(){
        return this.state;
    },
    addEffect:function(effect){
        this.effects[effect.name]= effect;
    },
    removeEffect:function(effect){
        delete this.effects[effect];
    },
	setState:function(state, callback){
        if (!state){
            throw "Undefined state passed to setState";
        }
		//catch next state and current state
        var currentState = this.state;
		this.state = state;

        jc.log(['sprite', 'state'],"State Change For:" + this.name + ' from:' + currentState + ' to:' + this.state);

        //no need to do anything
        if (this.state == currentState){
			jc.log(['sprite', 'state'],"Trying to set a state already set, exit");
			return;
		}

        //if I'm dead, return state shouldn't be idle
        if (this.isAlive()){
            this.nextState = 'idle';
        }else{
            this.nextState = 'dead';
        }

        //make sure start state is known
        var startMe = this.animations[this.state];
        var stopMe = this.animations[currentState];
        if (!startMe){
            throw "Couldn't start state. What is state: " + this.state + " currentState:" + currentState;
        }

        //capture callback if one is provided
        startMe.callback = callback;

        //if this isn't my first state call, we need to stop an action
        if (currentState != -1){
            //make sure the stop state exists
            if (!stopMe){
                throw "Couldn't stop state. What is currentState:" + currentState;
            }
            jc.log(['sprite', 'state'],"Stopping action.");
            if(stopMe.action){
                this.stopAction(stopMe.action);
            }
		}

        jc.log(['sprite', 'state'],"Starting action.");
        if (startMe.action){
            this.runAction(startMe.action);
        }

        if (this.type!='background'){
            this.updateHealthBarPos();
            this.updateShadowPosition();
        }

	},
	centerOnScreen:function(){
		var size = cc.Director.getInstance().getWinSize();
		var x = size.width/2;
		var y = size.height/2;
		this.setPosition(cc.p(x,y));
	},
    setBehavior: function(behavior){
        var behaviorClass = BehaviorMap[behavior];
        if (!behaviorClass){
            throw 'Unrecognized behavior name: ' + behavior;
        }
        this.behavior = new behaviorClass(this);
    },
    think:function(dt){
        this.behavior.think(dt);
    },
    customDraw:function(){
        if (!this.imdeadman){
            this.superDraw();
            if (this.debug){
                this.drawBorders();
            }
            this.drawHealthBar();
        }
    },
    drawBorders:function(){

        var position = this.getBasePosition();
        var rect = this.getTextureRect();
        if (!this.debugTextureBorder){
            this.debugTextureBorder = cc.DrawNode.create();
            this.layer.addChild(this.debugTextureBorder);
            position.x = position.x - rect.width/2;
            this.debugTextureBorder.setPosition(position);
        }

        var color = cc.c4f(0,0,0,0);
        var border = cc.c4f(35.0/255.0, 28.0/255.0, 40.0/255.0, 1.0);

        this.debugTextureBorder.clear();
        this.drawRect(this.debugTextureBorder, this.getTextureRect(), color, border,4);

    },
    drawRect:function(poly, rect, fill, border, borderWidth){
        var height = rect.height;
        var width = rect.width;
        var vertices = [cc.p(0, 0), cc.p(0, height), cc.p(width, height), cc.p(width, 0)];
        poly.drawPoly(vertices, fill, borderWidth, border);
    },
    drawHealthBar: function(){
        if (!this.hideHealthbar){
            this.healthBar.clear();
            var verts = [];
            verts[0] = cc.p(0.0, 0.0);
            verts[1] = cc.p(0.0, this.HealthBarHeight - 1.0);
            verts[2] = cc.p(this.HealthBarWidth - 1.0, this.HealthBarHeight - 1.0);
            verts[3] = cc.p(this.HealthBarWidth - 1.0, 0.0);

            var clearColor = cc.c4f(255.0/255, 0.0, 0.0, 1.0);
            var fillColor = cc.c4f(26.0/255.0, 245.0/255.0, 15.0/255.0, 1.0);
            var borderColor = cc.c4f(35.0/255.0, 28.0/255.0, 40.0/255.0, 1.0);

            this.healthBar.drawPoly(verts,clearColor,0.7, borderColor);

            var verts2 = [];
            var hpRatio = this.gameObject.hp/this.gameObject.MaxHP;
            if (hpRatio <0){
                hpRatio = 0;
            }

            verts2[0] = cc.p(0.0, 0.0);
            verts2[1] = cc.p(0.0, this.HealthBarHeight - 1.0);
            verts2[2] = cc.p((this.HealthBarWidth - 2.0)* hpRatio + 0.5, this.HealthBarHeight - 1.0);
            verts2[3] = cc.p((this.HealthBarWidth - 2.0)* hpRatio + 0.5, 0.0);


            this.healthBar.drawPoly(verts2,fillColor,0.7, borderColor);
        }
    },
    updateHealthBarPos:function(){
        if (this.type != 'background'){
            var myPos = this.getBasePosition();
            var tr = this.getTextureRect();
            myPos.y += tr.height + 10;
            myPos.x -= this.HealthBarWidth/2;
            this.healthBar.setPosition(myPos);

        }
    },
    updateShadowPosition:function(){
        if (this.type!='background'){
            var pos = this.getBasePosition();
            var cs = this.getContentSize();

            pos.y += 5;
            if (!this.isFlippedX()){
                pos.x = (pos.x - cs.width) + 250;
            }else{
                pos.x = (pos.x - cs.width) + 270;
            }

            if (this.gameObject && this.gameObject.flightAug){
                pos.y-= this.gameObject.flightAug.y/2; //for flight, shadow should be further away
            }

            this.shadow.setPosition(pos);
        }
    }
});

//jc.Sprite.remapAnimations = function(character){
//    jc.Sprite.getMinMax(character);
//    var total = config.endFrame - character.startFrame;
//    for (var anim in character.animations){
//        character.animations[anim].start = (character.animations[anim].start+1) - character.startFrame; //normalize to 1
//        character.animations[anim].end = (character.animations[anim].end+1) - character.startFrame;
//    }
//
//}

jc.Sprite.getMinMax = function(character){
    var min = 99999;
    var max = -1;
    for (var anim in character.animations){
        if (character.animations[anim].start < min){
            min = character.animations[anim].start;
        }
        if (character.animations[anim].end > max){
            max = character.animations[anim].end;
        }
    }

    if (min == 99999){
        throw "something wrong..."

    }
    if (max == 99999){
        throw "something wrong..."
    }

    character.startFrame = min;
    character.endFrame = max;
}

jc.Sprite.spriteGenerator = function(allDefs, def, layer){

    //get details for sprite def
    var character = allDefs[def];

    if (!character){
        throw "Character not found: " + def;
    }

    //make a sprite
    var sprite = new jc.Sprite();

    //set the layer
    sprite.layer= layer;

    //nameformat
    var nameFormat = character.name + ".{0}.png";

    //if this character is inherited, find the parent
    if (character.inherit){
        //find who we inherit from, copy everything that doesn't exist over.
        var nameSave = character.name;
        _.extend(character, allDefs[character.inherit]);
        character.name = nameSave;
        character.parentOnly = undefined;
    }

    //are we brokified?
    if (character['animations']== undefined){
        throw def + " has a malformed configation. Animation property missing.";
    }


    //remap animations
    //jc.Sprite.remapAnimations(character);

    //what is our init frame?
    var firstFrame = character.animations['idle'].start;

    //make a game object, merge with props
    var gameObject = new jc.GameObject();
    _.extend(gameObject,character.gameProperties);

    //init
    character.type = 'character';
    sprite.initWithPlist(g_characterPlists[def], g_characterPngs[def], nameFormat.format(firstFrame), character);
    //create definitions from the animation states
    for (var animation in character.animations){
        //use this to create a definition in the sprite
        var useThis = jc.clone(character.animations[animation]);
        useThis.nameFormat = nameFormat; //jack this in.
        useThis.state = animation;
        sprite.addDef(useThis);
        if (animation == 'idle'){
            sprite.idle = animation;
        }
        if (animation == 'move'){
            sprite.moving = animation;
        }

    }

    //create an effect sprite and attach it if it exists.
    if (character.effect){
        jc.playEffectOnTarget(character.effect, sprite, layer, true);
    }

    //return the sprite;
    return sprite;
}


jc.randomNum= function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
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

            this.winSize = cc.Director.getInstance().getWinSize();
            this.superDraw = this.draw;
            this.draw = this.childDraw;
            this.superOnEnter = this.onEnter;
            this.onEnter = this.childOnEnter;
            this.superOnExit = this.onExit;
            this.onExit = this.childOnExit;
            this.touchTargets=[];
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
                cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 1, true);
            }else{
                cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
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
            item.runAction(moveAction);
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
    },
    runActionWithCallback: function(action, callback){
        var callbackAction = cc.CallFunc.create(callback);
        var seq = cc.Sequence.create(action, callbackAction);
        this.runAction(seq);
    }

});

var jc = jc || {};
var tracers = {
	'general':0,
	'touch':0,
    'touchcore':0,
    'touchid':0,
    'touchout':1,
	'mouse':0,
	'states':0,
	'sprite':0,
    'move':0,
    'updatetime':0,
	'memory':0,
	'tests':0,
	'requestManager':0,
    'gameplay':0
};

jc.log = function(categories, msg){
	for (var i =0;i<categories.length; i++){
		if (tracers[categories[i]]!=1){
			return;
		}
	}
	if (typeof msg == 'string' || msg instanceof String){
		cc.log(JSON.stringify(categories) + ': ' + msg);
	}else{
		cc.log(JSON.stringify(categories) + ': ' + JSON.stringify(msg));
	}

};

jc.clone = function (obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = jc.clone(obj[key]);
    return temp;
}
var jc = jc || {};

jc.UiConf = {};
jc.UiConf.frame19Rect = cc.RectMake(34,34,167,206);
jc.UiConf.frame20Rect = cc.RectMake(25,25,125,150);

jc.UiElementsLayer = jc.TouchLayer.extend({
    windowConfig:{
        "window":{
            "cell":8,
            "type":"scale9",
            "anchor":['top'],
            "transitionIn":"top",
            "transitionOut":"bottom",
            "size":{ "width":50, "height":50},
            "scaleRect":jc.UiConf.frame19Rect,
            "sprite":"frame 19.png",
            "padding":{
                "all":0
            }
            ,
            "kids":{
                "subwindow1":{
                    "cell":8,
                    "type":"scale9",
                    "input":true,
                    "size":{ "width":50, "height":50},
                    "scaleRect":jc.UiConf.frame20Rect,
                    "sprite":"frame 20.png",
                    "padding":{
                        "all":0
                    }
                },
                "subwindow2":{
                    "cell":2,
                    "type":"scale9",
                    "input":true,
                    "size":{ "width":50, "height":50},
                    "scaleRect":jc.UiConf.frame20Rect,
                    "sprite":"frame 20.png",
                    "padding":{
                        "all":0
                    }
                }
            }
        }
    },
    init: function() {
        if (this._super()) {
            this.windowConfigs = [];
            return true;
        }else{
            return false;
        }
    },
    done: function(){
        //transition windows out
        this.runningType = 'out';
        for(var i =0; i< this.windowConfigs.length; i++){
            var windowConfig = this.windowConfigs[i];
            if (windowConfig.config.transitionOut){
                this.doTransitionOut(windowConfig, this.onTransitionComplete.bind(this));
            }else{
                windowConfig.window.setVisible(false);
                this.onTransitionComplete();
            }
        }
    },
    onTransitionComplete:function(){
        this.incTransition();
        this.checkTransitionsDone()
    },
    incTransition:function(){
        if (!this.transitions){
            this.transitions=0;
        }
        this.transitions++;
    },
    checkTransitionsDone:function(){
        if (this.transitions == this.windowConfigs.length){
            this.transitions = 0;
            if (this.runningType == 'out'){
                this.outTransitionsComplete();
            }else{
                this.inTransitionsComplete();
            }
        }
    },
    outTransitionsComplete:function(){

    },
    inTransitionsComplete:function(){

    },
    start: function(){
        //transition windows in
        this.runningType = 'in';
        for(var i =0; i< this.windowConfigs.length; i++){
            var windowConfig = this.windowConfigs[i];
            if (windowConfig.config.transitionIn){
                this.doTransitionIn(windowConfig,this.onTransitionComplete.bind(this));
            }else{
                windowConfig.window.setPosition(windowConfig.position);
                windowConfig.window.setVisible(true);
                this.onTransitionComplete();
            }
        }
    },
    doTransitionIn:function(windowConfig, doneDelegate){
        switch(windowConfig.config.transitionIn){
            case 'right':
                this.slideInFromRight(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position,doneDelegate);
                break;
            case 'left':
                this.slideInFromLeft(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position,doneDelegate);
                break;
            case 'top':
                this.slideInFromTop(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position,doneDelegate);
                break;
            case 'bottom':
                this.slideInFromBottom(windowConfig.window, windowConfig.config.transitionInTime, windowConfig.position,doneDelegate);
                break;
        }
    },
    doTransitionOut:function(windowConfig, doneDelegate){
        switch(windowConfig.config.transitionOut){
            case 'right':
                this.slideOutToRight(windowConfig.window, windowConfig.config.transitionOutTime, undefined,doneDelegate);
                break;
            case 'left':
                this.slideOutToLeft(windowConfig.window, windowConfig.config.transitionOutTime, undefined,doneDelegate);
                break;
            case 'top':
                this.slideOutToTop(windowConfig.window, windowConfig.config.transitionOutTime, undefined,doneDelegate);
                break;
            case 'bottom':
                this.slideOutToBottom(windowConfig.window, windowConfig.config.transitionOutTime, undefined,doneDelegate);
                break;
        }
    },
    initFromConfig:function(configs, parent){
        for (var configName in configs){

            config = configs[configName];


            //parent is layer if parent doesn't exist
            if (!parent){
                parent = this;
            }

            if (config.isGroup){
                this.initFromGroupConfig(configName, config, parent);

            }else{

                var size = undefined;
                if (config.type == "scale9"){
                    size = this.calculateSize(config, parent);
                }

                //make it
                var window = this.makeWindowByType(config, size);

                if (!size){
                    size = window.getTextureRect();
                }

                //what cell is it anchored to
                var position = this.getAnchorPosition(config, size, parent);

                window.setPosition(cc.p(-1000,-1000));

                //have a variable for it
                this[configName] = window;
                window.name = configName;

                //add it to a collection
                this.windowConfigs.push({"window":window, "config":config, "position":position});

                //parent it
                parent.addChild(window);
                config.z = config.z | 0;
                parent.reorderChild(window, config.z);

                if (config.input){
                    this.touchTargets.push(window);
                }

                //what does it contain?
                if (config.kids){
                    this.initFromConfig(config.kids, window);
                }
            }
        }
    },
    makeWindowByType:function(config, size){
        var window;
        if (config.type == "scale9"){
            window = this.makeWindow(size,config.sprite, config.scaleRect);
        }else if (config.type == "sprite"){
            window = cc.Sprite.create();
            window.initWithSpriteFrameName(config.sprite);
            if (config.scale){
                window.setScaleX(config.scale/100);
                window.setScaleY(config.scale/100);
            }
        }else if (config.type == "button"){
            window = new jc.CompositeButton();
            if (!this[config.touchDelegateName]){
                throw "supplied:" + config.touchDelegateName + " for button click but it doesn't exist.";
            }
            window.initWithDefinition(config,this[config.touchDelegateName].bind(this));
            if (config.scale){
                window.setScaleX(config.scale/100);
                window.setScaleY(config.scale/100);
            }
        }else if (config.type == "label"){
            //var strInfo = arg[0] + "", fontName, fontSize, dimensions, hAlignment, vAlignment;
            var lblSize = cc.size(config.width, config.height);
            window = cc.LabelTTF.create(config.text, config.font, config.fontSize, lblSize, cc.TEXT_ALIGNMENT_LEFT);
            window.setColor(config.color);
        }else if (config.type == 'tile'){
            window = new jc.PowerTile();
            window.initTile();
        }
        return window;
    },
    initFromGroupConfig:function(name, config, parent){
        if (!config.members){
            return;
        }
        var total = config.membersTotal | config.members.length;

        switch(config.type){
            case 'line':
                this.initGrid(name,config, parent, 1, total);
                break;
            case 'stack':
                this.initGrid(name,config, parent, total, 1);
                break;
            case 'grid':
                this.initGrid(name,config, parent, total/config.cols, config.cols);
                break;
        }
    },
    initGrid:function(name,config, parent, rows, cols){
        var total = config.membersTotal || config.members.length;
        var size = parent.getContentSize();
        var itemSize;
        var lastSize;
        var itemSizeHardSet = false;
        if (config.itemSize){
            var itemWidth = size.width * config.itemSize.width/100;
            var itemHeight = size.height* config.itemSize.height/100;
            itemSize = cc.size(itemWidth, itemHeight);
            itemSizeHardSet = true;
        }

        var x = -1;
        var y = -1;
        var rowCount=0;
        var colCount=0;
        var initialPosition;
        for(var i =0;i<total;i++){
            var member;
            if (config.membersTotal){
                member = config.members[0]; // use the first over and over
            }else{
                member = config.members[i];
            }

            var window = this.makeWindowByType(member, itemSize);
            var elementSize = window.getBoundingBox().size;
            if (!itemSizeHardSet){
                itemSize = elementSize; //buttons and sprites set their own sizes
            }

            if (x==-1 && y==-1){
                initialPosition = this.getAnchorPosition(config, itemSize, parent);
                x = initialPosition.x;
                y = initialPosition.y;
//                if (config.itemPadding){
//                    if (config.itemPadding.all){
//                        y-=config.itemPadding.all;
//                        x+=config.itemPadding.all;
//                    }else{
//                        if (config.itemPadding.top){
//                            y-=config.itemPadding.top;
//                        }
//                        if (config.itemPadding.left){
//                            x+=config.itemPadding.left;
//                        }
//                    }
//                }
            }else if (colCount!=0){
                //the last pass, we moved x from the previous elements center, to where our center should be.
                //however, this assumes we're the same size as the previous element
                //if we are not, we'll overlap them. So here, we also need to apply some logic that moves us further if we're larger then the
                //last element;
                //if (lastSize.width < itemSize.width){
                    x+=itemSize.width/2;
                //}
            }

            //keep track
            parent.addChild(window);
            var instanceName;
            if (!member.name){
                instanceName = name+i;
            }else{
                instanceName = member.name;
            }
            window.name=instanceName;
            this[instanceName]=window;


            if (config.input){
                this.touchTargets.push(window);
            }
            if (config.itemPadding){
                if (config.itemPadding.all){
                    x+=config.itemPadding.all;
                }else{
                    if (config.itemPadding.left){
                        x+=config.itemPadding.left;
                    }
                }
            }
            var gridPos = cc.p(x,y);

            if (member.type == 'label'){
                gridPos.x+=window.getContentSize().width/2;
            }

            this.windowConfigs.push({"window":window, "config":member, "position":gridPos});


            //augment position for the next cell
            colCount++;
            if (colCount>=cols){
                rowCount++;
                x=initialPosition.x;
                y-=itemSize.height;
                if (config.itemPadding){
                    if (config.itemPadding.all){
                        y-=config.itemPadding.all;
                    }else{
                        if (config.itemPadding.top){
                            y-=config.itemPadding.top;
                        }
                    }
                }
                colCount = 0;
            }else{
                //move from my center, to the next center
                x+=itemSize.width/2;
                lastSize = itemSize;
            }

        }
    },

    calculateSize:function(config, parent){
        var size = parent.getContentSize();

        if (!config.size){
            throw "Size must be specified.";
        }

        //width height expressed as percentage of parent
        var w = config.size.width/100 * size.width;
        var h = config.size.height/100 * size.height;

        if(config.padding){
            if (config.padding.all!=undefined){
                w -= config.padding.all;
                h -= config.padding.all;

            }else{
                if (config.padding.right){
                    w -= config.padding.right;
                }
                if (config.padding.bottom){
                    h -= config.padding.bottom;
                }
            };
        }
        return cc.size(w,h);
    },
    getAnchorPosition:function(config, size, parent){
        if (!config.cell){
            throw "Need a cell";
        }
        if (!config.anchor){
            config.anchor=[];
        }
        var top;
        var left;
        var bottom;
        var right;
        var center;
        var parentSize = parent.getContentSize();
        var row = this.getRow(config.cell);
        var col = this.getCol(config.cell)
        var cellWidth = parentSize.width/3;
        var cellHeight = parentSize.height/3;
        var x= (cellWidth*col) + cellWidth/2;
        var y= (cellHeight*row) + cellHeight/2;
        for(var i =0; i<config.anchor.length; i++){
            var value = config.anchor[i];
            switch(value){
                case "top":
                    y+=cellHeight/2;
                    y-=size.height/2;
                    break;
                case "left":
                    x-=cellWidth/2;
                    x+=size.width/2
                    break;
                case "right":
                    x+=cellWidth/2;
                    x-=size.width/2;
                    break;
                case "bottom":
                    y-=cellWidth/2;
                    y+=size.height/2
                    break;
                case "center":
                    //default, do nothing;
                    break;
            }
        }

        if(config.padding){
            if (config.padding.all!=undefined){
                x+= config.padding.all;
                y+= config.padding.all;

            }else{
                if (config.padding.left){
                    x+= config.padding.left;
                }
                if (config.padding.top){
                    y-= config.padding.top;
                }
            }
        }


        return cc.p(x,y);
    },
    getRow:function(cell){
        if (cell <= 3){
            return 0;
        }
        if (cell <= 6){
            return 1;
        }
        if (cell <= 9){
            return 2;
        }
        throw "Cell must be 1-9";
    },
    getCol:function(cell){
        if (cell == 1 || cell == 4 || cell == 7 ){
            return 0;
        }
        if (cell == 2 || cell == 5 || cell == 8 ){
            return 1;
        }
        if (cell == 3 || cell == 6 || cell == 9 ){
            return 2;
        }
        throw "Cell must be 1-9";
    },
    centerThis:function(centerMe, centerOn){
        var pos = this.getAnchorPosition({"cell":5}, centerMe, centerOn);
        centerMe.setPosition(pos);
    },
    centerThisPeer:function(centerMe, centerOn){
        centerMe.setPosition(centerOn.getPosition());
    },
    scaleTo:function(scaleMe, toMe){
        var currentSize = scaleMe.getContentSize();
        var toSize = toMe.getContentSize();
        var scalex = toSize.width/currentSize.width;
        var scaley = toSize.height/currentSize.height;
        scaleMe.setScale(scalex, scaley);
    }

});

jc.UiElementsLayer.create = function() {
    var ml = new jc.UiElementsLayer();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

jc.UiElementsLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = jc.UiElementsLayer.create();
    scene.addChild(layer);
    return scene;

};


var jc = jc || {};



jc.moveActionWithCallback = function(point, rate, callback){
    var action = cc.MoveTo.create(rate, point);
    return jc.actionWithCallback(action, callback);

}

jc.cap = function(point, rect){
    if (point.x < rect.x){
        point.x = rect.x;
    }
    if (point.y < rect.y){
        point.y = rect.y
    }
    if (point.x > rect.width){
        point.x = rect.width;
    }
    if (point.y > rect.height){
        point.y = rect.height;
    }
}

jc.makeSpriteWithPlist = function(plist, png, startFrame){
    var sprite = new cc.Sprite();
    cc.SpriteFrameCache.getInstance().addSpriteFrames(plist);
    cc.SpriteBatchNode.create(png);

    //todo change to size of sprite
    var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(startFrame);
    sprite.initWithSpriteFrame(frame);
    return sprite;
}

jc.shade = function(item, op){
    if (!item.shade){
        item.shade = cc.LayerColor.create(cc.c4(15, 15, 15, 255));
        item.getParent().addChild(item.shade);
    }
    var pos = item.getPosition();
    var size = item.getBoundingBox().size;
    pos.x -= size.width/2;
    pos.y -= size.height/2;
    item.shade.setPosition(pos);
    item.shade.setContentSize(size);

    item.shade.setOpacity(0);
    item.getParent().reorderChild(item.shade,0);
    if (op == undefined){
        op = jc.defaultFadeLevel
    }
    jc.fadeIn(item.shade, op);

}

jc.unshade = function(item){
    jc.fadeOut(item.shade);
}

jc.fadeIn= function(item, opacity , time, action){
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
    if (action){
        var func = cc.CallFunc.create(action);
        var seq = cc.Sequence.create(actionFadeIn, func);
        item.runAction(seq);
    }else{
        item.runAction(actionFadeIn);
    }
}

//expects to be bound to cocos2d layer
jc.swapFade = function(swapOut, swapIn){
    if (swapOut){
        jc.fadeOut(swapOut, jc.defaultTransitionTime/4, function(){
            this.removeChild(swapOut);
            doFadeIn.bind(this)();
        }.bind(this));
    }else{
        doFadeIn.bind(this)();
    }

    function doFadeIn(){
        swapIn.setOpacity(0);
        this.addChild(swapIn);
        jc.fadeIn(swapIn, 255, jc.defaultTransitionTime/4);
    }
}

jc.fadeOut=function(item, time, action){
    if (!time){
        time = jc.defaultTransitionTime;
    }
    if (!item){
        item = this;
    }

    var actionFadeOut = cc.FadeTo.create(time,0);
    if (action){
        var func = cc.CallFunc.create(action);
        var seq = cc.Sequence.create(actionFadeOut, func);
        item.runAction(seq);
    }else{
        item.runAction(actionFadeOut);
    }



}

jc.makeAnimationFromRange = function(name, config){

    //animate it
    if (config.name){
        name = config.name;
    }

    var frames = [];
    var first =1;
    if (config.first){
        first = config.first;
    }

    for(var i =first;i<=config.frames;i++){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name + "." + i + ".png");
        frames.push(frame);
    }

    //reverse
    if (config.rev){
        for(var i =config.frames;i>=first;i--){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name + "." + i + ".png");
            frames.push(frame);
        }
    }


    var animation = cc.Animation.create(frames, config.delay);
    if (!config.times){
        return cc.RepeatForever.create(cc.Animate.create(animation));
    }else{
        return cc.Repeat.create(cc.Animate.create(animation), config.times);
    }

}

jc.playTintedEffectOnTarget = function(name, target, layer, child, r, g, b){
    var effect = jc.playEffectOnTarget(name, target, layer, child);
    if (effect){
        var fillColor = new cc.Color3B();
        fillColor.r =r;
        fillColor.b = b;
        fillColor.g = g;
        effect.setColor(fillColor);
    }

    return effect;
}

jc.playEffectOnTarget = function(name, target, layer, child){

    var config = effectsConfig[name];

    if (!target.effectAnimations){
        target.effectAnimations = {};
    }

    if (!target.effectAnimations[name]){
        target.effectAnimations[name] = {
                                            "sprite":jc.makeSpriteWithPlist(config.plist, config.png, config.start),
                                            "animation":jc.makeAnimationFromRange(name, config )
        };
    }


    if (target.effectAnimations[name].playing){
        return; //don't play if it's already playing on me
    }

    var parent;
    if (child){
        parent = target;
    }else{
        parent = layer;
    }

    var effect = target.effectAnimations[name].sprite;
    var effectAnimation = target.effectAnimations[name].animation;
    effect.setVisible(true);
    parent.addChild(effect);

    if (config.zorder == "behind" && !child){
        parent.reorderChild(effect,target.getZOrder()-1);
    }else if (config.zorder == "behind" && child) {
        parent.reorderChild(effect,-1);
    }
    else{
        parent.reorderChild(effect,target.getZOrder());
    }

    if (child){
        jc.setChildEffectPosition(effect, target, config);
    }else{
        jc.setEffectPosition(effect, target, config);
    }




    if (config.times){
        var onDone = cc.CallFunc.create(function(){
            parent.removeChild(effect);
            target.effectAnimations[name].playing =false;
        }.bind(this));

        var action = cc.Sequence.create(effectAnimation, onDone);
        effect.runAction(action);
    }else{
        effect.runAction(effectAnimation);
    }

    target.effectAnimations[name].playing =true;

    return effect;

}

jc.playEffectAtLocation = function(name, location, z, layer){

    var config = effectsConfig[name];
    var effect = jc.makeSpriteWithPlist(config.plist, config.png, config.start);
    var etr = effect.getTextureRect();
    var effectAnimation = jc.makeAnimationFromRange(name, config );
    //adjust location so we center ourselves on it...?

    effect.setPosition(location);
    effect.setVisible(true);
    layer.addChild(effect);
    layer.reorderChild(effect,z);
    if (config.times){
        var onDone = cc.CallFunc.create(function(){
            layer.removeChild(effect);
        }.bind(this));
        var action = cc.Sequence.create(effectAnimation, onDone);
        effect.runAction(action);
    }else{
        effect.runAction(effectAnimation);
    }
    return effect;

}

jc.setChildEffectPosition = function(effect, parent, config){
    var placement = config.placement;
    var effectPos = cc.p(0,0);
    var cs = parent.getContentSize();
    var tr = parent.getTextureRect();
    var etr = effect.getContentSize();

    if (placement){
        if (placement == 'bottom') {
            effectPos.y += etr.height/2; //up to feet
            effectPos.x += cs.width/2;
        }else if (placement=='ground'){
            effectPos.y += etr.height/2; //up to feet
            effectPos.x += cs.width/2;
            parent.reorderChild(effect,jc.groundEffectZOrder);

        }else if (placement == 'center'){
            effectPos.x += cs.width/2;
            effectPos.y += etr.height;
        }
        else if (placement == 'base2base'){
            effectPos.x += cs.width/2;
            effectPos.y -= cs.height/2;
            effectPos.y += etr.height;

        }else{
            throw "Unknown effect placement.";
        }
    }

    if (config.offset){
        var newPos = cc.pAdd(effectPos, config.offset);
        effect.setPosition(newPos);
    }else{
        effect.setPosition(effectPos);
    }

}

jc.setEffectPosition = function(effect, parent, config){
    var placement = config.placement;
    var base = parent.getBasePosition();
    var tr = parent.getTextureRect();
    var etr = effect.getTextureRect();

    if (placement){
        if (placement == 'bottom') {
            base.y += etr.height/2;
        }else if (placement == 'center'){
            base.y += tr.height/2;
        }else if (placement == 'top'){
            effect.setPosition(base);
        }else if (placement == 'base2base'){
            base.y += etr.height;
        }else{
            throw "Unknown effect placement.";
        }
    }

    if (config.offset){
        var newPos = cc.pAdd(base, config.offset);
        effect.setPosition(newPos);
    }else{
        effect.setPosition(base);
    }

}

jc.genericPower = function(name, value, attacker, target, config, element){
    if (!config){
        config = spriteDefs[value].damageMods[name];
    }
    var effect = {};
    effect = _.extend(effect, config); //add all props in config to effect
    effect.name = name;
    if (attacker){
        effect.origin = attacker;
    }else{
        effect.element = element;
    }

    target.addEffect(effect);
}

jc.genericPowerApply = function(effectData, effectName, varName,bObj){
    //examine the effect config and apply burning to the victim
    if (GeneralBehavior.applyDamage(bObj.owner, effectData.origin, effectData.damage, effectData.element)){
        if (!bObj.owner[varName]){
            bObj.owner[varName] = jc.playEffectOnTarget(effectName, bObj.owner, bObj.owner.getZOrder(), bObj.owner.layer, true);
        }
    }
}

jc.genericPowerRemove = function(varName,effectName, bObj){
    if (bObj.owner[varName]){
        bObj.owner.removeChild(bObj.owner[varName]);
    }
    delete bObj.owner[varName];
    bObj.owner.effectAnimations[effectName].playing = false;
}

jc.movementType = {
    "air":0,
    "ground":1
}

jc.targetType = {
    "air":0,
    "ground":1,
    "both":2,
}

jc.elementTypes = {
    "void":0,
    "water":1,
    "fire":2,
    "life":3,
    "none":4,
    "earth":5,
    "air":7
}

jc.getElementType = function(id){
    for(var type in jc.elementTypes){
        if (jc.elementTypes[type] == id){
            return type;
        }
    }
}

jc.checkPower = function(charName, powerName){

}

jc.insideEllipse = function(major, minor, point, center){
    //http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
    var xDiff = point.x - center.x;
    var yDiff = point.y - center.y;
    var majorSq = major*major;
    var minorSq = minor*minor;

    var final = ((xDiff*xDiff)/majorSq) + ((yDiff*yDiff)/minorSq);
    return final <1;
}

jc.getCharacterPortrait = function(name, size){
    var card =  jc.getCharacterCard(name);
    return card; //todo - revisit - this code is broken
    return jc.portraitFromCard(name, card,size);
}

jc.getCharacterCardFrame = function(name){
    var frame = name+".pic.png";
    var indexNumber = spriteDefs[name].cardIndex;
    if (indexNumber == undefined){
        indexNumber = 0;
    }

    cc.SpriteFrameCache.getInstance().addSpriteFrames(cardsPlists[indexNumber]);
    cc.SpriteBatchNode.create(cardsPngs[indexNumber]);

    return cc.SpriteFrameCache.getInstance().getSpriteFrame(frame);
}

jc.getCorrectPortraitPosition = function(position){
    //portraits coords are ipadhd
    //for now, just scale to iphone 3.
    //todo: add scale for device
    var newPos = cc.p(position.x, position.y);
    var augx = newPos.x*0.234375;
    var augy = newPos.y*0.234375;
    newPos.x=augx;
    newPos.y=augy;
    return newPos;
}

jc.portraitFromCard = function(name,card, size){
    var capturePos = jc.getCorrectPortraitPosition(spriteDefs[name].portraitXy);
    if (!capturePos){
        var cardSize = card.getContentSize();
        capturePos = cc.p(cardSize.width/2,cardSize.height/2);
    }
    var tr = card.getTextureRect();
    var cs = card.getContentSize();
    var widthDiff = cs.width - tr.width;
    var heightDiff = cs.height - tr.height;
    capturePos.x-=widthDiff;
    capturePos.y-=heightDiff;
    var rect = cc.RectMake(capturePos.x, capturePos.y,size.width,size.height);
    card.setTextureRect(rect);
    card.setContentSize(size);
    return card;
}

jc.getCharacterCard = function(name){
    var frame = name+"" +
        "_pose.png";
    var indexNumber = spriteDefs[name].cardIndex;
    if (indexNumber == undefined){
        indexNumber = 0;
    }
    return jc.makeSpriteWithPlist(cardsPlists[indexNumber], cardsPngs[indexNumber], frame);
}


jc.formations = {
    "4x3":[
        {"x":225,"y":225},
        {"x":225,"y":375},
        {"x":225,"y":525},
        {"x":225,"y":675},
        {"x":75,"y":300},
        {"x":75,"y":450},
        {"x":75,"y":600},

    ],
    "4x4x4a":[
        {"x":800,"y":400},
        {"x":800,"y":500},
        {"x":800,"y":600},
        {"x":800,"y":700},
        {"x":700,"y":400},
        {"x":700,"y":500},
        {"x":700,"y":600},
        {"x":700,"y":700},
        {"x":550,"y":400},
        {"x":550,"y":500},
        {"x":550,"y":600},
        {"x":550,"y":700},
    ],

    "4x4x4b":[
        {"x":1100,"y":400},
        {"x":1100,"y":500},
        {"x":1100,"y":600},
        {"x":1100,"y":700},
        {"x":1200,"y":400},
        {"x":1200,"y":500},
        {"x":1200,"y":600},
        {"x":1200,"y":700},
        {"x":1350,"y":400},
        {"x":1350,"y":500},
        {"x":1350,"y":600},
        {"x":1350,"y":700},
    ]

};


jc.backDropZOrder = -99999999;
jc.shadowZOrder = -99999998;
jc.groundEffectZOrder = -99999997;
var jc = jc || {};
jc.WorldLayer = jc.TouchLayer.extend({
    init: function(worldMap) {
        if (this._super()) {
            //set background layer
            this.backDrop = cc.Sprite.create(worldMap);
            this.addChild(this.backDrop);
            this.backDrop.setPosition(this.winSize.width/2, this.winSize.height/2);
            this.reorderChild(this.backDrop,  jc.backDropZOrder);
            this.worldSize = this.backDrop.getContentSize();
            var x = this.worldSize.width/2;
            var y = this.worldSize.height/2;
            this.worldMidPoint = cc.p(x,y);
            this.screenMidPoint = cc.p(this.winSize.width/2, this.winSize.height/2);
            this.worldBoundary = cc.RectMake(this.worldSize.width/4, this.worldSize.height/4, this.worldSize.width/2 + this.worldSize.width/4, this.worldSize.height/2 + this.worldSize.height/4);
            this.setViewCenter(cc.p(this.worldSize.width/2,this.worldSize.height/2));
            this.bubbleAllTouches(true);
            this.worldScale = {x:this.winSize.width/this.worldSize.width, y:this.winSize.height/this.worldSize.height};
            var scaleX = 0;
            this.aspectRatio = this.winSize.width/this.winSize.height;
            this.scaleTable = [];
            var i = 1;
            var inc = 0.2;
            while(scaleX <= 1){
                var myScaleX = 0;
                scaleX = parseFloat((this.winSize.width/(this.worldSize.width/i)).toFixed(2));
                if (scaleX > 1 ){
                    myScaleX =1;

                }else{
                    myScaleX = scaleX;
                }

                this.scaleTable.push({x:myScaleX, y:myScaleX/this.aspectRatio});
                i+=inc;
            }
            //this.scaleTable.push({x:1, y:1}); //make sure 1:1 is in there
            return true;
        } else {
            return false;
        }
    },
    getOkayScale:function(width,height){
        var okayHeight = width/this.aspectRatio;
        if (okayHeight >= height){
            return this.getScale(width,okayHeight);
        }else{
            while(okayHeight<height){
                width+=10;
                okayHeight = width/this.aspectRatio;
            }
            return this.getScale(width,okayHeight);
        }

    },
    panToWorldPoint:function(point, scale, rate, doneCallback){
        var converted = this.convertToLayerPosition(point)
        //console.log("Scale:" + JSON.stringify(scale));
        //Svar okScale = this.getClosestCorrectScale(scale);
        //console.log("Corrected Scale:" + JSON.stringify(okScale));
        this.doScale(scale, converted, rate, doneCallback);
    },
    fullZoomOut:function(rate, done){
        var scale = this.getScaleWorld();
        scale = this.getClosestCorrectScale(scale);
        var converted = this.convertToLayerPosition(cc.p(this.worldSize.width/2, this.worldSize.height/2));
        var action = jc.PanAndZoom.create(rate, converted, scale.x, scale.y );
        this.runActionWithCallback(action, done);
    },

    doScale:function(scale, pos, rate, callback){
        var action = jc.PanAndZoom.create(rate, pos , scale.x, scale.y );
        this.runActionWithCallback(action, callback);
    },
    getClosestCorrectScale:function(scale){
        //don't allow a zoom further in than 1
        var minEntry=undefined;
        //loop through the "allow scale aspects"
        for(var i =0; i<this.scaleTable.length; i++){
            var entry = this.scaleTable[i];
            //if an entry in our array, is > then what we've supplied, then it is a candidate for use
            //because we don't want to zoom in far enough to clip anyone, but we want to zoom in as close as we can
            //to what was supplied, without messing up the aspect
            if (entry.x <= scale.x && entry.y <= scale.y){
                if (!minEntry){
                    minEntry = entry;
                }else{
                    //if this entry is smaller then what we have as our min, but still bigger then what was supplied
                    //capture it
                    if (entry.x > minEntry.x && entry.y > minEntry.y){
                        minEntry = entry;
                    }
                }
            }
        }

        if (!minEntry){
            minEntry = this.scaleTable[this.scaleTable.length-1]; //max zoom in
        }
        return minEntry;   //return
    },
    getScale:function(width,height){
        var scale = {x:this.winSize.width/width, y:this.winSize.height/height};
        if (scale.x > 1){
            scale.x = 1;
        }
        if (scale.y > 1){
            scale.y=1;
        }
        return scale;

    },
    getScaleOne:function(){
        return {"x":1, "y":1};
    },
    getScale2x:function(){
        return this.getScale(this.worldSize.width/2, this.worldSize.height/2);
    },
    getScale4x:function(){
        return this.getScale(this.worldSize.width/4, this.worldSize.height/4);
    },
    getScale8x:function(){
        return this.getScale(this.worldSize.width/16, this.worldSize.height/16);
    },
    getScaleWorld:function(){
        return this.getScale(this.worldSize.width *0.9, this.worldSize.height*0.9);
    },
    convertToLayerPosition:function(point){
        jc.cap(point, this.worldBoundary);
        var pointAug = cc.pMult(point, -1);
        return cc.pAdd(pointAug, this.worldMidPoint);
    },
    convertToItemPosition:function(point){
        //get a screen position
        var screen = this.worldToScreen(point);

        //turn that screen position into a node position
        var node = this.convertToNodeSpace(screen);

        return node;

    },

    worldToScreen:function(point){

        //get the center of our view expressed as a world coord
        var viewWorldCenter = this.screenToWorld(this.screenMidPoint);

        //the difference from out world center to the world point in question
        var diff = cc.pSub(viewWorldCenter, point);

        diff.x *= this.getScaleX();
        diff.y *= this.getScaleY();

        //express this difference from our screen center
        var screendiff = cc.pSub(this.screenMidPoint, diff);

        return screendiff;

    },
    screenToWorld:function(point){
        return this.backDrop.convertToNodeSpace(point)

    },
    setViewCenter:function(point){
        var layerPoint = this.convertToLayerPosition(point);
        this.setPosition(layerPoint);
    },
    targetTouchHandler:function(type, touch, sprites){

    }
});

var jc = jc || {};
var RequestManager = function(){
	this.gameQueue = [];
	this.resourceQueue = [];
	jc.log(['requestManager'], 'scheduling updates');
	cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, this.worker, .01);
	
}

RequestManager.gameQId = 'game.queue.storage';
RequestManager.resQId = 'resource.queue.storage';
RequestManager.events = {};
RequestManager.types = {};
RequestManager.events.GameRequestQueued = 'game.req.queued';
RequestManager.events.ResourceRequestQueued = 'res.req.queued';
RequestManager.events.GameRequestSuccess = 'game.req.success';
RequestManager.events.GameRequestFailed = 'game.req.failed';
RequestManager.events.GameRequestStarted = 'game.req.started';
RequestManager.events.ResourceRequestSuccess = 'resource.req.success';
RequestManager.events.ResourceRequestFailed = 'resource.req.failed';
RequestManager.events.ResourceRequestStarted = 'resource.req.started';
RequestManager.types.game = 'game';
RequestManager.types.res = 'res';



RequestManager.prototype.queueGameRequest = function(request){
	request.type = RequestManager.types.game;
	this.gameQueue.push(request);
	jc.log(['requestManager'], 'gameRequest queued');
	this.emit('game.request.queued')
	this.serializeGameQueue();
}

RequestManager.prototype.queueResourceRequest = function(request){
	request.type = RequestManager.types.res;
	this.resourceQueue.push(request);
	jc.log(['requestManager'], 'resRequest queued');
	this.serializeResQueue();
}

RequestManager.prototype.getGameReq = function(){
	var req = this.gameQueue.shift();
	this.serializeGameQueue();
	return req;
}

RequestManager.prototype.getResourceReq = function(){
	var req = this.resourceQueue.shift();
	this.serializeResQueue();
	return req;
}

RequestManager.prototype.serializeToLocalStorage = function(id, item){
	sys.localStorage[id] = JSON.stringify(item);
}

RequestManager.prototype.serializeGameQueue = function(){
	this.serializeToLocalStorage(this.gameQid, this.gameQueue);
}

RequestManager.prototype.serializeResQueue = function(){
	this.serializeToLocalStorage(this.resQId, this.resourceQueue);
}


RequestManager.prototype.testEventFire = function(name, data){
	this._instance.emit(name, data);
}

RequestManager.prototype.worker = function(){
		cc.Director.getInstance().getScheduler().pauseTarget(this);
		
		//pull a request off the game queue, unless empty
		var req = this.getGameReq();
		if (req){	
			this.emit(RequestManager.events.GameRequestStarted, req);
		}else{
			req = this.getResourceReq();
			if (req){
				this.emit(RequestManager.events.GameRequestStarted, req);				
			}
		}
		
		if (req){ //there is a request in the queue
			//send the request
			req.success = this.success.bind(this);
			req.failure = this.failure.bind(this);
			jc.log(['requestManager'], 'sending request');
			ajax(req);
			
		}else{ //queue is empty...todo: anything to do here?
			
		}
		
		cc.Director.getInstance().getScheduler().resumeTarget(this);
}

RequestManager.prototype.success = function(req, res){
	var event;
	jc.log(['requestManager'], 'Request success');
	if (req.type == RequestManager.types.game){
		event = RequestManager.events.GameRequestSuccess;
	}else if (req.type == RequestManager.types.res){
		event = RequestManager.events.ResourceRequestSuccess;
	}else{
		throw 'unknown request type in request manager';
	}
	this.emit(event, {'req':req, 'res':res});		
}

RequestManager.prototype.failure = function(req, res){
	var event;
	jc.log(['requestManager'], 'Request failure');
	if (req.type == RequestManager.types.game){
		event = RequestManager.events.GameRequestFailure;
	}else if (req.type == RequestManager.types.res){
		event = RequestManager.events.ResourceRequestFailure;
	}else{
		throw 'unknown request type in request manager';
	}
	this.emit(event, {'req':req, 'res':res});		
}

RequestManager.getInstance = function(){
    if (!this._instance) {
		this._instance=new RequestManager();
		_.extend(this._instance, new jc.EventEmitter2({
			      						 wildcard: false,
			      						 newListener: false
			    					 }));
		
    }
    return this._instance;
}

jc.RequestManager = RequestManager;



//use case:
//dude queues a request

//request gets serialized to disk

//scheduler pulls a request, sends it out

//send/response fires event (what's the mean in this case? node style 'on'



var eventTest = _.extend({
    'name':'emit an event',
	'test--':function() {
		jc.log(['tests'],"test--emit an event running");
		var manager = jc.RequestManager.getInstance();
		manager.once('data', this['validateAsync'].bind(this));
		manager.emit('data', {
			'hi': 'hi'
		});
	},
	'validateAsync': function(someData) {
		jc.log(['tests'],"test--emit validating");
		this.assert(someData.hi=='hi');
		this.emit('validate',null);
	}
}, new TestRunner());

var diskTest = _.extend({
    'name':'verify that storage works',
	'test--': function(){
		var obj = {
			a:1,
			b:2,
			c:"hi",
			d:{
				a:1,
				c:"hi"
			}
		};
		sys.localStorage.setItem('gq', JSON.stringify(obj));
	},
	'validate': function(someData){
		var raw = sys.localStorage.getItem('gq');
		var obj = JSON.parse(raw);
		this.assert(obj.a == 1);
		this.assert(obj.b == 2);
		this.assert(obj.c == "hi");
		this.assert(obj.d.a == 1);
		this.assert(obj.d.a == 1);
		this.assert(obj.d.c == "hi");						
	}
}, new TestRunner);

var requestQueueSerializationTest = _.extend({
    'name':'verify that when I queue game stuff they end up on disk',
	'test--':function(){
		var manager = jc.RequestManager.getInstance();	
		manager.queueGameRequest({
			'url':'http://localhost:1337/tests.html',
			'method':'GET',
			'data':{
				'randomstuff':'stuff'
			}
		});
	},
	'validate':function(someData){
		var raw = sys.localStorage.getItem('gq');		
	}
}, new TestRunner());

var requestStartedEvent = _.extend({
	'name':'verify that I can send an http request and I will get an event stating it started',
	'test--':function(){
		jc.RequestManager.getInstance().once(jc.RequestManager.events.GameRequestStarted, this.validateAsync.bind(this));
		jc.RequestManager.getInstance().queueGameRequest({
			id:'requestStartedEvent',
			url:'http://localhost:1337/tests.js',		
		    method:'GET'
		});
	},
	'validateAsync':function(req){
		if (req.id == 'requestStartedEvent'){
			this.assert(req.url == 'http://localhost:1337/tests.js');
			this.assert(req.method == 'GET');
			this.emit('validate',null);			
		}		
	}
}, new TestRunner());

var requestSuccessEvent = _.extend({
	'name':'verify that I can send an http request and I will get an event stating it completed',
	'test--':function(){
		jc.RequestManager.getInstance().once(jc.RequestManager.events.GameRequestSuccess, this.validateAsync.bind(this));
		jc.RequestManager.getInstance().queueGameRequest({
			id: 'requestSuccessEvent',
			url:'http://localhost:1337/index.html',		
		    method:'GET'
		});
	},
	'validateAsync':function(answer){
		if (answer.req.id == 'requestSuccessEvent'){ //otherwise this isn't our request, ignore
			this.assert(answer.req.url == 'http://localhost:1337/index.html');
			this.assert(answer.req.method == 'GET');
			this.assert(answer.res.response != undefined);
			this.assert(answer.res.status == 200);
			this.emit('validate',null);					
		}
	}
}, new TestRunner());


var requestFailEvent = _.extend({
	'name':'verify that I can send an http request and I will get an event stating it completed if it fails',
	'test--':function(){
		jc.RequestManager.getInstance().once(jc.RequestManager.events.GameRequestFailure, this.validateAsync.bind(this));
		jc.RequestManager.getInstance().queueGameRequest({
			id: 'requestFailEvent',
			url:'http://localhost:1337/index1.html', //doesn't exist		
		    method:'GET'
		});
	},
	'validateAsync':function(answer){
		if (answer.req.id == 'requestFailEvent'){ //otherwise this isn't our request, ignore
			this.assert(answer.req.url == 'http://localhost:1337/index1.html');
			this.assert(answer.req.method == 'GET');
			this.assert(answer.res.status == 404);
			this.emit('validate',null);					
		}
	}
}, new TestRunner());

//todo: get async working up in this bizitch
var xmlHttpTest = _.extend({
	'name':'verify that I can send multiple http requests',
	'test--':function(){
		var done=0;
		ajax({
			method:'GET',
			url:'http://localhost:1337/index.html',
			success:function(){
				done++
				if (done>=3){
					this.emit('validate', null);
				}
			}.bind(this),
			failure:function(){
				this.assert(false);
			}.bind(this)			
		});
		ajax({
			method:'GET',
			url:'http://localhost:1337/index.html',
			success:function(){
				done++
				if (done>=3){
					this.emit('validate', null);
				}
			}.bind(this),
			failure:function(){
				this.assert(false);
			}.bind(this)			
		});
		ajax({
			method:'GET',
			url:'http://localhost:1337/index.html',
			success:function(){
				done++
				if (done>=3){
					this.emit('validate', null);
				}
			}.bind(this),
			failure:function(){
				this.assert(false);
			}.bind(this)
			
		});		
	},
	'validateAsync':function(answer){
		this.emit('validate', null);
	}
}, new TestRunner());


TestRunner.addTests([eventTest, xmlHttpTest, requestFailEvent, requestSuccessEvent, requestStartedEvent, requestQueueSerializationTest, diskTest, eventTest]);
var SpriteAnimationTest = function(spriteName, state, layer){
    var sprite = jc.Sprite.spriteGenerator(spriteDefs, spriteName, layer);
    sprite.debug= true;
    layer.addChild(sprite.batch);
    layer.addChild(sprite);
    sprite.centerOnScreen();
    sprite.setState(state, repeat);
    function repeat(){
        sprite.setState(state,repeat);
    }

}


var StateMachineTest = function(sprite1, sprite2, layer){
    var spriteOne = jc.Sprite.spriteGenerator(spriteDefs, sprite1, layer);
    var spriteTwo = jc.Sprite.spriteGenerator(spriteDefs, sprite2, layer);
    spriteOne.setBasePosition(cc.p(100,100));
    spriteTwo.setBasePosition(cc.p(200,200));
    layer.addChild(spriteOne);
    layer.addChild(spriteTwo);
    var updateCount = 0;

    layer.update = function(dt){
        //verify both sprites are idle

        spriteOne.think(dt);
        //spriteTwo.think(dt);

        if (updateCount == 0){
            //verify both sprites have locked onto one another
            if (sprite1.behavior.locked != sprite2){
                throw "sprite1 locked fail."
            }
        }

    }


}

var jc = jc || {};
jc.tests = jc.tests || {};
jc.tests.SpriteAnimationTest = SpriteAnimationTest;
jc.tests.StateMachineTest = StateMachineTest;

var TestLayer = cc.Layer.extend({	
	init: function() {
		if (this._super()) {
			TestRunner.runAll();
			//TestRunner.run([requestStartedEvent]);	
			return true;
		} else {
			return false;
		}
	},
});

TestLayer.create = function() {
	var ml = new TestLayer();
	if (ml && ml.init()) {
		return ml;
	} else {
		throw "Couldn't create the RequestManagerTestLayer. Something is wrong.";
	}
	return null;
};

TestLayer.scene = function() {
	var scene = cc.Scene.create();
	var layer = TestLayer.create();
	scene.addChild(layer);
	return scene;
};

var TestRunner = function(){
	_.extend(this, new jc.EventEmitter2({
	      						 wildcard: false,
	      						 newListener: false,
	      						 maxListeners: 1,
	    					 }));
}

TestRunner.addTests = function(tests){
	if (TestRunner.toRun == undefined){
		TestRunner.toRun = [];
	}
	
	TestRunner.toRun = TestRunner.toRun.concat(tests);
}

TestRunner.runAll = function(){
	TestRunner.run(TestRunner.toRun);
}

TestRunner.run = function(tests){
	TestRunner.count = 0;
	TestRunner.pending = tests.length;
	for (var i=0;i<tests.length;i++){
		var test = tests[i];
		for(var pro in test){
			if (pro.indexOf('test--')!=-1){
				jc.log(['tests'], "Running: " + test.name);				
				if (test.validate){
					test[pro](test);
					jc.log(['tests'], "Validating: " + test.name);
					test.validate();
					TestRunner.count++;
				}else{

					test.on('validate', function(name) { 
						return function(){
									jc.log(['tests'], "Validating: " + name);
									TestRunner.count++;
						}
					}(test.name));
					test[pro](test);
				}
			}
		}			
	}
	cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(TestRunner, TestRunner.worker, 1);
}

TestRunner.worker = function(){
	jc.log(['tests'], TestRunner.count + " of " + TestRunner.pending + " tests completed");
	if (TestRunner.count >= TestRunner.pending){
		jc.log(['tests'], "All Tests Done!");
		cc.Director.getInstance().getScheduler().unscheduleAllCallbacksForTarget(TestRunner);
	}
}

TestRunner.prototype.assert = function(theCase){
	if (!theCase){
		throw "TEST FAILED!!!! - " + this.name + "  - assert case failed. Info:" + JSON.stringify(this.getCallerInfo(), null, 4) ;
	}
}


TestRunner.prototype.getCallerInfo = function(){
	var level = 4;
	var err = (new Error);
	var obj = {};
	obj.stack = err.stack;	
	return obj;
}
	
	

function ajax(cfg)
{
    var xhr,
    url = cfg.url,
    method = cfg.method || 'GET',
    success = cfg.success || function () {},
    failure = cfg.failure || function () {},
	data = cfg.data || {};
    
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        throw ("Couldn't create xmlhttp = " + e);
        //xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    
    xhr.onreadystatechange = function (req)
    {
        return function(){
			if (xhr.readyState == 4) {
	            if (xhr.status == 200) {
	                success(req, {'status':xhr.status,'response':xhr.responseText});
	            } else {
	                failure(req, {'status':xhr.status,'response':xhr.responseText});
	            }
	        }	
		}
    }(cfg)
    
    xhr.open(method, url);
    xhr.send(data);
}
var cards = {};
cards.kik = {};
cards.kik.getAnonymousUser = function(cb){
    cb('joeiscool1');
}

cards.kik.anonymousSign = function(value, cb){
    cb("hihihihi1", "yabbo yaboo yaboo6", "mrmgue4uandwho");
}


cards.ready = function(cb){
    window.load = cb;
}

hotr.levelLogic = {};

var temp =  [
    {
        "name":"goblinKnightNormal",
        "id":"id1",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id2",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id3",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id4",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id5",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "data":{}
    }]



hotr.levelLogic.getTeamForLevel = function(level){
    return temp;
}

hotr.levelLogic.getFormationForLevel = function(level){
    return "4x4x4b";
}

hotr.levelLogic.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}
var Loading = jc.UiElementsLayer.extend({
    init: function(config) {

        this.assets = config.assets;
        this.nextScene = config.nextScene;
        this.apiCalls = config.apiCalls;
        this.assetFunc = config.assetFunc;


        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(loadingPlist);
            this.initFromConfig(this.windowConfig);
            this.start();
            return true;
        } else {
            return false;
        }
    },
    inTransitionsComplete:function(){
        //put the spinner in
        this.animationDone = true;
        this.spinner = jc.makeSpriteWithPlist(loadingPlist,loadingPng, "loader1.png");
        this.addChild(this.spinner);
        this.spinner.setPosition(cc.p((this.winSize.width/2)-1, (this.winSize.height/2)+26));
        this.startLoading();

    },
    startLoading:function(){

        //first thing calculate total items
        this.totalItemsToLoad = 0;
        this.totalItemsCompleted=0;
        if (this.assets){
            this.totalItemsToLoad+=this.assets.length;
        }else if (this.assetFunc){
            this.totalItemsToLoad++;
        }
        if (this.apiCalls){
            this.totalItemsToLoad +=this.apiCalls.length;
        }


        //before anything we need to get the assetFunc out of the way
        if (this.assetFunc){
            this.assetFunc(function(assets){
                this.totalItemsCompleted++;
                if (this.assets){
                    this.assets = this.assets.concat(assets);
                }else{
                    this.assets = assets;
                }
                this.totalItemsToLoad+=assets.length;
                this.startLoadingAssets();
            }.bind(this))
        }else{
            this.startLoadingAssets();
        }

        //if there
        if (this.apiCalls){
            this.startLoadingapiCalls();
        }

        this.schedule(this.checkPercent);
    },
    startLoadingAssets:function(){
        cc.Loader.preload(this.assets, function(){
            this.ccLoaderDone = true;
        }.bind(this));
    },
    startLoadingapiCalls:function(){
        var q = async.queue(function(task,callback){
            task.action(callback);
        }.bind(this),2);

        for (var i =0;i<this.apiCalls.length;i++){
            q.push({"name":i, "action":this.apiCalls[i]}, function(err){
                this.totalItemsCompleted++;
            }.bind(this));
        }

        q.drain= function(){
            jc.log(['loader'],"apiCalls done");
        }.bind(this);
    },
    raiseComplete:function(){
        this.done();
        this.unschedule(this.checkPercent);
        hotr.changeScene(this.nextScene);

    },
    checkPercent:function(){
        //implement loading bar once we have the sprites
        if (this.animationDone){

            var parts = 20; //we have 20 animation states for the bar

            //first, what is the asset loader at?
            var loader = cc.Loader.getInstance();


            //ccLoader is a bit of a piece, so - we need to patch it up with some stuff...
            //first if it finished, it will report getPercentage lower than 100 forever. so we track that
            var percent = 0;
            var totalAssets = 0;
            if (this.assets){
                if (this.ccLoaderDone==true){
                    percent = 100;
                }else{
                    percent = loader.getPercentage(); //it will also go over, so patch that down
                    if (percent> 100){
                        percent = 100;
                    }
                }
                //turn the loader percentage into a value representing the # of assets
                totalAssets = (percent*this.assets.length)/100;
            }else{
                totalAssets = 0;
            }


            //what does that represent?
            var tempDoneCount = totalAssets + this.totalItemsCompleted;

            //now convert that back to a percentage
            var percentDone = Math.floor((tempDoneCount/this.totalItemsToLoad) * 100);


            //calculate
            var part = Math.floor(percentDone * parts/100);
            if (part < 1){
                part = 1;
            }
            if (part > parts){
                part = parts;
            }
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader"+part+".png");
            this.spinner.setDisplayFrame(frame)

            if (tempDoneCount >= this.totalItemsToLoad){
                var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader20.png");
                this.spinner.setDisplayFrame(frame);
                this.scheduleOnce(this.raiseComplete.bind(this));

            }
        }
    },
    windowConfig:{
        "leftDoor":{
            "type":"sprite",
            "transitionIn":"left",
            "transitionOut":"left",
            "cell":4,
            "anchor":['left'],
            "sprite":"leftDoor.png",
            "padding":{
                left:10,
            }

        },
        "rightDoor":{
            "type":"sprite",
            "transitionIn":"right",
            "transitionOut":"right",
            "cell":6,
            "anchor":['right'],
            "sprite":"rightDoor.png",
            "padding":{
                left:-10,
            }

        }
    }
});


//todo: remove
//var transition = cc.TransitionSlideInR.create(EditDeck.scene, 2);
//cc.Director.getInstance().replaceScene(transition);
//return;
Array.prototype.pushUnique = function(value){
    if (!value){
        throw "Attempting to load undefined value.";
    }
    if (this.indexOf(value)==-1){
        this.push(value);
    }
}

var MainGame = cc.Layer.extend({
    state: 0,
    init: function() {
        if (this._super()) {
            return true;
        } else {
            return false;
        }
    },
    changeScene:function(key, assets, data){         //todo: change to layer manager


        switch(key){
            case 'selectTeam':
                cc.Director.getInstance().replaceScene(SelectTeam.scene());
                break;
            case 'editTeam':
                cc.Director.getInstance().replaceScene(EditTeam.scene());
                break;
            case 'arena':
                cc.Director.getInstance().replaceScene(hotr.arenaScene);
                break;
            case 'animationTest':
                cc.Director.getInstance().replaceScene(AnimationTest.scene());
                break;


        }
    },
    showLoader:function(config){
        var layer = new Loading();
        var runningScene = cc.Director.getInstance().getRunningScene();
        runningScene.addChild(layer);
        layer.init(config);

    },
    selectEditTeamPre: function(){

//        var testLoader =             {
//            "assets":[{src:g_characterPngs['blueKnight']}],
//            "assetFunc":function(callback){
//                hotr.blobOperations.getBlob(function(){
//                    var cardAssets = this.makeCardDictionary();
//                    callback(cardAssets);
//                }.bind(this))
//            }.bind(this),
//            "nextScene":'selectTeam',
//            "apiCalls":[
//                function(callback){
//                    hotr.blobOperations.getBlob(function(){
//                        console.log("aoi done");
//                        callback();
//                    })
//                },
//            ]
//        }

        this.showLoader({
            "assets":this.makeCardDictionary(),
            "nextScene":'selectTeam'
        });
    },
    arenaPre:function(){
        //todo: what level, get team
        //fight config
        ArenaGame.scene();
        var teamA = hotr.blobOperations.getTeam();
        var level = hotr.blobOperations.getLevel();
        var teamAFormation = hotr.blobOperations.getFormation();
        var teamAPowers = hotr.blobOperations.getPowers();
        var teamB = hotr.levelLogic.getTeamForLevel(level);
        var teamBFormation = hotr.levelLogic.getFormationForLevel(level);
        var teamBPowers = hotr.levelLogic.getPowers();

        var fightConfig = {
            teamA:teamA,
            teamAFormation:teamAFormation,
            teamB:teamB,
            teamBFormation:teamBFormation,
            teamAPowers:teamAPowers,
            teamBPowers:teamBPowers,
            offense:'a'
        };

        hotr.arenaScene.data = fightConfig;
        var assets = this.makeAssetDictionary(fightConfig.teamA, fightConfig.teamB, fightConfig.teamAPowers, fightConfig.teamBPowers);
        this.showLoader(            {
            "assets":assets,
            "apiCalls":[
                function(callback){
                    hotr.blobOperations.saveBlob(function(){
                        callback();
                    });
                }
            ],
            "nextScene":'arena'
        });
    },
    onEnter:function(){
         cards.kik.getAnonymousUser(function(token){
            this.startGame(token);
         }.bind(this));
    },
    startGame:function(value, type){

        //get signed data from kik
        //if !cached blob token
        var hasPlayed = hotr.blobOperations.hasPlayed();
        var hasToken = hotr.blobOperations.hasToken();

        //if I have an auth token, I don't care, just go.
        if (hasToken){
            this.initGame();
        }else if (hasPlayed) { //if I don't ahve a token, well - have I played? If so, don't create a user for me, just get a token and go
            this.authorizeAndInitGame();
        }else{
            //I sort of look like a new player, take me through the new player flow
            this.authorizeNewPlayer();
        }
    },
    authorizeNewPlayer:function(){
        cards.kik.anonymousSign({"signme":true}, function (signedData, token, host) {
            //send these to us, for authtoken
            hotr.blobOperations.createNewPlayer(signedData, token, host, function(){
                this.selectEditTeamPre();
            }.bind(this));
        }.bind(this));
    },
    authorizeAndInitGame:function(){
        cards.kik.anonymousSign({"signme":true}, function (signedData, token, host) {
            //send these to us, for authtoken
            hotr.blobOperations.getNewAuthTokenAndBlob(signedData, token, host, function(){
                this.selectEditTeamPre();
            }.bind(this));
        }.bind(this));
    },
    initGame:function(callback){
        hotr.blobOperations.getBlob(function(){
            this.selectEditTeamPre();
        });
    },
    makeCardDictionary:function(){
        var names = hotr.blobOperations.getCharacterNames();
        var assets = [];
        _.map(names, function(name){
            var data = this.getCardAssets(name);
            assets.pushUnique(data.cardPng);
            assets.pushUnique(data.cardPlist);
        }.bind(this));
        for (var i =0;i<assets.length;i++){
            assets[i] = {src:assets[i]};
        }
        return assets;
    },
    getCardAssets:function(name){
        var cardIndex = spriteDefs[name].cardIndex;
        if (cardIndex == undefined){
            cardIndex = 0;
        }
        return {    cardPng:cardsPngs[cardIndex],
                    cardPlist:cardsPlists[cardIndex]
        };
    },
    makeAssetDictionary:function(teamA, teamB, teamAPowers, teamBPowers){
        var assets = [];
        for (var i=0;i<teamA.length;i++){
            if (teamA[i]){
                var name = teamA[i].name;
                this.addAssetChain(assets, name);
            }

        }

        for (var i=0;i<teamB.length;i++){
            if (teamB[i]){
                var name = teamB[i].name;
                this.addAssetChain(assets, name);
            }
        }

        for (var i=0;i<teamAPowers.length;i++){
            var name = teamAPowers[i];
            this.addPowerAssets(assets, name);
        }

        for (var i=0;i<teamAPowers.length;i++){
            var name = teamAPowers[i];
            this.addPowerAssets(assets, name);
        }


        assets.pushUnique(g_characterPlists["greenbullet"]);
        assets.pushUnique(g_characterPngs["greenbullet"]);
        assets.pushUnique(g_characterPlists["greenBang"]);
        assets.pushUnique(g_characterPngs["greenBang"]);

        //transform
        for (var i =0;i<assets.length;i++){
            assets[i] = {src:assets[i]};
        }

        for (var i=0;i<g_battleStuff.length;i++){
            assets.pushUnique(g_battleStuff[i]);
        }

        return assets;
    },
    addPowerAssets:function(assetAry, name){

        var animations = powerAnimationsRequired[name];
        if (animations){
            for (var i =0;i<animations.length;i++){
                assetAry.pushUnique(g_characterPlists[animations[i]]);
                assetAry.pushUnique(g_characterPngs[animations[i]]);
            }
        }
    },
    addAssetChain:function(assetAry, name){
        assetAry.pushUnique(g_characterPlists[name]);
        assetAry.pushUnique(g_characterPngs[name]);

        if (spriteDefs[name].effect){

            assetAry.pushUnique(g_characterPlists[spriteDefs[name].effect]);
            assetAry.pushUnique(g_characterPngs[spriteDefs[name].effect]);
        }

        if (spriteDefs[name].gameProperties && spriteDefs[name].gameProperties.missile){
            assetAry.pushUnique(g_characterPlists[spriteDefs[name].gameProperties.missile]);
            assetAry.pushUnique(g_characterPngs[spriteDefs[name].gameProperties.missile]);

            //missiles, have effects - we need to add the missile effect here.
            var bulletConfig = missileConfig[spriteDefs[name].gameProperties.missile];
            if (bulletConfig.effect){
                assetAry.pushUnique(g_characterPlists[bulletConfig.effect]);
                assetAry.pushUnique(g_characterPngs[bulletConfig.effect]);
            }
        }

        if (spriteDefs[name].powers){
            var powers = spriteDefs[name].powers;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                for (var i =0;i<animations.length;i++){
                    assetAry.pushUnique(g_characterPlists[animations[i]]);
                    assetAry.pushUnique(g_characterPngs[animations[i]]);

                }
            }

        }

        if (spriteDefs[name].damageMods){
            var powers = spriteDefs[name].damageMods;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                for (var i =0;i<animations.length;i++){
                    assetAry.pushUnique(g_characterPlists[animations[i]]);
                    assetAry.pushUnique(g_characterPngs[animations[i]]);

                }
            }
        }

        if (spriteDefs[name].deathMods){
            var powers = spriteDefs[name].deathMods;
            for(var power in powers){
                var animations = powerAnimationsRequired[power];
                for (var i =0;i<animations.length;i++){
                    assetAry.pushUnique(g_characterPlists[animations[i]]);
                    assetAry.pushUnique(g_characterPngs[animations[i]]);

                }
            }
        }

    }

});

var hotr = hotr || {};
MainGame.create = function() {
    var ml = new MainGame();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

MainGame.scene = function() {
    if (!hotr.mainScene){
        hotr.mainScene = cc.Scene.create();
        hotr.mainScene.layer = MainGame.create();
        hotr.mainScene.addChild(hotr.mainScene.layer );
    }
    hotr.changeScene = hotr.mainScene.layer.changeScene.bind(hotr.mainScene.layer);
    return hotr.mainScene;
};




var missileConfig = {
                     "greenbullet":{
                         "png":"art/greenbullet.png",
                         "plist":"art/greenbullet.plist",
                         "start":"greenbullet.1.png",
                         "effect":"greenBang",
                         "frames":27,
                         "delay":0.02 ,
                         "first":9,
                         "speed":400
                     },
                    "fireball":{
                        "png":"art/fireball.png",
                        "plist":"art/fireball.plist",
                        "start":"fireball.1.png",
                        "effect":"explosion",
                        "frames":10,
                        "delay":0.01,
                        "speed":500
                    },
}


var PanZoomTest = jc.WorldLayer.extend({
    init: function() {
        if (this._super(shrine1Png)) {
            this.firstTouch = true;
            return true;
        } else {
            return false;
        }
    },
    targetTouchHandler:function(type, touch){
        if (type == jc.touchEnded && this.firstTouch){
            //this.fullZoomOut(jc.defaultTransitionTime,function(){
//            this.panToWorldPoint(cc.p(900,900), this.getScale8x(), jc.defaultTransitionTime, function(){
//               this.firstTouch = false;
//            }.bind(this));
        }else if (type == jc.touchEnded && !this.firstTouch){
            console.log(touch);
            var world = this.screenToWorld(touch);
            console.log(world);
            var screen = this.worldToScreen(world)
            console.log(screen);
            //screen to world
//            var world = this.screenToWorld(touch)
//            console.log(world);
//            console.log(this.worldToScreen(world))
        }

    }
});

PanZoomTest.create = function() {
    var ml = new PanZoomTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

PanZoomTest.scene = function() {
    if (!jc.panZoomTest){
        jc.panZoomTest = cc.Scene.create();
        jc.panZoomTest.layer = PanZoomTest.create();
        jc.panZoomTest.addChild(jc.panZoomTest.layer);
    }
    return jc.panZoomTest;

};
var dirImg = "";
var dirMusic = "";
//Every function in here expects to be bound to an instance of GeneralBehavior, or something that extends it!
var powerAnimationsRequired = {
    "healingRadius":["heal"],
    "vampireRadius":["fire","heal"],
    "regeneration":['heal'],
    "splashDamage":['explosion'],
    "vampireDistro":["fire","heal"],
    "vampireDrain":["fire","heal"],
    "knockBack":["greenBang"],
    "burn":["fire"],
    "poison":["poison"],
    "explodePoison":["explosion"],
    "poisonCloud":["explosion", "poison"],
    "explodeFire":["explosion"]

}

var powerConfig = {
    "healingRadius":function(value){

        jc.checkPower(value, "healingRadius");

        var config = spriteDefs[value].powers["healingRadius"];
        //get all allies in range
        var friends = this.allFriendsWithinRadius(config.radius);

        //heal them
        for(var i =0;i<friends.length;i++){
            if (GeneralBehavior.heal(this.owner, friends[i], config.heal)){
                jc.playEffectOnTarget("heal", friends[i],  this.owner.layer);
            }
        }
    },
    "vampireRadius":function(value){

        jc.checkPower(value, "vampireRadius");

        var config = spriteDefs[value].powers["vampireRadius"];
        //get all allies in range
        var foes = this.allFoesWithinRadius(config.radius);

        //damage them and heal me this amount
        var heal = 0;
        for(var i =0;i<foes.length;i++){
            if (GeneralBehavior.applyDamage( foes[i], this.owner, config.damage)){
                jc.playTintedEffectOnTarget("fireLoop", foes[i], this.owner.layer, true, 255, 255, 0);
                heal+=config.damage;
            }
        }
        if (heal!=0){
            if (GeneralBehavior.heal(this.owner, this.owner, heal)){
                jc.playEffectOnTarget("heal", this.owner, this.owner.layer);
            }
        }

    },
    "regeneration":function(value){
        jc.checkPower(value, "regeneration");
        var config = spriteDefs[value].powers["regeneration"];
        if (GeneralBehavior.heal(this.owner, this.owner, config.heal)){
            jc.playEffectOnTarget("heal", this.owner, this.owner.layer);
        }
    },
    "splashDamage":function(value){
        jc.checkPower(value, "splashDamage");
        var config = spriteDefs[value].damageMods["splashDamage"];

        //initial explosion
        jc.playEffectOnTarget("explosion", this.locked, this.owner.layer);

        var foes = this.allFoesWithinRadiusOfPoint(config.radius, this.locked.getBasePosition());
        //damage them
        for(var i=0;i<foes.length;i++){
            if (GeneralBehavior.applyDamage(foes[i], this.owner, config.damage)){
              //  jc.playEffectOnTarget("fire", foes[i], this.owner.layer);
            }
        }
    },
    "explodeFire":function(value){
        var config = spriteDefs[value].deathMods["explodeFire"];
        var foes = this.allFoesWithinRadiusOfPoint(config.radius, this.owner.getBasePosition());

        //initial explosion
        jc.playEffectOnTarget("explosion", this.locked, this.owner.layer);

        //damage them
        for(var i=0;i<foes.length;i++){
            if (GeneralBehavior.applyDamage(foes[i], this.owner, config.damage)){
               jc.genericPower('fire', value, this.owner, foes[i], config.burn)
            }
        }
    },
    "explodePoison":function(value){
        var config = spriteDefs[value].deathMods["explodePoison"];
        //initial explosion
        var effect = jc.playEffectOnTarget("explosion", this.locked, this.owner.layer);
        var fillColor = new cc.Color3B();
        fillColor.r = 0;
        fillColor.b = 0;
        fillColor.g = 255;
        effect.setColor (fillColor);

        var foes = this.allFoesWithinRadiusOfPoint(config.radius, this.locked.getBasePosition());

        //damage them
        for(var i=0;i<foes.length;i++){
            if (GeneralBehavior.applyDamage(foes[i], this.owner, config.damage)){
                jc.genericPower('poison', value, this.owner, foes[i], config.poison)
            }
        }
    },

    "vampireDistro":function(value){
        jc.checkPower(value, "vampireDistro");
        var config = spriteDefs[value].damageMods["vampireDistro"];
        var allies = this.owner.homeTeam();
        if (GeneralBehavior.applyDamage(this.locked, this.owner, config.damage)){
            jc.playTintedEffectOnTarget("fireLoop", this.locked, this.owner.layer, true, 255,0,255);
        }

        for(var i=0;i<allies.length;i++){
            if (allies[i]!= this.owner){
                if (GeneralBehavior.heal(this.owner, allies[i],config.heal)){
                    jc.playEffectOnTarget("heal", allies[i],  this.owner.layer);
                }

            }
        }
    },
    "vampireDrain":function(value){
        jc.checkPower(value, "vampireDrain");
        var config = spriteDefs[value].damageMods["vampireDrain"];
        if (GeneralBehavior.applyDamage(this.locked, this.owner, config.damage)){
            jc.playTintedEffectOnTarget("fireLoop", this.locked, this.owner.layer, true, 255, 0, 255);
        }

        if (GeneralBehavior.heal(this.owner, this.owner, config.heal)){
            jc.playEffectOnTarget("heal", this.owner, this.owner.layer);
        }


    },
    "knockback":function(value){
        jc.checkPower(value, "knockback");
        var config = spriteDefs[value].damageMods["knockback"];
        var distance = config.distance;
        if (this.owner.isFlippedX()){
            distance*=-1;
        }
        var targetPos = this.locked.getBasePosition();
        targetPos.x+=distance;
        this.locked.setBasePosition(targetPos);
        jc.playEffectOnTarget("greenBang", this.locked, this.owner.layer);
    },
    "burn":function(value){
        jc.genericPower("burn", value, this.owner, this.locked);
    },
    "burn-apply":function(effectData){
        var fillColor = new cc.Color3B();
        fillColor.r = 255;
        fillColor.b = 0;
        fillColor.g = 0;
        this.owner.setColor(fillColor);
        jc.genericPowerApply(effectData, "fire", "burnEffect", this);
    },
    "burn-remove":function(){
        var fillColor = new cc.Color3B();
        fillColor.r = 255;
        fillColor.b = 255;
        fillColor.g = 255;
        this.owner.setColor(fillColor);
        jc.genericPowerRemove("burnEffect", "fire", this);
    },
    "poison":function(value){
        jc.genericPower("poison", value, this.owner, this.locked);
    },
    "poison-apply":function(effectData){
        var fillColor = new cc.Color3B();
        fillColor.r = 0;
        fillColor.b = 0;
        fillColor.g = 255;
        this.owner.setColor(fillColor);
        jc.genericPowerApply(effectData, "poison", "poisonEffect", this);
    },
    "poison-remove":function(){
        var fillColor = new cc.Color3B();
        fillColor.r = 255;
        fillColor.b = 255;
        fillColor.g = 255;
        this.owner.setColor(fillColor);
        jc.genericPowerRemove("poisonEffect", "poison", this)
    }

}


var PowerHud = jc.UiElementsLayer.extend({
    tiles:3,
    init:function(powers){
        this.name = "powerHud";
        this.myTiles = [];
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(powerTilesPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(windowPlist);
            this.initFromConfig(PowerHud.windowConfig);

            var len = this.tiles>powers.length?powers.length:this.tiles;
            for(var i=0;i<len;i++){
                var name = "tile"+i;
                this[name].initFromName(powers[i], this);
                this.myTiles.push(this[name]);
            }

            return true;
        }else{
            return false;
        }
    },
    setSelected:function(tile){
        for (var i=0;i<this.tiles;i++){
            if (this["tile"+i]!=tile){
                this["tile"+i].setUnselected();
            }
        }
        tile.setSelected();
    },
    scheduleThisOnce:function(method,delay){
        this.scheduleOnce(method, delay);
    },
    targetTouchHandler: function(type, touch, sprites) {
        return false; //the tiles are swallowing touches, so this should never get called.
    },
    onShow:function(){
        console.log("onshow");
    }
});

PowerHud.windowConfig={
    "portraitFrame":{
        "cell":1,
        "anchor":['left'],
        "type":"scale9",
        "transitionIn":"bottom",
        "transitionOut":"bottom",
        "scaleRect":jc.UiConf.frame19Rect,
        "size":{ "width":50, "height":25},
        "sprite":"frame 19.png",
        "padding":{
            "left":0
        },
        "kids":{
            "tiles":{
                "isGroup":true,
                "type":"line",
                "cell":1,
                "size":{ "width":33, "height":33},
                "anchor":['left'],
                "padding":{
                    "left":15,
                    "top":-3
                },
                "itemPadding":{
                    "left":10,
                    "top":-25
                },
                "members":[
                    {
                        "type":"tile",
                        "name":"tile0"
                    },
                    {
                        "type":"tile",
                        "name":"tile1"
                    },
                    {
                        "type":"tile",
                        "name":"tile2"
                    }
                ]
            }
        }
    }
}
var powerTiles = {
    "fireBall":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Fire4.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"fireBall"
    },
    "poisonCloud":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Poison4.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"poisonCloud"
    },
    "lightningBolt":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Holy1.png",
        "cooldown":2000,
        "type":"direct",
        "offense":"lightningBolt"
    },
    "healing":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Holy5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"healAll"
    },
    "leech":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Shadow4.png",
        "cooldown":2000,
        "type":"global",
        "offense":"leechAll"
    },
    "iceStorm":{
        "png":"art/powerTiles.png",
        "plist":"art/powerTiles.plist",
        "icon":"Frost5.png",
        "cooldown":2000,
        "type":"global",
        "offense":"iceStorm"
    },

}

cc.Sprite.prototype.setColor = function(){ console.log("setcolor");};
var globalPowers = {
    "fireBall":function(){

    },
    "poisonCloud":function(touch, sprites){
        var behavior = hotr.arenaScene.layer.teams['a'][0].behavior;
        var foes = behavior.allFoesWithinRadiusOfPoint(150, touch);

        var effect = jc.playEffectAtLocation("explosion", touch , 1, hotr.arenaScene.layer);

        //this function doesn't position us correctly, we need to add to it
        var pos = effect.getPosition();
        var tr = effect.getTextureRect();
        pos.y += tr.height;
        effect.setPosition(pos);

        var fillColor = new cc.Color3B();
        fillColor.r = 0;
        fillColor.b = 0;
        fillColor.g = 255;
        effect.setColor (fillColor);

        //damage them
        for(var i=0;i<foes.length;i++){
                jc.genericPower('poison', undefined, undefined, foes[i], {
                    "damage": 50,
                    "duration": 5,
                    "interval": 0.5
                }, "life");
        }


    },
    "lightningBolt":function(){

    },
    "healAll":function(){

    },
    "leech":function(){

    },
    "iceStorm":function(){

    }

}
var arenaSheet = dirImg + "arena.png";
var shadowPlist = dirImg + "shadowSheet.plist";
var shadowPng = dirImg + "shadowSheet.png";
var powerTilesPng= dirImg + "powerTiles.png";
var powerTilesPlist= dirImg + "powerTiles.plist";

var windowPng = dirImg + "windows.png";
var windowPlist = dirImg + "windows.plist";

var cardsPngs = [dirImg + "cards.png"];
var cardsPlists = [dirImg + "cards.plist"];
var loadingPng = dirImg + "loading.png";
var loadingPlist = dirImg + "loading.plist";
var uiPng = dirImg + "uiElements.png";
var uiPlist = dirImg + "uiElements.plist";

var g_characterPngs = {};
var g_characterPlists = {};



//core resources - need these to launch ui, loader, etc
var g_maingame = [
    {src:arenaSheet},
    {src:shadowPlist},
    {src:shadowPng},
    {src:windowPlist},
    {src:windowPng},
    {src:loadingPlist},
    {src:loadingPng},
    {src:uiPlist},
    {src:uiPng}

];

//core character resources and effects - stuff we need for battles
var g_battleStuff =[
    {src:effectsConfig['teleport'].png},
    {src:effectsConfig['teleport'].plist},
    {src:powerTilesPlist},
    {src:powerTilesPng},

]

for (var entry in spriteDefs ){
    if (!spriteDefs[entry].parentOnly && spriteDefs[entry].name){
        g_characterPngs[entry] = dirImg + entry + 'Sheet.png';
        g_characterPlists[entry] = dirImg + entry + 'Sheet.plist';
    }
}

for (var entry in missileConfig){
    g_characterPngs[entry] = missileConfig[entry].png;
    g_characterPlists[entry] = missileConfig[entry].plist;
}

for (var entry in effectsConfig){
    g_characterPngs[entry] = effectsConfig[entry].png;
    g_characterPlists[entry] = effectsConfig[entry].plist;
}

var g_everything = [];
g_everything = g_everything.concat(_.map(g_characterPngs, function(item){ return {src:item};}));
g_everything = g_everything.concat(_.map(g_characterPlists, function(item){ return {src:item};}));
g_everything = g_everything.concat(_.map(g_battleStuff, function(item){ return item;}));
var SelectTeam = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    cellPrefix:"gridCells",
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.highlight = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmallSelected.png");
            this.highlight.setVisible(false);
            this.addChild(this.highlight);
            this.name = "SelectTeam";
            jc.layerManager.pushLayer(this);
            this.start();

            //if blob formation is not set
            //use it
            //else autopop with light logic (range back most, tank front most, anyone else middle)
            //save blob formation
            //if selected character is not null
            //place that character into the cell
            //update blob formation
            this.first = false;
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        if (!this.first){
            //llp through characters
            var formationOrder = hotr.blobOperations.getFormationOrder();
            for (var i =0; i<formationOrder.length; i++){
                if (formationOrder[i]!=undefined){
                    var cell = i;
                    this.doSelectionData(formationOrder[i], cell);
                    this.doSelectionVisual(formationOrder[i], cell, this.cellPrefix+i);
                }
            }
            this.first = true;
        }else if (hotr.scratchBoard.selectedCharacter!=undefined && hotr.scratchBoard.currentCell!=undefined){
            var id = hotr.blobOperations.indexToId(hotr.scratchBoard.selectedCharacter);
            var cell = parseInt(hotr.scratchBoard.currentCell.replace(this.cellPrefix, ""));
            this.removeExistingVisual(id, cell);
            this.doSelectionData(id, cell);
            this.doSelectionVisual(id, cell, hotr.scratchBoard.currentCell);
            hotr.scratchBoard.selectedCharacter = undefined;
            hotr.scratchBoard.currentCell = undefined;
        }
    },
    removeExistingVisual:function(id,cell){
        var oldCell = hotr.blobOperations.getCurrentFormationPosition(id);
        if (oldCell != -1){
            var cellName = this.cellPrefix + oldCell;
            if (this[cellName].pic){
                jc.fadeOut(this[cellName].pic);
            }
        }
    },

    doSelectionVisual:function(id, cell, cellName){
        var characterEntry = hotr.blobOperations.getEntryWithId(id);

        //get card image from jc.getCharacterCard
        var card = jc.getCharacterCard(characterEntry.name);

        //scale it to size
        this.scaleTo(card,this[cellName]);

        //center on selected cell
        this.centerThisPeer(card, this[cellName]);

        //if one is there, hide it
        if (this[cellName].pic){
            jc.swapFade.bind(this)(this[cellName].pic, card);
        }else{ //otherwise show it
            this.addChild(card);
            jc.fadeIn(card, 255);
        }

        //set it
        this[cellName].pic=card;

        //reorder it
        this.reorderChild(card,this[cellName].getZOrder());

        //add a border if it's not there
        if (!this[cellName].border) {
            this[cellName].border = jc.makeSpriteWithPlist(uiPlist, uiPng, "portraitSmall.png");
            this.reorderChild(this[cellName].border, this[cellName].pic.getZOrder()+1);
        }
    },
    doSelectionData:function(id, cell){
        hotr.blobOperations.placeCharacterFormation(id, cell);
    },
    previousFormation:function(){
        console.log("previous");
    },
    nextFormation:function(){
        console.log("next");
    },
    fightStart:function(){
        hotr.mainScene.layer.arenaPre();
    },
    close:function(){
        console.log("close");
    },
    targetTouchHandler: function(type, touch, sprites) {
        if (sprites[0]){

            if (type == jc.touchEnded){
                //on grid cell touch
                //place highlight border
                this.highlight.setVisible(true);
                var pos = sprites[0].getPosition();
                pos.y-=10;
                this.highlight.setPosition(pos);
                this.reorderChild(this.highlight, sprites[0].getZOrder()+1);
                //put cell # into scratchboard
                hotr.scratchBoard.currentCell = sprites[0].name;
                jc.layerManager.pushLayer(EditTeam.getInstance(),10);

            }

            return true;
        }
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"top",
            "transitionOut":"top",
            "sprite":"genericBackground.png",
            "kids":{
                "closeButton":{
                    "cell":9,
                    "anchor":['center', 'right'],
                    "padding":{
                        "top":-15,
                        "left":0
                    },
                    "type":"button",
                    "main":"closeButton.png",
                    "pressed":"closeButton.png",
                    "touchDelegateName":"close"

                },
                "gridCells":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":4,
                    "cell":7,
                    "anchor":['bottom'],
                    "padding":{
                        "top":-35,
                        "left":-25
                    },
                    "itemPadding":{
                        "top":3,
                        "left":4
                    },

                    "input":true,
                    "members":[
                        {
                            "type":"sprite",
                            "input":true,
                            "sprite":"portraitSmallDarkBackground.png"
                        }
                    ],
                    "membersTotal":12
                },
                "formation":{
                    "cell":6,
                    "anchor":['right','top'],
                    "padding":{
                        "top":-67,
                        "left":-27
                    },
                    "type":"sprite",
                    "sprite":"formationFrame.png"
                },
                "description":{
                    "cell":3,
                    "anchor":['top'],
                    "padding":{
                        "top":-40,
                        "left":-30
                    },
                    "type":"sprite",
                    "sprite":"descriptionWindow.png"
                },
                "formationSelect":{
                    "isGroup":true,
                    "type":"line",
                    "cell":3,
                    "anchor":['left', 'top'],
                    "padding":{
                        "top":20,
                        "left":-50
                    },

                    "members":[
                        {
                            "type":"button",
                            "main":"leftArrowFormationName.png",
                            "pressed":"leftArrowFormationName.png",
                            "touchDelegateName":"previousFormation"
                        },
                        {
                            "type":"sprite",
                            "sprite":"formationNameFrame.png"
                        },
                        {
                            "type":"button",
                            "main":"rightArrowFormationName.png",
                            "pressed":"rightArrowFormationName.png",
                            "touchDelegateName":"nextFormation"
                        }
                    ]
                },
                "fightButton":{
                    "cell":3,
                    "anchor":['center'],
                    "padding":{
                        "top":20,
                        "left":-30
                    },
                    "type":"button",
                    "main":"buttonFight.png",
                    "pressed":"buttonFight.png",
                    "touchDelegateName":"fightStart"
                },
            }
        },
    }
});



SelectTeam.scene = function() {
    if (!hotr.selectTeamScene){
        hotr.selectTeamScene = cc.Scene.create();
        hotr.selectTeamScene.layer = new SelectTeam();
        hotr.selectTeamScene.addChild(hotr.selectTeamScene.layer);
        hotr.selectTeamScene.layer.init();

    }
    return hotr.selectTeamScene;
};


/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var Base = C_lib.Base = (function () {
        function F() {}

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.$super.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push((Math.random() * 0x100000000) | 0);
            }

            return WordArray.create(words, nBytes);
        }
    });

    /**
     * Encoder namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return WordArray.create(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return WordArray.create(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = WordArray.create();
            this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return WordArray.create(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
        },

        _minBufferSize: 0
    });

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        // cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            // this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            this._doFinalize();

            return this._hash;
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = hasher.clone();
         */
        clone: function () {
            var clone = BufferedBlockAlgorithm.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        },

        blockSize: 512/32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return hasher.create(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return C_algo.HMAC.create(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}(Math));


(function (Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Initialization and round constants tables
    var H = [];
    var K = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    // Reusable object
    var W = [];

    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = WordArray.create(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                   (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                   (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA256('message');
     *     var hash = CryptoJS.SHA256(wordArray);
     */
    C.SHA256 = Hasher._createHelper(SHA256);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA256(message, key);
     */
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));



if (typeof module !== 'undefined'){
    if (module.exports){
        module.exports = CryptoJS;
    }

}

var SpriteTest = cc.Layer.extend({
    init: function() {
        if (this._super()) {
            cc.TextureCache.getInstance().addImageAsync(s_spineboy, this, this.loadSpineTest);
            return true;
        } else {
            return false;
        }
    },
    loadSpineTest: function () {

        var ccSkelNode = cc.SkeletonAnimation.createWithFile(s_spineboyJSON, s_spineboyATLAS);

        ccSkelNode.skeleton.setSlotsToSetupPose();
        ccSkelNode.setMix("walk", "jump", 0.2);
        ccSkelNode.setMix("jump", "walk", 0.4);

        ccSkelNode.setAnimation("walk", true);

        ccSkelNode.skeleton.getRootBone().x = 0;
        ccSkelNode.skeleton.getRootBone().y = 0;

        ccSkelNode.updateWorldTransform();
        ccSkelNode.setPosition(cc.p(320, 5));

        this.addChild(ccSkelNode);

        this.removeChild(this._labelLoading, true);
    }
});

SpriteTest.create = function() {
    var ml = new SpriteTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
};

SpriteTest.scene = function() {
    var scene = cc.Scene.create();
    var layer = SpriteTest.create();
    scene.addChild(layer);
    return scene;
};

var spriteDefs = {
	"blackGargoyle": {
		"name": "blackGargoyle",
		"formalName": "Void Demon",
		"details": "An winged creature from the void. It possesses a devastating air to ground dive and weak magic range abilities for other air units.",
		"elementType": "void",
		"special": "None",
		"gameProperties": {
			"MaxHP": 200,
			"movementType": 0,
			"targets": 2,
			"speed": 100,
			"damage": 25,
			"vsAirDamage": 5,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 25,
			"seekRadius": 25
		},
		"inherit": "gargoyle"
	},
	"blueKnight": {
		"name": "blueKnight",
		"formalName": "Elemental Knight - Water",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of water, this unit also heals any units nearby.",
		"elementType": "water",
		"unitType": 3,
		"effect": "blueRadius",
		"gameProperties": {
			"MaxHP": 500,
			"movementType": 1,
			"targets": 1,
			"speed": 20,
			"damage": 160,
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25,
			"heal": 30
		},
		"powers": {
			"healingRadius": {
				"heal": 20,
				"interval": 2,
				"radius": 200
			}
		},
		"inherit": "knight"
	},
	"dragon": {
		"name": "dragon",
		"parentOnly": true,
		"targetRadius": 100,
		"step": 1,
		"animations": {
			"move": {
				"start": 529,
				"end": 565,
				"delay": 0.035,
				"type": 0
			},
			"attack": {
				"start": 614,
				"end": 690,
				"delay": 0.035,
				"type": 1
			},
			"dead": {
				"start": 725,
				"end": 790,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 529,
				"end": 565,
				"delay": 0.035,
				"type": 0
			}
		},
		"behavior": "range"
	},
	"dragonBlack": {
		"name": "dragonBlack",
		"formalName": "Void Dragon",
		"details": "These small dragons are aerial terrors doing massive damage to ground units below but they have a difficulty targeting other air born units.",
		"elementType": "void",
		"unitType": 1,
		"special": "None",
		"gameProperties": {
			"MaxHP": 700,
			"speed": 250,
			"movementType": 0,
			"missile": "greenbullet",
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"missleTarget": "base",
			"targets": 1,
			"damage": 300,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 100,
			"seekRadius": 25
		},
		"inherit": "dragon"
	},
	"dragonRed": {
		"name": "dragonRed",
		"formalName": "Fire Dragon",
		"details": "These small dragons are aerial terrors doing massive damage to ground units below but they have a difficulty targeting other air born units. Fire Dragons do additional burning damage after each attack and splash damage to units around it. ",
		"elementType": "fire",
		"unitType": 2,
		"damageMods": {
			"splashDamage": {
				"damage": 50,
				"radius": 100
			},
			"burn": {
				"damage": 10,
				"duration": 5,
				"interval": 0.25
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 150,
			"damage": 100,
			"missile": "fireball",
			"missileOffset": {
				"x": 0,
				"y": 10
			},
			"flightAug": {
				"x": 25,
				"y": 100
			},
			"missleTarget": "base",
			"movementType": 0,
			"targets": 1,
			"actionDelays": {
				"attack": 5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 100,
			"seekRadius": 25
		},
		"inherit": "dragon"
	},
	"dwarvenKnight": {
		"name": "dwarvenKnight",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 70,
				"end": 93,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 100,
				"end": 145,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 140,
				"end": 180,
				"delay": 0.025,
				"type": 1
			},
			"attack3": {
				"start": 180,
				"end": 250,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 60,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 300,
				"end": 370,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"dwarvenKnightEarth": {
		"name": "dwarvenKnightEarth",
		"formalName": "Dwarven Knight - Earth",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with earth magic, this dwarf has additional health.",
		"elementType": "earth",
		"unitType": 3,
		"gameProperties": {
			"MaxHP": 1300,
			"speed": 50,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightFire": {
		"name": "dwarvenKnightFire",
		"formalName": "Dwarven Knight - Fire",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with fire magic, this dwarf is immune completely immune to fire and explosive based attacks.",
		"elementType": "fire",
		"unitType": 3,
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"defense": {
				"fire": 100
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightLife": {
		"name": "dwarvenKnightLife",
		"formalName": "Dwarven Knight - Life",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with life magic, this dwarf is immune to poison.",
		"elementType": "life",
		"unitType": 3,
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"damage": 25,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"life": 100
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightVoid": {
		"name": "dwarvenKnightVoid",
		"formalName": "Dwarven Knight - Void",
		"details": "Dwarven Knights are known for being very difficult to kill. His armor embued with void magic, this dwarf is immune to vampiric powers and has its own.",
		"elementType": "void",
		"unitType": 3,
		"damageMods": {
			"vampireDrain": {
				"heal": 20,
				"damage": 20
			}
		},
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"damage": 35,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"void": 100
			},
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"dwarvenKnightWater": {
		"name": "dwarvenKnightWater",
		"formalName": "Dwarven Knight - Water",
		"details": "Dwarven Knights are known for being very difficult to kill. With armor embued with water magic, this dwarf regenerates.",
		"elementType": "water",
		"unitType": 3,
		"powers": {
			"regeneration": {
				"heal": 100,
				"interval": 1
			}
		},
		"gameProperties": {
			"MaxHP": 700,
			"speed": 50,
			"damage": 25,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "dwarvenKnight"
	},
	"elemental1": {
		"name": "elemental1",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 81,
				"end": 128,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 141,
				"end": 188,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 201,
				"end": 248,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 72,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 261,
				"end": 296,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"elemental2": {
		"name": "elemental2",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 91,
				"end": 126,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 131,
				"end": 190,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 75,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 271,
				"end": 330,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"elementalFire": {
		"name": "elementalFire",
		"formalName": "Fire Elemental",
		"details": "Extraordinarily powerful, but slow moving. Heavy additional burn damage inflicted.",
		"elementType": "fire",
		"unitType": 3,
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 600,
			"speed": 20,
			"damage": 250,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "elemental1"
	},
	"elementalStone": {
		"name": "elementalStone",
		"formalName": "Stone Elemental",
		"details": "Extraordinarily powerful, but slow moving.",
		"elementType": "earth",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 1700,
			"speed": 20,
			"damage": 100,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "elemental1"
	},
	"elementalWater": {
		"name": "elementalWater",
		"formalName": "Water Elemental",
		"details": "Fast elemental creatures that fire at range. Water elementals have regenerative abilities.",
		"elementType": "water",
		"unitType": 3,
		"special": "None",
		"powers": {
			"regeneration": {
				"heal": 100,
				"interval": 1
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 50,
			"damage": 75,
			"movementType": 1,
			"targets": 2,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 250,
			"seekRadius": 25
		},
		"inherit": "elemental2"
	},
	"elementalWind": {
		"name": "elementalWind",
		"formalName": "Wind Elemental",
		"details": "Fast elemental creatures that fire at range. Wind elementals have knock back capability.",
		"elementType": "air",
		"unitType": 3,
		"damageMods": {
			"knockBack": {
				"distance": 15
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 50,
			"damage": 50,
			"movementType": 1,
			"targets": 2,
			"actionDelays": {
				"attack": 2
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 250,
			"seekRadius": 25
		},
		"inherit": "elemental2"
	},
	"elf": {
		"name": "elf",
		"parentOnly": true,
		"targetRadius": 600,
		"animations": {
			"move": {
				"start": 730,
				"end": 741,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 1365,
				"end": 1415,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1263,
				"end": 1358,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 862,
				"end": 910,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"fireKnight": {
		"name": "fireKnight",
		"formalName": "Elemental Knight - Fire",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of fire, this unit deals additional burn damage to its targets.",
		"elementType": "fire",
		"unitType": 3,
		"damageMods": {
			"burn": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"damage": 160,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "knight"
	},
	"forestElf": {
		"name": "forestElf",
		"formalName": "Forest Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Forest Elves deal poison damage with each arrow.",
		"elementType": "life",
		"unitType": 4,
		"damageMods": {
			"poison": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 100,
			"damage": 25,
			"movementType": 1,
			"targets": 2,
			"missile": "greenbullet",
			"poisonDamage": 10,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600,
			"seekRadius": 25
		},
		"inherit": "elf"
	},
	"gargoyle": {
		"name": "gargoyle",
		"parentOnly": true,
		"animations": {
			"move": {
				"start": 230,
				"end": 255,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 51,
				"end": 100,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 100,
				"end": 147,
				"delay": 0.025,
				"type": 1
			},
			"dead": {
				"start": 147,
				"end": 228,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 24,
				"delay": 0.025,
				"type": 0
			}
		},
		"behavior": "tank"
	},
	"goblin": {
		"name": "goblin",
		"cardIndex": 0,
		"portraitXy": {
			"x": 181,
			"y": 72
		},
		"formalName": "Goblin Demolition Expert",
		"details": "Goblin demolition experts hurl explosives at enemies. While they don't have an impressive range, they can inflict massive damage on groups of ground enemies at a time.",
		"elementType": "fire",
		"unitType": 3,
		"special": "Splash Damage",
		"damageMods": {
			"splashDamage": {
				"damage": 25,
				"radius": 50
			}
		},
		"deathMods": {
			"explodeFire": {
				"damage": 25,
				"radius": 50,
				"burn": {
					"damage": 50,
					"duration": 5,
					"interval": 0.5
				}
			}
		},
		"gameProperties": {
			"MaxHP": 50,
			"movementType": 1,
			"targets": 1,
			"missile": "greenbullet",
			"damage": 80,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 75
		},
		"animations": {
			"move": {
				"start": 80,
				"end": 90,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 315,
				"end": 353,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 60,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 450,
				"end": 550,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "range"
	},
	"goblinKnight": {
		"name": "goblinKnight",
		"parentOnly": true,
		"targetRadius": 20,
		"animations": {
			"move": {
				"start": 70,
				"end": 93,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 100,
				"end": 145,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 140,
				"end": 180,
				"delay": 0.025,
				"type": 1
			},
			"attack3": {
				"start": 180,
				"end": 250,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 60,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 300,
				"end": 370,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"goblinKnightBile": {
		"name": "goblinKnightBile",
		"formalName": "Goblin Knight - Plains",
		"details": "Goblin Knights are fast and do reasonable damage. Plains goblins are incredibly fast runners.",
		"elementType": "none",
		"unitType": 3,
		"special": "Burn Damage",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 120,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightBlood": {
		"name": "goblinKnightBlood",
		"cardIndex": 0,
		"portraitXy": {
			"x": 186,
			"y": 265
		},
		"formalName": "Goblin Knight - Blood",
		"details": "Goblin Knights are fast and do reasonable damage. These blood goblins are tougher, faster then their cousins.",
		"elementType": "none",
		"unitType": 3,
		"special": "Burn Damage",
		"gameProperties": {
			"MaxHP": 500,
			"speed": 80,
			"movementType": 1,
			"targets": 1,
			"damage": 35,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightFire": {
		"name": "goblinKnightFire",
		"formalName": "Goblin Knight - Fire",
		"details": "Goblin Knights are fast and do reasonable damage. These fire goblins live near magma in deep caves are resist burning damage.",
		"elementType": "fire",
		"unitType": 3,
		"special": "Resist Fire",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 80,
			"movementType": 1,
			"targets": 1,
			"defense": {
				"fire": 100
			},
			"damage": 35,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goblinKnightNormal": {
		"name": "goblinKnightNormal",
		"formalName": "Goblin Knight",
		"details": "Goblin Knights are fast and do reasonable damage..",
		"elementType": "none",
		"unitType": 3,
		"special": "Resist Fire",
		"gameProperties": {
			"MaxHP": 250,
			"speed": 70,
			"movementType": 1,
			"targets": 1,
			"damage": 25,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 20,
			"seekRadius": 25
		},
		"inherit": "goblinKnight"
	},
	"goldElf": {
		"name": "goldElf",
		"formalName": "Plains Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Plains Elves are heartier and faster then their other elven cousins.",
		"elementType": "earth",
		"unitType": 4,
		"special": "None",
		"gameProperties": {
			"MaxHP": 200,
			"movementType": 1,
			"targets": 2,
			"damage": 35,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600
		},
		"inherit": "elf"
	},
	"goldKnight": {
		"name": "goldKnight",
		"formalName": "Elemental Knight - Earth",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of earth, this unit has almost 2x the health of other elemental knights.",
		"elementType": "earth",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 1000,
			"speed": 20,
			"damage": 160,
			"movementType": 1,
			"targets": 1,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 25
		},
		"inherit": "knight"
	},
	"knight": {
		"name": "knight",
		"parentOnly": true,
		"targetRadius": 200,
		"animations": {
			"move": {
				"start": 11,
				"end": 80,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 440,
				"end": 520,
				"delay": 0.02,
				"type": 1
			},
			"attack2": {
				"start": 613,
				"end": 796,
				"delay": 0.02,
				"type": 1
			},
			"dead": {
				"start": 1120,
				"end": 1259,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 1380,
				"end": 1460,
				"delay": 0.02,
				"type": 0
			}
		},
		"behavior": "tank"
	},
	"monsterbase": {
		"name": "monsterbase",
		"parentOnly": true,
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 145,
				"end": 167,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 24,
				"delay": 0.02,
				"type": 1
			},
			"attack2": {
				"start": 25,
				"end": 48,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 121,
				"end": 137,
				"delay": 0.02,
				"type": 0
			},
			"damage": {
				"start": 49,
				"end": 60,
				"delay": 0.02,
				"type": 1
			},
			"dead": {
				"start": 72,
				"end": 120,
				"delay": 0.02,
				"type": 1
			}
		}
	},
	"orc": {
		"name": "orc",
		"formalName": "Orc Warrior",
		"details": "Orcs are fast, fierce attackers. What they lack in heavy armor, they make up for in pure tenacity.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 400,
			"speed": 55,
			"movementType": 1,
			"targets": 1,
			"damage": 50,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 20
		},
		"baseOffset": {
			"x": -20,
			"y": -5
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 264,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 25,
				"delay": 0.025,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 73,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 209,
				"delay": 0.02,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.04,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"orge": {
		"name": "orge",
		"formalName": "Orge",
		"cardIndex": 0,
		"portraitXy": {
			"x": 241,
			"y": 122
		},
		"details": "Orge are massive, powerful creatures. Though they are slow movers, you do not want to be at the wrong end of their weapons.",
		"elementType": 4,
		"unitType": 3,
		"special": "None",
		"targetRadius": 75,
		"gameProperties": {
			"movementType": 1,
			"targets": 1,
			"MaxHP": 1500,
			"speed": 15,
			"damage": 200,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.9
			},
			"targetRadius": 30
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 265,
				"delay": 0.06,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 37,
				"delay": 0.04,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 84,
				"delay": 0.04,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 240,
				"delay": 0.02,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "tank"
	},
	"redGargoyle": {
		"name": "redGargoyle",
		"formalName": "Void Demon",
		"details": "An winged creature embued with elemental fire. It possesses a devastating air to ground dive and weak magic range abilities for other air units. Fire Demons deal splash and burn damage around their targets.",
		"elementType": "fire",
		"unitType": 0,
		"special": "Splash Damage, Burn Damage",
		"gameProperties": {
			"MaxHP": 200,
			"speed": 100,
			"movementType": 0,
			"targets": 2,
			"damage": 15,
			"splashDamage": 5,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 25
		},
		"inherit": "gargoyle"
	},
	"scowerer": {
		"name": "scowerer",
		"formalName": "Void Scavenger",
		"details": "Weak, dog-like creatures that quickly attack the weakest target they can find. When killed the scowerer will burst a poison acid on anyone nearby.",
		"elementType": "life",
		"unitType": 3,
		"special": "None",
		"deathMods": {
			"explodePoison": {
				"damage": 100,
				"radius": 75,
				"poison": {
					"damage": 50,
					"duration": 5,
					"interval": 0.5
				}
			}
		},
		"gameProperties": {
			"MaxHP": 10,
			"movementType": 1,
			"targets": 1,
			"speed": 200,
			"damage": 25,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 20
		},
		"animations": {
			"move": {
				"start": 170,
				"end": 190,
				"delay": 0.03,
				"type": 0
			},
			"attack": {
				"start": 245,
				"end": 320,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 1,
				"delay": 0.03,
				"type": 0
			},
			"dead": {
				"start": 460,
				"end": 560,
				"delay": 0.03,
				"type": 1
			}
		},
		"behavior": "flanker"
	},
	"shadowKnight": {
		"name": "shadowKnight",
		"formalName": "Elemental Knight - Void",
		"details": "Elemental Knights are heavy tank units that are slow, but deal massive amounts of damage. Embued with the elemental power of the void, this unit saps life from nearby enemies, healing itself.",
		"elementType": "void",
		"unitType": 3,
		"effect": "blueRadius",
		"powers": {
			"vampireRadius": {
				"damage": 20,
				"radius": 100,
				"interval": 1
			}
		},
		"gameProperties": {
			"MaxHP": 500,
			"speed": 20,
			"movementType": 1,
			"targets": 1,
			"damage": 160,
			"actionDelays": {
				"attack": 1
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 25
		},
		"inherit": "knight"
	},
	"shellback": {
		"name": "shellback",
		"formalName": "Shellback Raider",
		"details": "Heavily armored and fast, shellbacks are mindless attack animals. This one is trained to lock onto and kill weaker archers and healers.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 150,
			"movementType": 1,
			"targets": 1,
			"speed": 200,
			"damage": 25,
			"actionDelays": {
				"attack": 0.01
			},
			"effectDelays": {
				"attack": 0.01
			},
			"targetRadius": 20
		},
		"animations": {
			"move": {
				"start": 70,
				"end": 88,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 198,
				"end": 249,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 91,
				"end": 131,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 283,
				"end": 340,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "flanker"
	},
	"snakeThing": {
		"name": "snakeThing",
		"formalName": "Serpent Guardian",
		"details": "Heavily armored and fast, serpent guardians were once summoned to the defense of powerful mages. When summoned, the guardian will attach itself to a range or support unit and guard it until death.",
		"elementType": "none",
		"unitType": 3,
		"special": "None",
		"gameProperties": {
			"MaxHP": 150,
			"speed": 80,
			"movementType": 1,
			"targets": 1,
			"damage": 45,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 20,
			"seekRadius": 150
		},
		"animations": {
			"move": {
				"start": 53,
				"end": 84,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 90,
				"end": 150,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 10,
				"end": 45,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 275,
				"end": 315,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "defender"
	},
	"spider": {
		"name": "spider",
		"formalName": "Arachnon Guardian",
		"details": "These guardians will choose and defend a target to death dealing heavy damage from their bladed legs and injecting enemies with poison. They do not however, have much armor and are easily killed.",
		"elementType": "life",
		"unitType": 3,
		"special": "Poison",
		"powers": {
			"poison": {
				"damage": 50,
				"duration": 5,
				"interval": 0.5
			}
		},
		"gameProperties": {
			"MaxHP": 100,
			"speed": 200,
			"movementType": 1,
			"targets": 1,
			"damage": 55,
			"actionDelays": {
				"attack": 0.2
			},
			"effectDelays": {
				"attack": 0.5
			},
			"targetRadius": 20,
			"seekRadius": 150
		},
		"animations": {
			"move": {
				"start": 164,
				"end": 189,
				"delay": 0.02,
				"type": 0
			},
			"attack": {
				"start": 192,
				"end": 221,
				"delay": 0.025,
				"type": 1
			},
			"idle": {
				"start": 1,
				"end": 32,
				"delay": 0.02,
				"type": 0
			},
			"dead": {
				"start": 332,
				"end": 400,
				"delay": 0.02,
				"type": 1
			}
		},
		"behavior": "defender"
	},
	"troll": {
		"name": "troll",
		"formalName": "Goblin Cleric",
		"details": "These small goblins are expert in healing magic. They will stay back, supporting your warriors and healing them in battle.",
		"elementType": "none",
		"unitType": 3,
		"special": "Healing",
		"gameProperties": {
			"MaxHP": 100,
			"speed": 100,
			"movementType": 1,
			"targets": 2,
			"damage": 10,
			"heal": 50,
			"actionDelays": {
				"attack": 0.5,
				"heal": 0.5
			},
			"effectDelays": {
				"attack": 0.05,
				"heal": 0.05
			},
			"targetRadius": 25
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 264,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 24,
				"delay": 0.02,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 73,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 209,
				"delay": 0.02,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "healer"
	},
	"voidElf": {
		"name": "voidElf",
		"formalName": "Dark Elf",
		"details": "Elves are powerful archers dealing decent damage while they stay safely at range. Touched with Void magic, Dark Elves have the magic arrows that steal life from targets and give it to allies.",
		"elementType": "void",
		"unitType": 4,
		"damageMods": {
			"vampireDistro": {
				"heal": 20,
				"damage": 20
			}
		},
		"gameProperties": {
			"MaxHP": 200,
			"damage": 45,
			"movementType": 1,
			"targets": 2,
			"speed": 55,
			"actionDelays": {
				"attack": 0.5
			},
			"effectDelays": {
				"attack": 1
			},
			"targetRadius": 600
		},
		"inherit": "elf"
	},
	"wizard": {
		"name": "wizard",
		"formalName": "Goblin Wizard",
		"details": "These goblins are masters of destructive magic and can do serious damage at an impressive range.",
		"elementType": "none",
		"unitType": 4,
		"special": "None",
		"gameProperties": {
			"MaxHP": 100,
			"movementType": 1,
			"targets": 2,
			"speed": 50,
			"damage": 50,
			"missile": "greenbullet",
			"actionDelays": {
				"attack": 0.05
			},
			"effectDelays": {
				"attack": 0.05
			},
			"targetRadius": 400
		},
		"baseOffset": {
			"x": 0,
			"y": 10
		},
		"startFrame": 1,
		"endFrame": 48,
		"byStep": 1,
		"animations": {
			"move": {
				"start": 241,
				"end": 264,
				"delay": 0.025,
				"type": 0
			},
			"attack": {
				"start": 1,
				"end": 40,
				"delay": 0.02,
				"type": 1
			},
			"attack2": {
				"start": 48,
				"end": 80,
				"delay": 0.02,
				"type": 1
			},
			"idle": {
				"start": 193,
				"end": 209,
				"delay": 0.02,
				"type": 0
			},
			"damage": {
				"start": 96,
				"end": 108,
				"delay": 0.04,
				"type": 1
			},
			"dead": {
				"start": 144,
				"end": 192,
				"delay": 0.06,
				"type": 1
			}
		},
		"behavior": "range"
	}
}
if (typeof jc === 'undefined'){
    var jc = {};
    jc.log = function(array, msg){
        //console.log(msg);
    }
}

var TouchIdHandler =  function(params){
	this.pointsPerMM = params.pointsPerMM;
	this.cellSizeMM = params.cellSizeMM;
	this.cellSizePoints = this.cellSizeMM*this.pointsPerMM;
	this.sha = params.sha;
}

TouchIdHandler.prototype.processTouches = function(touches){
	//locate the guide
	//guide is the closest point to 0, maxy
	//sort by xy
	//touches.sort(this.compare);
    //var guide = touches[0];

			
	//use the guide to position our grid.
	//the guide is assumed to be the location of cell 0			
	//every other point from the guide, falls into a given cell considering cell width and cell height

 	var keyRaw = "";
    var diffs = [];
	//convert these to cell positions based on their distance from 0,0.
	for (var i =0; i<touches.length; i++){
		for(var ii=0; ii<touches.length; ii++){
            if (i != ii){
                var diff = this.convertCell(touches[i], touches[ii], this.cellSizePoints);
                //var diffId = i + '-' + ii + '-' + diff;
                jc.log(['touchid'], "Cell Diff Id: " + diff);
                diffs.push(diff);
            }
        }
	}
    diffs.sort();
    jc.log(['touchid'], 'Coverted:');
    for (var i =0;i<diffs.length;i++){
        jc.log(['touchout'], diffs[i]);
        keyRaw+=this.serializeCell(diffs[i]);
    }

    //sha-256 the string
	var sha = this.sha.SHA256(keyRaw).toString();
    jc.log(['touchout'], sha);
    return sha;
	
}

TouchIdHandler.prototype.serializeCell = function(diff){
	return "-" + diff;
}

TouchIdHandler.prototype.convertCell = function (cell, guide, pointSize){
    var diffX = Math.abs(guide.x/pointSize - cell.x/pointSize);
    var diffY = Math.abs(guide.y/pointSize - cell.y/pointSize);

    var diff = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    jc.log(['touchid'], "Distance: " + diff);

    diff = Math.floor(diff);
    jc.log(['touchid'], "Distance by cell width: " + diff);



//    var angle =  Math.atan2(diffY, diffX) * 180 / Math.PI;
//    jc.log(['touchid'], "Angle : " + angle);

    return diff;
}

TouchIdHandler.prototype.normalizeAngle=function(angle)
{
    var newAngle = angle;
    while (newAngle <= -180) newAngle += 360;
    while (newAngle > 180) newAngle -= 360;
    return Math.floor(newAngle);
}

TouchIdHandler.prototype.printTouches = function (){
	for(var i =0; i<this.touches.length;i++){
		jc.log(['touchid'], i + ' : ' + this.touches[i].x + "," + this.touches[i].y);
	}
}


TouchIdHandler.prototype.compare = function (a, b){
	   	var colA = a.x;
	    var colB = b.x;
	   	var rowA = a.y;
	    var rowB = b.y;

	    // Sort by row
	    if (colA < colB) {
			return -1;
		}
	    if (colB < colA) {
			return 1;
		}

		if (rowA > rowB) return -1;
		if (rowB > rowA) return 1;


		return 0; //same exact point should actually be impossible
}


if (typeof module !== 'undefined'){
    if (module.exports){
        module.exports = TouchIdHandler;
    }

}

//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
!function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,v=e.reduce,h=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,w=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.1";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(j.has(n,a)&&t.call(e,n[a],a,n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduce===v)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduceRight===h)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e};var F=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=F(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var k=function(n,t,r,e){var u={},i=F(null==t?j.identity:t);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};j.groupBy=function(n,t,r){return k(n,t,r,function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)})},j.countBy=function(n,t,r){return k(n,t,r,function(n,t){j.has(n,t)||(n[t]=0),n[t]++})},j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:F(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var R=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return R(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var M=function(){};j.bind=function(n,t){var r,e;if(w&&n.bind===w)return w.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));M.prototype=n.prototype;var u=new M;M.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u=null;return function(){var i=this,a=arguments,o=function(){u=null,r||(e=n.apply(i,a))},c=r&&!u;return clearTimeout(u),u=setTimeout(o,t),c&&(e=n.apply(i,a)),e}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){var t=[];for(var r in n)j.has(n,r)&&t.push(n[r]);return t},j.pairs=function(n){var t=[];for(var r in n)j.has(n,r)&&t.push([r,n[r]]);return t},j.invert=function(n){var t={};for(var r in n)j.has(n,r)&&(t[n[r]]=r);return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}.call(this);

