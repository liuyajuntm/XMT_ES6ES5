var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-annotation";

function anotation(){
	function parseAnotation(file){
		var str = file.contents.toString();
		var fieldReg = /@field\s*?(\S*?)\s*?(((let|const|export).*?)=\s*?\(([^\(]+?)\)\s*?=>)/g
		return str.replace(fieldReg,function(s0,s1,s2,s3,s4,s5){
			/*
			 * s0 : @field  newFunc1
			 *	export const func1 = (Type1 a, Type2 b)=>
			 * s1 : newFunc1
			 * s2 : export const func1 = (Type1 a, Type2 b)=>
			 * s3 : export const func1 
			 * s4 : export
			 * s5 : Type1 a, Type2 b
			*/
			var typeReg = /\s*?(\S+?)\s+?/;
			var Type = s5.match(typeReg);
			if(Type === ""){
				return s0;
			}
			else{
				Type = Type[1];
			}
			var nameArr = [];
			nameArr = s3.trim().split(" ");
			var oldName	= nameArr[nameArr.length - 1];
			var newName = s1 ? s1 : oldName;
			var params = s5.split(",");
			var index = 1;
			var newParams = "";
			for(index = 1; index < params.length; index ++){
				var param = params[index].trim().split(" ");
				if(index == params.length - 1){
					newParams += param[param.length - 1];
				}
				else{
					newParams += param[param.length - 1] + ",";
				}
			}
			var protoStr = Type + ".prototype." + newName + 
			" = function(" + newParams + ")\n{\n\treturn " + oldName + "(this";
			if(newParams !== ""){
				protoStr += "," + newParams + ");\n}\n\n";
			}
			else{
				protoStr += ");\n}\n\n";
			}
			return protoStr + s2;
		});
	}
	var stream = through.obj(function(file,enc,cb){
		var self = this;
		if(file.isBuffer()){
			var newStr = parseAnotation(file);
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

module.exports = anotation;