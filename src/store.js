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
var contentOf=function(nColl){
	//find up content with markups
	return data.contentOf(nColl);
}
var collCaption=function(nColl){
	return data.colls[nColl];
}
var libCaption=function(nLib){
	return data.libs[nLib];
}
var authorCaption=function(nAuthor){
	return data.authors[nAuthor];
}
var titleCaption=function(nTitle){
	return data.titles[nTitle];
}
var firstTitle=function(nColl){
	return data.collFirstTitle[nColl];
}
var firstTitleOfPage=function(nPage){
	return data.firstTitleOfPage(nPage);
}

var dynastyByCode=function(dyn){
	return data.dynastyByCode(dyn);
}
var expandVariant=function(tofind){
	var tf="",i=0;
	while (i<tofind.length){
		var code=tofind.charCodeAt(i);
		var ch=tofind[i];
		if (code>=0xd800&&code<=0xdfff){
			ch+=tofind[++i];
		}
		tf+=data.variants[ch]?"["+ch+data.variants[ch]+"]":ch;
		i++;
	}
	return new RegExp(tf);
}
var getPDF=function(titleid){
	return data.archive[titleid];
}
registerGetter("filterAuthor",filterAuthor);
registerGetter("titleByAuthor",titleByAuthor);
registerGetter("filterTitle",filterTitle);
registerGetter("filterColl",filterColl);
registerGetter("collOf",collOf);
registerGetter("totalTitle",totalTitle);
registerGetter("contentOf",contentOf);
registerGetter("collCaption",collCaption);
registerGetter("titleCaption",titleCaption);
registerGetter("libCaption",libCaption);
registerGetter("authorCaption",authorCaption);
registerGetter("firstTitle",firstTitle);
registerGetter("firstTitleOfPage",firstTitleOfPage);
registerGetter("dynastyByCode",dynastyByCode);
registerGetter("expandVariant",expandVariant);
registerGetter("getPDF",getPDF);