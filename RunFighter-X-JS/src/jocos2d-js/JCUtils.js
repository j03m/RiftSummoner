var jc = jc || {};



jc.moveActionWithCallback = function(point, rate, callback){
    var action = cc.MoveTo.create(rate, point);
    return jc.actionWithCallback(action, callback);

}

jc.cap = function(point, rect){
    if (point.x < rect.x){
        point.x = rect.x;
    }
    if (point.y < rect.y){
        point.y = rect.y
    }
    if (point.x > rect.width){
        point.x = rect.width;
    }
    if (point.y > rect.height){
        point.y = rect.height;
    }
}

jc.makeSpriteWithPlist = function(plist, png, startFrame){
    var sprite = new cc.Sprite();
    cc.SpriteFrameCache.getInstance().addSpriteFrames(plist);
    cc.SpriteBatchNode.create(png);
    //todo change to size of sprite
    var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(startFrame);
    sprite.initWithSpriteFrame(frame);
    return sprite;
}

jc.shade = function(item, op){
    if (!item.shade){
        item.shade = cc.LayerColor.create(cc.c4(15, 15, 15, 255));
        item.getParent().addChild(item.shade);
    }
    var pos = item.getPosition();
    var size = item.getBoundingBox().size;
    pos.x -= size.width/2;
    pos.y -= size.height/2;
    item.shade.setPosition(pos);
    item.shade.setContentSize(size);

    item.shade.setOpacity(0);
    item.getParent().reorderChild(item.shade,0);
    if (op == undefined){
        op = jc.defaultFadeLevel
    }
    jc.fadeIn(item.shade, op);

}

jc.unshade = function(item){
    jc.fadeOut(item.shade);
}

jc.fadeIn= function(item, opacity , time){
    if (!time){
        time = jc.defaultTransitionTime;
    }
    if (!opacity){
        opacity = jc.defaultFadeLevel;
    }
    if (!item){
        item = this;
    }

    var actionFadeIn = cc.FadeTo.create(time,opacity);
    item.runAction(actionFadeIn);
},
jc.fadeOut=function(item, time){
    if (!time){
        time = jc.defaultTransitionTime;
    }
    if (!item){
        item = this;
    }
    var actionFadeOut = cc.FadeTo.create(time,0);
    item.runAction(actionFadeOut);

}

jc.makeAnimationFromRange = function(name, config){

    //animate it
    var frames = [];
    var first =1;
    if (config.first){
        first = config.first;
    }

    for(var i =first;i<=config.frames;i++){
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name + "." + i + ".png");
        frames.push(frame);
    }

    //reverse
    if (config.rev){
        for(var i =config.frames;i>=first;i--){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name + "." + i + ".png");
            frames.push(frame);
        }
    }


    var animation = cc.Animation.create(frames, config.delay);
    if (!config.times){
        return cc.RepeatForever.create(cc.Animate.create(animation));
    }else{
        return cc.Repeat.create(cc.Animate.create(animation), config.times);
    }

}

jc.playEffectOnTarget = function(name, target, layer, child){

    var config = effectsConfig[name];

    if (!target.effectAnimations){
        target.effectAnimations = {};
    }

    if (!target.effectAnimations[name]){
        target.effectAnimations[name] = {
                                            "sprite":jc.makeSpriteWithPlist(config.plist, config.png, config.start),
                                            "animation":jc.makeAnimationFromRange(name, config )
        };
    }
    if (target.effectAnimations[name].playing){
        return; //don't play if it's already playing on me
    }

    var parent;
    if (child){
        parent = target;
    }else{
        parent = layer;
    }

    var effect = target.effectAnimations[name].sprite;
    var effectAnimation = target.effectAnimations[name].animation;
    effect.setVisible(true);
    parent.addChild(effect);

    if (child){
        jc.setChildEffectPosition(effect, target, config);
    }else{
        jc.setEffectPosition(effect, target, config);
    }


    if (config.zorder == "behind"){
        parent.reorderChild(effect,target.getZOrder()-1);
    }else{
        parent.reorderChild(effect,target.getZOrder()+1);
    }

    if (config.times){
        var onDone = cc.CallFunc.create(function(){

            parent.removeChild(effect);
            target.effectAnimations[name].playing =false;
        }.bind(this));

        var action = cc.Sequence.create(effectAnimation, onDone);
        target.effectAnimations[name].playing =true;
        effect.runAction(action);
    }else{
        effect.runAction(effectAnimation);
    }


}

jc.playEffectAtLocation = function(name, location, z, layer){

    var config = effectsConfig[name];
    var effect = jc.makeSpriteWithPlist(config.plist, config.png, config.start);
    var effectAnimation = jc.makeAnimationFromRange(name, config );
    effect.setPosition(location);
    effect.setVisible(true);
    layer.addChild(effect);
    layer.reorderChild(effect,z);
    if (config.times){
        var onDone = cc.CallFunc.create(function(){
            layer.removeChild(effect);
        }.bind(this));
        var action = cc.Sequence.create(effectAnimation, onDone);
        effect.runAction(action);
    }else{
        effect.runAction(effectAnimation);
    }

}

