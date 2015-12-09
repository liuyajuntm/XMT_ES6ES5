var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-param2es5";

function param2es5(){

	function deleteType(file){
		var str = file.contents.toString();
		var paramsReg = /(\(([^\(\"\']+?)\)\s*?=>)|(constructor\s*?\(([^\(\"\']+?)\))/g;
		return str.replace(paramsReg, function(s0,s1,s2,s3,s4,s5,s6){
			/*
			*S0: (TypeA1 a    , TypeB1 b  )=> or constructor(TypeA1|TypeC1 a    , b  )
			*S1：(TypeA1 a    , TypeB1 b  )=>
			*S2: TypeA1 a    , TypeB1 b  
			*S3: constructor(TypeA1|TypeC1 a    , b  )
			*S4: TypeA1|TypeC1 a    , b  
			*/
			var params = [];
			var isArrowFunc = false;
			var newParams = "";
			if(s1 !== undefined){
				isArrowFunc = true;
				params = s2.split(",");
				newParams = "("
			}
			else{
				params = s4.split(",");
				newParams = "constructor("
			}

			var index = 0;
			for(index = 0; index < params.length; index ++){
				var param = params[index].trim().split(" ");
				if(index == params.length - 1){
					if(isArrowFunc){
						newParams += param[param.length - 1] + ")=>";
					}
					else{
						newParams += param[param.length - 1] + ")";	
					}
				}
				else{
					newParams += param[param.length - 1] + ",";
				}
			}
			return newParams;
		})

	}

	var stream = through.obj(function(file,enc,cb){
		var self = this;
		if(file.isBuffer()){
			var newStr = deleteType(file);
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

module.exports = param2es5;