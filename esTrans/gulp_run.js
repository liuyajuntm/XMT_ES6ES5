var child_process = require("child_process");

var gulpexec = child_process.exec("gulp");
gulpexec.stdout.on("data",function(data){
	console.log(data);
})
gulpexec.stderr.on("data",function(data){
	console.log(data);
})