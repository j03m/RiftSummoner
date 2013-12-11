var redis = require("redis"),
    client = redis.createClient();

exports.get = function get(key, cb){
    //for now return client, but todo: implement hashring
    return client.get(key, cb);
}

exports.set = function set(key, val, cb){
    //for now return client, but todo: implement hashring
    return client.set(key,val, cb);
}

exports.multi= function(cmds){
    //for now return client, but todo: implement hashring
    return client.multi(cmds);
}

exports.getClient = function(key){
     return client;
}