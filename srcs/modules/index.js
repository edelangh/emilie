

var modules = [];

modules.push(require("./shopping").module);
modules.push(require("./alarm").module);
modules.push(require("./exit").module);

exports.modules = modules;
