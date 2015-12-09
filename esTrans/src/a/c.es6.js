import * as d  from "a/d"

export const write = (str)=>{
	d.write(str + " from c ");
}

export class C{
	constructor(){
	this.m = 2;
	this.n = 3;
	}
}

@field
const getm = (C c)=>{
	return c.m;
}