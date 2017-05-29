var js2xmlparser = require("js2xmlparser");
var parseString = require('xml2js').parseString;
var util = require('util');
var inspect = util.inspect;
var fs = require('fs');

function Omi() {
    
}

// QLM.read('MistNetwork/Nodes/Joystick', 'axis0')
// QLM.read('MistNetwork/Nodes/Joystick', 'axis0', { ttl: -1 })
Omi.read = function(path, infoitem, opts) {
    if(!opts) { opts = {}; }
    path = path.split('/');
    var req = {
        '@': {
            'xmlns:xs': "http://www.w3.org/2001/XMLSchema-instance",
            'xmlns:omi': "omi.xsd",
            version: "1.0",
            ttl: opts.ttl ? opts.ttl : "0"
        },
        "read": [
            {
                "@": {
                    xmlns: "omi.xsd",
                    msgformat: "odf"
                },
                "omi:msg": [
                    {
                        Objects: [
                            {
                                "@": {
                                    "xmlns": "odf.xsd"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    

    var pos = req.read[0]['omi:msg'][0]['Objects'][0];
    
    for(var cur;(cur = path.shift());!cur) {
        var object = [{
            id: [cur]
        }];
        pos.Object = object;
        pos = object[0];
    }
    
    if(infoitem) {
        var it = [{"@": { "name": infoitem } }];
        pos.InfoItem = it;
    }
    
    return Omi.omiXml(req);
};

Omi.subscribe = function(path, infoitem, opts) {
    if(!opts) { opts = {}; }
    path = path.split('/');
    var req = {
        '@': {
            'xmlns:xs': "http://www.w3.org/2001/XMLSchema-instance",
            'xmlns:omi': "omi.xsd",
            version: "1.0",
            ttl: opts.ttl ? opts.ttl : "0"
        },
        "read": [
            {
                "@": {
                    xmlns: "omi.xsd",
                    msgformat: "odf",
                    callback: opts.callback ? opts.callback : "0",
                    interval: opts.interval ? opts.interval : "-1"
                },
                "omi:msg": [
                    {
                        Objects: [
                            {
                                "@": {
                                    "xmlns": "odf.xsd"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    

    var pos = req.read[0]['omi:msg'][0]['Objects'][0];
    
    for(var cur;(cur = path.shift());!cur) {
        var object = [{
            id: [cur]
        }];
        pos.Object = object;
        pos = object[0];
    }
    
    if(infoitem) {
        var it = [{"@": { "name": infoitem } }];
        pos.InfoItem = it;
    }
    
    return Omi.omiXml(req);
};

// QLM.write('MistNetwork/Nodes/Joystick', 'axis0', value)
Omi.write = function(path, infoitem, value, opts) {
    if(!opts) { opts = {}; }
    path = path.split('/');
    var req = {
        '@': {
            'xmlns:xs': "http://www.w3.org/2001/XMLSchema-instance",
            'xmlns:omi': "omi.xsd",
            version: "1.0",
            ttl: opts.ttl ? opts.ttl : "0"
        },
        "write": [
            {
                "@": {
                    xmlns: "omi.xsd",
                    msgformat: "odf"
                },
                "omi:msg": [
                    {
                        Objects: [
                            {
                                "@": {
                                    "xmlns": "odf.xsd"
                                }                                
                            }
                        ]
                    }
                ]
            }
        ]
    };
    

    var pos = req.write[0]['omi:msg'][0]['Objects'][0];
    
    for(var cur;(cur = path.shift());!cur) {
        var object = [{
            id: [cur]
        }];
        pos.Object = object;
        pos = object[0];
    }
    
    var types = {
        'string': 'xs:string',
        'number': 'xs:decimal',
        'boolean': 'xs:boolean'
    };
    
    var it = [
        {
            "@": {
                "name": infoitem                
            },
            value: [{ '@': {"type": types[typeof value] || 'xs:string'}, '#': value }]
        }
    ];
    
    pos.InfoItem = it;
    
    return Omi.omiXml(req);
};

Omi.omiXml = function(req) {
    return js2xmlparser("omi:omiEnvelope", req, { prettyPrinting: { indentString: '  ' } });
};

Omi.parse = function(req) {
    
    var out;
    
    parseString(req, {attrkey: '@', emptyTag: {}}, function (err, result) {
        if (err) {
            console.log('error:', err, result);
            out = 'Error!!';
            return;
        }
        
        //console.log("we got this:", err, result);
        out = result;
    });    
    return out;
};

Omi.prototype.subscribe = function(ttl) {};


module.exports = { Omi: Omi };