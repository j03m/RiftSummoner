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
        var arenaSize = cc.size(9088 * jc.characterScaleFactor, 1706 * jc.characterScaleFactor);

        if (this._super(arenaSize, gameboardFrames)) {
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

            var nexusOffset = 500 * jc.characterScaleFactor;
            this.nexusAPoint = cc.p(nexusOffset, this.worldSize.height/2);
            this.nexusBPoint = cc.p(this.worldSize.width - nexusOffset, this.worldSize.height/2);

            var adjustX1 = 600 *jc.characterScaleFactor;
            var adjustX2 = 400 *jc.characterScaleFactor;
            var adjustY = 200 *jc.characterScaleFactor;
            var adjustY1 = 75*jc.characterScaleFactor;
            this.spawnA1 = cc.p(this.nexusAPoint.x + adjustX1, this.nexusAPoint.y + adjustY1);
            this.spawnA2 = cc.p(this.nexusAPoint.x + adjustX2, this.nexusAPoint.y + adjustY);
            this.spawnA3 = cc.p(this.nexusAPoint.x + adjustX2, this.nexusAPoint.y - adjustY);

            this.spawnB1 = cc.p(this.nexusBPoint.x - adjustX1, this.nexusBPoint.y+ adjustY1);
            this.spawnB2 = cc.p(this.nexusBPoint.x - adjustX2, this.nexusBPoint.y + adjustY);
            this.spawnB3 = cc.p(this.nexusBPoint.x - adjustX2, this.nexusBPoint.y - adjustY);


            this.playableRect = cc.rect(0,0, this.worldSize.width, this.worldSize.height - 100 * jc.characterScaleFactor);

            this.spawnBPoint = this.nexusBPoint;
            this.enemyStartPos = cc.p((this.worldSize.width/2)+ 1000 * jc.characterScaleFactor, (this.worldSize.height/2) + 500 *jc.characterScaleFactor);
            this.enemyStartPosTutorials = cc.p((this.worldSize.width/2)+ 1000 * jc.characterScaleFactor, (this.worldSize.height/2) - 300 *jc.characterScaleFactor);

            this.nexusMsg = "You must summon closer to another hero or your nexus.";
            this.playableMsg = "You must summon within the arena.";
            this.dragDelegate = function(){
                this.activeTrack = false;
            }
            return true;
		} else {
			return false;
		}
	},
    onShow:function(){
        if (!jc.parsed[shadowPlist]){
            cc.SpriteFrameCache.getInstance().addSpriteFrames(shadowPlist);
            jc.parsed[shadowPlist]= true;
        }

        this.shadowBatchNode = cc.SpriteBatchNode.create(shadowPng);
        this.addChild(this.shadowBatchNode);
        this.reorderChild(this.shadowBatchNode, jc.shadowZOrder);
        this.level = hotr.blobOperations.getTutorialLevel();

        this.scheduleOnce(function(){
            this.setUp();
            if(!hotr.arenaScene.data){
                this.runScenario0();
            }else
                this.runScenario();
//            }else{
//                this.runTutorial();
//            }
        }.bind(this));


    },
    runScenario:function(){
        this.teamASprites = hotr.arenaScene.data.teamA;
        this.teamAPowers = hotr.arenaScene.data.teamAPowers;
        this.teamBSprites = hotr.arenaScene.data.teamB;
        this.teamBPowers = hotr.arenaScene.data.teamBPowers;
        this.panToWorldPoint(this.nexusAPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
            //this.placeEnemyTeam();
            //this.nextTouchDo(this.initialSetupAction,true);
            this.makeSelectionBar();
            this.finalActions();
        }.bind(this));


    },
    makePowerBar:function(){
        var powerNames = hotr.blobOperations.getPowers();
        var powers = this.makeScrollPowers(powerNames);
        var finalIds = [];
        _.each(powerNames, function(power){
            finalIds.push(power);
        });
        if (this.powerView){
            this.slideOutToTop(this.powerView);
            this.getParent().removeChild(this.powerView, false);
            this.powerView.clear();
        }
        this.powerView = new jc.ScrollingLayer();
        this.getParent().addChild(this.powerView);

        this.cellWidth = powers[0].getContentSize().width*2;
        this.powerView.init({
            sprites:powers,
            metaData:finalIds,
            cellWidth:this.cellWidth,
            selectionCallback:this.powerSelectionCallback.bind(this),
            width:this.winSize.width
        });

        var tableDim = this.powerView.getContentSize();
        var y = this.winSize.height - tableDim.height/2;
        y -= 25 * jc.characterScaleFactor;
        this.powerView.setPosition(cc.p(this.winSize.width/2, y));
        this.reorderChild(this.tableView, jc.topMost);
        this.powerView.hackOn();
        this.powerView.setIndex(Math.floor(powers.length/2));

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
    powerSelectionCallback:function(index, sprite,data){
        //this.doPlacePower(index, data);
    },
    selectionCallback:function(index, sprite, data){
        jc.log(['ArenaSelection'], 'index:' + index);
        this.clearSelection();
        this.activeTrack = true;
        this.doPlaceHero(index, data);
    },
    doPlacePower: function(index, data){
        if (!data.used){

            this.tableView.disableCell(index);
            var config = powerTiles[data];
            if (!config){
                throw "unknown power: " + data;
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

    getLeaderCreep:function(name){
        var val = this.getLivingCreeps(this.selectedCreeps[0].name);
        return val.creeps[val.firstAlive];
    },
    getLivingCreeps:function(name){
        var creeps = _.filter(this.sprites, function(obj){
            return obj.name == name;
        });
        var keepGoing =false
        var firstAlive = -1;
        for(var i =0;i<creeps.length;i++){
            if (creeps[i].isAlive()){
                firstAlive = i;
                break;
            }
        }
        return {firstAlive:firstAlive, creeps:creeps};
    },
    doCreepSelect:function(found){
        var val = this.getLivingCreeps(found.name);
        if (val.firstAlive != -1){
            this.clearSelection();
            var creeps = val.creeps;
            this.selectedCreeps = [];
            jc.playEffectOnTarget(this.charSelect, creeps[val.firstAlive], this, true);
            this.activeTrack = true;
            for(var i =0;i<creeps.length;i++){
                this.selectedCreeps.push(creeps[i]);
                creeps[i].behavior.setState('idle', 'idle');
            }
        }
        this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
    },
    doHeroSelect:function(found){
        if(!found.isAlive()){
            return;
        }else{
            var minSprite = found;
            this.activeTrack = true;
            this.clearSelection();
            this.selectedSprite = minSprite;
            this.selectedSprite.behavior.setState('idle', 'idle');
            jc.playEffectOnTarget(this.charSelect, minSprite, this, true);
            this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
            this.makePowerBar();
        }
    },
    placeBarSprite:function(touch){
        this.activeTrack = true;
        var world = this.screenToWorld(touch);
        if (jc.insidePlayableRect(world)){
            if (this.checkOkayPosition(world)){
                var def = spriteDefs[this.barSelection.name];
                if (def.creep){
                    this.placeCreeps(world);
                }else{
                    this.placeHero(world)
                }
            }else{
                this.floatMsg(this.nexusMsg);
            }

        }else{
            this.floatMsg(this.playableMsg);
        }
    },
    checkOkayPosition:function(worldPos){
        var max = 0;
        for(var i =0; i<this.teams['a'].length;i++){
            var teamMate = this.teams['a'][i];
            var pos = teamMate.getBasePosition().x;
            if ( pos > max){
                max = pos;
            }
        }

        if (worldPos.x < max){
            return true;
        }else{
            if (worldPos.x - this.nexusAPoint.x > 512*jc.characterScaleFactor){
                return false;
            }else{
                return true;
            }


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
                var sprite=hold[count];
                var randx = 0;
                var randy = 0;
                if (count != 0){
                    randx = jc.randomNum(0, 100*jc.characterScaleFactor);
                    randy = jc.randomNum(0, 100*jc.characterScaleFactor);
                }

                var point = cc.p(world.x+randx, world.y+randy);
                var nodePos = this.convertToItemPosition(point);
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
        this.tableView.disableCell(this.barIndex);
        if (this.selectedSprite != sprite){
            this.clearSelection();
            jc.playEffectOnTarget(this.charSelect, sprite, this, true );
            this.selectedSprite = sprite;
        }
        this.makePowerBar();
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

        var sprites = this.makeScrollSprites(names);

        var finalIds = [];
        _.each(ids, function(id){
            finalIds.push({type:'char', id:id});
        });

        return {ids:finalIds, sprites:sprites};
    },

    runScenario0:function(){

        this.teamASprites.push({name:'orge'});
        this.teamASprites.push({name:'priestessEarth'});
        this.teamBSprites.push({name:'orge'});
        this.teamBSprites.push({name:'troll'});

        this.setUp();
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
    getSprite:function(nameCreate){
        var sprite;
        sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, this);
        sprite.setState('idle');
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


        var sprite = this.makeTeamASprite({name:"nexus"});
        this.teamANexus = sprite;
        var point = cc.p(this.nexusAPoint.x+sprite.getTextureRect().width, this.nexusAPoint.y);
        point = this.convertToItemPosition(point);
        sprite.setBasePosition(point);
        sprite.ready(true);

        var sprite = this.makeTeamBSprite("nexus");
        var point = cc.p(this.nexusBPoint.x-sprite.getTextureRect().width, this.nexusBPoint.y);
        point = this.convertToItemPosition(point);
        sprite.setBasePosition(point);
        sprite.ready(true);
        this.teamBNexus = sprite;

    },
    getTeam:function(who){
        return this.teams[who];
    },
    nextTouchDo:function(action, manualErase){
        this.nextTouchAction = action;
        this.nextTouchAction.manualErase = manualErase;
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

        if (!this.lastcreep){
            this.lastcreep = 0;
            this.creepCount = 0
        }


        if (this.started){
            //check for winner
            this.gameTime+=dt;
            if (this.checkWinner()){
                return;
            }

            //this does the thnk for all sprites.
            this.thinkSprites(dt);

            this.lastcreep += dt;
            var creeplimit = 5;

            if (this.lastcreep > creeplimit){
                this.makeCreeps();
                this.lastcreep = 0;
                this.creepCount++;
                if (this.creepCount > 25){
                    //creeplimit=(creeplimit*0.25) + creeplimit;
                }
            }

            this.panToSelected();


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
    panToSelected:function(){
        var panTarget;

        if (this.inDrag){
            return;
        }

        if (!this.activeTrack){
            return;
        }

        if (this.selectedSprite){
            panTarget = this.selectedSprite;
        }else if (this.selectedCreeps){
            var living = this.getLeaderCreep(this.selectedCreeps[0].name);
            panTarget = living;
        }

        //no one selected
        if (panTarget == undefined){
            return;
        }

        var pos = panTarget.getBasePosition();
        var screen = this.worldToScreen(pos);
        if (screen.x > this.winSize.width * 0.65 || screen.x < this.winSize.width * 0.35){
            this.panToWorldPoint(pos);
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
        sprite2.enemyTeam = this.getTeam.bind(this,'a');
        sprite2.homeTeam = this.getTeam.bind(this, 'b');
        sprite2.team = 'b';

        this.sprites.push(sprite);
        this.sprites.push(sprite2);
        this.teams['a'].push(sprite);
        this.teams['b'].push(sprite2);

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
    thinkSprites:function(dt){
        for(var i =0;i<this.sprites.length;i++){
            if (this.sprites[i] && this.sprites[i].getParent()==this){
                var selected = false;
                if (this.selectedSprite && this.selectedSprite == this.sprites[i]){
                    selected = true;
                }
                if (this.selectedCreeps && this.selectedCreeps.indexOf(this.sprites[i])!=-1){
                    selected = true;
                }
                if (selected){
                    this.sprites[i].selectedTime = 1;
                }else if (this.sprites[i].selectedTime != undefined){
                    this.sprites[i].selectedTime-=dt;
                }

                if (selected){
                    this.sprites[i].think(dt, selected);
                }else if (this.sprites[i].selectedTime>0){
                    this.sprites[i].think(dt, true);
                }else{
                    this.sprites[i].think(dt, false);
                }

            }
        }
    },
    setSpriteTargetLocation:function(touch, sprites){
        var worldPos = this.screenToWorld(touch);
        var nodePos = this.convertToItemPosition(worldPos);
        //play tap effect at touch
        if (sprites){

            var temp = [];
            temp = temp.concat(this.getTeam('b'));
            temp = temp.concat(this.getTeam('a'));
            var minSprite = this.getBestSpriteForTouch(nodePos, sprites, temp);
            if (this.selectedSprite){
                if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite)){ //if we touched an enemy
                    this.doEnemyTouch(minSprite, nodePos);
                }else if (minSprite && this.getTeam('a').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite)
                    && (this.selectedSprite.behaviorType == "healer" || this.selectedSprite.behaviorType == "defender")){ //if we touched an friend
                    this.doFriendTouch.bind(this)(minSprite);
                }else{
                    this.doGenericTouch(nodePos);
                }
            }else if (this.selectedCreeps){
                if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedCreeps[0].behavior.canTarget(minSprite)){ //if we touched an enemy
                    jc.playEffectOnTarget(this.enemySelect, minSprite, jc.shadowZOrder,this);
                }else{
                    jc.playEffectAtLocation("movement", nodePos, jc.shadowZOrder,this);
                }
                for(var i =0;i<this.selectedCreeps.length;i++){
                    if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedCreeps[i].behavior.canTarget(minSprite)){ //if we touched an enemy
                        this.selectedCreeps[i].behavior.attackCommand(minSprite);
                    }else{
                        this.selectedCreeps[i].behavior.followCommand(nodePos);
                    }
                }
            }
        }else{
            this.doGenericTouch(touch);
        }
    },
    doGenericTouch:function(touch){
        this.selectedSprite.behavior.followCommand(touch);
        jc.playEffectAtLocation("movement", touch, jc.shadowZOrder,this);

    },
    doFriendTouch:function (sprite){
        jc.playEffectOnTarget(this.allySelect, sprite, jc.shadowZOrder,this);
        this.selectedSprite.behavior.supportCommand(sprite);

    },
    doEnemyTouch:function (sprite){
        jc.playEffectOnTarget(this.enemySelect, sprite, jc.shadowZOrder,this);
        this.selectedSprite.behavior.attackCommand(sprite);

    },
    targetTouchHandler:function(type, touch,sprites, touches){
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
        this.getParent().removeChild(this.powerView, false);
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
        this.getParent().removeChild(this.powerView, false);
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
