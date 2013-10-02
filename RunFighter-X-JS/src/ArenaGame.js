var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var ArenaGame = jc.TouchLayer.extend({
	teamASprites: [],
    teamBSprites: [],
    sprites:[],
    teams:{},
    init: function() {
		if (this._super()) {

            //todo: change this cc sprite, not need for jcsprite here, kinda dumb
            this.background = cc.Sprite.create(shrine1Png);
			this.addChild(this.background);

            this.worldSize = this.background.getContentSize();
            this.reorderChild(this.background,  (cc.Director.getInstance().getWinSize().height+10) * -1);
            this.setViewpointCenter(cc.p(this.worldSize.width/2, this.worldSize.height/2));
            this.teams['a'] = [];
            this.teams['b'] = [];
            this.bubbleAllTouches(true);

            //sequence
                //pan to team a start

                //add each team member
                //pan to team b start
                //add each team member
                //pan to center
                //fight
                //put constant zoom to fit in update

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
        this.teamBSprites.push('blueKnight');
        this.teamBSprites.push('orge');
        this.teamBSprites.push('fireKnight');
        this.teamBSprites.push('dragonRed');
        this.teamBSprites.push('dragonBlack');
        this.teamBSprites.push('orc');
        this.arrange();
    },
    runScenario0:function(){
        this.teamASprites.push('goblin');
        this.teamASprites.push('spider');
        this.teamASprites.push('wizard');
        this.teamASprites.push('snakeThing');
        this.teamASprites.push('wizard');
        this.teamASprites.push('spider');

        this.teamBSprites.push('blueKnight');
        this.teamBSprites.push('orge');
        this.teamBSprites.push('fireKnight');
        this.teamBSprites.push('dragonRed');
        this.teamBSprites.push('dragonBlack');
        this.teamBSprites.push('orc');
        this.arrange();
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
    setViewpointCenter:function(point){
        var centerPoint = cc.p(this.worldSize.width/2, this.worldSize.height/2);
        var viewPoint = cc.pSub(centerPoint, point);

        if(point.x < centerPoint.x){
            viewPoint.x = 0;
        }

        if(point.y < centerPoint.y){
            viewPoint.y = 0;
        }

        // while zoomed out, don't adjust the viewpoint
        this.setPosition(viewPoint);


    },
    arrange:function(){
        //get random position on the bottom portion of the screen
        var size = this.worldSize;
        var teamAX = size.width/4;
        var teamAY = size.height/8;
        var teamBX = size.width - teamAX;
        var sprite;
        for (var i =0; i<this.teamASprites.length;i++){
            sprite = this.getSprite(this.teamASprites[i]);
            var worldPosition = cc.p(teamAX,teamAY*(i+1));
            var screenPosition = this.convertToNodeSpace(worldPosition);
            sprite.setBasePosition(screenPosition);
            sprite.homeTeam = this.teams['a'];
            sprite.enemyTeam = this.teams['b'];
            sprite.team = 'a';
            this.teams['a'].push(sprite);
            this.touchTargets.push(sprite);
        }


        for (var i =0; i<this.teamBSprites.length;i++){
            sprite = this.getSprite(this.teamBSprites[i]);
            sprite.setBasePosition(cc.p(teamBX,teamAY*(i+1)));
            sprite.setFlipX(true);
            sprite.homeTeam = this.teams['b'];
            sprite.enemyTeam = this.teams['a'];
            sprite.team = 'b';
            this.teams['b'].push(sprite);
            this.touchTargets.push(sprite);
        }

        this.sprites = this.teams['a'].concat(this.teams['b']);

    },
    update:function (dt){
        //pulse each sprite
        for (var i =0; i<this.sprites.length;i++){
            this.sprites[i].think(dt);
        }
    },
    doBlood:function(sprite){
        var flower = cc.ParticleSystem.create(bloodPlist);
        this.addChild( flower );
        flower.setPosition( this.getRandomBloodSpot(sprite));
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

        var point = this.convertToNodeSpace(touch);
        this.setViewpointCenter(point);
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
