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
    teamBPowers:undefined,
    presentationSpeed:0.2,
    timeLimit:45,
    init: function() {
        this.name = "Arena";
        if (this._super(arenaSheet)) {
            Math.seedrandom('yay i made a game');
            this.teams['a'] = [];
            this.teams['b'] = [];
            this.teamSize = jc.teamSize;
            this.squadNumbers = this.teamSize/2;
            this.scheduleUpdate();
            this.doConvert = true;
            this.gameTime = 0;
            this.charSelect = "characterSelection";
            this.enemySelect = "enemySelection";
            this.allySelect = "allySelection";
            this.powerBarOpenPos = cc.p(400* jc.characterScaleFactor, 187*jc.characterScaleFactor);
            this.powerBarClosePos = cc.p(-255* jc.characterScaleFactor, 187*jc.characterScaleFactor);
            this.powerTilePosition = cc.p(159*jc.characterScaleFactor, 100*jc.characterScaleFactor);
            this.powerTileSpacing = 200 * jc.characterScaleFactor;

            this.squadBarOpenPos = cc.p(1700* jc.characterScaleFactor, 187*jc.characterScaleFactor);
            this.squadBarClosePos = cc.p(2310 * jc.characterScaleFactor, 187*jc.characterScaleFactor);
            this.squadTilePosition = cc.p(250*jc.characterScaleFactor, 85*jc.characterScaleFactor);
            this.squadTileSpacing = 200 * jc.characterScaleFactor;

            this.tutorialPoint1 = cc.p(600*jc.characterScaleFactor, 600*jc.characterScaleFactor);
            this.tutorialPoint2 = cc.p(800*jc.characterScaleFactor, 800*jc.characterScaleFactor);

            this.tutorial2Point1 = cc.p(300* jc.characterScaleFactor, 180*jc.characterScaleFactor);
            this.tutorial2Point2 = cc.p(350* jc.characterScaleFactor, 425*jc.characterScaleFactor);
            this.tutorial2Point3 = cc.p((this.winSize.width/2)+300*jc.characterScaleFactor,this.winSize.height/2);

            this.nexusAPoint = cc.p(550*jc.characterScaleFactor, 853*jc.characterScaleFactor);
            this.nexusBPoint = cc.p(3878.3535109*jc.characterScaleFactor, 853*jc.characterScaleFactor);

            var adjustX1 = 600 *jc.characterScaleFactor;
            var adjustX2 = 400 *jc.characterScaleFactor;
            var adjustY = 500 *jc.characterScaleFactor;
            var adjustY1 = 75*jc.characterScaleFactor;
            this.spawnA1 = cc.p(this.nexusAPoint.x + adjustX1, this.nexusAPoint.y + adjustY1);
            this.spawnA2 = cc.p(this.nexusAPoint.x + adjustX2, this.nexusAPoint.y + adjustY);
            this.spawnA3 = cc.p(this.nexusAPoint.x + adjustX2, this.nexusAPoint.y - adjustY);

            this.spawnB1 = cc.p(this.nexusBPoint.x - adjustX1, this.nexusBPoint.y+ adjustY1);
            this.spawnB2 = cc.p(this.nexusBPoint.x - adjustX2, this.nexusBPoint.y + adjustY);
            this.spawnB3 = cc.p(this.nexusBPoint.x - adjustX2, this.nexusBPoint.y - adjustY);

            this.startViewPoint = cc.p(1500*jc.characterScaleFactor,1000*jc.characterScaleFactor);

            this.playableRect = cc.rect(0,0, this.worldSize.width, this.worldSize.height - 100 * jc.characterScaleFactor);

            this.spawnBPoint = this.nexusBPoint;
            this.enemyStartPos = cc.p((this.worldSize.width/2)+ 1000 * jc.characterScaleFactor, (this.worldSize.height/2) + 500 *jc.characterScaleFactor);
            this.enemyStartPosTutorials = cc.p((this.worldSize.width/2)+ 1000 * jc.characterScaleFactor, (this.worldSize.height/2) - 300 *jc.characterScaleFactor);

            this.nexusMsg = "You cannot summon so far from your nexus gem. Try touching closer to it.";

            return true;
		} else {
			return false;
		}
	},
    onShow:function(){
        cc.SpriteFrameCache.getInstance().addSpriteFrames(shadowPlist);
        cc.SpriteBatchNode.create(shadowPng);
        this.level = hotr.blobOperations.getTutorialLevel();

        this.scheduleOnce(function(){
            this.setUp();
            if(!hotr.arenaScene.data){
                this.runScenario0();
            }else if (this.level>3){
                this.runScenario();
            }else{
                this.runTutorial();
            }
        }.bind(this));


    },
    runScenario:function(){
        this.teamASprites = hotr.arenaScene.data.teamA;
        this.teamAPowers = hotr.arenaScene.data.teamAPowers;
        this.teamBSprites = hotr.arenaScene.data.teamB;
        this.teamBPowers = hotr.arenaScene.data.teamBPowers;


        this.placementTouches = 1;
        this.panToWorldPoint(this.startViewPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
            //this.placeEnemyTeam();
            //this.nextTouchDo(this.initialSetupAction,true);
            this.finalActions();
            this.makeSelectionBar();
        }.bind(this));


    },
    makeSelectionBar:function(){
        if (!this.tableView){
            this.tableView = new jc.ScrollingLayer();
            this.getParent().addChild(this.tableView);
            var scrollData = this.getDisplaySpritesAndMetaData();
            this.cellWidth = scrollData.sprites[0].getContentSize().width*2;
            this.tableView.init({
                sprites:scrollData.sprites,
                metaData:scrollData.ids,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this),
                width:this.winSize.width
            });

            var tableDim = this.tableView.getContentSize();
            var y = tableDim.height/2;
            y += 25 * jc.characterScaleFactor;
            this.tableView.setPosition(cc.p(this.winSize.width/2, y));
            this.reorderChild(this.tableView, jc.topMost);
            this.tableView.hackOn();
            this.tableView.setIndex(Math.floor(scrollData.sprites.length/2));
        }
    },
    makeScrollSprites: function(names){
        var characters =  _.map(names, function(name){
            return this.makeScrollSprite(name);
        }.bind(this));

        return characters;

    },
    makeScrollPowers: function(powers){
        var powers =  _.map(powers, function(name){
            return this.makePowerSprite(name);
        }.bind(this));
        return powers;
    },
    makePowerSprite: function(powerName){
        var sprite = jc.makeSimpleSprite("characterPortraitFrame.png");
        sprite.pic = jc.makeSpriteWithPlist(powerTiles[powerName].plist, powerTiles[powerName].png, powerTiles[powerName].icon);
        sprite.addChild(sprite.pic);
        this.scaleTo(sprite.pic, sprite);
        jc.scaleCard(sprite.pic);
        this.centerThisChild(sprite.pic, sprite);
        sprite.pic.setZOrder(-1);
        return sprite;
    },
    makeScrollSprite: function(name){
        var sprite = jc.makeSimpleSprite("characterPortraitFrame.png");
        sprite.pic = jc.getCharacterCard(name);
        sprite.addChild(sprite.pic);
        this.scaleTo(sprite.pic, sprite);
        jc.scaleCard(sprite.pic);
        this.centerThisChild(sprite.pic, sprite);
        sprite.pic.setZOrder(-1);
        return sprite;
    },
    selectionCallback:function(index, sprite, data){
        jc.log(['ArenaSelection'], 'index:' + index);
        this.clearSelection();
        if (data.type == 'char'){
            this.doPlaceHero(index, data);
        }

        if (data.type == 'power'){
            this.doPlacePower(index, data);
        }

    },
    doPlacePower: function(index, data){
        if (!data.used){

            this.tableView.disableCell(index);
            var config = powerTiles[data.id];
            if (!config){
                throw "unknown power: " + data.id;
            }
            var func = globalPowers[config['offense']].bind(this);
            if (config.type == "direct"){
                hotr.arenaScene.layer.nextTouchDo(function(touch, sprites){
                    var worldPos = this.screenToWorld(touch);
                    var nodePos = this.convertToItemPosition(worldPos);
                    data.used = true;
                    func(nodePos, sprites);
                    jc.log(['arena'], 'fading out!');
                }.bind(this));

            }else if (config.type == "global"){
                func();
            }else{
                throw "Unknown power type.";
            }
        }
    },
    doPlaceHero:function(index, data){
        if (data.id == undefined){
            throw "selection data corrupt";
        }
        this.barSelection = hotr.blobOperations.getEntryWithId(data.id);
        this.barIndex =  index;
        var found = _.find(this.sprites, function(obj){
            return obj.id == data.id;
        });



        if (found){
            if (found.name == 'nexus'){
                throw "Nexus selected, something wrong.";
            }
            var def = spriteDefs[found.name];
            if (def.creep){
                this.doCreepSelect(found);
            }else{
                this.doHeroSelect(found);
            }
        }else{
            this.nextTouchDo(this.placeBarSprite.bind(this));
        }
    },
    doCreepSelect:function(found){
        var creeps = _.filter(this.sprites, function(obj){
            return obj.name == found.name;
        });
        var keepGoing =false
        var firstAlive = 0;
        for(var i =0;i<creeps.length;i++){
            if (creeps[i].isAlive()){
                firstAlive = i;
                keepGoing = true;
                this.clearSelection();
                break;
            }
        }

        if (keepGoing){
            this.selectedCreeps = [];
            jc.playEffectOnTarget(this.charSelect, creeps[firstAlive], this, true);
            this.panToWorldPoint(this.screenToWorld(creeps[firstAlive].getBasePosition()), this.getScaleOne(), jc.defaultTransitionTime)
            for(var i =0;i<creeps.length;i++){

                this.selectedCreeps.push(creeps[i]);
            }

        }

        this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
    },
    doHeroSelect:function(found){
        if(!found.isAlive()){
            return;
        }else{
            var minSprite = found;

            this.clearSelection();
            this.selectedSprite = minSprite;
            jc.playEffectOnTarget(this.charSelect, minSprite, this, true);
            this.panToWorldPoint(this.screenToWorld(minSprite.getBasePosition()), this.getScaleOne(), jc.defaultTransitionTime);
            this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
        }
    },
    placeBarSprite:function(touch){

        var world = this.screenToWorld(touch);
        this.panToWorldPoint(world, this.getScaleOne(), jc.defaultTransitionTime)
        var center = this.worldMidPoint;
        if (jc.insideCircle(world, center) && world.x < this.worldMidPoint.x){

            var def = spriteDefs[this.barSelection.name];
            if (def.creep){
                this.placeCreeps(world);
            }else{
                this.placeHero(world)
            }

        }else{
            this.floatMsg(this.nexusMsg);
        }
    },
    placeCreeps:function(world){
        var def = spriteDefs[this.barSelection.name];
        this.clearSelection();
        if (!this.selectedCreeps){
            this.selectedCreeps=[];
        }
        this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
        this.tableView.disableCell(this.barIndex);
        var count = 0;
        var hold = [];
        for(var i =0; i<def.number;i++){
            var sprite = this.makeTeamASprite(this.barSelection);
            this.selectedCreeps.push(sprite);
            hold.push(sprite);
            if (i == 0){
                jc.playEffectOnTarget(this.charSelect, sprite, this, true );
            }
        }
        this.schedule(function(data, index){
            return function(){
                if (!this.started){
                    this.finalActions();
                }
                var sprite=hold[count];
                var nodePos = this.convertToItemPosition(world);
                sprite.setBasePosition(nodePos);
                sprite.ready(true);
                jc.playEffectOnTarget("teleport", sprite, this);
                count++;

            }.bind(this);
        }.bind(this)(this.barSelection, this.barIndex),0.5, def.number-1);


    },
    clearSelection:function(){
        if (this.selectedSprite){
            this.selectedSprite.removeAnimation(this.charSelect);
        }
        this.selectedSprite = undefined;
        if (this.selectedCreeps){
            for(var i=0;i<this.selectedCreeps.length;i++){
                this.selectedCreeps[i].removeAnimation(this.charSelect);
            }
        }
        this.selectedCreeps = undefined;
        this.nextTouchAction = undefined;
    },
    placeHero:function(world){
        var sprite = this.makeTeamASprite(this.barSelection);
        var nodePos = this.convertToItemPosition(world);
        sprite.setBasePosition(nodePos);
        sprite.ready(true);
        jc.playEffectOnTarget("teleport", sprite, this);
        if (!this.started){
            this.finalActions();
        }
        this.tableView.disableCell(this.barIndex);
        if (this.selectedSprite != sprite){
            this.clearSelection();
            jc.playEffectOnTarget(this.charSelect, sprite, this, true );
            this.selectedSprite = sprite;
        }
        this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
    },
    teamASpawn:function(){
        var spot = jc.randomNum(0,2);

        if (spot == 0){
            return this.convertToItemPosition(this.spawnA1);
        }

        if (spot == 1){
            return this.convertToItemPosition(this.spawnA2);
        }

        if (spot == 2){
            return this.convertToItemPosition(this.spawnA3);
        }

        return pos;
    },
    teamBSpawn:function(){
        var spot = jc.randomNum(0,2);

        if (spot == 0){
            return this.convertToItemPosition(this.spawnB1);
        }

        if (spot == 1){
            return this.convertToItemPosition(this.spawnB2);
        }

        if (spot == 2){
            return this.convertToItemPosition(this.spawnB3);
        }

        throw "did someone back randomNum? ";

    },
    getDisplaySpritesAndMetaData: function(){
        var characters = hotr.blobOperations.getCharacterIdsAndTypes();
        var names = _.pluck(characters, 'name');
        var ids = _.pluck(characters, 'id');
        var powerNames = hotr.blobOperations.getPowers();
        var sprites = this.makeScrollSprites(names);
        var powers = this.makeScrollPowers(powerNames);
        sprites = sprites.concat(powers);
        var finalIds = [];
        _.each(ids, function(id){
            finalIds.push({type:'char', id:id});
        });
        _.each(powerNames, function(power){
            finalIds.push({type:'power', id:power});
        });
        return {ids:finalIds, sprites:sprites};
    },
    runTutorial:function(){

        this.teamASprites = hotr.arenaScene.data.teamA;
        this.teamAPowers = hotr.arenaScene.data.teamAPowers;
        this.teamBSprites = hotr.arenaScene.data.teamB;
        this.teamBPowers = hotr.arenaScene.data.teamBPowers;
        this.step = hotr.blobOperations.getTutorialStep();
        this.blackBoxScene();
        if (this.level==1){
            if (this.step==1)
            {
                this.setUp();
                this.panToWorldPoint(this.startViewPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
                    this.showTutorialStep("This is your nexus. The source of a summoner's power. You must defend it at all costs.", undefined, 'left', 'girl');
                    this.step = 2;
                }.bind(this));

            }else if (this.step == 14){
                //we selected teams
                this.setUp();
                this.placeEnemyTeam(this.enemyStartPosTutorials);
                var scaleData = this.calculateScaleForSprites(this.teams['b']);
                this.panToWorldPoint(scaleData.mid, scaleData.scale, jc.defaultTransitionTime, function(){
                    this.showTutorialStep("Alright, there they are. Get ready to fight!", undefined, 'left', 'girl');
                    this.step =15;
                }.bind(this));
            }
        }else if (this.level == 2){
            this.showTutorialStep("This time you're going to pay!", undefined, 'right', 'orc');
        }else if (this.level == 3){
            var count = 0;
            this.incrementOnDefeat=true;
            this.showTutorialStep("We have come for the summoner. Your powers will serve our Dark Lord.", undefined, 'right', 'demon');
            this.step = 1;
        }

    },
    runScenario0:function(){

        this.teamASprites.push({name:'orge'});
        this.teamASprites.push({name:'priestessEarth'});
        this.teamBSprites.push({name:'orge'});
        this.teamBSprites.push({name:'troll'});

        this.setUp();
    },
    initialSetupAction:function(touch){

        this.startPos = this.screenToWorld(touch);
        var center = this.worldMidPoint;
        if (jc.insideCircle(this.startPos, center) && this.startPos.x < this.worldMidPoint.x){
            //play animation

            if (this.placementTouches == 1){
                jc.log(['Arena'], 'placement a!');
                var placement = this.placePlayerTeam('a');
                if (!placement){
                    jc.log(['Arena'], 'failed placement a!, placing b');
                    this.placePlayerTeam('b');
                }
            }

            if (this.placementTouches == 2){
                jc.log(['Arena'], 'pre placement b');
                this.placePlayerTeam('b');
                jc.log(['Arena'], 'post placement b');
                if (this.arrow){
                    this.removeChild(this.arrow, true);
                }
                jc.log(['Arena'], 'post placement b');
            }


            if (this.placementTouches==2 || this.teams['a'].length<=9){
                //place enemy team
                hotr.blobOperations.saveBlob();
                this.nextTouchAction = undefined;
                jc.log(['Arena'], 'before final actions!');
                this.finalActions();
            }else{
                jc.log(['Arena'], 'waiting for next touch!');
                this.placementTouches++;
                this.nextTouchDo(this.initialSetupAction,true);
            }

        }else{
                jc.log(['Arena'], 'invalid location msg');
                this.floatMsg(this.nexusMsg);
        }
    },
    finalActions:function(){
        function goodSprite(sprite){
            return sprite!=undefined;
        }

        jc.log(['Arena'], 'finalActions');
        this.originalPositions = {
            'a':[].concat(this.teams['a']),
            'b':[].concat(this.teams['b'])
        };

        jc.log(['Arena'], 'filtering');
        this.teams['a']=_.filter(this.teams['a'],goodSprite);
        this.teams['b']=_.filter(this.teams['b'],goodSprite);

        jc.log(['Arena'], 'sprites');
        this.sprites = this.teams['a'].concat(this.teams['b']);

        jc.log(['Arena'], 'started');
        this.startedAt = Date.now();
        this.started = true;
        this.teamANexus.updateHealthBarPos();
        this.teamBNexus.updateHealthBarPos();
        jc.log(['Arena'], 'schedule');
        this.schedule(function(dt){
            jc.log(['Arena'], 'updating...');
            this.doUpdate(0.20);
        }, 0.20);
    },
    placeEnemyTeam:function(pos){
        if (!pos){
            this.startPos = cc.p(this.enemyStartPos.x, this.enemyStartPos.y);
        }else{
            this.startPos = pos;
        }

        this.placeTeamPosition(this.teams['b'], this.squadNumbers);
        this.startPos.y-=800*jc.characterScaleFactor;
        this.placeTeamPosition(this.teams['b'], this.teamSize);
    },
    placePlayerTeam:function(squad){
        var touches = 0;
        if (squad == 'a'){
            touches = 1;
        }else{
            touches = 2;
        }

        var nodePos = this.convertToItemPosition(this.startPos);
        hotr.blobOperations.setSquadLocations(squad, this.startPos);
        jc.playEffectAtLocation("movement", nodePos, jc.shadowZOrder,this);
        return this.placeTeamPosition(this.teams['a'], touches * this.squadNumbers);
    },
    placeTeamPosition:function(team, squadSize){
        var placement = false;
        for(var i=squadSize-this.squadNumbers; i< squadSize; i++){
            var sprite = team[i];
            if (sprite){
                placement = true;
                var point = cc.p(this.startPos.x, this.startPos.y);
                var pos = i;
                if (i>this.squadNumbers){
                    pos -= this.squadNumbers;
                }
                var col = (pos)% 4;
                var row = Math.floor(pos/4);
                var valueX = 200 * jc.characterScaleFactor;
                var valueY = -175* jc.characterScaleFactor;
                if (team[i].isFlippedX()){
                    valueX *=-1;
                }
                var colAdjust = col * valueX;
                var rowAdjust = row * valueY;
                point.x+=colAdjust;
                point.y+=rowAdjust;
                var worldPos = point;
                var nodePos = this.convertToItemPosition(worldPos);
                sprite.setBasePosition(nodePos);
                sprite.ready(true);
                jc.playEffectOnTarget("teleport", sprite, this);
            }

        }
        return placement;
    },
    getSquadMovePositions:function(whichSquad, location){
        var returnMe = [];
        var squadSize = 0;
        var team = this.originalPositions['a'];
        if (whichSquad == 'a'){
            squadSize = this.squadNumbers;
        }else{
            squadSize = this.teamSize;
        }

        for(var i=squadSize-this.squadNumbers; i< squadSize; i++){
            if (team[i]){
                var point = cc.p(location.x, location.y);
                var pos = i;
                if (i>this.squadNumbers){
                    pos -= this.squadNumbers;
                }
                var col = (pos)% 4;
                var row = Math.floor(pos/4);
                var valueX = 200 * jc.characterScaleFactor;
                var valueY = -175* jc.characterScaleFactor;
                var colAdjust = col * valueX;
                var rowAdjust = row * valueY;
                point.x+=colAdjust;
                point.y+=rowAdjust;
                returnMe.push({'member':team[i], 'pos':point});
            }
        }
        return returnMe;
    },
    getSprite:function(nameCreate){
        var sprite;
        sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, this);
        sprite.setState('idle');
		this.addChild(sprite.batch);
		this.addChild(sprite);
        sprite.setVisible(false);
        sprite.layer = this;
        return sprite;
	},
    makeTeamASprite:function(data){
        var sprite = this.getSprite(data.name);
        sprite.healthBarColor = cc.c4f(26.0/255.0, 245.0/255.0, 15.0/255.0, 1.0);
        //todo: augment sprite using data fetched via the id
        sprite.homeTeam = this.getTeam.bind(this,'a');
        sprite.enemyTeam = this.getTeam.bind(this, 'b');
        sprite.team = 'a';
        sprite.setVisible(false);
        sprite.id = data.id;
        this.teams['a'].push(sprite);
        this.touchTargets.push(sprite);
        this.sprites.push(sprite);
        return sprite;
    },
    makeTeamBSprite:function(name){
        sprite = this.getSprite(name);
        //todo: augment sprite using data fetched via the id
        sprite.healthBarColor = cc.c4f(150.0/255.0, 0.0/255.0, 255.0/255.0, 1.0);
        sprite.setFlippedX(true);
        sprite.homeTeam = this.getTeam.bind(this,'b');
        sprite.enemyTeam = this.getTeam.bind(this, 'a');
        sprite.team = 'b';
        sprite.setVisible(false);
        this.teams['b'].push(sprite);
        this.touchTargets.push(sprite);
        this.sprites.push(sprite);
        return sprite;

    },
    setUp:function(){
        var sprite;

//        //todo refactor these loops into 1 funcN
//        for (var i =0; i<this.teamASprites.length;i++){
//            if (this.teamASprites[i])
//            {
//                this.makeTeamASprite(this.teamASprites[i].name)
//            }
//
//        }

        var sprite = this.makeTeamASprite({name:"nexus"});
        this.teamANexus = sprite;
        var point = cc.p(this.nexusAPoint.x+sprite.getTextureRect().width, this.nexusAPoint.y);
        point = this.convertToItemPosition(point);
        sprite.setBasePosition(point);
        sprite.ready(true);

//        this.riftPool1 = jc.playEffectAtLocation('vampireRadius', this.convertToItemPosition(this.spawnA1), jc.topMost,this);
//        this.riftPool1.setScale(2);
//        this.riftPool2 = jc.playEffectAtLocation('vampireRadius', this.convertToItemPosition(this.spawnA2), jc.shadowZOrder,this);
//        this.riftPool2.setScale(2);
//        this.riftPool3 = jc.playEffectAtLocation('vampireRadius', this.convertToItemPosition(this.spawnA3), jc.shadowZOrder,this);
//        this.riftPool3.setScale(2);

//        for (var i =0; i<this.teamBSprites.length;i++){
//            if (this.teamBSprites[i])
//            {
//                this.makeTeamBSprite(this.teamBSprites[i].name);
//            }
//        }

        var sprite = this.makeTeamBSprite("nexus");
        var point = cc.p(this.nexusBPoint.x-sprite.getTextureRect().width, this.nexusBPoint.y);
        point = this.convertToItemPosition(point);
        sprite.setBasePosition(point);
        sprite.ready(true);
        this.teamBNexus = sprite;

//        this.riftPool4 = jc.playEffectAtLocation('vampireRadius', this.convertToItemPosition(this.spawnB1), jc.shadowZOrder,this);
//        this.riftPool4.setScale(2);
//        this.riftPool5 = jc.playEffectAtLocation('vampireRadius', this.convertToItemPosition(this.spawnB2), jc.shadowZOrder,this);
//        this.riftPool5.setScale(2);
//        this.riftPool6 = jc.playEffectAtLocation('vampireRadius', this.convertToItemPosition(this.spawnB3), jc.shadowZOrder,this);
//        this.riftPool6.setScale(2);


    },
    makeForGame:function(ary){

    },
    getTeam:function(who){
        return this.teams[who];
    },
    nextTouchDo:function(action, manualErase){
        this.nextTouchAction = action;
        this.nextTouchAction.manualErase = manualErase;
    },
    placeSquadTokens:function(){

        //todo: replace with new bar
        this.squadBar = jc.makeSpriteWithPlist(uiPlist, uiPng, "squadsBackground.png");

        hotr.arenaScene.addChild(this.squadBar);
        this.squadBar.setPosition(this.squadBarClosePos);

        this.touchTargets.push(this.squadBar);

        this.squadA = jc.makeSpriteWithPlist(uiPlist, uiPng, "iconA.png");
        this.squadBar.addChild(this.squadA);
        this.squadA.setPosition(this.squadTilePosition);
        this.touchTargets.push(this.squadA);

        this.squadB = jc.makeSpriteWithPlist(uiPlist, uiPng, "iconB.png");
        this.squadBar.addChild(this.squadB);
        this.squadB.setPosition(cc.p(this.squadTilePosition.x + this.squadTileSpacing,this.squadTilePosition.y));
        this.touchTargets.push(this.squadB);

        this.squadBarOpen = false;

    },
    placePowerTokens:function(){
        this.availablePowers={};
        this.powerBar = jc.makeSpriteWithPlist(uiPlist, uiPng, "powersBackground.png");
        hotr.arenaScene.addChild(this.powerBar);
        this.powerBar.setPosition(this.powerBarClosePos);
        this.touchTargets.push(this.powerBar);

        if (this.teamAPowers.length > 3){
            this.teamAPowers = this.teamAPowers.slice(0,2);
        }

        for (var i =0;i<this.teamAPowers.length;i++){
            var powerTileName = "power"+i;
            this[powerTileName]=jc.makeSpriteWithPlist(uiPlist, uiPng, "powerFrame.png");
            var powerName = this.teamAPowers[i];
            this.powerBar.addChild(this[powerTileName]);
            this[powerTileName].tile = jc.makeSpriteWithPlist(powerTiles[powerName].plist, powerTiles[powerName].png, powerTiles[powerName].icon);
            this[powerTileName].addChild(this[powerTileName].tile);
            this.scaleTo(this[powerTileName].tile, this[powerTileName]);
            this.centerThisChild(this[powerTileName].tile, this[powerTileName]);
            this[powerTileName].tile.setZOrder(this[powerTileName].getZOrder()-1);
            this[powerTileName].setPosition(cc.p(this.powerTilePosition.x+ (this.powerTileSpacing*i), this.powerTilePosition.y));
            this.touchTargets.push(this[powerTileName]);
            this.availablePowers[powerTileName]=powerName;
        }
        this.barOpen = false;

    },
    closeBar: function(){
        //function(item, from, to, time, nudge, when, doneDelegate){
        this.barOpen = false;
        jc.log(['arena'], 'Closing powerbar');
        this.setPowerBarFrameTouch();
        this.slide(this.powerBar, this.powerBarOpenPos, this.powerBarClosePos, jc.defaultTransitionTime, cc.p(jc.defaultNudge,0), "before", this.setPowerBarFrameNormal.bind(this));
    },
    openBar: function(){
        this.barOpen = true;
        jc.log(['arena'], 'opening powerbar');
        this.setPowerBarFrameTouch();
        this.slide(this.powerBar, this.powerBarClosePos, this.powerBarOpenPos, jc.defaultTransitionTime, cc.p(jc.defaultNudge*-1,0), "after", this.setPowerBarFrameNormal.bind(this));
    },
    setPowerBarFrameTouch:function(){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("powersBackgroundPressed.png");
        this.powerBar.setDisplayFrame(frame);
    },
    setPowerBarFrameNormal:function(){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("powersBackground.png");
        this.powerBar.setDisplayFrame(frame);
    },
    setSquadBarTouched:function(){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("squadsBackgroundPressed.png");
        this.squadBar.setDisplayFrame(frame);

    },
    setSquadBarNormal:function(){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("squadsBackground.png");
        this.squadBar.setDisplayFrame(frame);

    },
    setFrameTouched:function(item){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("powerFrameSelected.png");
        item.setDisplayFrame(frame);
    },
    setFrameNormal:function(item){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("powerFrame.png");
        item.setDisplayFrame(frame);
    },
    closeSquadBar: function(){
        //function(item, from, to, time, nudge, when, doneDelegate){
        this.squadBarOpen = false;
        this.setSquadBarTouched();
        this.slide(this.squadBar, this.squadBarOpenPos, this.squadBarClosePos, jc.defaultTransitionTime, cc.p(jc.defaultNudge*-1,0), "before", this.setSquadBarNormal.bind(this));
    },
    openSquadBar: function(){
        this.squadBarOpen = true;
        this.setSquadBarTouched();
        this.slide(this.squadBar, this.squadBarClosePos, this.squadBarOpenPos, jc.defaultTransitionTime, cc.p(jc.defaultNudge,0), "after", this.setSquadBarNormal.bind(this));
    },
    amISelected:function(sprite){
        if ((this.selectedSprite && this.selectedSprite == sprite) || (this.selectedCreeps && this.selectedCreeps.indexOf(sprite)!=-1)){
            return true;
        }else{
            return false;
        }
    },
    update:function(dt){
        for (var i =0; i<this.sprites.length;i++){
            this.sprites[i].behavior.handleMove(dt);
        }
    },
    doUpdate:function (dt){
        //pulse each sprite

        if (!this.creepa){
            this.creepa = [];
            this.creepb = [];
            this.lastcreep = 0;
            this.creepCount = 0
        }



        if (this.started){
            //check for winner
            this.gameTime+=dt;
            if (this.checkWinner()){
                return;
            }
            var scaleData = this.calculateScaleForSprites(this.sprites, true, dt);
            var scaleLimit = 50;
            this.lastcreep += dt;
            var creeplimit = 2;
            if (jc.isBrowser){
                creeplimit = 4.5;
            }

            if (this.lastcreep > creeplimit){
                this.makeCreeps();
                this.lastcreep = 0;
                this.creepCount++;
                if (this.creepCount > 20){
                    creeplimit=(creeplimit*0.25) + creeplimit;
                }
            }

//            if (!this.scaleGate){
//                //smooth
//                if (!this.lastPan){
//                    this.lastPan = scaleData.mid;
//                    var diff = cc.p(scaleLimit+1,scaleLimit+1);
//                }else{
//                    var diff = cc.pSub(this.lastPan, scaleData.mid);
//                }
//
//                if (Math.abs(diff.x) > scaleLimit || Math.abs(diff.y)>scaleLimit){
//                    this.lastPan = scaleData.mid;
//
//                    this.panToWorldPoint(scaleData.mid, scaleData.scale, jc.defaultTransitionTime, function(){
//                        this.scaleGate = false;
//                    }.bind(this));
//                }
//            }
        }
    },
    makeCreeps: function(){
        var sprite = this.getSprite("goblinKnightNormal");
        var sprite2 = this.getSprite("goblinKnightNormal");
        sprite.setVisible(true);
        sprite2.setVisible(true);
        this.teams['a'].push(sprite);
        sprite.setBasePosition(this.teamASpawn());
        sprite.ready(true);
        sprite.homeTeam = this.getTeam.bind(this,'a');
        sprite.enemyTeam = this.getTeam.bind(this, 'b');
        sprite.team = 'a';

        jc.playEffectOnTarget("teleport", sprite, this);

        sprite2.healthBarColor = cc.c4f(150.0/255.0, 0.0/255.0, 255.0/255.0, 1.0);
        sprite2.setFlippedX(true);
        sprite2.setPosition(this.teamBSpawn());
        jc.playEffectOnTarget("teleport", sprite2, this);
        this.teams['b'].push(sprite2);
        this.sprites.push(sprite);
        this.sprites.push(sprite2);
        sprite2.enemyTeam = this.getTeam.bind(this,'a');
        sprite2.homeTeam = this.getTeam.bind(this, 'b');
        sprite2.team = 'b';


        this.summonEnemyHero();


    },
    summonEnemyHero:function(){
        if (!this.lastEnemyHero){
            this.lastEnemyHero = 0;
        }

        if (this.lastEnemyHero < this.teamBSprites.length){
            var name = this.teamBSprites[this.lastEnemyHero].name;
            var def = spriteDefs[name];
            if (def.creep){
                this.schedule(function(){
                    var enemyHero = this.makeTeamBSprite(name);
                    enemyHero.setBasePosition(this.teamBSpawn());
                    enemyHero.ready(true);
                    jc.playEffectOnTarget("teleport", enemyHero, this);

                }.bind(this), 0.5, def.number-1);

                this.lastEnemyHero++;
            }else{
                var enemyHero = this.makeTeamBSprite(name);
                enemyHero.setBasePosition(this.teamBSpawn());
                enemyHero.ready(true);
                jc.playEffectOnTarget("teleport", enemyHero, this);
                this.lastEnemyHero++;
            }

        }


    },
    randomCreep: function(){
        var who = jc.randomNum(0, 7);
        if (who == 0){
            return "dwarvenKnightEarth";
        }

        if (who == 1){
            return "dwarvenKnightFire";
        }

        if (who == 2){
            return "dwarvenKnightLife";
        }

        if (who == 3){
            return "dwarvenKnightWater";
        }

        if (who == 4){
            return "goblinKnightNormal";
        }

        if (who == 5){
            return "goblinKnightBile";
        }

        if (who == 6){
            return "goblinKnightFire";
        }

        if (who == 7){
            return "goblinKnightBlood";
        }

        throw "Who? :" + who;
    },
    calculateScaleForSprites:function(sprites, shouldThink, dt){
        var minX=this.worldSize.width;
        var maxX=0;
        var minY=this.worldSize.height;
        var maxY=0;

        for (var i =0; i<sprites.length;i++){
            if (sprites[i] && sprites[i].getParent()==this){
                var position = sprites[i].getBasePosition(); //where am i in the layer
                var tr = sprites[i].getTextureRect();
                var nodePos = this.convertToWorldSpace(position); //where is that on the screen?
                var worldPos = this.screenToWorld(nodePos); //where is that in the world?
                var compareMaxX = worldPos.x + tr.width;
                var compareMinX = worldPos.x - tr.width;
                var compareMaxY = worldPos.y + tr.height*1.5;
                var compareMinY = worldPos.y - (tr.height/2);

                if (shouldThink){
                    sprites[i].think(dt);
                }

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

        }

        var characterMid = cc.pMidpoint(cc.p(minX,minY), cc.p(maxX,maxY));
        var scale = this.getOkayScale(maxX-minX, maxY-minY);

        return {mid:characterMid, scale:scale};


    },
    setSpriteTargetLocation:function(touch, sprites){
        //play tap effect at touch
        if (sprites){

            var temp = [];
            temp = temp.concat(this.getTeam('b'));
            temp = temp.concat(this.getTeam('a'));
            var minSprite = this.getBestSpriteForTouch(touch, sprites, temp);
            if (this.selectedSprite){
                if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite)){ //if we touched an enemy
                    this.doEnemyTouch(minSprite, touch);
                }else if (minSprite && this.getTeam('a').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite)){ //if we touched an friend
                  //  this.doFriendTouch.bind(this)(minSprite);
                }else{
                    this.doGenericTouch(touch);
                }
            }else if (this.selectedCreeps){
                var worldPos = this.screenToWorld(touch);
                var nodePos = this.convertToItemPosition(worldPos);
                if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedCreeps[0].behavior.canTarget(minSprite)){ //if we touched an enemy
                    jc.playEffectAtLocation(this.enemySelect, minSprite.getBasePosition(), jc.shadowZOrder,this);
                }else{
                    jc.playEffectAtLocation("movement", nodePos, jc.shadowZOrder,this);
                }
                for(var i =0;i<this.selectedCreeps.length;i++){
                    if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedCreeps[i].behavior.canTarget(minSprite)){ //if we touched an enemy
                        this.selectedCreeps[i].behavior.attackCommand(minSprite);
                    }else{
                        this.selectedCreeps[i].behavior.followCommand(touch);
                    }
                }
            }
        }else{
            this.doGenericTouch(touch);
        }
    },
    doGenericTouch:function(touch){
        this.selectedSprite.behavior.followCommand(touch);
        var worldPos = this.screenToWorld(touch);
        var nodePos = this.convertToItemPosition(worldPos);
        jc.playEffectAtLocation("movement", nodePos, jc.shadowZOrder,this);
    },
    doFriendTouch:function (sprite, touch){
        jc.playEffectAtLocation(this.allySelect, touch, jc.shadowZOrder,this);
        this.selectedSprite.behavior.supportCommand(sprite);
    },
    doEnemyTouch:function (sprite, touch){
        jc.playEffectAtLocation(this.enemySelect, sprite.getBasePosition(), jc.shadowZOrder,this);
        this.selectedSprite.behavior.attackCommand(sprite);
    },
    targetTouchHandler:function(type, touch,sprites, touches){

        if (this.level <= 3){ //tutorial
            if (type == jc.touchEnded){
                this.handleTutorialTouches(type, touch, sprites);
            }
            return true;
        }

        jc.log(['ArenaMultiTouch'], 'touches:' + JSON.stringify(touches));
        if (touches.length>1){
            jc.log(['ArenaMultiTouch'], 'touche > 1');
            if (this.handlePinchZoom(type, touches)){
                return true;
            }
        }else{
            jc.log(['ArenaMultiTouch'], 'touches = 1');
            jc.log(['ArenaMultiTouch'], 'touch:' + JSON.stringify(touch));
            if (this.handlePinchZoom(type, [touch])){
                return true;
            }
        }


        if (type == jc.touchEnded){

            if (jc.isBrowser){ //todo - change this to mouse wheel zoom, double click is lame
                if (this.checkDoubleClick(touch)){
                    if (!this.dbcScale){
                        this.panToWorldPoint(this.screenToWorld(touch),this.getScaleOne() , jc.defaultTransitionTime/2);
                        this.dbcScale = true;
                    }else{
                        this.panToWorldPoint(this.worldMidPoint, this.getScaleWorld(), jc.defaultTransitionTime/2);
                        this.dbcScale = false;
                    }
                    return true;
                }
            }

            var nodePos = touch; //this.convertToNodeSpace(touch);
            if (this.nextTouchAction){
                this.nextTouchAction(nodePos, sprites);
                if (this.nextTouchAction){
                    if (!this.nextTouchAction.manualErase){
                        this.nextTouchAction = undefined;
                    }
                }
            } else if (sprites){
                //was sprite selected?
                //check sprites
                //this.checkSpriteTouch(sprites, touch);
                //this.checkPowerBar(sprites);
                //this.checkSquadBar(sprites);
            }
        }
        return true;
    },

    handleTutorialTouches:function(type, touch, sprites){
        if (this.level == 1){
            this.handleLevel1Tutorial(type, touch, sprites);
        }else if (this.level == 2){
            this.handleLevel2Tutorial(type, touch, sprites);
        }else if (this.level == 3){
            this.handleLevel3Tutorial(type, touch, sprites);
        }
    },
    handleLevel3Tutorial:function(type, touch, sprites){
        if (this.step == 1){
            this.showTutorialStep('Moloch? But your master was banished to The Rift a century ago - how...?', undefined, 'left', 'girl');
            this.step = 2;
        }else if (this.step == 2){
            this.attachMsgTo('How is of little consequence, dear priestess. My master has returned and he will overtake this realm. Give us the Summoner and spare your pathetic lives for a short time.', this.guideCharacters['demon'], 'left');
            this.step = 3;
        }else if (this.step == 3){
            this.attachMsgTo('You cannot defeat us. RESISTANCE IS FUTILE!', this.guideCharacters['demon'], 'left');
            this.makeCreeps();
            this.makeCreeps();
            this.started = true;
            this.doUpdate(0.40);
            this.doUpdate(0.40);
            this.doUpdate(0.40);
            this.doUpdate(0.40);
            this.started = false;
            var scaleData = this.calculateScaleForSprites(this.teams['b']);
            this.panToWorldPoint(this.worldMidPoint, this.getScaleWorld(), jc.defaultTransitionTime/2, function(){
                this.step=4;
            }.bind(this));
        }else if (this.step == 4){
                this.removeTutorialStep('demon', 'right', function(){
                    this.attachMsgTo("Dragons? If the Dark One has returned and has raised an army within The Rift....", this.guideCharacters['girl'], 'right');
                }.bind(this));
                this.step = 4.5;
        }else if (this.step ==4.5){
            this.panToWorldPoint(this.startViewPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
                this.showTutorialStep("Priestess! The city is lost, you must flee! We will buy you what time we can. Take the summoner into the mountains. Commander Vandie, will meet you there to prepare for the coming war!", undefined, 'right', 'dwarf');
                this.step = 4.6;
            }.bind(this));
        }else if (this.step ==4.6){
            this.attachMsgTo("Your sacrifice won't be forgotten, brave soldier.", this.guideCharacters['girl'], 'right');
            this.step = 4.7;
        }else if (this.step ==4.7){
            this.attachMsgTo("It is as good day as any to die. Do not let it be in vain.", this.guideCharacters['dwarf'], 'left');
            this.step = 5;
        }else if (this.step ==5){
            this.removeTutorialStep('girl', 'left');
            this.removeTutorialStep('dwarf', 'right');
            this.level = 99;
            this.makeSelectionBar();
            this.finalActions();
        }
    },
    handleLevel2Tutorial:function(type, touch, sprites){
        if (this.step == 1){
            this.removeTutorialStep('orc', 'right', function(){
                this.makeSelectionBar();
                this.showTutorialStep('Notice the cannon ball in your bar. This is a power, use it on the orcs.', undefined, 'left', 'girl');
                this.step = 2;
            }.bind(this));
        }else if (this.step == 2){
            this.removeTutorialStep('girl', 'left');
            this.finalActions();
            this.level = 99;
        }
    },
    handleLevel1Tutorial:function(type, touch, sprites){
        if (this.step == 2){
            this.panToWorldPoint(this.enemyStartPos, this.getScaleOne(), jc.defaultTransitionTime, function(){
                this.attachMsgTo("This is the enemy nexus. To end the assault, we must destroy it.", this.guideCharacters['girl'], 'right') ;
                this.step = 3;
            }.bind(this));
        }else if (this.step == 3){
            this.panToWorldPoint(this.worldMidPoint, this.getScaleWorld(), jc.defaultTransitionTime, function(){
                this.attachMsgTo("While the nexus is intact, a stream of goblin 'creeps' will be summoned.", this.guideCharacters['girl'], 'right');
                this.makeCreeps();
                this.step = 4;
            }.bind(this));
        }else if (this.step == 4){
            this.panToWorldPoint(this.startViewPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
            this.attachMsgTo("Use your heroes and powers to push the tide of battle and destroy the enemy nexus.", this.guideCharacters['girl'], 'right') ;
            this.makeSelectionBar();
                this.step = 5;
            }.bind(this));
        }else if (this.step == 5){
            this.removeTutorialStep('girl', 'left');
            this.showTutorialStep("You dare challenge us? Now you die!", undefined, 'right', 'orc');
            this.step = 6;
        }else if (this.step ==  6){
            this.removeTutorialStep('orc', 'right');
            this.finalActions();
            this.level = 99;

        }
    },
    checkSquadBar:function(sprites){
        for(var i=0;i<sprites.length;i++){
            if (sprites[i]==this.squadA){
                this.nextTouchDo(this.moveSquad.bind(this, 'a'));
                return;
            }

            if(sprites[i]==this.squadB){
                this.nextTouchDo(this.moveSquad.bind(this, 'b'));
                return;
            }
        }

        for(var i=0;i<sprites.length;i++){
            if (sprites[i]==this.squadBar){
                if (this.squadBarOpen){
                    this.closeSquadBar();
                }else{
                    this.openSquadBar();
                }
            }
        }

    },
    moveSquad:function(squad, touch){
        //play anim
        var worldPos = this.screenToWorld(touch);
        var nodePos = this.convertToItemPosition(worldPos);
        jc.playEffectAtLocation("movement", nodePos, jc.shadowZOrder,this);
        var positions = this.getSquadMovePositions(squad, nodePos);
        _.each(positions, function(entry){
            this.doGenericTouch(entry.member, entry.pos);
        }.bind(this));
    },
    checkPowerBar:function(sprites){
        jc.log(['arena'], 'checkpower bar');
        for (var power in this.availablePowers){
            for(var i=0;i<sprites.length;i++){
                if (sprites[i]==this[power]){
                    //power token touched -
                    if (!sprites[i].used){
                        jc.log(['arena'], 'touch - execute');
                        this.doPower(power, sprites[i]);
                        return;
                    }else{
                        jc.log(['arena'], 'touch - used');
                        return; //still don't let this become a bar
                    }
                }
            }
        }

        //if not, check if we touched the powerbar
        for(var i=0;i<sprites.length;i++){
            if (sprites[i]==this.powerBar){
                if (this.barOpen){
                    jc.log(['arena'], 'bar touch close');
                    this.closeBar();
                }else{
                    jc.log(['arena'], 'bar touch open');
                    this.openBar();
                }
            }
        }

    },
    doPower: function(name, sprite){
        this.setFrameTouched(sprite);
        this.executeOffensivePower(this.availablePowers[name],sprite);
    },
    executeOffensivePower: function(name, frame){
        if (!this.started && this.level > 2){
            return;
        }
        frame.used = true;
        var tile = frame.tile;
        var config = powerTiles[name];
        if (!config){
            throw "unknown power: " + name;
        }
        this.executed = Date.now();
        var func = globalPowers[config['offense']].bind(this);
        if (config.type == "direct"){
            hotr.arenaScene.layer.nextTouchDo(function(touch, sprites){
                var worldPos = this.screenToWorld(touch);
                var nodePos = this.convertToItemPosition(worldPos);
                func(nodePos, sprites);
                jc.log(['arena'], 'fading out!');
                jc.shadow(frame);
                jc.shadow(tile);
                this.setFrameNormal(frame);
            }.bind(this));

        }else if (config.type == "global"){
            func();
            jc.shadow(frame);
            jc.shadow(tile);
            this.setFrameNormal(frame);
        }else{
            throw "Unknown power type.";
        }
    },
    checkSpriteTouch:function(sprites, touch){
        var worldPos = this.screenToWorld(touch);
        var nodePos = this.convertToItemPosition(worldPos);
        var minSprite = this.getBestSpriteForTouch(nodePos, sprites, this.getTeam('a'));
        if (minSprite){
            if (this.selectedSprite != minSprite){
                jc.playEffectOnTarget(this.charSelect, minSprite, this, true );
                this.clearSelection();
                this.selectedSprite = minSprite;
            }
            this.nextTouchDo(this.setSpriteTargetLocation.bind(this),true);
        }
    },
    getBestSpriteForTouch:function(touch, sprites, team){
        var minSprite;
        var minDis = this.winSize.width;
        for(var i =0;i<sprites.length;i++){
            //alive/myteam?
            if (sprites[i].getParent()==this && team.indexOf(sprites[i])!=-1){
                //this.bestMatch?
                var v1 = jc.getVectorTo(touch, sprites[i].getPosition());
                if (v1.distance < minDis){
                    minDis = v1.distance;
                    minSprite = sprites[i];
                }
            }
        }
        return minSprite;
    },
    checkWinner: function(){
        //first - is everyone dead on either team?
        var teamaisdead = true;
        var teambisdead = true;
        var aliveA = 0;
        var aliveB = 0;
        var teama = this.getTeam('a');
        var teamb = this.getTeam('b');
        for(var i =0;i<teama.length;i++){
            if (teama[i].getParent()==this){
                teamaisdead=false;
            }
            aliveA++;
        }

        for(var i =0;i<teamb.length;i++){
            if (teamb[i].getParent()==this){
                teambisdead=false;
            }
            aliveB++;
        }

        if (teambisdead){
            //pause game, display victory
            this.showVictory();
            return true;
        }

        if (teamaisdead){
            //pause game, display lost
            this.showDefeat();
            return true;
        }

        if (!this.teamANexus.isAlive()){
            this.showDefeat();
            return true;
        }

        if (!this.teamBNexus.isAlive()){
            this.showVictory();
            return true;
        }

        //hey no team is fully dead. But, how long have been running?
//        if (this.timeExpired()){
//            if (aliveA > aliveB){
//                //pause game, display victory
//                this.showVictory();
//
//            }
//            if (aliveB > aliveA){
//                //pause game, display defeat
//                this.showDefeat();
//            }
//
//            if (aliveB == aliveA){
//                //pause game, display defeat
//                this.showDefeat();
//            }
//        }
    },
    showVictory:function(){
        this.started = false;
        this.getParent().removeChild(this.tableView, false);
        if (this.level == 1 && this.step == 19){ //show some tutorial stuff first.
            this.showTutorialStep("You did it! We're safe! But that won't be the last of them. Let's head back quickly.", undefined, 'left', 'girl');
            this.step = 20;
            return;
        }else if(this.level == 2 && this.step == 10){
            this.showTutorialStep("Nothing like a little artillery fire to even the odds. We're not through yet though. Let's head back.", undefined, 'right', 'girl');
            this.step = 11;
            return;
        }


        if (hotr.arenaScene.data.op){
            hotr.multiplayerOperations.victory(hotr.arenaScene.data.op,hotr.arenaScene.data);
        }else{
            hotr.blobOperations.incrementLevel();
        }

        hotr.blobOperations.saveBlob();

        this.victory = new Victory();
        this.victory.onDone = function(){
            this.removeChild(this.victory,false);
            hotr.mainScene.layer.goToReturnPoint();
        }.bind(this);
        this.victory.init();
        hotr.arenaScene.addChild(this.victory);
    },
    showDefeat:function(){
        this.started = false;
        this.getParent().removeChild(this.tableView, false);
        if (hotr.arenaScene.data.op){
            hotr.multiplayerOperations.defeat(hotr.arenaScene.data.op, hotr.arenaScene.data);
        }

        //you cannot win level 3
        if (this.incrementOnDefeat){
            this.incrementOnDefeat = false;
            hotr.blobOperations.incrementLevel();
        }

        hotr.blobOperations.saveBlob();
        this.defeat = new Defeat();
        this.defeat.onDone = function(){
            this.removeChild(this.defeat,false);
            hotr.mainScene.layer.goToReturnPoint();
        }.bind(this);
        this.defeat.init(); //todo pass stats

        hotr.arenaScene.addChild(this.defeat);
    },
    timeExpired:function(){
        var time = this.gameTime;
        if (time>this.timeLimit){
            return true;
        }else{
            return false;
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
    if (hotr.arenaScene){
        hotr.arenaScene.layer.release();
        hotr.arenaScene.release();
    }
    hotr.arenaScene = cc.Scene.create();
    hotr.arenaScene.retain();
    hotr.arenaScene.layer = ArenaGame.create();
    hotr.arenaScene.layer.retain();
    hotr.arenaScene.addChild(hotr.arenaScene.layer);
    return hotr.arenaScene;

};
