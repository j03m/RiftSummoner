
//get blob from redis
//persist blob


var CardLayer = jc.UiElementsLayer.extend({
    cells:50,
    cellWidth:undefined,
    init: function(playerBlob, selectDelegate, cancelDelegate) {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(portraitsPlist);
            this.playerBlob = playerBlob;
            this.tableView = new jc.ScrollingLayer();
            this.addChild(this.tableView);
            var sprites = this.getDisplaySprites()
            this.tableView.init({
                sprites:sprites,
                cellWidth:this.cellWidth,
                selectionCallback:this.selectionCallback.bind(this)
            });

            this.name = "CardLayer";
            this.initFromConfig(CardLayerConf.windowConfig);
            this.raiseSelected = selectDelegate;
            this.raiseCancel = cancelDelegate;
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        console.log("onshow");
        var tableSize = this.tableView.getContentSize();
        var pos = this.getAnchorPosition({
                                    "cell":2,
                                    "anchor":['bottom'],
                                    "padding":{
                                        "top":-35
                                    }
                                },tableSize,this);

        pos.x =0;
        this.reorderChild(this.tableView,3);
        this.slide(this.tableView, cc.p(0,-1000),pos);
        this.start();
    },
    onHide:function(){


    },
    onDone:function(){
        //tableview is not in window config, gotta get rid of it ourselves
        this.raiseSelected(this.lastIndex);
        this.slide(this.tableView, this.tableView.getPosition(), cc.p(0,-1000));
        this.done(); //transition everyone out


    },
    outTransitionsComplete:function(){
        jc.layerManager.pop();
    },
    onCancel:function(){
        this.raiseCancel();
        this.slide(this.tableView, this.tableView.getPosition(), cc.p(0,-1000));
        this.done(); //transition everyone out
        jc.layerManager.pop();

    },
    selectionCallback: function(index, sprite){
        //todo: should be a global character list
        this.swapCharacter(this.playerBlob.myguys[index]);
        this.updateStats(this.playerBlob.myguys[index]);
        this.lastIndex = index;
    },
    swapCharacter:function(characterEntry){
        if (this.char){
            var f1 =  cc.FadeOut.create(jc.defaultTransitionTime/4, 0)
            this.nextEntry = characterEntry;
            this.char.runAction(cc.Sequence.create(f1,cc.CallFunc.create(this.displayNewCard.bind(this))))
        }else{
            var portraitFrame = jc.getCharacterPortrait(characterEntry);
            this.char = cc.Sprite.create();
            this.char.initWithSpriteFrameName(portraitFrame);
            this["portraitWindow"].addChild(this.char);

            var pos = this.getAnchorPosition({"cell":5}, this.portraitSprite, this.portraitWindow);
            this.char.setPosition(pos);
        }

    },
    displayNewCard:function(){
        var portraitFrame = jc.getCharacterPortrait(this.nextEntry);
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(portraitFrame);
        this.char.setDisplayFrame(frame);
        var f2 =  cc.FadeIn.create(jc.defaultTransitionTime/4, 255);
        this.char.runAction(f2);
        this.updateStats(this.nextEntry);

    },
    updateStats:function(entry){
        this.labelNameValue.setString(spriteDefs[entry.name].formalName);
        this.labelNameValue.setContentSize(this.labelNameValue.getTexture().getContentSize());
        this.labelDamageValue.setString(spriteDefs[entry.name].gameProperties.damage);
        this.labelLifeValue.setString(spriteDefs[entry.name].gameProperties.MaxHP);
        this.labelSpeedValue.setString(spriteDefs[entry.name].gameProperties.speed);
        var rad = spriteDefs[entry.name].gameProperties.targetRadius;
        if (rad < 0){
            rad = "Hand to Hand";
        }
        this.labelRangeValue.setString(rad);
        var type = jc.getUnitType(spriteDefs[entry.name].unitType).title;
        var element = jc.getElementType(spriteDefs[entry.name].elementType);

        this.labelUnitTypeValue.setString(type);
        this.labelElementTypeValue.setString(element);
        this.labelSpecialValue.setString(spriteDefs[entry.name].special);



    },
    getDisplaySprites: function(){
        var returnme = [];
        for(var i=0;i<this.playerBlob.myguys.length;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("lock.png");
            var pic = jc.getCharacterPortrait(this.playerBlob.myguys[i]);
            sprite.pic = new cc.Sprite();
            sprite.pic.initWithSpriteFrameName(pic);
            sprite.addChild(sprite.pic);
            this.scaleTo(sprite.pic, sprite);
            this.centerThis(sprite.pic, sprite);
            returnme.push(sprite);
        }

        returnme = returnme.concat(this.getEmptyCells(this.cells - this.playerBlob.myguys.length));
        return returnme;
    } ,
    getEmptyCells:function(number){
        var returnme=[];
        for(var i =0;i<number;i++){
            var sprite = new cc.Sprite();
            sprite.initWithSpriteFrameName("lock.png");
            if (!this.cellWidth){
                this.cellWidth = sprite.getTextureRect().width + 100;
            }
            returnme.push(sprite);
        }
        return returnme;
    },
    targetTouchHandler:function(type, touch, sprites){

    }
});



