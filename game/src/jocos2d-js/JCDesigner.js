var jc = jc || {};
jc.Designer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            var guideSprite = new cc.Sprite();
            guideSprite.initWithFile(guide);
            cc.SpriteFrameCache.getInstance().addSpriteFrame(guideSprite.displayFrame(), "guide");
            this.designMode = true;
            this.initFromConfig(this.windowConfig);
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
    },
    targetTouchHandler:function(type, touch, sprites) {
        var sorted = _.sortBy(sprites, function(sprite){
           return sprite.getZOrder();
        });
        var theSprite = sorted[sprites.length-1]
        if (type == jc.touchBegan){
            jc.log(['console'], theSprite.name);
            this.moving = theSprite;
            this.startPos = theSprite.getPosition();
            this.lastTouch = touch;
        }
        if (type == jc.touchMoved && this.moving){
            var dx = touch.x - this.lastTouch.x;
            var dy = touch.y - this.lastTouch.y;
            var x = this.startPos.x+dx;
            var y = this.startPos.y+dy;
            this.lastTouch = touch;
            this.startPos = cc.p(x,y);
            this.moving.setPosition(this.startPos);
        }
        if (type == jc.touchEnded){
            this.moving = undefined;
        }
    },
    doClickOn:function(name){
        var theSprite = this[name];
        this.moving = theSprite;
        this.startPos = theSprite.getPosition();
        this.lastTouch = cc.p(0,0);

    },
    dump:function(){
       this.doDump(this, this.windowConfig);
       jc.log(['console'], this.windowConfig);
    },
    doDump:function(entity, config){
        var children = entity.getChildren();
        for (var i =0; i<children.length;i++){
            var child = children[i];
            if (child.name){
                config[child.name].pos = child.getPosition();
                config[child.name].z = child.getZOrder();
                if (config[child.name].kids){
                    this.doDump(child, config[child.name].kids);
                }
            }
        }

    },
	windowConfig:
	{
		"itemWindow": {
			"type": "sprite",
			"sprite": "itemWindow.png",
			"z": 2,
			"pos": {
				"x": 1210,
				"y": 957
			},
			"kids": {
				"pokeButton": {
					"type": "button",
					"main": "pokeButton.png",
					"pressed": "pokeButtonPressed.png",
					"touchDelegateName": "poke",
					"z": 3,
					"pos": {
						"x": 1147,
						"y": 123
					}
				},
				"itemFrame": {
					"type": "sprite",
					"sprite": "imageFrame.png",
					"z": 3,
					"pos": {
						"x": 135,
						"y": 123
					}
				},
				"closeButton": {
					"type": "button",
					"main": "closeButton.png",
					"pressed": "closeButtonPressed.png",
					"touchDelegateName": "close",
					"z": 3,
					"pos": {
						"x": 1387,
						"y": 111
					}
				},
				"lblName": {
					"type": "label",
					"text": "NAME - NAME - NAME",
					"width": 1000,
					"height": 80,
					"alignment": 0,
					"fontSize": 50,
					"fontName": "gow",
					"z": 3,
					"pos": {
											"x": 775,
											"y": 159
										}
				},
				"lblWins": {
					"type": "label",
					"text": "WINS",
					"width": 80,
					"height": 80,
					"alignment": 0,
					"fontSize": 40,
					"fontName": "gow",
					"z": 3,
					"pos": {
						"x": 456,
						"y": 12
					}
				},
				"lblLosses": {
					"type": "label",
					"text": "HEALTH",
					"width": 80,
					"height": 80,
					"alignment": 0,
					"fontSize": 40,
					"fontName": "gow",
					"z": 3,
					"pos": {
						"x": 745,
						"y": 12
					}
				}
			}
		},
		"mainFrame": {
			"type": "sprite",
			"transitionIn": "top",
			"transitionOut": "top",
			"applyAdjustments": true,
			"sprite": "genericBackground.png",
			"z": 1,
			"kids": {

				"backButton": {
					"type": "button",
					"main": "backButton.png",
					"pressed": "backButtonPressed.png",
					"touchDelegateName": "back",
					"z": 2,
					"pos": {
						"x": 177,
						"y": 810
					}
				},
				"facebookButton": {
					"type": "button",
					"main": "facebookButton.png",
					"pressed": "facebookButtonPressed.png",
					"touchDelegateName": "fb",
					"z": 2,
					"pos": {
						"x": 165,
						"y": 624
					}
				},
				"gameCenterButton": {
					"type": "button",
					"main": "gameCenterButton.png",
					"pressed": "gameCenterPressed.png",
					"touchDelegateName": "gameCenter",
					"z": 2,
					"pos": {
						"x": 163,
						"y": 443
					}
				},
				"storeButton": {
					"type": "button",
					"main": "mpstoreButton.png",
					"pressed": "mpstoreButtonPressed.png",
					"touchDelegateName": "store",
					"z": 2,
					"pos": {
						"x": 342,
						"y": 807
					}
				},
				"twitterButton": {
					"type": "button",
					"main": "tweeterButton.png",
					"pressed": "tweeterButtonPressed.png",
					"touchDelegateName": "tweet",
					"z": 2,
					"pos": {
						"x": 348,
						"y": 624
					}
				},
				"startButton": {
					"type": "button",
					"main": "startButton.png",
					"pressed": "startButtonPressed.png",
					"touchDelegateName": "startGame",
					"z": 2,
					"pos": {
						"x": 255,
						"y": 993
					}
				},
				"messageButton": {
					"type": "button",
					"main": "messageButton.png",
					"pressed": "messageButtonPressed.png",
					"touchDelegateName": "msg",
					"z": 2,
					"pos": {
						"x": 348,
						"y": 447
					}
				}
			},
			"pos": {
				"x": 1024,
				"y": 778
			}
		}
	} , 

});


jc.Designer.create = function() {
    var ml = new jc.Designer();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

jc.Designer.scene = function() {

        jc.Designer.scene = cc.Scene.create();
        jc.Designer.scene.layer = jc.Designer.create();
        jc.Designer.scene.layer.retain();
        jc.Designer.scene.addChild(jc.Designer.scene.layer);
        return jc.Designer.scene;
};

