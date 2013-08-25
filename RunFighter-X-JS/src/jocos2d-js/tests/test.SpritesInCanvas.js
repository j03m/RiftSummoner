var SpriteAnimationTest = function(spriteName, state, layer){
    var sprite = jc.Sprite.spriteGenerator(spriteDefs, spriteName, layer);
    sprite.debug= true;
    layer.addChild(sprite.batch);
    layer.addChild(sprite);
    sprite.centerOnScreen();
    sprite.setState(state, repeat);
    function repeat(){
        sprite.setState(state,repeat);
    }

}


var StateMachineTest = function(sprite1, sprite2, layer){
    var spriteOne = jc.Sprite.spriteGenerator(spriteDefs, sprite1, layer);
    var spriteTwo = jc.Sprite.spriteGenerator(spriteDefs, sprite2, layer);
    spriteOne.setBasePosition(cc.p(100,100));
    spriteTwo.setBasePosition(cc.p(200,200));
    layer.addChild(spriteOne);
    layer.addChild(spriteTwo);
    var updateCount = 0;

    layer.update = function(dt){
        //verify both sprites are idle

        spriteOne.think(dt);
        //spriteTwo.think(dt);

        if (updateCount == 0){
            //verify both sprites have locked onto one another
            if (sprite1.behavior.locked != sprite2){
                throw "sprite1 locked fail."
            }
        }

    }


}

var jc = jc || {};
jc.tests = jc.tests || {};
jc.tests.SpriteAnimationTest = SpriteAnimationTest;
jc.tests.StateMachineTest = StateMachineTest;
