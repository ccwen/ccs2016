/* generate book name to archive.org book id mapping*/

/* 四庫 
juan 16   , page 9 , column 0, line 3, ch 6 bits

36304 冊, 16 bits 
(平均63頁) 個別目錄有到300頁，9 bits

34 bits 
range :52 bits 

download link
https://archive.org/download/06048509.cn/06048509.cn.pdf

*/
const request=require("request");
const targetpath='souyun/'
const fs=require('fs');
const indexes=["ji","shi","zi","ji","other"];
var books=[];
var errorfetch=[];
const downloadindex=function(index){
	const content=fs.readFileSync("souyun-index/"+index+".html","utf8");
	content.replace(/eBookIndex\.aspx\?id=(.*?)'>(.*?)<\/a>/g,function(m,id,title){
			books.push([id,title]);
	});
}
var now=0;
const extractArchiveUrl=function(id,content){
	var out=[],vids={};
	content.replace(/archive.org\/stream\/(.*?)\.cn' target='_blank'>(.*?)<\/a>/g
		,function(m,vid,vol){
			if (!vids[vid]){
				out.push([vid,vol]);	
			}
			vids[vid]=true;
	});
	return out;
}
const fetch=function(){
	const id=books[now][0]
	const tfn=targetpath+id+".txt";
	const url='http://sou-yun.com/eBookIndex.aspx?id='+id;

	if (fs.existsSync(tfn)){
    setTimeout(function(){
    	now++;
    	fetch();	
    },1);
    return;
	}
	request({url}, function (error, response, body) {
	  if (error || response.statusCode !== 200) {
	  	errorfetch.push(books[now]);
	  }
	  const vols=extractArchiveUrl(id,body);
	  console.log(now,"/",books.length,"saving ",id,"vol count",vols.length)
	  fs.writeFileSync(tfn,vols.join("\n"),"utf8");
		if (now<books.length) {
	    setTimeout(function(){
	    	now++;
	    	fetch();	
	    },100);
		}	
	})
}
indexes.forEach(downloadindex);
fs.writeFileSync("bookid.txt",books.join("\n"),"utf8");
fetch();


fs.writeFileSync("errorfetch.txt",errorfetch.join("\n"),"utf8");