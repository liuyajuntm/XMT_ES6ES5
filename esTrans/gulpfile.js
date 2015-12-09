var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemap = require("gulp-sourcemaps");
var html2amd = require("./gulp_plugins/html2amd");
var param2es5 = require("./gulp_plugins/param2es5");
var annotation = require("./gulp_plugins/annotation");
var importDepCopy = require("./gulp_plugins/importDepCopy");
var rename = require("gulp-rename");
var stripcomments = require("gulp-strip-comments");

var srcRoot = "./src/",destRoot = "./dst";

gulp.task("ES62AMD",function(){

	gulp.src(srcRoot+"**/*\.{e,E}{s,S}6\.{j,J}{s,S}").
	pipe(rename(function(path){
		baseNameReg =/(\S+?)(\.(e|E)(s|S)6)/;
		path.basename = path.basename.replace(baseNameReg,function(s0,s1){
			return s1;
		});})).
	pipe(stripcomments()).   //删除注释
	// pipe(importDepCopy()).
	pipe(annotation()).//注解
	pipe(param2es5()).//去掉
	pipe(sourcemap.init()).
	pipe(babel({
			"plugins": ["transform-es2015-modules-amd",
			"transform-es2015-arrow-functions",
			"transform-es2015-block-scoped-functions",
			"transform-es2015-block-scoping",
			"transform-es2015-classes",
			//"transform-es2015-computed-properties",
			"transform-es2015-constants",
			"transform-es2015-destructuring",
			"transform-es2015-for-of",
			//"transform-es2015-function-name",
			"transform-es2015-literals",
			"transform-es2015-object-super",
			"transform-es2015-parameters",
			// "transform-es2015-shorthand-properties",
			// "transform-es2015-spread",
			// "transform-es2015-sticky-regex",
			"transform-es2015-template-literals",
			"transform-es2015-typeof-symbol",
			"transform-es2015-unicode-regex",
			"transform-regenerator"
		]
	})).
	pipe(sourcemap.write(".")).
	pipe(gulp.dest(destRoot));
})

gulp.task("HTML2AMD",function(){
	gulp.src(srcRoot+"**/*.html").
	pipe(html2amd()).
	pipe(gulp.dest(destRoot));
})


gulp.task("default",["HTML2AMD","ES62AMD"],function(){
	console.log("compiled");
	gulp.watch(srcRoot+"**/*",function(event){
		gulp.run("HTML2AMD","ES62AMD",function(){
			console.log("compiled");
		})
	})
});
