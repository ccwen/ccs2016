var React=require("react");
var E=React.createElement;
var RightHelp=React.createClass({
	render:function(){
		return E("div",{},
				E("h2",{},"　古籍目錄檢索"),
				E("div",{},"　資料庫: 劉寧慧 littlehateliu@gmail.com"),
				E("div",{},"　",E("a",{href:"https://github.com/ksanaforge/ccs2016",target:"_new"},"程式碼"),"：",
					E("a",{href:"http://www.ksana.tw",target:"_new"},"剎那工坊")
				)
			);
	}
})
module.exports=RightHelp;