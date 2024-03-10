const fs = require('fs');
const {jsonc} = require('jsonc');

function readConfig(file) {
	preprocessors = new Set();
	let config = readConfigRecursive(file, preprocessors);
	for (let p of preprocessors) {
		let [field, preprocessor] = p.split("@");
		if (config.preprocessors[field] === undefined) {
			config.preprocessors[field] = [];
		}
		let args;
		let func = preprocessor;
		if (preprocessor.indexOf("/") === -1) {
			args = [];
		}
		else {
			let arglist;
			[func, arglist] = preprocessor.split("/");
			args = arglist.split(",").map(eval);
		}
		config.preprocessors[field].push({
			suffix: preprocessor,
			func: func,
			args: args
		});
	}
	return config;
}

function readConfigRecursive(file, preprocessors) {
	let json = jsonc.parse(fs.readFileSync(file, "utf-8"));
	let newJson = deepReplace(json, (obj) => {
		if (typeof obj === "string") {
			if (obj[0] === "$") {
				return readConfigRecursive(`config/${obj.substring(1)}`, preprocessors);
			}
			else if (obj.indexOf("@") !== -1) {
				preprocessors.add(obj);
			}
		}
		return obj;
	});
	return newJson;
}

function deepReplace(obj, callback) {
	if (obj instanceof Array) {
		return obj.map(e => {
			return deepReplace(e, callback);
		});
	}
	if (obj instanceof Object) {
		let newObj = {};
		Object.keys(obj).forEach(k => {
			newObj[k] = deepReplace(obj[k], callback);
		});
		return newObj;
	}
	return callback(obj);
}

module.exports = readConfig;