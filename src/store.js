var data=require("dataset");

var {action,store,getter,registerGetter,unregisterGetter}=require("./model");

var filter=function(strtable,tofind,cb){
	var out=[];
	var tf=new RegExp(tofind);
	for (var i=0;i<strtable.length;i++) {
		if (strtable[i].match(tf)) {
			out.push([strtable[i],i]);
		}
	}
	cb(out);
}
var filterauthor=function(author,cb){
	filter(data.authors,author,cb);
}
var filtercoll=function(coll,cb){
	filter(data.colls,coll,cb);
}
var filtertitle=function(title,cb){
	filter(data.titles,title,cb);
}
registerGetter("filterauthor",filterauthor);
registerGetter("filtertitle",filtertitle);
registerGetter("filtercoll",filtercoll);