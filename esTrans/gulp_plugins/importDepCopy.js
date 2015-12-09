var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-importDepCopy";

function importDepCopy(){

	function parseImport(file){
		var nameSuffix = 0;
		var str = file.contents.toString();
		var importReg = /import\s+?{(.+?)}\s+?from\s+?(\"|\')(.+?)(\"|\')/g
		return str.replace(importReg, function(s0, s1, s2,s3,s4){
			/*
			 * s0 : import {B, A as AA } from "./b"
			 * s1 : B, A as AA 
			 * s2 : "
			 * s3 : ./b
			 * s4 : "
			 */
			nameSuffix ++;
			var exportInfos = [];
			exportsArgs = s1.split(",");
			exportsArgs.forEach(function(ele){
				var eleArgs = ele.trim().split(" ");
				var oldName = eleArgs[0];
				var tempName = "_$"+oldName+ nameSuffix +"$_";
				var scopeName = "_$_"+oldName+"_$_";
				var newName = "";
				if(eleArgs.length > 1){
					newName = eleArgs[eleArgs.length - 1];
				}
				else{
					newName = eleArgs[0];
				}
				exportInfos.push({
					oldName: oldName,
					tempName: tempName,
					newName: newName,
					scopeName: scopeName
				});
			});

			var newStr = "import {";
			exportInfos.forEach(function(ele){
				newStr += ele.oldName + " as " + ele.tempName + ",";
			})
			newStr = newStr.substr(0, newStr.length - 1);
			newStr += "} from \"" + s3 + "\";\n\n";

			exportInfos.forEach(function(ele){
				newStr += "let " + ele.newName + " = " + ele.tempName + ";\n" + 
				"if(" + ele.newName + "&&" + ele.newName + ".prototype  && " + ele.newName + ".prototype.constructor && "+
				ele.newName + ".toString() &&"	+ "(/_classCallCheck/).test(JSON.stringify(" + ele.newName + ".toString()))" + "){\n" +
				"\tlet " + ele.scopeName + " = new Function();\n" + 
				"\t" + ele.scopeName + ".prototype = new " + ele.newName + "();\n" + 
				"\t" + ele.scopeName + ".prototype.constructor = " + ele.scopeName + ";\n" + 
				"\t" + ele.newName + " = " + ele.scopeName + ";\n" +
				"}\n\n";
			})
			return newStr;
		})
	}

	var stream = through.obj(function(file,enc,cb){
		var self = this;
		if(file.isBuffer()){
			var newStr = parseImport(file);
			file.contents = new Buffer(newStr);
		}
		if(file.isStream()){
			this.emit('error', new PluginError(PLUGIN_NAME, 'stream not supported!please use buffer'));
		}
		this.push(file);
		cb();
	});
	return stream;
}

module.exports = importDepCopy;