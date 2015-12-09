import {write as writec, C}  from "a/c"

export class B {
	constructor(){
		this.x = 2;
	}
}


@field newWrite
export const write = (B b, str)=>{
	writec(str + b.x);
}

@field
const getn = (C c)=>{
	return c.n;
}

let c = new C();
alert("c.getn from b : " + c.getn());