jc.setChildEffectPosition = function(effect, parent, config){
    var placement = config.placement;
    var effectPos = effect.getPosition();
    var cs = parent.getContentSize();
    var tr = parent.getTextureRect();
    var etr = effect.getContentSize();

    if (placement){
        if (placement == 'bottom') {
            effectPos.y -= cs.height/2;
            effectPos.y += etr.height/2;
            effectPos.y -= tr.height;
            effectPos.x += cs.width/2;

        }else if (placement == 'center'){
            effectPos.x += cs.width/2;
            effectPos.y -= cs.height/2; //move to bottom
            effectPos.y += tr.height/2; //move up to middle of texture
        }
        else if (placement == 'base2base'){
            effectPos.x += cs.width/2;
            effectPos.y -= cs.height/2;
            effectPos.y += etr.height;

        }else{
            throw "Unknown effect placement.";
        }
    }

    if (config.offset){
        var newPos = cc.pAdd(effectPos, config.offset);
        effect.setPosition(newPos);
    }else{
        effect.setPosition(effectPos);
    }

}

jc.setEffectPosition = function(effect, parent, config){
    var placement = config.placement;
    var base = parent.getBasePosition();
    var tr = parent.getTextureRect();
    var etr = effect.getTextureRect();

    if (placement){
        if (placement == 'bottom') {
            base.y += etr.height/2;
        }else if (placement == 'center'){
            base.y += tr.height/2;
        }else if (placement == 'top'){
            effect.setPosition(base);
        }else if (placement == 'base2base'){
            base.y += etr.height;
        }else{
            throw "Unknown effect placement.";
        }
    }

    if (config.offset){
        var newPos = cc.pAdd(base, config.offset);
        effect.setPosition(newPos);
    }else{
        effect.setPosition(base);
    }

}

jc.genericPower = function(name, value, attacker, target, config, element){
    if (!config){
        config = spriteDefs[value].damageMods[name];
    }
    var effect = {};
    effect = _.extend(effect, config); //add all props in config to effect
    effect.name = name;
    if (attacker){
        effect.origin = attacker;
    }else{
        effect.element = element;
    }

    target.addEffect(effect);
}

jc.genericPowerApply = function(effectData, effectName, varName,bObj){
    //examine the effect config and apply burning to the victim
    if (GeneralBehavior.applyDamage(bObj.owner, effectData.origin, effectData.damage, effectData.element)){
        if (!bObj.owner[varName]){
            bObj.owner[varName] = jc.playEffect(effectName, bObj.owner, bObj.owner.getZOrder(), bObj.owner.layer);
        }
    }
}



jc.genericPowerRemove = function(varName,bObj){
    if (!bObj.owner[varName]){
        bObj.owner.layer.removeChild(bObj.owner[varName]);
    }
    bObj.owner[varName] = undefined;
}

jc.movementType = {
    "air":0,
    "ground":1
}

jc.targetType = {
    "air":0,
    "ground":1,
    "both":2,
}

jc.elementTypes = {
    "void":0,
    "water":1,
    "fire":2,
    "life":3,
    "none":4,
    "earth":5,
    "air":7


}

jc.getElementType = function(id){
    for(var type in jc.elementTypes){
        if (jc.elementTypes[type] == id){
            return type;
        }
    }
}

jc.checkPower = function(charName, powerName){

}

jc.insideEllipse = function(major, minor, point, center){
    //http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
    var xDiff = point.x - center.x;
    var yDiff = point.y - center.y;
    var majorSq = major*major;
    var minorSq = minor*minor;

    var final = ((xDiff*xDiff)/majorSq) + ((yDiff*yDiff)/minorSq);
    return final <1;
}






jc.formations = {
    "4x3":[
        {"x":225,"y":225},
        {"x":225,"y":375},
        {"x":225,"y":525},
        {"x":225,"y":675},
        {"x":75,"y":300},
        {"x":75,"y":450},
        {"x":75,"y":600},

    ],
    "4x4x4a":[
        {"x":800,"y":400},
        {"x":800,"y":500},
        {"x":800,"y":600},
        {"x":800,"y":700},
        {"x":700,"y":400},
        {"x":700,"y":500},
        {"x":700,"y":600},
        {"x":700,"y":700},
        {"x":550,"y":400},
        {"x":550,"y":500},
        {"x":550,"y":600},
        {"x":550,"y":700},
    ],

    "4x4x4b":[
        {"x":1100,"y":400},
        {"x":1100,"y":500},
        {"x":1100,"y":600},
        {"x":1100,"y":700},
        {"x":1200,"y":400},
        {"x":1200,"y":500},
        {"x":1200,"y":600},
        {"x":1200,"y":700},
        {"x":1350,"y":400},
        {"x":1350,"y":500},
        {"x":1350,"y":600},
        {"x":1350,"y":700},
    ]

};