var CardLayerConf={};
CardLayerConf.font = "Helvetica";
CardLayerConf.fontSize = 12.0;
CardLayerConf.color = cc.c4f(255.0/255.0, 255.0/255.0, 255.0/255.0, 1.0);
CardLayerConf.labelWidth = 75;
CardLayerConf.labelValueWidth = 175;
CardLayerConf.labelHeight = 15;

CardLayerConf.windowConfig={
    "scrollFrame":{
        "cell":1,
        "type":"scale9",
        "anchor":['left'],
        "transitionIn":"bottom",
        "transitionOut":"bottom",
        "size":{ "width":100, "height":20},
        "scaleRect":jc.UiConf.frame19Rect,
        "sprite":"frame 19.png",
        "padding":{
            "top":7
        },
        "z":0
    },
    "portraitFrame":{
        "cell":7,
        "anchor":['top','left'],
        "type":"scale9",
        "transitionIn":"right",
        "transitionOut":"right",
        "scaleRect":jc.UiConf.frame19Rect,
        "size":{ "width":100, "height":80},
        "sprite":"frame 19.png",
        "padding":{
            "left":-7
        },
        "kids":{
            "decor":{
                "cell":7,
                "anchor":['top','left'],
                "type":"sprite",
                "transitionIn":"top",
                "transitionOut":"top",
                "sprite":"decor.png",
                "padding":{
                    "left":-50
                },
                "z":5,
                "scale":70
            },
            "portraitWindow":{
                "cell":7,
                "anchor":['top', 'left'],
                "type":"scale9",
                "transitionIn":"top",
                "transitionOut":"top",
                "size":{"width":35, "height":60},
                "scaleRect":jc.UiConf.frame20Rect,
                "sprite":"frame 20.png",
                "padding":{
                    "top":40,
                    "left":35
                }
            },
            "stats":{
                "isGroup":true,
                "type":"grid",
                "cell":8,
                "cols":2,
                "size":{ "width":33, "height":CardLayerConf.labelHeight},
                "padding":{
                    "top":10,
                    "left":5

                },
                "members":[
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"lableName",
                        "text":"Name:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelNameValue",
                        "text":"Joe is cool",
                        "width":CardLayerConf.labelValueWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelDamage",
                        "text":"Damage:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelDamageValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelLife",
                        "text":"Life:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelLifeValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpeed",
                        "text":"Speed:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpeedValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelRange",
                        "text":"Range:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelRangeValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelUnitType",
                        "text":"Unit Type:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelUnitTypeValue",
                        "text":"10",
                        "width":CardLayerConf.labelValueWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelElementType",
                        "text":"Element:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelElementTypeValue",
                        "text":"10",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpecial",
                        "text":"Special:",
                        "width":CardLayerConf.labelWidth,
                        "height":CardLayerConf.labelHeight
                    },
                    {
                        "type":"label",
                        "font":CardLayerConf.font,
                        "fontSize":CardLayerConf.fontSize,
                        "color":CardLayerConf.color,
                        "name":"labelSpecialValue",
                        "text":"10",
                        "width":CardLayerConf.labelValueWidth,
                        "height":CardLayerConf.labelHeight
                    }



                ]
            },
            "doneCancel":{
                "isGroup":true,
                "type":"line",
                "cell":2,
                "size":{ "width":33, "height":CardLayerConf.labelHeight},
                "anchor":['right'],
                "padding":{
                    "left":80,
                    "top":0
                },
                "members":[
                    {
                        "type":"button",
                        "main":"check.png",
                        "pressed":"check1.png",
                        "touchDelegateName":"onDone"
                    },
                    {
                        "type":"button",
                        "main":"close.png",
                        "pressed":"close1.png",
                        "touchDelegateName":"onCancel"
                    }
                ]
            }
        }
    }
}

jc.getCharacterPortrait=function(entry){
    //TODO: Mod to correct portrait - alive vs hurt based on state
    //todo implement me
    switch(entry.name){
        case "orc":
            return "btn_mon_orcWrrior.png";
        case "orge":
            return "btn_mon_orgeHitter.png";
        case "troll":
            return "btn_mon_trolCurer.png";
        case "wizard":
            return "btn_mon_goblinWizard.png";
        default:
            return "crunch-portrait.png";
    }

}







