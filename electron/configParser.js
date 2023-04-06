const fs = require('fs');
const {jsonc} = require('jsonc');

function readConfig(file) {
	let json = jsonc.parse(fs.readFileSync(file, "utf-8"));
	let newJson = deepReplace(json, (obj) => {
		if (typeof obj === "string") {
			if (obj[0] === "$") {
				return readConfig(`config/${obj.substring(1)}`);
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