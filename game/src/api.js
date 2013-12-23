var hotr = hotr || {};
hotr.api = {};

if (jc.isBrowser){
    hotr.api.target = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    hotr.api.sTarget = hotr.api.target;
}else{
    hotr.api.target = "http://www.riftsummoner.com";
    hotr.api.sTarget = "http://www.riftsummoner.com";
}

hotr.api.get = function(url, cb){
	hotr.api.do("GET",url,undefined,cb);
}

hotr.api.post = function(url, data, cb){
	hotr.api.do("POST",url,data,cb);
}

hotr.api.do = function(method, url,data,cb) {
    var xhr;    
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        throw ("Couldn't create xmlhttp = " + e);
    }
    
    xhr.onreadystatechange = function(){
		jc.log(['console'], "readystatechange");
			if (xhr.readyState == 4) {
                jc.log(['console'],"readystatechange 4");
				var response = xhr.responseText;
				var responseObj;
				try{
					responseObj = JSON.parse(response);
				}catch(e){
					jc.log(['console'],"failed to parse:" + response + " with " + e);
					responseObj = response;
                    if (responseObj == "" || responseObj == false || responseObj == null){
                        responseObj = undefined;
                    }
				}
					
	            if (xhr.status == 200) {
	                if (cb){
                        cb(undefined, responseObj);
                    }

	            } else {
					var errStatus;
					if (xhr.status == 0){
						errStatus = 500;
						responseObj = "connection dropped.";
					}else{
						errStatus = xhr.status;
					}
                    if (cb){
                        cb(errStatus,responseObj);
                    }
	            }
	        }	
	}
    

	xhr.open(method, url);

	 	
	if (data){
		xhr.setRequestHeader("Content-type","application/json");
		var jsonString = JSON.stringify(data);
		xhr.send(jsonString);
	}else{
		xhr.send();
	}
}

hotr.api.makeUrl = function(target, path, args ){
        var parts = path.split('/');
        var paramCount = 0;
        for (var i=0;i<parts.length;i++){
                if (parts[i].indexOf(':')!=-1){
                        if (paramCount>=args.length){
                                throw "Insufficient number of params passed to make a url for: " + path;
                        }else{
                                parts[i] = args[paramCount];
                                paramCount++;
                        }
                }
        }
        return target+parts.join('/');
}

hotr.api.getBlob = function(token, callback){
	var url = hotr.api.makeUrl(hotr.api.target,'/app/getblob/:token',arguments);
	hotr.api.get(url, callback);
}

hotr.api.createNewPlayer = function(id, pass, callback){	
	var url = hotr.api.makeUrl(hotr.api.sTarget,'/app/createplayer/:id/:pass',arguments);
	hotr.api.get(url, callback);
}

hotr.api.getNewAuthTokenAndBlob = function(id, data, hash, callback){
	var url = hotr.api.makeUrl(hotr.api.sTarget,'/app/gettokenandblob/:id/:data/:hash',arguments);
	hotr.api.get(url, callback);
}

hotr.api.saveBlob = function(token, blob, callback){
	var url = hotr.api.makeUrl(hotr.api.target, '/app/saveblob/:token', arguments);
	var data = blob;
	hotr.api.post(url,data,callback);
}

hotr.api.getGames = function(token, callback){
	var url = hotr.api.makeUrl(hotr.api.target, '/app/getgames/:token', arguments);
	hotr.api.get(url,callback);
}

hotr.api.findGame = function(token, callback){
	var url = hotr.api.makeUrl(hotr.api.target, '/app/findgame/:token', arguments);
	hotr.api.get(url,callback);
}

hotr.api.getTeam = function(token, op, callback){
	var url = hotr.api.makeUrl(hotr.api.target, '/app/getteam/:token/:opponent', arguments);
	hotr.api.get(url, callback);
}

hotr.api.victory = function(token, op,data, callback){
    var url = hotr.api.makeUrl(hotr.api.target, '/app/victory/:token/:opponent', arguments);
    hotr.api.post(url, data,callback);
}

hotr.api.defeat = function(token, op, data,callback){
    var url = hotr.api.makeUrl(hotr.api.target, '/app/defeat/:token/:opponent', arguments);
    hotr.api.post(url, data, callback);
}
