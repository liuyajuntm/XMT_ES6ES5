import {B, write} from "./b"
import {C} from "./a/c"

let onload = (TypeTest1 uselessa, TypeTest2 useless)=>{
	let b = new B();
	b.newWrite("from newWrite");
	write(b, "<\p>from write");
	let c = new C();
	b.newWrite("<\p> c.getm() from a : " + c.getm());
	b.newWrite("<\p> c.getn from a : " + c.getn);
}
onload();