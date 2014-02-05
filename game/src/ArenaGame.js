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
        this.idCount = 0;
        this.maxTeamCreeps = 10;
        this.creepBatch = 5;
        this.creeplimit = 5;


        if (this._super(gameboardFrames)) {
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

            var adjustX1 = 300 *jc.characterScaleFactor;
            var adjustX2 = 200 *jc.characterScaleFactor;
            var adjustY = 200 *jc.characterScaleFactor;
            var adjustY1 = 75*jc.characterScaleFactor;
            this.spawnA1 = cc.p(this.nexusAPoint.x + adjustX1, this.nexusAPoint.y + adjustY1);
            this.spawnA2 = cc.p(this.nexusAPoint.x + adjustX2, this.nexusAPoint.y + adjustY);
            this.spawnA3 = cc.p(this.nexusAPoint.x + adjustX2, this.nexusAPoint.y - adjustY);

            this.spawnB1 = cc.p(this.nexusBPoint.x - adjustX1, this.nexusBPoint.y+ adjustY1);
            this.spawnB2 = cc.p(this.nexusBPoint.x - adjustX2, this.nexusBPoint.y + adjustY);
            this.spawnB3 = cc.p(this.nexusBPoint.x - adjustX2, this.nexusBPoint.y - adjustY);
            this.teamACreeps = [];
            this.teamBCreeps = [];

            this.playableRect = cc.rect(0,0, this.worldSize.width, this.worldSize.height - 100 * jc.characterScaleFactor);

            this.spawnBPoint = this.nexusBPoint;
            this.enemyStartPos = cc.p((this.worldSize.width/2)+ 1000 * jc.characterScaleFactor, (this.worldSize.height/2) + 500 *jc.characterScaleFactor);
            this.enemyStartPosTutorials = cc.p((this.worldSize.width/2)+ 1000 * jc.characterScaleFactor, (this.worldSize.height/2) - 300 *jc.characterScaleFactor);

            this.hurt = {};
            this.hurt['a']=[];
            this.hurt['b']=[];


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
        this.teamASprites = hotr.arenaScene.data.teamASprites;
        this.teamBSprites = hotr.arenaScene.data.teamBSprites;
        this.teamACount = _.toArray(this.teamASprites).length;
        this.teamBAry = _.toArray(this.teamBSprites);
        this.teamBCount = this.teamBAry.length;
        this.panToWorldPoint(this.nexusAPoint, this.getScaleOne(), jc.defaultTransitionTime, function(){
            //this.placeEnemyTeam();
            //this.nextTouchDo(this.initialSetupAction,true);
            this.makeSelectionBar();
            this.finalActions();
        }.bind(this));


    },
    makePowerBar:function(){
        if (!this.selectedSprite){
            throw "wat?";
        }

        if (this.powerView){
            this.slideOutToTop(this.powerView);
            this.getParent().removeChild(this.powerView, false);
            this.powerView.clear();
        }

        var powerNames = hotr.blobOperations.getPowersFor(this.selectedSprite.name, this.selectedSprite.id);
        if (this.selectedSprite.powerTiles == undefined){
            this.selectedSprite.powerTiles = {};
            for(var i =0;i<powerNames.length;i++){
                this.selectedSprite.powerTiles[powerNames[i]] = true;
            }
        }
        if (powerNames.length == 0){
            return;
        }

        var powers = this.makeScrollPowers(powerNames, this.selectedSprite.powerTiles);
        var finalIds = [];
        _.each(powerNames, function(power){
            finalIds.push(power);
        });

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

        for(var i =0;i<powerNames.length;i++){
            if (this.selectedSprite.powerTiles[powerNames[i]] == false){
                this.powerView.disableCell(i);
            }
        }

    },
    makeSelectionBar:function(){
        if (!this.tableView){
            this.tableView = new jc.ScrollingLayer();
            this.tableView.retain();
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
    makeScrollPowers: function(powers, enabled){
        var powers =  _.map(powers, function(name){
            if (enabled[name]){
                return this.makePowerSprite(name);
            }else{
                return undefined;
            }
        }.bind(this));
        return powers.clean(undefined);
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
        sprite.pic.retain();
        sprite.addChild(sprite.pic);
        this.scaleTo(sprite.pic, sprite);
        jc.scaleCard(sprite.pic);
        this.centerThisChild(sprite.pic, sprite);
        sprite.pic.setZOrder(-1);
        return sprite;
    },
    powerSelectionCallback:function(index, sprite,data){
        this.doPlacePower(index, data);
    },
    selectionCallback:function(index, sprite, data){
        jc.log(['ArenaSelection'], 'index:' + index);
        this.clearSelection();
        this.activeTrack = true;
        if (!data.dead){
            this.doPlaceHero(index, data);
        }

    },
    doPlacePower: function(index, data){
        if (!this.selectedSprite){
            return;
        }

        if (!this.selectedSprite.powerTiles[data]){
            return;    //used
        }


        this.selectedSprite.powerTiles[data] = false; //disable it, used.
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
                this.makePowerBar();
                jc.log(['arena'], 'fading out!');
            }.bind(this));

        }else if (config.type == "global"){
            func();
            this.makePowerBar();
        }else{
            throw "Unknown power type.";
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
                jc.log(['error'], "Nexus selected from id: " + data.id +" something wrong.");
            }
            var def = spriteDefs[found.name];
            if (def.creep){
                this.doCreepSelect(found);
            }else{
                this.doHeroSelect(found);
            }
        }else{
            this.nextTouchDo(this.placeBarSprite.bind(this), true);
        }
    },

    getLeaderCreep:function(name){
        var val = this.getLivingCreeps(this.selectedCreeps[0].id);
        return val.creeps[val.firstAlive];
    },
    getLivingCreeps:function(id){
        var creeps = _.filter(this.sprites, function(obj){
            return obj.id == id && obj.team == 'a';
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
        var val = this.getLivingCreeps(found.id);
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
            jc.log(['spritecommands'], 'Found Hero is dead:' + found.name);
            return;
        }else{
            var minSprite = found;
            this.activeTrack = true;
            this.clearSelection();
            jc.log(['spritecommands'], 'Hero selected:' + minSprite.name);
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
                    this.nextTouchAction = undefined;
                }else{
                    this.placeHero(world)
                    this.nextTouchAction = undefined;
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

        this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
        this.tableView.disableCell(this.barIndex);
        var count = 0;
        var hold = [];

        for(var i =0; i<def.number;i++){
            var sprite = this.makeTeamASprite(this.barSelection, i);
            hold.push(sprite);
            if (i == 0){
                jc.log(['arena'], "play charselect effect on sprite");
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
                if (!this.selectedCreeps){
                    this.selectedCreeps=[];
                }
                this.selectedCreeps.push(sprite);
                count++;

            }.bind(this);
        }.bind(this)(this.barSelection, this.barIndex),0.5, def.number-1);


    },
    clearSelection:function(){
        jc.log(['spritecommands'], 'clearing selected hero:' + this.selectedSprite);
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
        jc.log(['spritecommands'], "Placing hero: " + sprite.name);
        if (this.selectedSprite != sprite){
            this.clearSelection();
            jc.playEffectOnTarget(this.charSelect, sprite, this, true );
            this.selectedSprite = sprite;
        }else{
            jc.log(['spritecommands'], "Already selected? How can that be? " + this.selectedSprite.name);
        }
        this.makePowerBar();
        this.nextTouchDo(this.setSpriteTargetLocation.bind(this), true);
    },
    teamASpawn:function(){
        var spot = jc.randomNum(0,2);

        var randx = jc.randomNum(-100*jc.characterScaleFactor, 100*jc.characterScaleFactor);
        var randy = jc.randomNum(-100*jc.characterScaleFactor, 100*jc.characterScaleFactor);

        if (spot == 0){
            var pos = this.convertToItemPosition(this.spawnA1);
        }

        if (spot == 1){
            var pos = this.convertToItemPosition(this.spawnA2);
        }

        if (spot == 2){
            var pos = this.convertToItemPosition(this.spawnA3);
        }

        pos.x+=randx;
        pos.y+=randy;
        return pos;
    },
    teamBSpawn:function(){
        var spot = jc.randomNum(0,2);

        var randx = jc.randomNum(-100*jc.characterScaleFactor, 100*jc.characterScaleFactor);
        var randy = jc.randomNum(-100*jc.characterScaleFactor, 100*jc.characterScaleFactor);

        if (spot == 0){
            var pos = this.convertToItemPosition(this.spawnB1);
        }

        if (spot == 1){
            var pos = this.convertToItemPosition(this.spawnB2);
        }

        if (spot == 2){
            var pos = this.convertToItemPosition(this.spawnB3);
        }

        pos.x+=randx;
        pos.y+=randy;
        return pos;

    },
    getDisplaySpritesAndMetaData: function(){
        var characters = hotr.blobOperations.getTeam();
        characters = characters.slice(0, jc.teamSize)
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
            this.doUpdate(0.25);
        },0.25);
    },
    getSprite:function(nameCreate){
        var sprite;
        jc.log(['arena'], "Sprite generating: " + nameCreate);
        sprite = jc.Sprite.spriteGenerator(spriteDefs, nameCreate, this);
        jc.log(['arena'], "Sprite generated: " + nameCreate);
        sprite.setState('idle');

        if (jc.config.batch){
            if (!this.batches){
                this.batches = {};
            }
            if (!this.batches[sprite.batch.sheet]){
                jc.log(['arena'], "new batch, adding");
                this.addChild(sprite.batch);
                this.batches[sprite.batch.sheet]=true;
            }
        }else{
            this.addChild(sprite);
        }


        sprite.setVisible(false);
        sprite.layer = this;

        return sprite;
	},
    makeTeamASprite:function(data, sub){
        if (!sub){
            sub = 0;
        }
        var sprite = this.teamASprites[data.id][sub];
        sprite = this.teamASpritePrep(sprite, data.id);
        this.addChild(sprite);
        return sprite;

    },
    teamASpritePrep:function(sprite, id){
        sprite.healthBarColor = cc.c4f(26.0/255.0, 245.0/255.0, 15.0/255.0, 1.0);
        //todo: augment sprite using data fetched via the id
        sprite.homeTeam = this.getTeam.bind(this,'a');
        sprite.enemyTeam = this.getTeam.bind(this, 'b');
        sprite.team = 'a';
        sprite.otherteam = 'b';
        sprite.setVisible(true);
        this.idCount++;
        if (id && !sprite.id){
            sprite.id = id;
        }else if (!id && !sprite.id){
            sprite.id = this.idCount;
        }

        this.teams['a'].push(sprite);
        this.touchTargets.push(sprite);
        this.sprites.push(sprite);
        return sprite;

    },
    makeTeamBSprite:function(data, sub){
        if (!sub){
            sub = 0;
        }
        var sprite = this.teamBSprites[data.id][sub];
        sprite = this.teamBSpritePrep(sprite);
        this.addChild(sprite);
        return sprite;

    },
    teamBSpritePrep:function(sprite){
        //todo: augment sprite using data fetched via the id
        sprite.healthBarColor = cc.c4f(150.0/255.0, 0.0/255.0, 255.0/255.0, 1.0);
        sprite.setFlippedX(true);
        sprite.homeTeam = this.getTeam.bind(this,'b');
        sprite.enemyTeam = this.getTeam.bind(this, 'a');
        sprite.team = 'b';
        sprite.otherteam = 'a';
        sprite.setVisible(true);
        this.teams['b'].push(sprite);
        this.touchTargets.push(sprite);
        this.sprites.push(sprite);
        this.idCount++;
        sprite.id = this.idCount;
        return sprite;
    },
    setUp:function(){

        this.teamASprites = hotr.arenaScene.data.teamASprites;
        this.teamBSprites = hotr.arenaScene.data.teamBSprites;
        this.teamACreeps = hotr.arenaScene.data.teamACreeps;
        this.teamBCreeps = hotr.arenaScene.data.teamBCreeps;

        var sprite = this.makeTeamASprite({name:"nexus", 'id':'teamanexus'});
        this.teamANexus = sprite;
        var point = cc.p(this.nexusAPoint.x+sprite.getTextureRect().width, this.nexusAPoint.y);
        point = this.convertToItemPosition(point);
        sprite.setBasePosition(point);
        sprite.ready(true);

        delete this.teamASprites['teamanexus']

        var sprite = this.makeTeamBSprite({name:"nexus",'id':'teambnexus'});
        var point = cc.p(this.nexusBPoint.x-sprite.getTextureRect().width, this.nexusBPoint.y);
        point = this.convertToItemPosition(point);
        sprite.setBasePosition(point);
        sprite.ready(true);
        this.teamBNexus = sprite;
        delete this.teamBSprites['teambnexus']

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

        for(var i=0;i<this.sprites.length;i++)   {
            if (this.sprites[i] != undefined){
                this.sprites[i].behavior.handleMove(dt);
            }
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

            if (this.lastcreep > this.creeplimit || !this.firstCreepSummon){
                this.makeCreeps();
                this.firstCreepSummon = true;
                this.creeplimit+=2; //add 2 seconds each summon
                this.lastcreep = 0;
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
    inflateCreeps:function(teamCreeps, team){
        var i=0;
        var alive = 0;
        while(i<teamCreeps.length){
            if (teamCreeps[i].getParent() != this){ //not in play, recycle
                teamCreeps[i].reset();

                teamCreeps[i].setVisible(true);

                if (team == 'b'){
                    this.addChild(teamCreeps[i]);
                    teamCreeps[i] = this.teamBSpritePrep(teamCreeps[i]);
                    teamCreeps[i].setBasePosition(this.teamBSpawn());

                }

                if (team == 'a'){
                    this.addChild(teamCreeps[i]);
                    teamCreeps[i] = this.teamASpritePrep(teamCreeps[i], teamCreeps[i].id);
                    teamCreeps[i].setBasePosition(this.teamASpawn());

                }
                jc.playEffectOnTarget("teleport", teamCreeps[i], this);
            }
            i++;
        }
    },
    makeCreeps: function(){
        if (jc.config.creeps){
            this.inflateCreeps(this.teamACreeps, 'a');
            this.inflateCreeps(this.teamBCreeps, 'b');
        }

        if (!this.enemiesSummoned){
            for(var i=0;i<jc.teamSize;i++){
                this.summonEnemyHero();
            }
            this.enemiesSummoned=true;
        }
    },
    summonEnemyHero:function(){
        if (!this.lastEnemyHero){
            this.lastEnemyHero = 0;
        }

        if (this.lastEnemyHero < this.teamBCount){
            var name = this.teamBAry[this.lastEnemyHero][0].name;
            var id = this.teamBAry[this.lastEnemyHero][0].id;
            this.teamBAry[this.lastEnemyHero].count = 0;
            var def = spriteDefs[name];

            if (def.creep){
                this.schedule(function(entry){
                    return function(){
                        var enemyHero = this.makeTeamBSprite({name:name, id:id}, this.teamBAry[entry].count);
                        this.teamBAry[entry].count++;
                        enemyHero.setBasePosition(this.teamBSpawn());
                        enemyHero.ready(true);
                        jc.playEffectOnTarget("teleport", enemyHero, this);
                    }.bind(this);
                }.bind(this)(this.lastEnemyHero), 0.5, def.number-1);

                this.lastEnemyHero++;
            }else{
                var enemyHero = this.makeTeamBSprite({name:name, id:id});
                enemyHero.setBasePosition(this.teamBSpawn());
                enemyHero.ready(true);
                jc.playEffectOnTarget("teleport", enemyHero, this);
                this.lastEnemyHero++;
            }

        }


    },
    thinkSprites:function(dt){
        var alive = 0;
        var maxX;
        var minX = this.worldSize.width;
        var maxY;
        var minY = this.worldSize.height;
        for(var i =0;i<this.sprites.length;i++){
            var currentSprite = this.sprites[i];
            var currentSpriteTeam = currentSprite.team;
            if (currentSprite && currentSprite.getParent()==this && currentSprite.name != "nexus"){
                if(currentSprite.isAlive()){
                    alive++;
                }

                if(jc.config.think){
                    var selected = false;
                    if (this.selectedSprite && this.selectedSprite == currentSprite){
                        selected = true;
                    }
                    if (this.selectedCreeps && this.selectedCreeps.indexOf(currentSprite)!=-1){
                        selected = true;
                    }
                    if (selected){
                        currentSprite.selectedTime = 3;
                    }else if (currentSprite.selectedTime != undefined){
                        currentSprite.selectedTime-=dt;
                    }

                    if (selected){
                        currentSprite.think(dt, selected);
                    }else if (currentSprite.selectedTime>0){
                        currentSprite.think(dt, true);
                    }else{
                        currentSprite.think(dt, false);
                    }
                }


                if (jc.config.harlemShake){
                    if (currentSprite.name != "nexus"){
                        var x = jc.randomNum(0, this.worldSize.width);
                        var y = jc.randomNum(0, this.worldSize.height);
                        currentSprite.behavior.followCommand(cc.p(x,y));
                    }
                }

                if (jc.config.blink){
                    var x = jc.randomNum(0, this.worldSize.width);
                    var y = jc.randomNum(0, this.worldSize.height);
                    currentSprite.setPosition(cc.p(x,y));

                }

                if (jc.config.blinkAndDance){
                    var x = jc.randomNum(0, this.worldSize.width);
                    var y = jc.randomNum(0, this.worldSize.height);
                    currentSprite.setBasePosition(cc.p(x,y));
                    if (currentSprite.name != "nexus"){
                        currentSprite.behavior.setState('idle', 'move');
                    }
                }


                if (currentSprite.gameObject.hp < currentSprite.gameObject.MaxHP && this.hurt){
                    if (this.hurt[currentSpriteTeam].indexOf(currentSprite)==-1){
                        this.hurt[currentSpriteTeam].push(currentSprite);
                    }
                }else{
                    var index = this.hurt[currentSpriteTeam].indexOf(currentSprite);
                    if (index!=-1){
                        this.hurt[currentSpriteTeam].splice(index, 1);
                    }
                }


                var position = currentSprite.getBasePosition(); //where am i in the layer
                var tr = currentSprite.getTextureRect();
                var nodePos = this.convertToWorldSpace(position); //where is that on the screen?
                var worldPos = this.screenToWorld(nodePos); //where is that in the world?
                var compareMaxX = worldPos.x + tr.width;
                var compareMinX = worldPos.x - tr.width;
                var compareMaxY = worldPos.y + tr.height*1.5;
                var compareMinY = worldPos.y - (tr.height/2);

                if (compareMaxX > maxX){
                    maxX = compareMaxX;

                }

                if (compareMinX < minX){
                    minX = compareMinX;

                }

                if (compareMaxY > maxY){
                    maxY = compareMaxY;

                }

                if (compareMinY < minY){
                    minY = compareMinY;

                }
            }else if (!currentSprite.isAlive()){
                if (!this.deadTeamA){
                    this.deadTeamA = [];
                }
                if (!this.deadTeamB){
                    this.deadTeamB = [];
                }
                var deadSprite = this.sprites.splice(i,1)[0]; // remove it if it's not parented. might have to revisit this when necro
                if (deadSprite.team == 'a'){
                    this.deadTeamA.push(deadSprite);
                }
                if (deadSprite.team == 'b'){
                    this.deadTeamB.push(deadSprite);
                }

                var def = spriteDefs[deadSprite.name];
                var markDead = false;
                if (!def.creep){
                    markDead = true;
                }else{
                    //todo: create a creep data structure
                    //id - creeps
                    //change areas where we loop for creeps (getlivingcreeps)
                }

                if (markDead){
                    for(var ii=0;ii<this.tableView.metaData.length;ii++){
                        if (this.tableView.metaData[ii].id == deadSprite.id){
                            this.tableView.placeSpriteOver(ii, uiPlist, uiPng, "deathFrame.png")
                            this.tableView.addMeta(ii, "dead", "true");
                            break;
                        }
                    }
                }

                var index = this.hurt[currentSpriteTeam].indexOf(currentSprite);
                if (index!=-1){
                    this.hurt[currentSpriteTeam].splice(index, 1);
                }
            }

            if (jc.isBrowser){
                var characterMid = cc.pMidpoint(cc.p(minX,minY), cc.p(maxX,maxY));
                var shouldScale = false;
                if (!this.lastMid){
                    this.lastMid = characterMid;
                    shouldScale = true;
                }else{
                    var diff = cc.pSub(this.lastMid, characterMid);
                    if (diff >100 * jc.characterScaleFactor){
                        shouldScale = true;
                    }else{
                        shouldScale = false;
                    }
                    this.lastMid = characterMid;
                }
                var scale = this.getOkayScale(maxX-minX, maxY-minY);
                if (!this.scaling && shouldScale){
                    this.scaling = true;
//                    this.panToWorldPoint(characterMid, scale, undefined, function(){
//                        this.scaling = false;
//                    }.bind(this));
                }
            }
        }

        jc.log(['spritesonboard'], "Total alive: " + alive + " fps:" + cc.Director.getInstance()._frameRate);
    },
    setSpriteTargetLocation:function(touch, sprites){
        jc.log(['spritecommands'], 'setSpriteTargetLocation invoked');
        if (this.selectedSprite){
            jc.log(['spritecommands'], 'selected sprite is:' + this.selectedSprite.name);
        }else{
            jc.log(['spritecommands'], 'no sprite selected.');
        }


        if (this.selectedCreeps){
            jc.log(['spritecommands'], 'selected selectedCreeps is:' + this.selectedCreeps[0].name);
        }else{
            jc.log(['spritecommands'], 'no creeps selected.');
        }

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
                }else if (minSprite && this.getTeam('a').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite) && this.selectedSprite != minSprite
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
                        jc.log(['spritecommands'], 'Creeps attack!.');
                        this.selectedCreeps[i].behavior.attackCommand(minSprite);
                    }else{
                        jc.log(['spritecommands'], 'Creeps go!.');
                        this.selectedCreeps[i].behavior.followCommand(nodePos);
                    }
                }
            }
        }else{
            jc.log(['spritecommands'], 'do generic touch invoked');
            this.doGenericTouch(touch);
        }
    },
    doGenericTouch:function(touch){
        this.selectedSprite.behavior.followCommand(touch);
        if (this.movement){
            this.removeChild(this.movement, true);
        }
        this.movement = jc.playEffectAtLocation("movement", touch, jc.shadowZOrder,this);

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
            }else if (this.selectedSprite!=undefined || this.selectedCreeps!=undefined){
                //if we have a selected unit but not an action, set sprite location with touch.
                this.setSpriteTargetLocation(touch, sprites);
            }else if (sprites){
                //was sprite selected?
                //check sprites
                this.checkSpriteTouch(sprites, touch);
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
            var def = spriteDefs[minSprite.name];
            if (!def.creep){
                if (this.selectedSprite != minSprite){
                    this.doHeroSelect(minSprite);
                }
            }else{
                if (this.selectedCreeps.indexOf(minSprite) != -1){
                    this.doCreepSelect(minSprite);
                }
            }

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
        if (this.tableView){
            this.getParent().removeChild(this.tableView, false);
        }
        this.cleanUp();
//        if (this.powerView){
//            this.getParent().removeChild(this.powerView, false);
//        }

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

        if (this.tableView){
            this.getParent().removeChild(this.tableView, false);
        }
        this.cleanUp();
//        if (this.powerView){
//            this.getParent().removeChild(this.powerView, false);
//        }


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
    cleanUp:function(){
        this.started = false;
        for(var i =0;i<this.sprites.length;i++){
            if (this.sprites[i]!=undefined){
                this.removeChild(this.sprites[i],true);
                this.sprites[i].cleanUp();
                this.sprites[i] = undefined;
            }
        }
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
