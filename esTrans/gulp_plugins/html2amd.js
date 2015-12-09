var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var fs = require("fs");
var File = require('vinyl');

var PLUGIN_NAME = 'gulp-html2amd';

function html2amd(){

	function addamd(file, self){
		var str = file.contents.toString();
		var reg = /<\s*?script.*?(src\s*?=\s*?["']\s*?(((\S+?[//])*)(\S+?)\.(e|E)(s|S)6\.(j|J)(s|S))\s*?["']).*?>/g
		var newStr = str.replace(reg, function(s0,s1,s2,s3,s4,s5){
			/*
			*s1 : src = "../xx/a.es6.js";
			*s2 : ../xx/a.es6.js
			*s3 : ../xx/
			*s4 ：xx/
			*s5 : a
			*/
			var pathReg = /((\S+?\\)+)(\S+?\.html)/;
			var history = file.history.toString();
			var path = history.replace(pathReg,function(s0,s1,s2,s3){
				/*
				*s0 : f:\pijs_component\td\plugin\htdocs\pi\.res\test\index.html
				*s1 : f:\pijs_component\td\plugin\htdocs\pi\.res\test\
				*s2 : test\
				*s3 : index.html
				*/
				return s1;
			})
			var mainjs = new File({
		        cwd: file.cwd,
		        base: file.base,
		        path: path + s5 + "_main.js",
		        contents: new Buffer("require(['" + s3 + s5 + "'],function(){});"),
		        stat: {
		          isFile: function () { return true; },
		          isDirectory: function () { return false; },
		          isBlockDevice: function () { return false; },
		          isCharacterDevice: function () { return false; },
		          isSymbolicLink: function () { return false; },
		          isFIFO: function () { return false; },
		          isSocket: function () { return false; }
		        }
		      });
      		self.push(mainjs);

      		var requirejs = new File({
		        cwd: file.cwd,
		        base: file.base,
		        path: path + "require.js",
		        contents: fs.readFileSync("./require.js"),
		        stat: {
		          isFile: function () { return true; },
		          isDirectory: function () { return false; },
		          isBlockDevice: function () { return false; },
		          isCharacterDevice: function () { return false; },
		          isSymbolicLink: function () { return false; },
		          isFIFO: function () { return false; },
		          isSocket: function () { return false; }
		        }
		      });
      		self.push(requirejs);
			
			var str =  s0.replace(s1, s1 + ' data-main = "' + s3 + s5+'_main"');
			return str.replace(s2, "require.js");
		})
		return newStr;
	}

	var stream = through.obj(function(file,enc,cb){
		var self = this;
		if(file.isBuffer()){
			var newStr = addamd(file,self);
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

module.exports = html2amd;