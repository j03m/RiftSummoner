var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var ArenaGame = jc.TouchLayer.extend({
	sprites: [],
    teams:{},
    init: function() {
		if (this._super()) {
            this.background = new jc.Sprite();
			this.background.layer = this;
            this.background.type = 'background';
            this.background.initWithPlist(arenaPlist, arenaSheet, 'Colosseum_02.png', {"name:":"arena", "type":'background'});
            this.background.centerOnScreen();
			this.addChild(this.background);

            this.reorderChild(this.background,  (cc.Director.getInstance().getWinSize().height+10) * -1);
            this.teams['a'] = [];
            this.teams['b'] = [];
            //this.runScenario1();
            //this.runScenario2();
            //this.runScenario3();
            this.runScenario0();
            this.scheduleUpdate();
			return true;
		} else {
			return false;
		}
	},
    initScroll:function(){
//      var size = new cc.Size();
//      size.width = this
//      cc.ScrollView.create(cc.Size())
    },
    runScenario0:function(){
        this.getRandomSprite('goblin');
        this.getRandomSprite('spider');
        this.getRandomSprite('wizard');
        this.getRandomSprite('snakeThing');
        this.getRandomSprite('wizard');
        this.getRandomSprite('spider');


        this.getRandomSprite('blueKnight');
        this.getRandomSprite('orge');
        this.getRandomSprite('fireKnight');
        this.getRandomSprite('dragonRed');
        this.getRandomSprite('dragonBlack');
        this.getRandomSprite('orc');



        this.arrange(this.sprites);
    },
    runScenario1:function(){
        this.getRandomSprite('goldKnight');
        this.getRandomSprite('orc');
        this.arrange(this.sprites);
    },
    runScenario2:function(){
        this.getRandomSprite('goldKnight');
        this.getRandomSprite('orc');
        this.arrange(this.sprites);
        //now set orc (sprite #2) into the middle of the screen
        this.sprites[1].centerOnScreen();
        this.sprites[1].updateHealthBarPos();
        var base = this.sprites[1].getBasePosition();
        //set me to his right
        this.sprites[0].setBasePosition(cc.p(base.x + 100, base.y+100));

    },
    runScenario3:function(){
        this.getRandomSprite('goldKnight');
        this.getRandomSprite('forestElf');
        this.arrange(this.sprites);
    },
    runScenario4:function(){
        this.getRandomSprite('goldKnight');
        this.getRandomSprite('forestElf');
        this.getRandomSprite('orc');
        this.getRandomSprite('voidElf');
        this.arrange(this.sprites);
    },
    runScenario4:function(){
        this.getRandomSprite('goldKnight');
        this.getRandomSprite('forestElf');
        this.getRandomSprite('orc');
        this.getRandomSprite('dragonRed');


        this.getRandomSprite('blueKnight');
        this.getRandomSprite('redGargoyle');
        this.getRandomSprite('orge');
        this.getRandomSprite('voidElf');

        this.arrange(this.sprites);
    },
    runScenario5:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');
        this.arrange(this.sprites);
    },
    runScenario6:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');

        this.getRandomSprite('orc');
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');
        this.arrange(this.sprites);
    },
    runScenario7:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('orc');
        this.getRandomSprite('voidElf');
        this.getRandomSprite('troll');
        this.getRandomSprite('orge');


        this.getRandomSprite('orge');
        this.getRandomSprite('troll');
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');
        this.getRandomSprite('goldKnight');

        this.arrange(this.sprites);
    },
    runScenario8:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('shellback');
        this.getRandomSprite('troll');
        this.getRandomSprite('troll');
        this.getRandomSprite('shellback');
        this.getRandomSprite('orge');

        this.getRandomSprite('troll');
        this.getRandomSprite('orge');
        this.getRandomSprite('troll');
        this.getRandomSprite('orc');
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');

        this.arrange(this.sprites);
    },
    runScenario9:function(){
        //todo: unbalanced, shellbacks should be like troll killing missles
        this.getRandomSprite('shellback');
        this.getRandomSprite('troll');
        this.getRandomSprite('troll');
        this.getRandomSprite('shellback');

        this.getRandomSprite('troll');
        this.getRandomSprite('troll');
        this.getRandomSprite('troll');
        this.getRandomSprite('shellback');
        this.arrange(this.sprites);
    },
    runScenario10:function(){
        //todo: unbalanced, shellbacks should be like troll killing missles
        this.getRandomSprite('spider');
        this.getRandomSprite('troll');
        this.getRandomSprite('orc');

        this.getRandomSprite('orc');
        this.getRandomSprite('troll');
        this.getRandomSprite('orc');
        this.arrange(this.sprites);
    },
    runScenario11:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('shellback');
        this.getRandomSprite('troll');
        this.getRandomSprite('troll');
        this.getRandomSprite('shellback');
        this.getRandomSprite('orge');

        this.getRandomSprite('troll');
        this.getRandomSprite('orge');
        this.getRandomSprite('spider');
        this.getRandomSprite('orc');
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');

        this.arrange(this.sprites);
    },
    runScenario12:function(){
        this.getRandomSprite('forestElf');
        this.getRandomSprite('forestElf');
        this.getRandomSprite('forestElf');


        this.getRandomSprite('troll');
        this.getRandomSprite('spider');
        this.getRandomSprite('troll');
        this.arrange(this.sprites);
    },
    runScenario13:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('dragonBlack');
        this.getRandomSprite('troll');
        this.getRandomSprite('troll');
        this.getRandomSprite('dragonBlack');
        this.getRandomSprite('orge');

        this.getRandomSprite('troll');
        this.getRandomSprite('redGargoyle');
        this.getRandomSprite('redGargoyle');
        this.getRandomSprite('orc');
        this.getRandomSprite('orc');
        this.getRandomSprite('troll');

        this.arrange(this.sprites);
    },
    runScenario14:function(){
        this.getRandomSprite('orc');
        this.getRandomSprite('orge');
        this.getRandomSprite('orc');
        this.getRandomSprite('orge');
        this.arrange(this.sprites);
    },



    getRandomSprite:function(nameCreate){
        var sprite;
        sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, this);
        sprite.setState('idle');
		this.addChild(sprite.batch);
		this.addChild(sprite);
        sprite.layer = this;
        this.sprites.push(sprite);
	},
    arrange:function(sprites){
        //get random position on the bottom portion of the screen
        var size = cc.Director.getInstance().getWinSize();
        var teamAX = size.width/4;
        var teamAY = size.height/8;
        var teamBX = size.width - teamAX;

        for (var i =0; i<sprites.length/2;i++){
            sprites[i].setBasePosition(cc.p(teamAX,teamAY*(i+1)));
            sprites[i].homeTeam = this.teams['a'];
            sprites[i].enemyTeam = this.teams['b'];
            this.teams['a'].push(sprites[i]);
        }

        var count =0;
        for (var i =sprites.length/2; i<sprites.length;i++){
            sprites[i].setBasePosition(cc.p(teamBX,teamAY*(count+1)));
            sprites[i].setFlipX(true);
            sprites[i].homeTeam = this.teams['b'];
            sprites[i].enemyTeam = this.teams['a'];
            this.teams['b'].push(sprites[i]);
            count++;
        }

        for (var i =0; i<sprites.length/2;i++){
            sprites[i].team = 'a';
        }

        for (var i =sprites.length/2; i<sprites.length;i++){
            sprites[i].team = 'b';
        }


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

    }
    //todo: sort sprites by y pos, draw in order


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
