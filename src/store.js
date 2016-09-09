var data=require("dataset");

var {action,listen,unlistenAll,getter,registerGetter,unregisterGetter}=require("./model");

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
var filterAuthor=function(author,cb){
	filter(data.authors,author,cb);
}
var filterColl=function(coll,cb){
	filter(data.colls,coll,cb);
}
var filterTitle=function(title,cb){
	filter(data.titles,title,cb);
}
var totalTitle=function(nColl){
	return data.colltitles[nColl];
}
var decodeTitles=function(t){
	var arr=t.split(",").map(function(h){return parseInt(h,16)});
	for (var i=1;i<arr.length;i++){
		arr[i]+=arr[i-1];
	}
	return arr;

}
var titleByAuthor=function(nAuthor,cb){
	if (typeof nAuthor=="string"){
		nAuthor=data.authors.indexOf(nAuthor);
	}
	var titles=data.by[nAuthor];
	if ( data.by[nAuthor] &&typeof data.by[nAuthor]=="string"){
		 data.by[nAuthor]=decodeTitles(data.by[nAuthor]);
	}
	var nTitles=data.by[nAuthor]||[];
	var out=[];
	nTitles.forEach(function(nTitle){
		var title=data.titles[nTitle];
		var maintitle=nTitle;
		var title=data.titles[maintitle];
		while (data.titles[maintitle][0]=="!") {
			maintitle--;
			title=data.titles[maintitle]+title;
		}
		
		out.push([title,maintitle]);
	});
	cb(out);
}
var collOf=function(nTitle){
	var nColl=data.collOf(nTitle);
	if (nColl>=0) return [data.colls[nColl],nColl];
}
registerGetter("filterAuthor",filterAuthor);
registerGetter("titleByAuthor",titleByAuthor);
registerGetter("filterTitle",filterTitle);
registerGetter("filterColl",filterColl);
registerGetter("collOf",collOf);
registerGetter("totalTitle",totalTitle);