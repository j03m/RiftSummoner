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
        if(!jc.arenaScene.data){
            this.runScenario0();
        }else{
            this.runScenario();
        }
    },
    runScenario:function(){

        this.teamASprites = jc.arenaScene.data.teamA;
        this.teamAFormation = jc.formations[jc.arenaScene.data.teamAFormation];
        this.teamBSprites = jc.arenaScene.data.teamB;
        this.teamBFormation = jc.formations[jc.arenaScene.data.teamBFormation];
        this.teamAPowers = jc.arenaScene.data.teamAPowers;
        this.teamBPowers = jc.arenaScene.data.teamBPowers;
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

        for (var i =0; i<this.teamASprites.length;i++){
            sprite = this.getSprite(this.teamASprites[i]);
            sprite.homeTeam = this.teams['a'];
            sprite.enemyTeam = this.teams['b'];
            sprite.team = 'a';
            sprite.setVisible(false);
            this.teams['a'].push(sprite);
            this.touchTargets.push(sprite);

        }


        for (var i =0; i<this.teamBSprites.length;i++){
            sprite = this.getSprite(this.teamBSprites[i]);
            sprite.setFlipX(true);
            sprite.homeTeam = this.teams['b'];
            sprite.enemyTeam = this.teams['a'];
            sprite.team = 'b';
            sprite.setVisible(false);
            this.teams['b'].push(sprite);
            this.touchTargets.push(sprite);
        }
        this.sprites = this.teams['a'].concat(this.teams['b']);

        this.present();

    },
    present:function(){

        this.presentTeam(this.teams['a'], this.teamAFormation, cc.p(this.worldSize.width/4, this.worldSize.height/2), function(){
            this.presentTeam(this.teams['b'], this.teamBFormation, cc.p((this.worldSize.width/4)*3, this.worldSize.height/2), function(){
                this.presentHud(this.teamAPowers, function(){
                    this.started = true;
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
        jc.arenaScene.addChild(this.powerLayer, this.getZOrder()+1);

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
            this.scheduleOnce(function(){
                this.panToWorldPoint(formationPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
                    var worldPos = formationPoint;
                    var nodePos = this.convertToItemPosition(worldPos);
                    sprite.setBasePosition(nodePos);
                    sprite.setVisible(true);
                    jc.playEffectOnTarget("teleport", sprite, sprite.getZOrder(), this);
                    done();
                }.bind(this));
            }, this.presentationSpeed);
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
            var scaleLimit = 25;
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
        if (type == jc.touchEnded){
            if (this.nextTouchAction){
                this.nextTouchAction(touch, sprites);
                this.nextTouchAction = undefined;
            }
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
	if (!jc.arenaScene){
        jc.arenaScene = cc.Scene.create();
        jc.arenaScene.layer = ArenaGame.create();
        jc.arenaScene.addChild(jc.arenaScene.layer);
    }
    return jc.arenaScene;

};
