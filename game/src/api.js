var hotr = hotr || {};
hotr.api = {};
hotr.api.target = "http://localhost";
hotr.api.sTarget = "http://localhost";
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
			if (xhr.readyState == 4) {
				var response;
				try{
					response = JSON.parse(xhr.responseText);
				}catch(e){
					console.log("failed to parse:" + e);
					response = xhr.responseText;
				}
					
	            if (xhr.status == 200) {
	                cb(undefined, response);
	            } else {
	                cb(xhr.status,response);
	            }
	        }	
	}
    

	xhr.open(method, url);
	xhr.setRequestHeader("Content-type", "application/json")    	
	if (data){
		xhr.send(JSON.stringify(data));
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
	var url = hotr.api.makeUrl(hotr.api.sTarget,'/app/getblob/:token',arguments);
	hotr.api.get(url, callback);
}

hotr.api.createPlayer = function(id, pass, callback){	
	var url = hotr.api.makeUrl(hotr.api.target,'/app/createplayer/:id/:pass',arguments);
	hotr.api.get(url, callback);
}

hotr.api.getNewAuthTokenAndBlob = function(id, data, hash, callback){
	var url = hotr.api.makeUrl(hotr.api.target,'/app/gettokenandblob/:id/:data/:hash',arguments);
	hotr.api.get(url, callback);
}

hotr.api.saveBlob = function(token, blob, callback){
	var url = hotr.api.makeUrl(hotr.api.target, 'app/saveblob/:token', arguments);
	var data = blob;
	hotr.api.post(url,data,callback)
}