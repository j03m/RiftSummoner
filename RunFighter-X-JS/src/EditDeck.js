jc.playerBlob = {
    id:1,
    grid:[1],
    myguys:[
        {   "name":"wizard",
            "status":"alive"
        },
        {   "name":"orc",
            "status":"alive"
        },
        {   "name":"orge",
            "status":"down"
        },
        {   "name":"troll",
            "status":"alive"
        },
        {   "name":"goldKnight",
            "status":"alive"
        },
        {   "name":"goblin",
            "status":"alive"
        }
]

}

var EditDeck = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:140,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function(playerBlob) {

        if (this._super()) {
            this.initFromConfig(this.windowConfig);
            this.start();
            this.playerBlob = playerBlob;
            this.cardLayer= new CardLayer();
            this.cardLayer.init(this.playerBlob, this.selectionMade.bind(this), this.selectionCancelled.bind(this));
            jc.layerManager.push(this);
            this.name = "EditDeck";

            return true;
        } else {
            return false;
        }
    },
    selectionMade:function(index){
        var portraitFrame = jc.getCharacterPortrait(this.playerBlob.myguys[index]);
        if (!this.touchedSprite.portrait){
            this.touchedSprite.portrait = cc.Sprite.create();
            this.touchedSprite.portrait.initWithSpriteFrameName(portraitFrame);
            this.touchedSprite.addChild(this.touchedSprite.portrait);
            this.scaleTo(this.touchedSprite.portrait, this.touchedSprite);
            this.centerThis(this.touchedSprite.portrait, this.touchedSprite);
            this.playMap[this.touchedSprite.name] = index;
        }
    },
    selectionCancelled:function(){
         this.touchedSprite = undefined;
    },
    onDone:function(){
        if (!this.isPaused){
            //todo: transition to battle
            jc.editDeckResult = this.playMap;
            jc.mainScene.layer.changeScene('arena');
        }
    },
    onCancel:function(){
        if (!this.isPaused){
            //todo: transition to map

        }
    },
    targetTouchHandler:function(type, touch, sprites){
        if (type == jc.touchEnded){
            this.touchedSprite = sprites[0];
            jc.layerManager.push(this.cardLayer);
            this.reorderChild(this.cardLayer, 3);
        }
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"scale9",
            "transitionIn":"top",
            "transitionOut":"top",
            "size":{ "width":100, "height":100},
            "scaleRect":jc.UiConf.frame19Rect,
            "sprite":"frame 19.png",
            "padding":{
                "top":12,
                "left":2
            }
            ,
            "kids":{
                "gridCells":{
                    "isGroup":true,
                    "type":"grid",
                    "cols":5,
                    "cell":7,
                    "anchor":['bottom'],
                    "padding":{
                        "top":-35
                    },
                    "itemPadding":{
                        "left":5,
                        "top":5
                    },
                    "size":{ "width":90, "height":90},
                    "itemSize":{ "width":15, "height":20},
                    "input":true,
                    "members":[
                        {
                            "type":"scale9",
                            "input":true,
                            "scaleRect":jc.UiConf.frame20Rect,
                            "sprite":"frame 20.png"
                        }
                    ],
                    "membersTotal":15
                },
                "bottomButtons":{
                    "isGroup":true,
                    "type":"line",
                    "cell":2,
                    "size":{ "width":33, "height":10},
                    "anchor":['right'],
                    "padding":{
                        "left":10
                    },
                    "members":[
                        {
                            "type":"button",
                            "main":"wood blank.png",
                            "pressed":"black wood.png",
                            "touchDelegateName":"onDone",
                            "text":"done"
                        },
                        {
                            "type":"button",
                            "main":"wood blank.png",
                            "pressed":"black wood.png",
                            "touchDelegateName":"onCancel",
                            "text":"cancel"
                        }
                    ]
                }
            }
        }
    }
});



EditDeck.scene = function() {
    if (!jc.editDeckScene){
        jc.editDeckScene = cc.Scene.create();
        jc.editDeckScene.layer = new EditDeck();
        jc.editDeckScene.addChild(jc.editDeckScene.layer);
        jc.editDeckScene.layer.init(jc.playerBlob); //todo: must come from remote

    }
    return jc.editDeckScene;
};

//            label = cc.LabelTTF.create(strValue, "Helveticac", 20.0);
//            label.setPosition(cc.p(0,0));
//            label.setAnchorPoint(cc.p(0,0));
//            label.setTag(123);
//            cell.addChild(label);

//testing
//            this.bottomWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromBottom(this.bottomWindow);
//            this.topWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromTop(this.topWindow);
//            this.leftWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromLeft(this.leftWindow);
//            this.rightWindow = this.makeWindow(cc.size(150,150));
//            this.slideInFromRight(this.rightWindow);
