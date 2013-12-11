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
    windowConfig:{
        "mainFrame": {
            "cell": 5,
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
                        "x": 186,
                        "y": 1059
                    }
                },
                "facebookButton": {
                    "type": "button",
                    "main": "facebookButton.png",
                    "pressed": "facebookButtonPressed.png",
                    "touchDelegateName": "fb",
                    "z": 2,
                    "pos": {
                        "x": 156,
                        "y": 807
                    }
                },
                "gameCenterButton": {
                    "type": "button",
                    "main": "gameCenterButton.png",
                    "pressed": "gameCenterPressed.png",
                    "touchDelegateName": "gameCenter",
                    "z": 2,
                    "pos": {
                        "x": 157,
                        "y": 626
                    }
                },
                "storeButton": {
                    "type": "button",
                    "main": "mpstoreButton.png",
                    "pressed": "mpstoreButtonPressed.png",
                    "touchDelegateName": "store",
                    "z": 2,
                    "pos": {
                        "x": 345,
                        "y": 1059
                    }
                },
                "twitterButton": {
                    "type": "button",
                    "main": "tweeterButton.png",
                    "pressed": "tweeterButtonPressed.png",
                    "touchDelegateName": "tweet",
                    "z": 2,
                    "pos": {
                        "x": 336,
                        "y": 807
                    }
                },
                "itemWindow": {
                    "type": "sprite",
                    "sprite": "itemWindow.png",
                    "z": 2,
                    "pos": {
                        "x": 1168,
                        "y": 1164
                    },
                    "kids": {
                        "pokeButton": {
                            "type": "button",
                            "main": "pokeButton.png",
                            "pressed": "pokeButtonPressed.png",
                            "touchDelegateName": "poke",
                            "z": 3,
                            "pos": {
                                "x": 1072,
                                "y": 135
                            }
                        },
                        "itemFrame": {
                            "type": "sprite",
                            "sprite": "imageFrame.png",
                            "z": 3,
                            "pos": {
                                "x": 156,
                                "y": 138
                            }
                        },
                        "closeButton": {
                            "type": "button",
                            "main": "closeButton.png",
                            "pressed": "closeButtonPressed.png",
                            "touchDelegateName": "close",
                            "z": 3,
                            "pos": {
                                "x": 1333,
                                "y": 135
                            }
                        }
                    }
                },
                "startButton": {
                    "type": "button",
                    "main": "startButton.png",
                    "pressed": "startButtonPressed.png",
                    "touchDelegateName": "startGame",
                    "z": 2,
                    "pos": {
                        "x": 264,
                        "y": 1242
                    }
                },
                "messageButton": {
                    "type": "button",
                    "main": "messageButton.png",
                    "pressed": "messageButtonPressed.png",
                    "touchDelegateName": "msg",
                    "z": 2,
                    "pos": {
                        "x": 339,
                        "y": 627
                    }
                }
            },
            "pos": {
                "x": 1018,
                "y": 778.0000000000002
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

