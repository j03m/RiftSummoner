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
        var theSprite = _.sortBy(sprites, function(sprite){
           return sprite.getZOrder();
        })[sprites.length-1];

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
    windowConfig: {
        "mainFrame": {
            "type": "sprite",
            "applyAdjustments": true,
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
            "transitionIn": "top",
            "transitionOut": "top",
            "sprite": "genericBackground.png",
            "z": 0,
            "kids": {
                "closeButton": {
                    "type": "button",
                    "main": "closeButton.png",
                    "pressed": "closeButtonPressed.png",
                    "z": 0,
                    "pos": {
                        "x": 1952,
                        "y": 1340
                    }
                },
                "statsFrame": {
                    "type": "sprite",
                    "sprite": "statsFrame.png",
                    "z": 0,
                    "pos": {
                        "x": 604,
                        "y": 950
                    }
                },
                "powerLevels": {
                    "isGroup": true,
                    "type": "grid",
                    "cols": 5,
                    "itemPadding": {
                        "top": 0,
                        "left": 11
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
                        "x": 1189,
                        "y": 1102
                    }
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
                        "x": 1189,
                        "y": 925
                    }
                },
                "powerDesc": {
                    "type": "sprite",
                    "sprite": "powerIconsDescription.png",
                    "z": 0,
                    "pos": {
                        "x": 1519,
                        "y": 762
                    }
                },
                "nextLevel": {
                    "type": "sprite",
                    "sprite": "nextLevelCostFrame.png",
                    "z": 0,
                    "pos": {
                        "x": 1393,
                        "y": 594
                    }
                },
                "trainButton": {
                    "type": "button",
                    "main": "buttonTrain.png",
                    "pressed": "buttonTrainPressed.png",
                    "z": 0,
                    "pos": {
                        "x": 1756,
                        "y": 576
                    }
                },
                "doneButton": {
                    "type": "button",
                    "main": "buttonDone.png",
                    "pressed": "buttonDonePressed.png",
                    "z": 0,
                    "pos": {
                        "x": 1723,
                        "y": 153
                    }
                },
                "characterPortraitsFrame": {
                    "type": "sprite",
                    "sprite": "characterPortraitsFrame.png",
                    "z": 0,
                    "pos": {
                        "x": 1024,
                        "y": 371
                    }
                },
                "characterPortraitsLeft": {
                    "type": "button",
                    "main": "characterPortraitsButtonLeft.png",
                    "pressed": "characterPortraitsButtonLeftPressed.png",
                    "z": 10,
                    "pos": {
                        "x": 95,
                        "y": 375
                    }
                },
                "characterPortraitsRight": {
                    "type": "button",
                    "main": "characterPortraitsButtonRight.png",
                    "pressed": "characterPortraitsButtonRightPressed.png",
                    "z": 10,
                    "pos": {
                        "x": 1955,
                        "y": 366
                    }
                },
                "info": {
                    "type": "button",
                    "main": "infoButton.png",
                    "touchDelegateName":"infoTouch",
                    "z": 5,
                    "pos": {
                        "x": 511,
                        "y": 1218
                    }
                },
                "card": {
                    "type": "sprite",
                    "sprite": "gargoyleFire_bg.png",
                    "z": 1,
                    "pos": {
                        "x": 784,
                        "y": 917
                    }
                },
                "element": {
                    "type": "sprite",
                    "sprite": "elements_0000_void.png",
                    "z": 5,
                    "pos": {
                        "x": 1021,
                        "y": 648
                    }
                },
                "air": {
                    "type": "sprite",
                    "sprite": "canAttackAir.png",
                    "z": 0,
                    "pos": {
                        "x": 403,
                        "y": 1209
                    }
                },
                "ground": {
                    "type": "sprite",
                    "sprite": "canAttackGround.png",
                    "z": 0,
                    "pos": {
                        "x": 246,
                        "y": 1206
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
                    "z": 0,
                    "pos": {
                        "x": 297,
                        "y": 1060
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
                    "z": 0,
                    "pos": {
                        "x": 294,
                        "y": 978
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
                    "z": 0,
                    "pos": {
                        "x": 301,
                        "y": 817
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
                    "z": 0,
                    "pos": {
                        "x": 302,
                        "y": 741
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
                    "z": 0,
                    "pos": {
                        "x": 306,
                        "y": 661
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
                    "z": 0,
                    "pos": {
                        "x": 298,
                        "y": 897
                    }
                },
                "infoDialog": {
                    "type": "sprite",
                    "sprite": "titleDescription.png",
                    "z": 0,
                    "pos": {
                        "x": 1508,
                        "y": 1023
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
                    "z": 0,
                    "pos": {
                        "x": 1565,
                        "y": 1278
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
                    "z": 0,
                    "pos": {
                        "x": 1291,
                        "y": 1051
                    }
                }
            },
            "pos": {
                "x": 1026.0000000000005,
                "y": 755.9999999999994
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

