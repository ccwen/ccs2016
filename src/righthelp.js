var React=require("react");
var E=React.createElement;
var RightHelp=React.createClass({
	render:function(){
		return E("div",{},
				E("h2",{},"　古籍目錄檢索"),
				E("div",{},"　資料庫: 劉寧慧 littlehateliu@gmail.com"),
				E("div",{},"　",E("a",{href:"https://github.com/ksanaforge/ccs2016",target:"_new"},"程式碼"),"：",
					E("a",{href:"http://www.ksana.tw",target:"_new"},"剎那工坊"),
				E("div",{},"　")	,
				E("div",{},"　輸入「文字」，查叢書、子目及作者名")	,
				E("div",{},"　輸入「@作者」，列出作者所有著作")	,
				E("div",{},"　輸入「數字」，跳到中國叢書綜錄頁碼")	
				)
			);
	}
})
module.exports=RightHelp;