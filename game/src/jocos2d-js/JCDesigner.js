var jc = jc || {};
jc.Designer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(cardsPlists[0]);
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
    windowConfig: 	{
	"mainFrame": {
		"size": {
			"width": 2048,
			"height": 1365
		},
		"type": "sprite",
		"rect": {
			"origin": {
				"x": 220,
				"y": 220
			},
			"size": {
				"width": 293,
				"height": 293
			}
		},
		"applyAdjustments": true,
		"transitionIn": "top",
		"transitionOut": "top",
		"sprite": "genericBackground.png",
		"z": 0,
		"kids": {
			"closeButton": {
				"type": "button",
				"main": "closeButton.png",
				"pressed": "closeButtonPressed.png",
				"touchDelegateName": "close",
				"z": 1,
				"pos": {
					"x": 1973,
					"y": 1081
				}
			},
			"statsFrame": {
				"type": "sprite",
				"sprite": "statsFrame.png",
				"z": 2,
				"pos": {
					"x": 596,
					"y": 731
				}
			},
			"powerLevels": {
				"isGroup": true,
				"type": "grid",
				"cols": 5,
				"itemPadding": {
					"top": 0,
					"left": 12
				},
				"members": [
					{
						"type": "sprite",
						"sprite": "level_0000_Layer-6.png"
					}
				],
				"membersTotal": 5,
				"sprite": "level_0000_Layer-6.png",
				"z": 1,
				"pos": {
					"x": 1210,
					"y": 967
				},
				"applyAdjustments": true
			},
			"powerIcons": {
				"isGroup": true,
				"type": "grid",
				"cols": 5,
				"itemPadding": {
					"top": 0,
					"left": -2
				},
				"input": true,
				"members": [
					{
						"type": "sprite",
						"input": true,
						"sprite": "powerIconSmallFrame.png"
					}
				],
				"membersTotal": 5,
				"sprite": "powerIconSmallFrame.png",
				"z": 1,
				"pos": {
					"x": 1213,
					"y": 797
				},
				"applyAdjustments": true
			},
			"powerDesc": {
				"type": "sprite",
				"sprite": "powerIconsDescription.png",
				"z": 1,
				"pos": {
					"x": 1535,
					"y": 630
				}
			},
			"nextLevel": {
				"type": "sprite",
				"sprite": "nextLevelCostFrame.png",
				"z": 1,
				"pos": {
					"x": 1363,
					"y": 456
				}
			},
			"trainButton": {
				"type": "button",
				"main": "buttonTrain.png",
				"pressed": "buttonTrainPressed.png",
				"touchDelegateName": "trainPower",
				"z": 1,
				"pos": {
					"x": 1249,
					"y": 386
				}
			},
			"doneButton": {
				"type": "button",
				"main": "buttonDone.png",
				"pressed": "buttonDonePressed.png",
				"touchDelegateName": "doneButton",
				"z": 1,
				"pos": {
					"x": 1759,
					"y": 457
				}
			},
			"characterPortraitsFrame": {
				"type": "sprite",
				"sprite": "characterPortraitsFrame.png",
				"z": 1,
				"pos": {
					"x": 1019,
					"y": 200
				}
			},
			"characterPortraitsLeft": {
				"type": "button",
				"main": "characterPortraitsButtonLeftBrown.png",
				"pressed": "characterPortraitsButtonLeftPressedBrown.png",
				"touchDelegateName": "previousChar",
				"z": 10,
				"pos": {
					"x": 97,
					"y": 208
				}
			},
			"characterPortraitsRight": {
				"type": "button",
				"main": "characterPortraitsButtonRightBrown.png",
				"pressed": "characterPortraitsButtonRightPressedBrown.png",
				"touchDelegateName": "nextChar",
				"z": 10,
				"pos": {
					"x": 1956,
					"y": 198
				}
			},
			"info": {
				"type": "button",
				"main": "infoButton.png",
				"pressDelegateName": "infoPress",
				"touchDelegateName": "infoTouch",
				"z": 5,
				"pos": {
					"x": 496,
					"y": 981
				}
			},
			"card": {
				"type": "sprite",
				"sprite": "gargoyleFire_bg.png",
				"z": 1,
				"pos": {
					"x": 781,
					"y": 680
				}
			},
			"element": {
				"type": "sprite",
				"sprite": "elements_0000_void.png",
				"z": 5,
				"pos": {
					"x": 1015,
					"y": 420
				}
			},
			"air": {
				"type": "sprite",
				"sprite": "canAttackAir.png",
				"z": 1,
				"pos": {
					"x": 238,
					"y": 1029
				}
			},
			"ground": {
				"type": "sprite",
				"sprite": "canAttackGround.png",
				"z": 1,
				"pos": {
					"x": 384,
					"y": 1023
				}
			},
			"lblhp": {
				"type": "label",
				"text": "HEALTH",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 3,
				"pos": {
					"x": 285,
					"y": 880
				}
			},
			"lbldamage": {
				"type": "label",
				"text": "DAMAGE",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 3,
				"pos": {
					"x": 288,
					"y": 798
				}
			},
			"lblspeed": {
				"type": "label",
				"text": "SPEED",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 3,
				"pos": {
					"x": 288,
					"y": 646
				}
			},
			"lblpower": {
				"type": "label",
				"text": "POWER",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 3,
				"pos": {
					"x": 291,
					"y": 561
				}
			},
			"lblrange": {
				"type": "label",
				"text": "RANGE",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 3,
				"pos": {
					"x": 294,
					"y": 481
				}
			},
			"lblarmor": {
				"type": "label",
				"text": "ARMOR",
				"width": 80,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 3,
				"pos": {
					"x": 297,
					"y": 723
				}
			},
			"infoDialog": {
				"type": "sprite",
				"sprite": "titleDescription.png",
				"z": 3,
				"pos": {
					"x": 1525,
					"y": 787
				}
			},
			"infoTitle": {
				"type": "label",
				"text": "TITLE",
				"width": 200,
				"height": 80,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 4,
				"pos": {
					"x": 1567,
					"y": 1031
				}
			},
			"infoText": {
				"type": "label",
				"text": "DESC",
				"width": 200,
				"height": 200,
				"alignment": 0,
				"fontSize": 20,
				"fontName": "gow",
				"z": 4,
				"pos": {
					"x": 1286,
					"y": 831
				}
			}
		},
		"pos": {
			"x": 1029.0000000000005,
			"y": 775.9999999999989
		}
	}
} 
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

