var Browser = require("zombie");
var redis = require("redis"),
    client = redis.createClient(1337);

setInterval(function(){
    Browser.visit("http://kik.heyhey.us/", {"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36"},function (e, browser) {
        if (!e){
            var elements = browser.html(".photo-grid-item");
            if (elements){
                var result = elements.match(/\d+\w+_thumb/g);
                if (result){
                    for(var i =0;i<result.length;i++){
                        result[i] = result[i].replace(/^\d+/,"");
                        result[i] = result[i].replace("_thumb","")
                        console.log("Adding: " + result[i]);
                        client.sadd('kikusers', result[i]);
                    }
                }else{
                    console.log("result empty");
                }
            }else{
                console.log("elements empty");
            }
        }else{
            console.log(JSON.stringify(e));
        }

    });
}, 30000);
