var json = {
	"joe":"iscool"
}

var json2 = {
	"joe2":"iscool"
}

var obj = [JSON.stringify(json),JSON.stringify(json)];


var objString = JSON.stringify(obj);

var obj2 = JSON.parse(objString);



var json22ndparse = JSON.parse(obj2.key2);

console.log(json22ndparse);