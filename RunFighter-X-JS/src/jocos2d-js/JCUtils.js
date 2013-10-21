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

jc.unitTypes = {
    "airGeneral":{
        "val":0,
        "title":"Versatile Air Unit",
        "desc":"Arial unit that attacks enemy air and ground units."
    },
    "air2Air":{
        "val":1,
        "title":"Air to Air Unit",
        "desc":"Arial unit that attacks only other enemy air."
    },
    "air2Ground":{
        "val":2,
        "title":"Air to Ground Unit",
        "desc":"Arial unit that has air to ground attack capabilities."
    },
    "ground2Ground":{
        "val":3,
        "title":"Ground to Ground Unit",
        "desc":"Grounded unit that attacks other ground units."
    },
    "groundGeneral":{
        "val":4,
        "title":"Versatile Ground Unit",
        "desc":"Grounded unit that attacks ground and air units."
    }
}

jc.getUnitType = function(id){
    for(var type in jc.unitTypes){
        if (jc.unitTypes[type].val == id){
            return jc.unitTypes[type];
        }
    }
}


jc.elementTypes = {
    "void":0,
    "water":1,
    "fire":2,
    "life":3,
    "none":4,
    "earth":5
}

jc.getElementType = function(id){
    for(var type in jc.elementTypes){
        if (jc.elementTypes[type] == id){
            return type;
        }
    }
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
    "4x4x4":[
        {"x":225,"y":225},
        {"x":225,"y":375},
        {"x":225,"y":525},
        {"x":225,"y":675},
        {"x":150,"y":225},
        {"x":150,"y":375},
        {"x":150,"y":525},
        {"x":150,"y":675},
        {"x":75,"y":225},
        {"x":75,"y":375},
        {"x":75,"y":525},
        {"x":75,"y":675},

    ]


};
