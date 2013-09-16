var LayerManager = function(){
    this.layers = [];
}

LayerManager.prototype.push = function(layer){
    if (this.currentLayer){
        this.currentLayer.pause();
        this.layers.push(this.currentLayer);
    }
    this.currentLayer = layer;
    jc.mainScene.addChild(layer);
    layer.setPosition(cc.p(0,0));

}

LayerManager.prototype.pop = function(){
    this.currentLayer.pause();
    this.removeChild(this.currentLayer);
    this.currentLayer = this.layers.pop();
    this.currentLayer.resume();
}


var jc = jc || {};
jc.layerManager = new LayerManager();