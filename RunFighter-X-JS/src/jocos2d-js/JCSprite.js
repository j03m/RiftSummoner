jc.AnimationTypeOnce=1;
jc.AnimationTypeLoop=0;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
  
jc.Sprite = cc.Sprite.extend({
    layer:undefined, //parent reference
	alive:true,
    initWithPlist: function(plist, sheet, firstFrame, name) {
        this.MaxHP = 100;
        this.hp = this.MaxHP;
        this.HealthBarWidth = 40;
        this.HealthBarHeight = 10;
        this.animations = {};
		this.batch = null;
		this.state = -1;
		this.moving = 0;
		this.currentMove = null;
		this.nextState = 0;
		this.idle = 0;
		this.name = name;
        this.speed = 50;
        this.homeTeam = undefined;
        this.enemyTeam = undefined;
		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist);
		this.batch = cc.SpriteBatchNode.create(sheet);
        this.batch.retain();
		var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(firstFrame); 		
		this.initWithSpriteFrame(frame);
        this.superDraw = this.draw;
        this.draw = this.customDraw;
        this.initHealthBar();
        this.debug = false;
        this.damage = 100;
        this.strikeTime = 1;
		return this;
	},
    addDamage: function(amount){
        this.hp -=amount;
        this.layer.doBlood(this);
        if (this.isAlive()){
            this.nextState = 'damage';
        }else{
            this.nextState = 'dead';
        }

    },
    initHealthBar:function(){
        this.healthBar = cc.DrawNode.create();
        this.healthBar.contentSize = cc.SizeMake(this.HealthBarWidth, this.HealthBarHeight);
        this.layer.addChild(this.healthBar);
        this.updateHealthBarPos();
    },
	cleanUp: function(){
		this.stopAction(this.currentMove);
		this.currentMove.release();
		this.currentMove = undefined;
		this.stopAction(this.animations[this.state].action);
		this.state = -1;
		for(var i =0; i<this.animations.length; i++){
			this.animations[i].action.release();
		}
        this.batch.release();
	},
	addDef: function(entry) {
		if (entry.nameFormat==undefined){
            throw "Nameformat is required in a sprite definition.";
        }
        if (entry.state==undefined){
            throw "State is required in a sprite definition.";
        }
        if (entry.type==undefined){
            throw "Animation type 'type' is required in a sprite definition.";
        }
        if (entry.delay==undefined){
            throw "Animation delay 'delay' is required in a sprite definition.";
        }

        var action = this.makeAction(entry);
        action.retain();
		entry.action = action;
		this.animations[entry.state] = entry;				
	},
	makeAction: function(entry){
		var animFrames = [];
		var str = "";
		var frame;
		var start = entry.start;
        var end = entry.end;
        if (start == undefined){
            start = 0;
        }
        if (end == undefined){
            if (entry.frames == undefined){
                throw "You must provide either an end range or a number of frames when creating an entry.";
            }
            end = entry.frames-1;
        }

		//loop through the frames using the nameFormat and init the animation
        for (var i = start; i <= end; i++) {
			str = entry.nameFormat.format(i); 
			frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
			if (!frame){
				throw "Couldn't get frame. What is: " + str;
			}
			animFrames.push(frame);			
		}
    	//make the animation
		var animation = cc.Animation.create(animFrames, entry.delay);		
		var action;
		//if the entry type is a loop create a forver action
		if (entry.type == jc.AnimationTypeLoop){
 			action = cc.RepeatForever.create(cc.Animate.create(animation));
			action.tag = entry.state;

		}else{
			//otherwise assume a one play with animationDone as an ending func
	        //we'll extend this with more types later. This is all I need right now
	        var ftAction = cc.Animate.create(animation);
			var repeater = cc.Repeat.create(ftAction, 1);
			var onDone = cc.CallFunc.create(this.animationDone, this);
			action = cc.Sequence.create(repeater, onDone);
			action.tag = entry.state;

		}
		return action;
	},
    scheduleDamage:function(amount, time){
        this.scheduleOnce(this.addDamage.bind(this, amount));
    },
    update: function(dt){
        if (!this.alive) return;
        this.think(dt);
    },
    getBasePosition:function(){
        //get the position of this sprite, push the y coord down to the base (feet)
        var point = this.getPosition();
        var box = this.getTextureRect();
        var box2 = this.getContentSize();
        //point.x = point.x + (box2.width - box.width)/2;
        //point.y = point.y + (box2.height - box.height)/2;
        point.y -= box.height/2;
        return point;
    },
    setBasePosition:function(point){
        var box = this.getTextureRect();
        point.y += box.height/2;
        this.setPosition(point);
        this.updateHealthBarPos();
    },
    moveTo: function(point, state, velocity, callback){
		jc.log(['sprite', 'move'],"Moving:"+ this.name);
		var moveDiff = cc.pSub(point, this.getPosition());
		var distanceToMove = cc.pLength(moveDiff);
		var moveDuration = distanceToMove/velocity;

		//todo: update this to transition
		if (this.currentMove != undefined){
			jc.log(['sprite', 'move'],'Stopping move in process.');
			this.stopAction(this.currentMove);
			this.currentMove.release();
			this.currentMove = undefined;
		}
		
		//set our moving state    
		jc.log(['sprite', 'move'],'Setting state to required move.');
		this.setState(state);
		
		//if a callback wasn't supplied, set callback to the internal moveEnded
		if (!callback){
			callback = this.moveEnded.bind(this);
		}
		
		//bust a move
		var moveAction = cc.MoveTo.create(moveDuration, point);
		
		jc.log(['sprite', 'move'],'creating the move sequence');
		this.currentMove = cc.Sequence.create(moveAction, cc.CallFunc.create(callback));
		this.currentMove.retain();
		
		//run it
		jc.log(['sprite', 'move'],'running move sequence');
		this.runAction(this.currentMove);		
	},
    isAlive: function(){
        if (this.hp>0){
            return true;
        }else{
            return false;
        }
    },
	moveEnded: function(){
		this.setState(this.idle);
		this.stopAction(this.currentMove);		
	},
	animationDone:function(){
        if (this.animations[this.state].callback){
            this.animations[this.state].callback(this.nextState);
        }else{
            this.setState(this.nextState);
        }
	},
    getState:function(){
        return this.state;
    },
	setState:function(state, callback){
        if (!state){
            return;
        }
		var currentState = this.state;
		this.state = state;
		jc.log(['sprite', 'state'],"State Change For:" + this.name + ' from:' + currentState + ' to:' + this.state);	
		if (this.state == currentState){
			jc.log(['sprite', 'state'],"Trying to set a state already set, exit");
			return;
		}
		var startMe = this.animations[this.state];		
		if (currentState != -1){
			var stopMe = this.animations[currentState];
			if (startMe && stopMe){
				this.nextState = startMe.transitionTo;
                if (!this.nextState){
                    if (this.isAlive()){
                        this.nextState = 'idle';
                    }else{
                        this.nextState = 'dead';
                    }

                }
	            jc.log(['sprite', 'state'],"Stopping action.")
	            if(stopMe.action){
                    this.stopAction(stopMe.action);
                }
	            jc.log(['sprite', 'state'],"Starting action.")
                this.animations[state].callback = callback;
                if (startMe.action){
                    this.runAction(startMe.action);
                }

				
			}else{
				throw "Couldn't set state. What is state: " + state + " currentState:" + currentState;			
			}			
		}else{
			this.nextState = startMe.transitionTo;
            jc.log(['sprite', 'state'],"Starting action.")
            this.runAction(startMe.action);
		}
	},
	centerOnScreen:function(){
		var size = cc.Director.getInstance().getWinSize();
		var x = size.width/2;
		var y = size.height/2;
		this.setPosition(cc.p(x,y));		
	},
    setBehavior: function(behavior){
        var behaviorClass = BehaviorMap[behavior];
        if (!behaviorClass){
            throw 'Unrecognized behavior name: ' + behavior;
        }

        this.behavior = new behaviorClass(this);
    },
    think:function(dt){
        this.behavior.think(dt);
    },
    getAllies:function(){
        if (this.homeTeam == undefined){
            throw "Sprite not init-ed correctly. Home team is not set.";
        }
        return this.homeTeam;
    },
    customDraw:function(){
        //team id
        //area effects
        this.superDraw();

        if (this.debug){
            this.drawBorders();
        }

        //health bar
        this.drawHealthBar();
        //ispoisoned
    },
    drawBorders:function(){
        if (!this.debugContentBorder){
            this.debugContentBorder = cc.DrawNode.create();
            this.layer.addChild(this.debugContentBorder);
            this.debugContentBorder.setPosition(this.getPosition());
        }

        if (!this.debugTextureBorder){
            this.debugTextureBorder = cc.DrawNode.create();
            this.layer.addChild(this.debugTextureBorder);
            this.debugContentBorder.setPosition(this.getPosition());
        }

        var color = cc.c4f(0,0,0,0);
        var border = cc.c4f(35.0/255.0, 28.0/255.0, 40.0/255.0, 1.0);
        this.debugContentBorder.clear();
        this.debugTextureBorder.clear();
        this.drawRect(this.debugContentBorder, this.getContentSize(), color, border);
        this.drawRect(this.debugTextureBorder, this.getTextureRect(), color, border);

    },
    drawRect:function(poly, rect, fill, border, borderWidth){
        var height = rect.height;
        var width = rect.width;
        var vertices = [cc.p(0, 0), cc.p(0, height), cc.p(width, height), cc.p(width, 0)];
        poly.drawPoly(vertices, fill, borderWidth, border);
    },
    drawHealthBar: function(){
        this.healthBar.clear();
        var verts = [4];
        verts[0] = cc.p(0.0, 0.0);
        verts[1] = cc.p(0.0, this.HealthBarHeight - 1.0);
        verts[2] = cc.p(this.HealthBarWidth - 1.0, this.HealthBarHeight - 1.0);
        verts[3] = cc.p(this.HealthBarWidth - 1.0, 0.0);

        var clearColor = cc.c4f(181.0, 0.0, 18.0, 1.0);
        var fillColor = cc.c4f(26.0/255.0, 245.0/255.0, 15.0/255.0, 1.0);
        var borderColor = cc.c4f(35.0/255.0, 28.0/255.0, 40.0/255.0, 1.0);

        this.healthBar.drawPoly(verts,clearColor,0.7, borderColor);

        verts[0].x += 0.5;
        verts[0].y += 0.5;
        verts[1].x += 0.5;
        verts[1].y -= 0.5;
        verts[2].x = (this.HealthBarWidth - 2.0)*this.hp/this.MaxHP + 0.5;
        verts[2].y -= 0.5;
        verts[3].x = verts[2].x;
        verts[3].y += 0.5;

        this.healthBar.drawPoly(verts,fillColor,0.7, borderColor);

    },
    updateHealthBarPos:function(){
        var myPos = this.getBasePosition();
        var myRect = this.getTextureRect();
        myPos.y+=myRect.height;
        myPos.x-=(myRect.width/4);
        this.healthBar.setPosition(myPos);
    }


});

jc.Sprite.spriteGenerator = function(allDefs, def, layer){

    var character = allDefs[def];
    var sprite = new jc.Sprite();
    sprite.layer= layer;

    var nameFormat = character.name + ".{0}.png";
    if (character.inherit){
        //find who we inherit from, copy everything that doesn't exist over.
        var nameSave = character.name;
        _.extend(character, allDefs[character.inherit]);
        character.name = nameSave;
        character.parentOnly = undefined;
    }

    if (character['animations']== undefined){
        throw def + " has a malformed configation. Animation property missing.";
    }

    var firstFrame = character.animations['idle'].start;
    sprite.initWithPlist(g_characterPlists[def], g_characterPngs[def], nameFormat.format(firstFrame), character.name);

    for (var animation in character.animations){
        //use this to create a definition in the sprite
        var useThis = jc.clone(character.animations[animation]);
        useThis.nameFormat = nameFormat; //jack this in.
        useThis.state = animation;
        sprite.addDef(useThis);
        if (animation == 'idle'){
            sprite.idle = animation;
        }
        if (animation == 'move'){
            sprite.moving = animation;
        }

    }
    _.extend(sprite,character.gameProperties);
    sprite.hp = sprite.MaxHP;
    return sprite;
}


jc.randomNum= function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}