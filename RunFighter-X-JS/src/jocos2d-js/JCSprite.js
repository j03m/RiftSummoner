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
    initWithPlist: function(plist, sheet, firstFrame, name, gameObject, behavior, type) {
        this.HealthBarWidth = 40;
        this.HealthBarHeight = 10;
        this.animations = {};
		this.batch = null;
		this.state = -1;
		this.moving = 0;
		this.currentMove = null;
		this.idle = 0;
		this.name = name;
		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist);
		this.batch = cc.SpriteBatchNode.create(sheet);
        this.batch.retain();
		var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(firstFrame); 		
		this.initWithSpriteFrame(frame);
        this.type = type;
        if(this.type != 'background'){
            this.superDraw = this.draw;
            this.draw = this.customDraw;
            this.initHealthBar();
        }

        this.debug = false;
        this.behavior = behavior;
        this.gameObject = gameObject;
        if(this.gameObject){
            this.gameObject.init();
        }

		return this;
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
    update: function(dt){
        if (!this.isAlive()){
            this.think(dt);
        }
    },
    getBasePosition:function(){
        //get the position of this sprite, push the y coord down to the base (feet)
        var point = this.getPosition();
        var box = this.getTextureRect();
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
        if (this.gameObject.hp>0){
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
        var call;
        if (this.animations[this.state].callback){
            call = this.animations[this.state].callback;
        }
        this.setState(this.nextState);
        if (call){
            call(this.nextState);
        }
	},
    getState:function(){
        return this.state;
    },
	setState:function(state, callback){
        if (!state){
            throw "Undefined state passed to setState";
        }
		//catch next state and current state
        var currentState = this.state;
		this.state = state;

        jc.log(['sprite', 'state'],"State Change For:" + this.name + ' from:' + currentState + ' to:' + this.state);

        //no need to do anything
        if (this.state == currentState){
			jc.log(['sprite', 'state'],"Trying to set a state already set, exit");
			return;
		}

        //if I'm dead, return state shouldn't be idle
        if (this.isAlive()){
            this.nextState = 'idle';
        }else{
            this.nextState = 'dead';
        }

        //make sure start state is known
        var startMe = this.animations[this.state];
        var stopMe = this.animations[currentState];
        if (!startMe){
            throw "Couldn't start state. What is state: " + this.state + " currentState:" + currentState;
        }

        //capture callback if one is provided
        startMe.callback = callback;

        //if this isn't my first state call, we need to stop an action
        if (currentState != -1){
            //make sure the stop state exists
            if (!stopMe){
                throw "Couldn't stop state. What is currentState:" + currentState;
            }
            jc.log(['sprite', 'state'],"Stopping action.");
            if(stopMe.action){
                this.stopAction(stopMe.action);
            }
		}

        jc.log(['sprite', 'state'],"Starting action.");
        if (startMe.action){
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
    customDraw:function(){
        this.superDraw();
        if (this.debug){
            this.drawBorders();
        }
        this.drawHealthBar();
    },
    drawBorders:function(){

        var position = this.getBasePosition();
        var rect = this.getTextureRect();
        if (!this.debugTextureBorder){
            this.debugTextureBorder = cc.DrawNode.create();
            this.layer.addChild(this.debugTextureBorder);
            position.x = position.x - rect.width/2;
            this.debugTextureBorder.setPosition(position);
        }

        var color = cc.c4f(0,0,0,0);
        var border = cc.c4f(35.0/255.0, 28.0/255.0, 40.0/255.0, 1.0);

        this.debugTextureBorder.clear();
        this.drawRect(this.debugTextureBorder, this.getTextureRect(), color, border,4);

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
        verts[2].x = (this.HealthBarWidth - 2.0)*this.gameObject.hp/this.gameObject.MaxHP + 0.5;
        verts[2].y -= 0.5;
        verts[3].x = verts[2].x;
        verts[3].y += 0.5;

        this.healthBar.drawPoly(verts,fillColor,0.7, borderColor);

    },
    updateHealthBarPos:function(){
        if (this.type != 'background'){
            var myPos = this.getBasePosition();
            var myRect = this.getTextureRect();
            myPos.y+=myRect.height;
            myPos.x-=(myRect.width/4);
            this.healthBar.setPosition(myPos);
        }
    }


});

jc.Sprite.spriteGenerator = function(allDefs, def, layer){

    //get details for sprite def
    var character = allDefs[def];

    //make a sprite
    var sprite = new jc.Sprite();

    //set the layer
    sprite.layer= layer;

    //nameformat
    var nameFormat = character.name + ".{0}.png";

    //if this character is inherited, find the parent
    if (character.inherit){
        //find who we inherit from, copy everything that doesn't exist over.
        var nameSave = character.name;
        _.extend(character, allDefs[character.inherit]);
        character.name = nameSave;
        character.parentOnly = undefined;
    }

    //are we brokified?
    if (character['animations']== undefined){
        throw def + " has a malformed configation. Animation property missing.";
    }

    //what is our init frame?
    var firstFrame = character.animations['idle'].start;

    //make a game object, merge with props
    var gameObject = new jc.GameObject();
    _.extend(gameObject,character.gameProperties);

    //if we don't have a behavior, default to tank
    if (!character.behavior){
        character.behavior = 'tank';
    }

    //look up behavior
    var behaviorClass = BehaviorMap[character.behavior];
    if (!behaviorClass){
        throw 'Unrecognized behavior name: ' + character.behavior;
    }

    //set it
    var behavior = new behaviorClass(sprite);

    //init
    sprite.initWithPlist(g_characterPlists[def], g_characterPngs[def], nameFormat.format(firstFrame), character.name, gameObject, behavior);
    sprite.behaviorType = character.behavior;
    //create definitions from the animation states
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

    //return the sprite;
    return sprite;
}


jc.randomNum= function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}