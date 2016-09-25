const React=require("react");
E=React.createElement;
const clickpdf=function(e){
	var t=e.target;
	if (!e.target.dataset['id']) t=t.parentElement; //deal with highlight text
	var select=t.nextSibling;
	if (!t.nextSibling) {
		select=t.childNodes[t.childNodes.length-1];
	}

	const option=select.options[select.selectedIndex];
	var pdf=option.dataset.pdf;
	pdf&&openpdf(pdf);
}
const url="https://archive.org/download/@.cn/@.cn.pdf";
const openpdf=function(pdf){
	var u=url.replace(/@/g,pdf);
	window.open(u);
}
const clickonepdf=function(e){
	var pdf=e.target.dataset.pdf;
	if (!pdf) pdf=e.target.parentElement.dataset.pdf;
	pdf&&openpdf(pdf);
}
const nop=function(e){
	e.preventDefault();
	e.stopPropagation();
};
const renderChapter=function(pdf,title){
	var chapters=pdf.split(",");
	var i;
	if (chapters.length==1) {
		var c=chapters[0];
		const len=c.length;
		var at=c.indexOf('-');
		if (at>-1) {
			count=parseInt(c.substr(at+1),10);
			c=parseInt(c.substr(0,at));
			chapters=[];
			for (i=0;i<count;i++) {
				nextid="0000000"+(c+i);
				nextid=nextid.substr(nextid.length-at);
				chapters.push(nextid);
			}
		}
	}
	var out=[];
	if (chapters.length>1) {
		for (var i=0;i<chapters.length;i++) {
			out.push(E("option",{key:i,"data-pdf":chapters[i]},"第"+(i+1)+"冊"));
		}
		return E("span",{"data-id":"pdf",onClick:clickpdf},title,[
			 E("span", {key:"button",className:"pdf"},"　"),
			,E("select",{key:"select",className:"chapterselect",onClick:nop},out)
			]);		
	} else {
		return E("span",{"data-pdf":chapters[0],onClick:clickonepdf},title,
			 E("span", {key:"button",className:"pdf"},"　")
			);
	}
}
const renderPDF=function(obj,nTitle,title){
	var pdf=this.context.getter("getPDF",nTitle);
	if(pdf) {
		obj.className="pdftitle"
		//obj["data-pdf"]=pdf;
		//obj.onClick=openpdf;
		return E("span",obj,renderChapter(pdf,title));
	} else {
		return E("span",obj,title);
	}
}

module.exports=renderPDF;