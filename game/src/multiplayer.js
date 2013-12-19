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
			this.tableView = new jc.ScrollingLayer();
            this.items = [];			
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
        this.addChild(this.tableView);
        var scrollData = this.getGames();		
        if (!this.tableInit && scrollData.length >0){
			this.tableInit = true;
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
        	
        }
    },
	selectionCallback:function(){
		console.log("Touch");
	},
    getGames:function(){
		var returnme = [];		
		var mpData =hotr.multiplayerData;

		if (!mpData){
			return returnme;
		}
		var creds = hotr.blobOperations.getCreds();
        this.replayData = {};
        for(var gameId in mpData){
			var game = mpData[gameId];
            var recordUi = this.getWindowFromConfig(this.itemWindow);				
			recordUi.lblWins.setString(game[creds.id].wins);
			recordUi.lblLosses.setString(game[gameId].wins);
            this.replayData[gameId] = game.lastMatchData;
			if (game[gameId].name){
				recordUi.lblName.setString(game[gameId].name);
			}else{
				recordUi.lblName.setString("Anonymous");
			}
			
			if (game.turn == creds.id){
				//set poke to fight
				recordUi.pokeButton.setVisible(false);
				recordUi.fightButton.setVisible(true);
                recordUi.replayButton.setVisible(true);
			}else{
				recordUi.pokeButton.setVisible(true);
				recordUi.fightButton.setVisible(false);
                recordUi.replayButton.setVisible(false);
			}
			
			recordUi.pokeButton.setData(gameId);
			recordUi.fightButton.setData(gameId);
			recordUi.closeButton.setData(gameId);
            recordUi.replayButton.setData(gameId);
			
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
    poke:function(data){},
	fight:function(data){
		hotr.newOpponent = data;
		hotr.mainScene.layer.mpTakeTurn();			
	},
    replay:function(data){
        var thisReplay = this.replayData[data];
        hotr.mainScene.layer.arenaReplay(thisReplay);
    },
	countGames:function(){
		var count=0;
        for(var gameId in hotr.multiplayerData){
			count++;
        }
		return count;	
	},

    startGame:function(){	
		if (this.countGames()<25){
			hotr.mainScene.layer.mpStartGame();			
		}else{
			//todo: msgbox - too many games. delete some
		}			
    },
    msg:function(){},
    close:function(data){},
	windowConfig:
	{
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
	"itemWindow": {
		"type": "sprite",
		"sprite": "itemWindow.png",
		"z": 4,
		"pos": {
					"x": 1201,
					"y": 1149
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
			"fightButton": {
				"type": "button",
				"main": "buttonFight.png",
				"pressed": "buttonFightPressed.png",
				"touchDelegateName": "fight",
				"z": 3,
				"pos": {
					"x": 1147,
					"y": 183
				}
			},
            "replayButton":{
                "type": "button",
                "main": "buttonFight.png",
                "pressed": "buttonFightPressed.png",
                "touchDelegateName": "replay",
                "z": 3,
                "pos": {
                    "x": 1147,
                    "y": 53
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
});



Multiplayer.scene = function() {
		if (hotr.multiplayer){
			hotr.multiplayer.removeChild(hotr.multiplayer.layer);
			hotr.multiplayer.layer.release();
			hotr.multiplayer.layer=null;
			hotr.multiplayer.release();
			hotr.multiplayer = null;			
		}
		
        hotr.multiplayer = cc.Scene.create();
        hotr.multiplayer.layer = new Multiplayer();
        hotr.multiplayer.addChild(hotr.multiplayer.layer);
        hotr.multiplayer.layer.init();

		return hotr.multiplayer;
};

