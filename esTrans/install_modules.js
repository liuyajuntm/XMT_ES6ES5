var child_process = require("child_process");

console.log("downloading...");

var gulpexec = child_process.exec("npm install");
gulpexec.stdout.on("data",function(data){
	console.log(data);
})
gulpexec.stderr.on("data",function(data){
	console.log(data);
})