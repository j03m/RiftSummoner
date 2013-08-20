var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var ArenaGame = cc.Layer.extend({
	sprites: [],
    teams:{},
    init: function() {
		if (this._super()) {							
			this.background = new jc.Sprite();
			this.background.initWithPlist(arenaPlist, arenaSheet, 'Colosseum_02.png', 'arena');
			this.background.centerOnScreen();
			this.addChild(this.background);
            this.teams['a'] = [];
            this.teams['b'] = [];
            this.getRandomSprite(0);
            this.getRandomSprite(1);
            this.getRandomSprite(2);
            this.getRandomSprite(3);
            this.arrange(this.sprites);
            this.scheduleUpdate();
			return true;
		} else {
			return false;
		}
	},

	getRandomSprite:function(toCreate){
        var nameCreate = "";
        var sprite;
        if (toCreate == 0){
            nameCreate = 'blackGargoyle';
            sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, blackGargoyleSheet, blackGargoylePlist);
        }

        if (toCreate == 1){
            nameCreate = 'dragonBlack';
            sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, dragonBlackSheet, dragonBlackPlist);
        }

        if (toCreate == 2){
            nameCreate = 'blueKnight';
            sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, blueKnightSheet, blueKnightPlist);
        }

        if (toCreate == 3){
            nameCreate = 'orc';
            sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, orcSheet, orcPlist);
        }

        sprite.setState('idle');
		this.addChild(sprite.batch);
		this.addChild(sprite);
        sprite.layer = this;
        this.sprites.push(sprite);
	},
    arrange:function(sprites){
        //get random position on the bottom portion of the screen
        var size = cc.Director.getInstance().getWinSize();
        var midW = size.width/2;
        var midH = size.height/2;

        for (var i =0; i<sprites.length/2;i++){
            var box = sprites[i].getBoundingBox();
            var posW = jc.randomNum(box.width, midW-box.width);
            var posH = jc.randomNum(box.height, midH-box.height);
            jc.log(['gameplay'], sprites[i].name + " starting@:" + posW + "," + posH);
            sprites[i].setPosition(cc.p(posW,posH));
            sprites[i].homeTeam = this.teams['a'];
            sprites[i].enemyTeam = this.teams['b'];
            this.teams['a'].push(sprites[i]);
        }

        for (var i =sprites.length/2; i<sprites.length;i++){
            var box = sprites[i].getBoundingBox();
            var posW = jc.randomNum(midW + box.width, size.width-box.width);
            var posH = jc.randomNum(box.height, midH-box.height);
            jc.log(['gameplay'], sprites[i].name + " starting@:" + posW + "," + posH);
            sprites[i].setPosition(cc.p(posW,posH));
            sprites[i].setFlipX(true);
            sprites[i].homeTeam = this.teams['b'];
            sprites[i].enemyTeam = this.teams['a'];

            this.teams['b'].push(sprites[i]);
        }

        for (var i =0; i<sprites.length/2;i++){
            sprites[i].team = 'a';
            sprites[i].setBehavior('tank');
        }

        for (var i =sprites.length/2; i<sprites.length;i++){
            sprites[i].team = 'b';
            sprites[i].setBehavior('tank');
        }


    },
    update:function (dt){
        //pulse each sprite
        for (var i =0; i<this.sprites.length;i++){
            this.sprites[i].think(dt);
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
	var scene = cc.Scene.create();
	var layer = ArenaGame.create();
	scene.addChild(layer);
	return scene;
};
