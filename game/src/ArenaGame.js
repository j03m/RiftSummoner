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
    timeLimit:45,
    init: function() {
        this.name = "Arena";
        if (this._super(arenaSheet)) {
            this.teams['a'] = [];
            this.teams['b'] = [];
            this.teamSize = 18;
            this.squadNumbers = this.teamSize/2;
            this.scheduleUpdate();
            this.doConvert = true;
            this.gameTime = 0;
            this.powerBarOpenPos = cc.p(400* jc.assetScaleFactor, 187*jc.assetScaleFactor);
            this.powerBarClosePos = cc.p(-255* jc.assetScaleFactor, 187*jc.assetScaleFactor);
            this.powerTilePosition = cc.p(159*jc.assetScaleFactor, 100*jc.assetScaleFactor);
            this.powerTileSpacing = 200 * jc.assetScaleFactor;

            this.squadBarOpenPos = cc.p(1700* jc.assetScaleFactor, 187*jc.assetScaleFactor);
            this.squadBarClosePos = cc.p(2310 * jc.assetScaleFactor, 187*jc.assetScaleFactor);
            this.squadTilePosition = cc.p(250*jc.assetScaleFactor, 85*jc.assetScaleFactor);
            this.squadTileSpacing = 200 * jc.assetScaleFactor;

            return true;
		} else {
			return false;
		}
	},
    dumpChildren:function(){
        var wtf = this.getChildren();
        for(var i=0;i<wtf.length;i++){
            console.log("Name:" + wtf[i].name)
            console.log("JCSprite: " + (wtf[i] instanceof jc.Sprite));
            console.log("CCSprite: " + (wtf[i] instanceof cc.Sprite));
            console.log("CCDrawNode: " + (wtf[i] instanceof cc.DrawNode));
            console.log("Is: " + typeof wtf[i]);


            if (wtf[i]._originalTexture){
                if (wtf[i]._originalTexture._htmlElementObj){
                    console.log("Texture:" + wtf[i]._originalTexture._htmlElementObj.src);
                }
            }
        }
    },
    onShow:function(){
        cc.SpriteFrameCache.getInstance().addSpriteFrames(shadowPlist);
        cc.SpriteBatchNode.create(shadowPng);

        this.showTutorialStep("Quick! Click anywhere to deploy your squads!");
        this.placeArrow(cc.p(600*jc.assetScaleFactor, 800*jc.assetScaleFactor), "down");

        if(!hotr.arenaScene.data){
            this.runScenario0();
        }else{
            this.runScenario();
        }


    },
    runScenario:function(){
        this.teamASprites = hotr.arenaScene.data.teamA;
        this.teamAPowers = hotr.arenaScene.data.teamAPowers;
        this.teamBSprites = hotr.arenaScene.data.teamB;
        this.teamBPowers = hotr.arenaScene.data.teamBPowers;

        this.placePowerTokens();
        this.placeSquadTokens();
        this.setUp();
        this.placementTouches = 1;
        this.panToWorldPoint(this.worldMidPoint, this.getScaleFloor(), jc.defaultTransitionTime, function(){
            this.nextTouchDo(this.initialSetupAction,true);
        }.bind(this));


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
    initialSetupAction:function(touch){

        this.startPos = this.screenToWorld(touch);
        var center = cc.p(this.winSize.width/2, this.winSize.height/2);
        if (jc.insideEllipse(touch, center) && this.startPos.x < this.worldMidPoint.x){
            //play animation

            if (this.placementTouches == 1){
                var placement = this.placePlayerTeam('a');
                if (!placement){
                    this.placePlayerTeam('b');
                }else{
                    this.removeTutorialStep(function(){
                        this.guideVisible = false;
                        if (this.teams['a'].length>9){
                            this.showTutorialStep("Quick! Okay, now place your second squad!");
                            this.placeArrow(cc.p(600*jc.assetScaleFactor, 600*jc.assetScaleFactor), "down");
                        }
                    }.bind(this));
                }
            }

            if (this.placementTouches == 2){
                this.placePlayerTeam('b');
                this.removeTutorialStep();
                this.removeChild(this.arrow, true);
            }


            if (this.placementTouches==2 || this.teams['a'].length<=9){
                //place enemy team
                hotr.blobOperations.saveBlob();
                this.nextTouchAction = undefined;
                this.placeEnemyTeam();

                function goodSprite(sprite){
                    return sprite!=undefined;
                }

                this.originalPositions = {
                    'a':[].concat(this.teams['a']),
                    'b':[].concat(this.teams['b'])
                };


                this.teams['a']=_.filter(this.teams['a'],goodSprite);
                this.teams['b']=_.filter(this.teams['b'],goodSprite);
                this.sprites = this.teams['a'].concat(this.teams['b']);
                this.startedAt = Date.now();

                this.started = true;
                this.schedule(function(dt){
                    this.doUpdate(0.10);
                }, 0.10);

            }else{
                this.placementTouches++;
                this.nextTouchDo(this.initialSetupAction,true);
            }


        }else{
                this.floatMsg("Click on the left side of the arena. You can't place troops there.");
        }


    },

    placeEnemyTeam:function(){
        this.startPos = cc.p(this.worldSize.width/2, this.worldSize.height/2);
        this.startPos.x+=500*jc.characterScaleFactor;
        this.placeTeamPosition(this.teams['b'], this.squadNumbers);
        this.startPos.x+=500*jc.characterScaleFactor;
        this.placeTeamPosition(this.teams['b'], this.teamSize);
    },
    placePlayerTeam:function(squad){

        var nodePos = this.convertToItemPosition(this.startPos);
        hotr.blobOperations.setSquadLocations(squad, this.startPos);
        jc.playEffectAtLocation("movement", nodePos, jc.shadowZOrder,this);
        return this.placeTeamPosition(this.teams['a'], this.placementTouches * this.squadNumbers);
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
                if (!team[i].isFlippedX()){
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

        //this.scheduleOnce(this.closeSquadBar.bind(this));
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
//        jc.log(['arena'], 'placetokens done, closing bar');
//        this.scheduleOnce(this.closeBar.bind(this));
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
    update:function(dt){
        for (var i =0; i<this.sprites.length;i++){
            this.sprites[i].behavior.handleMove(dt);
        }
    },
    doUpdate:function (dt){
        //pulse each sprite

        var minX=this.worldSize.width;
        var maxX=0;
        var minY=this.worldSize.height;
        var maxY=0;
        var shouldScale = false;
        if (this.started){
            //check for winner
            this.gameTime+=dt;
            if (this.checkWinner()){
                return;
            }
            for (var i =0; i<this.sprites.length;i++){
                if (this.sprites[i].getParent()==this){
                    var position = this.sprites[i].getBasePosition(); //where am i in the layer
                    var shouldScale = true;
                    var tr = this.sprites[i].getTextureRect();
                    var nodePos = this.convertToWorldSpace(position); //where is that on the screen?
                    var worldPos = this.screenToWorld(nodePos); //where is that in the world?
                    var compareMaxX = worldPos.x + tr.width;
                    var compareMinX = worldPos.x - tr.width;
                    var compareMaxY = worldPos.y + tr.height*1.5;
                    var compareMinY = worldPos.y - (tr.height/2);


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
    setSpriteTargetLocation:function(touch, sprites){
        //play tap effect at touch
        if (sprites){
            var temp = [];
            temp = temp.concat(this.getTeam('b'));
            temp = temp.concat(this.getTeam('a'));
            var minSprite = this.getBestSpriteForTouch(touch, sprites, temp);
            if (minSprite && this.getTeam('b').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite)){ //if we touched an enemy
                doEnemyTouch.bind(this)(minSprite);

            }else if (minSprite && this.getTeam('a').indexOf(minSprite)!=-1 && this.selectedSprite.behavior.canTarget(minSprite)){ //if we touched an friend
                //doFriendTouch.bind(this)(minSprite);
                doGenericTouch.bind(this)();
            }else{
                doGenericTouch.bind(this)();
            }
        }else{
            this.doGenericTouch.bind(this)();
        }
    },
    doGenericTouch:function(who, touch){
        this.nextTouchAction = undefined;
        who.behavior.followCommand(touch);
    },
    doFriendTouch:function (sprite, touch){
        jc.playEffectAtLocation("allySelection", touch, jc.shadowZOrder,this);
        this.selectedSprite.removeChild(this.selectedSprite.effectAnimations["characterSelect"].sprite, false);
        this.selectedSprite.effectAnimations["characterSelect"].playing = false;
        this.nextTouchAction = undefined;
        this.selectedSprite.behavior.supportCommand(sprite);
    },
    doEnemyTouch:function (sprite, touch){
        jc.playEffectAtLocation("enemySelection", touch, jc.shadowZOrder,this);
        this.selectedSprite.removeChild(this.selectedSprite.effectAnimations["characterSelect"].sprite, false);
        this.selectedSprite.effectAnimations["characterSelect"].playing = false;
        this.nextTouchAction = undefined;
        this.selectedSprite.behavior.attackCommand(sprite);
    },
    targetTouchHandler:function(type, touch,sprites){
        if (type == jc.touchEnded){
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
                //this.checkSpriteTouch(sprites);
                this.checkPowerBar(sprites);
                this.checkSquadBar(sprites);
            }
        }

        return true;
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
                        this.setFrameTouched(sprites[i]);
                        this.executeOffensivePower(this.availablePowers[power],sprites[i]);
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
    executeOffensivePower: function(name, frame){
        if (!this.started){
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
    checkSpriteTouch:function(sprites){
        var minSprite = this.getBestSpriteForTouch(nodePos, sprites, this.getTeam('a'));
        if (minSprite){
            jc.playEffectOnTarget("characterSelect", minSprite, this, true );
            this.selectedSprite = minSprite;
            this.nextTouchAction = this.setSpriteTargetLocation.bind(this)
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

        //hey no team is fully dead. But, how long have been running?
        if (this.timeExpired()){
            if (aliveA > aliveB){
                //pause game, display victory
                this.showVictory();

            }
            if (aliveB > aliveA){
                //pause game, display defeat
                this.showDefeat();
            }

            if (aliveB == aliveA){
                //pause game, display defeat
                this.showDefeat();
            }
        }
    },
    showVictory:function(){
        this.started = false;
        if (hotr.arenaScene.data.op){
            hotr.multiplayerOperations.victory(hotr.arenaScene.data.op,hotr.arenaScene.data);
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
        if (hotr.arenaScene.data.op){
            hotr.multiplayerOperations.defeat(hotr.arenaScene.data.op, hotr.arenaScene.data);
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
