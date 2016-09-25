/* 
 sort souyun chapter to archive id, convert to id-number_of_id
 convert titles. to simplified.
 search bookid.txt for match.
 put to book-archive.js array

*/
const fs=require("fs");
const sourcepath="souyun/";
const bookid=fs.readFileSync("bookid.txt","utf8").split(/\r?\n/);
var errorbooks=[];
const compressChapter=function(chapters,id){
	chapters.sort();
	var first,now,p=0,cont=true,idarr=[];
	for (var i=0;i<chapters.length;i++) {
		now=parseInt(chapters[i],10);
		if (p && now-1!==p) {
		//	console.log("book",id,"not continue",p,now);
			cont=false;
			errorbooks.push(id);
		}
		if (!p) first=now;
		p=now;
		idarr.push(now);
	}
	if (cont) return first+"-"+(now-first);
	else return idarr.join("|");
}
const findChapter=function(book){
	var id=parseInt(book,10);

	var fn=sourcepath+id+".txt";
	if (!fs.existsSync(fn)) {
		console.log(id,"not exists");
		return;
	}
	var chapters=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	var chapterrange=compressChapter(chapters,id);
	at=book.indexOf(",");
	return book.substr(at+1)+","+chapterrange;
}
books=bookid.map(findChapter);
books=books.sort((a,b)=>a>b?1:(a<b)?-1:0);
fs.writeFileSync("book-archive.txt",books.join("\n"),"utf8");
fs.writeFileSync("errorbooks.txt",errorbooks.join("\n"),"utf8")