var Multiplayer = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    cellPrefix:"gridCells",
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.items = [];			
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
        this.tableView = new jc.ScrollingLayer();
        this["mainFrame"].addChild(this.tableView);
        var scrollData = this.getGames();
		
        this.tableView.init({
        	isVertical:true,
		    sprites:scrollData,
            cellHeight:scrollData[0].getContentSize().height*2,
            selectionCallback:this.selectionCallback.bind(this),
            height:this.winSize.height
        });
		
		

		var position = cc.p(this.itemWindow.pos.x, this.itemWindow.pos.y);
        position.x *=jc.assetCategoryData.scale;
        position.y *=jc.assetCategoryData.scale;        
		this.tableView.setPosition(position);
        this.reorderChild(this.tableView, 3);
        this.tableView.hackOn();
        this.tableView.setIndex(0);
    },
	selectionCallback:function(){
		console.log("Touch");
	},
    getGames:function(){
		var returnme = [];
        for(var i =0;i<10;i++){
            var recordUi = this.getWindowFromConfig(this.itemWindow);
			returnme.push(recordUi);
        }
		return returnme;
    },
    targetTouchHandler: function(type, touch, sprites) {
    },
    back:function(){
        hotr.changeScene('landing');
    },
    fb:function(){},
    gameCenter:function(){},
    store:function(){},
    tweet:function(){},
    poke:function(){},
    startGame:function(){},
    msg:function(){},
    close:function(){},
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
    }
});



Multiplayer.scene = function() {
    if (!hotr.multiplayer){
        hotr.multiplayer = cc.Scene.create();
        hotr.multiplayer.layer = new Multiplayer();
        hotr.multiplayer.addChild(hotr.multiplayer.layer);
        hotr.multiplayer.layer.init();

    }
    return hotr.multiplayer;
};

