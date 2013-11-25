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
            this.doConvert = true;
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
        this.teamAPowers = hotr.arenaScene.data.teamAPowers;
        this.teamBSprites = hotr.arenaScene.data.teamB;
        this.teamBFormation = jc.formations[hotr.arenaScene.data.teamBFormation];
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

        //todo refactor these loops into 1 funcN
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
//        this.powerLayer = new PowerHud();
//
//        //place layer  add to scene
//        hotr.arenaScene.addChild(this.powerLayer, this.getZOrder()+1);
//
//        this.powerLayer.init(powers);
//
//        this.powerLayer.inTransitionsComplete = function(){
//            this.powerLayer.hackOn();
//            callback();
//        }.bind(this);
//
//        this.powerLayer.start();
        callback();

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
                    var compareMaxX = worldPos.x + tr.width;
                    var compareMinX = worldPos.x - tr.width;
                    var compareMaxY = worldPos.y + tr.height;
                    var compareMinY = worldPos.y - tr.height;


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

                //todo: based on characterMid, select camera 1-9                                             d
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
    setSpriteTargetLocation:function(touch, sprites){
        //play tap effect at touch
        jc.playEffectAtLocation("tapEffect", touch, jc.shadowZOrder,this);
        this.selectedSprite.removeChild(this.selectedSprite.effectAnimations["selectEffect"].sprite);
        this.selectedSprite.effectAnimations["selectEffect"].playing = false;
        this.nextTouchAction = undefined;
        this.selectedSprite.behavior.followCommand(touch);
    },
    targetTouchHandler:function(type, touch,sprites){
        if (type == jc.touchEnded){
            var nodePos = touch; //this.convertToNodeSpace(touch);
            if (this.nextTouchAction){
                this.nextTouchAction(nodePos, sprites);
                this.nextTouchAction = undefined;
            }
            if (sprites){

                var minSprite = this.getBestSpriteForTouch(nodePos, sprites, this.getTeam('a'));
                if (minSprite){
                    jc.playEffectOnTarget("selectEffect", minSprite, this, true );
                    this.selectedSprite = minSprite;
                    this.nextTouchAction = this.setSpriteTargetLocation.bind(this)
                }

            }
        }

        return true;
    },
    getBestSpriteForTouch:function(touch, sprites, team){
        var minSprite;
        var minDis = this.winSize.width;
        for(var i =0;i<sprites.length;i++){
            //alive/myteam?
            if (sprites[i].isAlive() && team.indexOf(sprites[i])!=-1){
                //this.bestMatch?
                var v1 = jc.getVectorTo(touch, sprites[i].getPosition());
                if (v1.distance < minDis){
                    minDis = v1.distance;
                    minSprite = sprites[i];
                }
            }
        }
        return minSprite;
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
