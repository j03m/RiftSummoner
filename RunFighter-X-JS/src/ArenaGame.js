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

    init: function() {
		if (this._super(shrine1Png)) {

            this.teams['a'] = [];
            this.teams['b'] = [];
            this.teamATerritory=this.worldSize.width/4;
            this.teamBTerritory=this.worldSize.width;
            this.scheduleUpdate();
			return true;
		} else {
			return false;
		}
	},
    onShow:function(){
        if(!jc.editDeckResult){
            this.runScenario0();
        }else{
            this.runMetaDataScenario();
        }
    },
    runMetaDataScenario:function(){
        for(var entry in jc.editDeckResult){
            var name = jc.playerBlob.myguys[jc.editDeckResult[entry]].name;
            this.teamASprites.push(name);
        }

        this.teamAFormation = jc.formations["4x4x4"];


        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('goldElf');
        this.teamBSprites.push('voidElf');
        this.teamBSprites.push('goldElf');

        this.teamBSprites.push('orc');
        this.teamBSprites.push('orc');
        this.teamBSprites.push('orc');
        this.teamBSprites.push('orc');

        this.teamBSprites.push('troll');
        this.teamBSprites.push('wizard');
        this.teamBSprites.push('wizard');
        this.teamBSprites.push('troll');
        this.teamBFormation = jc.formations["4x4x4"];
        this.setUp();
    },
    runScenario0:function(){

        this.teamASprites.push('orc');
        this.teamASprites.push('orc');
        this.teamASprites.push('orc');



        this.teamAFormation = jc.formations["4x4x4"];

        //this.teamBSprites.push('elementalWind');
        this.teamBSprites.push('shadowKnight');



        this.teamBFormation = jc.formations["4x4x4"];


//        this.teamASprites.push('fireKnight');
//        this.teamBSprites.push('shadowKnight');
//
//        this.teamBFormation = jc.formations["4x3"];
//        this.teamAFormation = jc.formations["4x3"];

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

        //pan and zoom to the center of team territory
        var teamALine = cc.p(this.teamATerritory, this.worldSize.height/2);
        var teamBLine = cc.p(this.teamBTerritory, this.worldSize.height/2);
//        this.panToWorldPoint(teamALine,this.getScale(this.teamATerritory,this.worldSize.height/2), jc.defaultTransitionTime, function(){
//            //add sprites, arrange in formation
//            for(var i =0; i<this.teams['a'].length; i++){
//                var sprite = this.teams['a'][i];
//                var position = this.teamAFormation[i];
//                sprite.setBasePosition(position);
//                sprite.setVisible(true);
//            }
//            this.panToWorldPoint(teamBLine, this.getScale(), jc.defaultTransitionTime,function(){
//                for(var i =0; i<this.teams['b'].length; i++){
//                    var sprite = this.teams['b'][i];
//                    var position = cc.p(this.teamBFormation[i].x, this.teamBFormation[i].y);
//                    position.x += this.winSize.width/2;
//                    sprite.setBasePosition(position);
//                    sprite.setVisible(true);
//                }
//                this.fullZoomOut(jc.defaultTransitionTime,function(){
//                      this.started = true;
//                });
//            }.bind(this));
//        }.bind(this));


        this.fullZoomOut(jc.defaultTransitionTime,function(){
            //add sprites, arrange in formation
            for(var i =0; i<this.teams['a'].length; i++){
                var sprite = this.teams['a'][i];
                var worldPos = this.teamAFormation[i];
                var nodePos = this.convertToItemPosition(worldPos);
                sprite.setBasePosition(nodePos);
                //sprite.setBasePosition(this.convertToItemPosition(cc.p(0, 0)));
                sprite.setVisible(true);
            }

            for(var i =0; i<this.teams['b'].length; i++){
                var sprite = this.teams['b'][i];
                var worldPos = cc.p(this.teamBFormation[i].x, this.teamBFormation[i].y);
                worldPos.x += this.worldSize.width/2;

                var nodePos = this.convertToItemPosition(worldPos);
                sprite.setBasePosition(nodePos);
                //sprite.setBasePosition(this.convertToItemPosition(cc.p(this.worldSize.width/2, this.worldSize.height/2)));
                sprite.setVisible(true);
                this.started = true;
            }

        }.bind(this));

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
            var scaleLimit = 100;
            if (!this.scaleGate && shouldScale){


                var characterMid = cc.pMidpoint(cc.p(minX,minY), cc.p(maxX,maxY));
                var scale = this.getScale(maxX-minX, maxY-minY);

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
            //this.panToWorldPoint(cc.p(0,0), this.getScaleOne(), jc.defaultTransitionTime, function(){});
            this.panToWorldPoint(cc.p(0,0),this.getScaleOne(), jc.defaultTransitionTime, function(){ });
        }
    }


    //assume the board is 3x as wide as before - rerender backdrop
    //team x starts left, team y starts right
    //game starts totally zoomed out on full scene
    //determine where the left most and right most charactgers are, zoom in or out until they are just visible
    //can I make a new widescreen camera in maya for the arena collosseum



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
