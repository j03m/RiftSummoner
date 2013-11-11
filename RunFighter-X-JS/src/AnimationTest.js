var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var AnimationTest = jc.TouchLayer.extend({
    //character:"dwarvenKnightWater",
    effect:"fire",
    //missile:"greenbullet",
    init: function() {

        if (this._super()) {
            if (AnimationTest.loaded){
                this.go();
                jc.playEffectOnTarget(this.effect, this.sprite, this, false);
                this.bubbleAllTouches(true);
            }else{
                AnimationTest.loaded = true;
                var assets = [];
                if (this.character){
                    jc.mainScene.layer.addAssetChain(assets, this.character);
                }

                if (this.effect){
                    assets.pushUnique(g_characterPlists[this.effect]);
                    assets.pushUnique(g_characterPngs[this.effect]);

                }

                if (this.missile){
                    assets.pushUnique(g_characterPlists[this.missile]);
                    assets.pushUnique(g_characterPngs[this.missile]);
                }


                //transform
                for (var i =0;i<assets.length;i++){
                    assets[i] = {src:assets[i]};
                }

                for (var i=0;i<g_battleStuff.length;i++){
                    assets.push(g_battleStuff[i]);
                }
                cc.Director.getInstance().replaceScene(Loading.scene(assets, 'animationTest'));
            }

            return true;
        } else {
            return false;
        }
    },
    go:function(){
        if (this.sprite){
            this.removeChild(this.sprite);
            if (this.sprite.cleanUp){
                this.sprite.cleanUp();
            }

            this.sprite = undefined;
        }
        if (this.character){
            this.makeChar(this.character);
        }else if (this.effect){
            this.makeEffect(this.effect);
        }else if (this.missile){
            this.makeMissile(this.missile);
        }else{
            throw "must set character, missile or effect"
        }
    },
    makeChar:function(){
        this.sprite = jc.Sprite.spriteGenerator(spriteDefs,this.character, this);
        this.addChild(this.sprite);
        this.sprite.setBasePosition(cc.p(this.winSize.width/2, this.winSize.height/2));
        this.sprite.setState('idle');

    },
    makeIt:function(it, inConfig){
        var config = inConfig;
        this.sprite = jc.makeSpriteWithPlist(config.plist, config.png, config.start);
        this.sprite.setPosition(cc.p(this.winSize.width/2, this.winSize.height/2));
        this.sprite.setVisible(true);
        this.addChild(this.sprite);


        var action = jc.makeAnimationFromRange(it, config);
        this.sprite.runAction(action);

    },
    makeEffect:function(){
        this.makeIt(this.effect, effectsConfig[this.effect]);
    },
    makeMissile:function(){
        this.makeIt(this.missile, missileConfig[this.missile]);
    },
    targetTouchHandler:function(type, touch, sprites){
        this.go();
    }
});

AnimationTest.create = function() {
    var ml = new AnimationTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

AnimationTest.scene = function() {

    var scene = cc.Scene.create();
    var layer = AnimationTest.create();
    scene.addChild(layer);
    jc.animationTest = layer;
    return scene;

};
