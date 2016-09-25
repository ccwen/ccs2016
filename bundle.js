(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\ksana2015\\ccs2016\\index.js":[function(require,module,exports){
var React=require("react");
var ReactDOM=require("react-dom");
require("ksana2015-webruntime/livereload")(); 
var ksanagap=require("ksana2015-webruntime/ksanagap");
ksanagap.boot("ccs2016",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=ReactDOM.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"C:\\ksana2015\\ccs2016\\src\\main.jsx","ksana2015-webruntime/ksanagap":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js","ksana2015-webruntime/livereload":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js","react":"react","react-dom":"react-dom"}],"C:\\ksana2015\\ccs2016\\src\\archivepdf.js":[function(require,module,exports){
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
},{"react":"react"}],"C:\\ksana2015\\ccs2016\\src\\authorresult.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxButton=10;
var styles={
	authorbutton:{fontSize:"80%"}
}
var AuthorResult=React.createClass({displayName: "AuthorResult",
	contextTypes:{
		action:PT.func.isRequired
	},
	listBookByAuthor:function(e){
		var author=e.target.dataset.author;
		this.context.action("setTofind","@"+author);
	},
	renderAuthorButton:function(){
		var authors=this.props.authors;
		var max=authors.length;
		var out=[];
		if (max>MaxButton) max=MaxButton;
		for (var i=0;i<max;i++) {
			var item=authors[i];
			out.push(E("button",{key:i,style:styles.authorbutton
					,onClick:this.listBookByAuthor
					,"data-author":item[0]}
				,item[0]));
		}
		return out;
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.authors!==this.props.authors);
	}
	,getDefaultProps:function(){
		return {authors:[]}
	}
	,renderCount:function(){
		if (this.props.authors.length<MaxButton) return;
		return E("span",{},"還有"+(this.props.authors.length-MaxButton),"位出者未列出")
	}
	,render:function(){
		return E("div",{},
			this.renderAuthorButton(),
			this.renderCount()
		)
	}
});
module.exports=AuthorResult;

},{"react":"react"}],"C:\\ksana2015\\ccs2016\\src\\bookview.js":[function(require,module,exports){
var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var MaxRange=150;
const archivePDF=require("./archivepdf");
var styles={
	scroller:{height:"100%",overflowY:"auto",overflowWrap:"normal"}
}
var SearchPanel=React.createClass({displayName: "SearchPanel",
	getInitialState:function(){
		return {nColl:0,nTitle:0}
	},
	contextTypes:{
		action:PT.func.isRequired,
		listen:PT.func.isRequired,
		getter:PT.func.isRequired
	}
	,componentDidMount:function(){
		this.context.listen("showColl" ,this.showColl, this);
		this.context.listen("showPage" ,this.showPage, this);
		this.context.listen("showTitle" ,this.showTitle, this);
	}
	,showColl:function(nColl){
		nColl=parseInt(nColl);
		var nTitle=this.context.getter("firstTitle",nColl);
		this.scrollto='t'+nTitle;
		this.setState({nColl,nTitle,showloading:true});
	}
	,showPage:function(nPage){
		var first=this.context.getter("firstTitleOfPage",parseInt(nPage)-1);
		this.scrollto='pg'+nPage;//overwrite scrollto
		this.showTitle(first);
	}
	,componentDidUpdate:function(){
		if (this.scrollto && !this.state.showloading) {
			var ele=this.refs[this.scrollto];
			ele&&ele.scrollIntoView();
			//move slightly above coll floating
			this.unhideCollCaption();
			this.scrollto=null;
		}
	}
	,showTitle:function(nTitle){
		nTitle=parseInt(nTitle);
		if (isNaN(nTitle))return;
		var nColl=this.context.getter("collOf",nTitle);
		this.scrollto='t'+nTitle;
		this.setState({nTitle,nColl:nColl[1],showloading:true});
	}
	,searchAuthor:function(e){
		this.context.action("setTofind","@"+e.target.innerHTML);
	}
	,componentWillUnmount:function(){
		this.context.unlistenAll(this);
	}
	,renderVersion:function(line,key){
		return E("span",{className:"version",key}
			,line.replace("((","").replace("))",""));
	}
	,renderLib:function(line,key){
		line=line.substring(1,line.length-1);
		var libs=line.split(",");
		var out=[];
		if (!libs.length)return;
		for (var i=0;i<libs.length;i++) {
			var libCaption=this.context.getter("libCaption",libs[i])||"";
			out.push(E("option",{key:i},libCaption+" "));
		}
		return [E("span",{className:"version"},"，",libs.length,"館藏"),
						E("select",{className:"lib",key},out)];
	}

	,renderBookTitle:function(line,key,opts){
		var i=0,out=[],text="";;
		var emitNormalText=function(key){
			if (text&inrange) {
				out.push(E("span",{key:'t'+key},text));
				text="";
			}
		}
		while (i<line.length){
			var inrange=(Math.abs(this.state.nTitle-opts.nTitle)<MaxRange);

			if (line[i]=="@") {
				emitNormalText(i);
				var title=this.context.getter("titleCaption",opts.nTitle);
				var obj={className:"title",key:i};
				if (opts.nTitle==this.state.nTitle) {
					obj.ref='t'+opts.nTitle;
					obj.className='title_hl';
				}
				if (title[0]=="!") title=title.substr(1);
				if (title[0]=="-") title="　"+title.substr(1);
				inrange&&out.push(archivePDF.call(this,obj,opts.nTitle,title));

				var m=line.substr(i+1).match(/^(\d+)/);
				if (m) {
						inrange&&out.push(E("span",{className:"juan",key:'j'+i},m[0],"卷 "));
						i+=m[0].length;
				}
				opts.nTitle++;
				if (this.state.nTitle-opts.nTitle==MaxRange) {
					out.push(E("span",{key:'w'+i,className:"warning"},"以上子目隱藏"));	
				}
				if (opts.nTitle-this.state.nTitle==MaxRange) {
					out.push(E("span",{key:'w'+i,className:"warning"},"以下子目隱藏"));
				}					
			} else if (line[i]=="#"){
				emitNormalText(i);
				var m=line.substr(i+1).match(/([0-9a-f]+)/);
				if (m) {
					var nAuthor=parseInt(m,16);
					var author=this.context.getter("authorCaption",nAuthor);
					inrange&&out.push(E("span",{className:"author",key:'a'+i,
						onClick:this.searchAuthor},author+" "));
					i+=m[0].length;
				}
			} else {
				var m=line.substr(i,2).match(/^[A-Z]+/);
				if (m) {
					var dyn=this.context.getter("dynastyByCode",m[0]);
					if (dyn) {
						emitNormalText(i);
						i+=(m[0].length-1);
						inrange&&out.push(E("span",{className:"dyn","data-n":'d'+i,key:'d'+i},dyn));
					} else{
						text+=m[0];
						i+=(m[0].length-1);
					}
				} else {
					text+=line[i];	
				}
			}
			
			i++;
		}
		emitNormalText();
		return E("div",{key},out);
	}
	,renderPageNumber:function(page,key){
		return E("div",{className:"page",key,ref:'pg'+page},"綜錄第",page,"頁");
	}
	,unhideCollCaption:function(){
		ReactDOM.findDOMNode(this.refs.scroller).scrollTop-=60;
	}
	,onSelectCat:function(e){
		var idx=e.target.selectedIndex;
		var nTitle=this.refs['cat'+idx].dataset.title;
		this.showTitle(nTitle);
	}
	,renderCategory:function(category,idx,defaultValue){
		if (!category.length)return null;
		return E("select",{key:idx,className:"category",
			onChange:this.onSelectCat,defaultValue},
			category.map(function(cat,key){
				return E("option",{key},cat);
			})
		)
	}
	,onCatClick:function(e){
		this.showTitle(e.target.dataset.title);
	}
	,renderContent:function(){
		var selectedCat="";
		var content=this.context.getter("contentOf",this.state.nColl);
		var out=[],category=[],category_select=null,collCaption;
		var opts={nTitle:this.context.getter("firstTitle",this.state.nColl)};
		for (var i=0;i<content.length;i++){
			var line=content[i];
			if (line[0]=="$") {
				var coll=this.context.getter("collCaption",this.state.nColl);
				collCaption=line.replace("$","");
				out.push(E("div",{key:i+'br1'},"　"));
				out.push(E("div",{key:i+'br2'},"　"));
			} else {
				if (line.indexOf("((")>-1) {
					out.push(E("br",{key:i}));
					out.push(this.renderVersion(line,"v"+i));
				} else if (line.indexOf("(")>-1){
					out.push(this.renderLib(line,i));
				} else if (line.indexOf("@")>-1||line.indexOf("#")>-1) {
					out.push(this.renderBookTitle(line,i,opts));
				} else if (line[0]=="~") {
					out.push(this.renderPageNumber(line.substr(1),i));
				} else {
					if (line.trim()){
						var cat=line.replace("%","").trim();
						var obj={key:'cat'+category.length,"data-title":opts.nTitle,ref:'cat'+category.length,
						className:"clickable_cat",onClick:this.onCatClick};
						out.push(E("div",obj,cat));
						if (this.state.nTitle>=opts.nTitle) {
							selectedCat=cat;
						}
						category.push(cat);
					}
				}
			}
		}
		//insert subcategory dropdown collname
		category_select=this.renderCategory(category,"cat",selectedCat);
		//add floating coll caption with category selector
		out.unshift(E("div",{className:"floatingColl",key:"coll"},
				E("span",{style:styles.coll},coll,collCaption)
				,category_select)
				);

		return out;
	}
	,startRendering:function(){
		if (this.state.showloading) {
			//show loading message,huge collection might take a while
			var coll=this.context.getter("collCaption",this.state.nColl);
			setTimeout(function(){
				this.setState({showloading:false});
			}.bind(this),5);
			return "Loading "+coll; 
		}
		return this.renderContent();
	}
	,render:function(){
		return E("div",{ref:"scroller",style:styles.scroller},this.startRendering());
	}
});
module.exports=SearchPanel;
},{"./archivepdf":"C:\\ksana2015\\ccs2016\\src\\archivepdf.js","react":"react","react-dom":"react-dom"}],"C:\\ksana2015\\ccs2016\\src\\collresult.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;

var CollResult=React.createClass({displayName: "CollResult",
	getDefaultProps:function(){
		return {colls:[]}
	}
	,propType:{
		highlight:PT.func.isRequired,
		colls:PT.array.isRequired
	},
	contextTypes:{
		action:PT.func.isRequired,
		getter:PT.func.isRequired
	}
	,goColl:function(e){
		this.context.action("showColl",e.target.dataset.n);
	},
	renderTitle:function(nColl){
		var total=this.context.getter("totalTitle",nColl);
		return E("button",{onClick:this.goColl,"data-n":nColl},total);
	},
	renderItem:function(item,key){
		return E("div",{key,className:"coll"}
			,key+1+".",this.props.highlight(item[0]),this.renderTitle(item[1]));
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.colls!==this.props.colls);
	}

	,render:function(){
		var colls=this.props.colls;
		if (this.props.colls.length>MaxItem) {
			colls=this.props.colls.slice(0,MaxItem);
		}
		return E("div",{},
			colls.map(this.renderItem)
		)
	}
});
module.exports=CollResult;

},{"react":"react"}],"C:\\ksana2015\\ccs2016\\src\\main.jsx":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var SearchPanel=require("./searchpanel");
var BookView=require("./bookview");
var {action,listen,unlistenAll,getter,registerGetter,unregisterGetter}=require("./model");

var styles={
  container:{display:"flex"},
  searchpanel:{flex:1},
  bookview:{flex:1}
}
var maincomponent = React.createClass({displayName: "maincomponent",
  getInitialState:function() {
    return {};
  }
  ,childContextTypes: {
    listen: PT.func
    ,unlistenAll: PT.func
    ,action: PT.func
    ,getter: PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,getChildContext:function(){
    return {action,listen,unlistenAll,getter,registerGetter,unregisterGetter};
  }
  ,render: function() {
    return E("div",{style:styles.container},
      E("div",{style:styles.searchpanel},E(SearchPanel)),
      E("div",{style:styles.bookview},E(BookView))
    )
  }
});
module.exports=maincomponent;
},{"./bookview":"C:\\ksana2015\\ccs2016\\src\\bookview.js","./model":"C:\\ksana2015\\ccs2016\\src\\model.js","./searchpanel":"C:\\ksana2015\\ccs2016\\src\\searchpanel.js","react":"react"}],"C:\\ksana2015\\ccs2016\\src\\model.js":[function(require,module,exports){
/* action dispatcher */
var listeners=[];
var getters={};

var eventqueue=[];
var running=false;

var fireEvent=function(){
	if (eventqueue.length===0) {
		running=false;
		return;
	}
	running=true;

	var task=eventqueue.pop();
	var func=task[0], opts=task[1], cb=task[2], context=task[3];

	if (func.length>1){
		func.call(context,opts,function(err,res,res2){
			cb&&cb(err,res,res2);
			setTimeout(fireEvent,0);
		});
	} else { //sync func
		func.call(context,opts);
		setTimeout(fireEvent,0);
	}
}

var queueTask=function(func,opts,cb,context) {
	eventqueue.unshift([func,opts,cb,context]);
	if (!running) setTimeout(fireEvent,0);
}

var action=function(evt,opts,cb){
	for (var i=0;i<listeners.length;i+=1) {
		var listener=listeners[i];
		if (evt===listener[1] ) {
			if (listener[2]==undefined) {
				console.error("action has no callback",evt,listener);
			}
			queueTask( listener[2], opts,cb  , listener[0]);
		}
	}
}

var getter=function(name,opts,cb){ // sync getter
	if (getters[name]) {
		return getters[name](opts,cb);
	} else {
		console.error("getter '"+name +"' not found");
	}
}
var hasGetter=function(name) {
	return (!!getters[name]);
}
var registerGetter=function(name,cb,opts){
	opts=opts||{};
	if (!cb && name) delete getters[name];
	else {
		if (getters[name] && !opts.overwrite) {
			console.error("getter name "+name+" overwrite.");
		}
		getters[name]=cb;
	} 
}
var unregisterGetter=function(name) {
	registerGetter(name);
}

var	listen=function(event,cb,element){
	listeners.push([element,event,cb]);
}
var unlistenAll=function(element){
	if (!element) {
		console.error("unlistenAll should specify this")
	}
	listeners=listeners.filter(function(listener){
		return (listener[0]!==element) ;
	});
}

module.exports={ action, listen, unlistenAll, getter, registerGetter, unregisterGetter, hasGetter};
},{}],"C:\\ksana2015\\ccs2016\\src\\resultlist.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var store=require("./store");
var PT=React.PropTypes;
var AuthorResult=require("./authorresult");
var CollResult=require("./collresult");
var TitleResult=require("./titleresult");
var RightHelp=require("./righthelp");
var ResultList=React.createClass({displayName: "ResultList",
	getInitialState:function(){
		return {result:[],authors:[]}
	}
	,contextTypes:{
		getter:PT.func.isRequired,
		action:PT.func.isRequired
	}
	,dosearch:function(tofind){
		tofind=tofind||this.props.tofind;
		if (!isNaN(parseInt(tofind))) {
			this.context.action("showPage",parseInt(tofind));
		} else if (tofind[0]=="@") {
			//TODO find coll by author(compiler)
			var tf=tofind.substr(1).trim();

			this.context.getter("titleByAuthor",tf,function(titles){
				this.setState({titles,authors:[],colls:[]});
			}.bind(this));
		} else {
			var tf=(tofind[0]=="=")?tofind.substr(1):this.context.getter("expandVariant",tofind);	
			this.context.getter("filterAuthor",tf,function(authors){
				this.setState({authors});
			}.bind(this));
			this.context.getter("filterColl",tf,function(colls){
				this.setState({colls});
			}.bind(this));
			this.context.getter("filterTitle",tf,function(titles){
//				console.log(titles.length)
				this.setState({titles});
			}.bind(this));			
		}
	}
	,componentWillReceiveProps:function(nextProps){
		if (nextProps.tofind!==this.props.tofind) {
			this.dosearch(nextProps.tofind);
		}
	}
	,highlight:function(text){
		var out=[],previdx=0;
		if (!text)return;
		var tofind=this.props.tofind;
		var tf=(tofind[0]=="=")?tofind.substr(1):this.context.getter("expandVariant",tofind);	
		text.replace(tf,function(m,idx){
			out.push(text.substring(previdx,idx));
			out.push(E("span",{key:idx,className:'hl'},m));
			previdx=idx+m.length;
		})
		out.push(text.substring(previdx));
		return out;
	}
	,renderItem:function(item,key){
		return E("div",{key},item);
	}
	,showHelp:function(){
		return E(RightHelp);
	}
	,render:function(){
		if (!this.props.tofind) {
			return this.showHelp();
		}
		return E("div",{},
			E(AuthorResult,{authors:this.state.authors}),
			E(CollResult,{colls:this.state.colls
				,highlight:this.highlight}),
			E(TitleResult,{titles:this.state.titles
				,highlight:this.highlight}),
				this.state.result.map(this.renderItem)
		);
	}
});
module.exports=ResultList;
},{"./authorresult":"C:\\ksana2015\\ccs2016\\src\\authorresult.js","./collresult":"C:\\ksana2015\\ccs2016\\src\\collresult.js","./righthelp":"C:\\ksana2015\\ccs2016\\src\\righthelp.js","./store":"C:\\ksana2015\\ccs2016\\src\\store.js","./titleresult":"C:\\ksana2015\\ccs2016\\src\\titleresult.js","react":"react"}],"C:\\ksana2015\\ccs2016\\src\\righthelp.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var RightHelp=React.createClass({displayName: "RightHelp",
	render:function(){
		return E("div",{},
				E("h2",{},"　古籍目錄檢索"),
				E("div",{},"　資料庫: 劉小愁 littlehateliu@gmail.com"),
				E("div",{},"　",E("a",{href:"https://github.com/ksanaforge/ccs2016",target:"_new"},"程式碼"),"：",
					E("a",{href:"http://www.ksana.tw",target:"_new"},"剎那工坊"),
				E("div",{},"　")	,
				E("div",{},"　輸入「文字」，查叢書、子目及作者名，可輸入簡化字或異體字。文字前加=精確查詢，例「=后」則不檢出「後」。"),
				E("div",{},"　輸入「@作者」，列出作者所有著作。")	,
				E("div",{},"　輸入「數字」，跳到中國叢書綜錄頁碼。")	
				)
			);
	}
})
module.exports=RightHelp;
},{"react":"react"}],"C:\\ksana2015\\ccs2016\\src\\searchpanel.js":[function(require,module,exports){
var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var ResultList=require("./resultlist");
var styles={
	tofind:{margin:5,fontSize:"120%",background:"silver"},
	scroller:{height:"100%",overflowY:"auto"}
}
var SearchPanel=React.createClass({displayName: "SearchPanel",
	contextTypes:{
		listen:PT.func.isRequired,
		unlistenAll:PT.func.isRequired
	}
	,getInitialState:function(){
		var value=document.location.hash.substr(1)||localStorage.getItem("ccs2016_tofind")||"";
		return {value,tofind:"",oldTofind:"",oldScrollTop:-1}
	}
	,componentDidMount:function(){
		this.context.listen("setTofind",this.setTofind,this);
		if (this.state.value) {
			setTimeout(function(){
				this.dofilter();
			}.bind(this),100);
		}
	}
	,componentWillUnmount:function(){
		this.context.unlistenAll(this);
	}
	,setTofind:function(tofind){
		var oldTofind=this.state.oldTofind;
		var oldScrollTop=-1;
		if (tofind[0]=="@" && this.state.tofind[0]!=="@") {
			oldTofind=this.state.tofind;
			oldScrollTop=ReactDOM.findDOMNode(this.refs.scroller).scrollTop;
		}
		this.setState({tofind,value:tofind,oldTofind,oldScrollTop},function(){
			ReactDOM.findDOMNode(this.refs.scroller).scrollTop=0;	
		}.bind(this));
	}
	,dofilter:function(){
		if (this.state.tofind!==this.state.value) {
			if (this.state.value[0]!="@"){
				localStorage.setItem("ccs2016_tofind",this.state.value);	
				document.location.hash=this.state.value;
			}
			this.setState({tofind:this.state.value});
		}
	}
	,onChange:function(e){
		this.setState({value:e.target.value});
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			this.dofilter();
		}.bind(this),300);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			this.dofilter();
		}
	}
	,setOldTofind:function(){
		var oldScrollTop=this.state.oldScrollTop;
		this.setState({value:this.state.oldTofind,tofind:this.state.oldTofind,oldTofind:"",oldScrollTop:0},function(){
			ReactDOM.findDOMNode(this.refs.scroller).scrollTop=oldScrollTop;
		}.bind(this));
	}
	,renderOldTofind:function(){
		if (this.state.oldTofind){
			return E("span",{onClick:this.setOldTofind,className:"oldtofind"},this.state.oldTofind);
		}
	}
	,renderAuthorMessage:function(){
		if (this.state.value[0]=="@") {
			return E("span",{},"之著作");
		}
	}
	,render:function(){
		return E("div",{style:styles.scroller,ref:"scroller"},
			E("div",{className:"floatinginput"},
				this.renderOldTofind(),
				E("input",{size:5,style:styles.tofind,ref:"input",
					placeholder:"查詢條件",
				onKeyPress:this.onKeyPress,
				onChange:this.onChange,
				value:this.state.value}),
				this.renderAuthorMessage()
			),
			E("div",{},"　"),
			E("div",{},"　"),
			E(ResultList,{tofind:this.state.tofind})
		);
	}
});
module.exports=SearchPanel;
},{"./resultlist":"C:\\ksana2015\\ccs2016\\src\\resultlist.js","react":"react","react-dom":"react-dom"}],"C:\\ksana2015\\ccs2016\\src\\store.js":[function(require,module,exports){
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
},{"./model":"C:\\ksana2015\\ccs2016\\src\\model.js","dataset":"dataset"}],"C:\\ksana2015\\ccs2016\\src\\titleresult.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;
const archivePDF=require("./archivepdf");
var styles={
	coll:{fontSize:"80%",color:"#0f0f7f"}
}
var TitleResult=React.createClass({displayName: "TitleResult",
	propTypes:{
		highlight:PT.func.isRequired,
		titles:PT.array.isRequired
	}
	,getDefaultProps:function(){
		return {titles:[]};
	}
	,contextTypes:{
		getter:PT.func.isRequired,
		action:PT.func.isRequired
	}
	,showTitle:function(e){
		this.context.action("showTitle",e.target.dataset.title);
	}
	,renderColl:function(nTitle){
		var res=this.context.getter("collOf",nTitle);// [CollCaption,nColl]
		return E("span",{className:"coll",key:"1"}
			,E("button",{"data-title":nTitle,
				style:styles.coll,onClick:this.showTitle},res[0]));
	}
	,renderItem:function(item,key){
		return E("div",{key,className:"title"},
			key+1+".",
			archivePDF.call(this,{},item[1],this.props.highlight(item[0]),key),
			this.renderColl(item[1])
		);
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.titles!==this.props.titles);
	}
	,getDefaultProps:function(){
		return {titles:[]}
	}
	,render:function(){
		var titles=this.props.titles;
		var warning=null;
		if (!this.props.titles.length){
			return E("div",{},"查無資料");
		}

		if (this.props.titles.length>MaxItem) {
			warning=E("span",{className:"warning"},"共有"+this.props.titles.length+"筆，只列出前500筆");
			titles=this.props.titles.slice(0,MaxItem);
		}

		return E("div",{},
			warning,
			titles.map(this.renderItem)
		)
	}
});
module.exports=TitleResult;

},{"./archivepdf":"C:\\ksana2015\\ccs2016\\src\\archivepdf.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js":[function(require,module,exports){

var userCancel=false;
var files=[];
var totalDownloadByte=0;
var targetPath="";
var tempPath="";
var nfile=0;
var baseurl="";
var result="";
var downloading=false;
var startDownload=function(dbid,_baseurl,_files) { //return download id
	var fs     = require("fs");
	var path   = require("path");

	
	files=_files.split("\uffff");
	if (downloading) return false; //only one session
	userCancel=false;
	totalDownloadByte=0;
	nextFile();
	downloading=true;
	baseurl=_baseurl;
	if (baseurl[baseurl.length-1]!='/')baseurl+='/';
	targetPath=ksanagap.rootPath+dbid+'/';
	tempPath=ksanagap.rootPath+".tmp/";
	result="";
	return true;
}

var nextFile=function() {
	setTimeout(function(){
		if (nfile==files.length) {
			nfile++;
			endDownload();
		} else {
			downloadFile(nfile++);	
		}
	},100);
}

var downloadFile=function(nfile) {
	var url=baseurl+files[nfile];
	var tmpfilename=tempPath+files[nfile];
	var mkdirp = require("./mkdirp");
	var fs     = require("fs");
	var http   = require("http");

	mkdirp.sync(path.dirname(tmpfilename));
	var writeStream = fs.createWriteStream(tmpfilename);
	var datalength=0;
	var request = http.get(url, function(response) {
		response.on('data',function(chunk){
			writeStream.write(chunk);
			totalDownloadByte+=chunk.length;
			if (userCancel) {
				writeStream.end();
				setTimeout(function(){nextFile();},100);
			}
		});
		response.on("end",function() {
			writeStream.end();
			setTimeout(function(){nextFile();},100);
		});
	});
}

var cancelDownload=function() {
	userCancel=true;
	endDownload();
}
var verify=function() {
	return true;
}
var endDownload=function() {
	nfile=files.length+1;//stop
	result="cancelled";
	downloading=false;
	if (userCancel) return;
	var fs     = require("fs");
	var mkdirp = require("./mkdirp");

	for (var i=0;i<files.length;i++) {
		var targetfilename=targetPath+files[i];
		var tmpfilename   =tempPath+files[i];
		mkdirp.sync(path.dirname(targetfilename));
		fs.renameSync(tmpfilename,targetfilename);
	}
	if (verify()) {
		result="success";
	} else {
		result="error";
	}
}

var downloadedByte=function() {
	return totalDownloadByte;
}
var doneDownload=function() {
	if (nfile>files.length) return result;
	else return "";
}
var downloadingFile=function() {
	return nfile-1;
}

var downloader={startDownload:startDownload, downloadedByte:downloadedByte,
	downloadingFile:downloadingFile, cancelDownload:cancelDownload,doneDownload:doneDownload};
module.exports=downloader;
},{"./mkdirp":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js","fs":false,"http":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js":[function(require,module,exports){
/* emulate filesystem on html5 browser */
var get_head=function(url,field,cb){
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);
	xhr.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				cb(xhr.getResponseHeader(field));
			} else {
				if (this.status!==200&&this.status!==206) {
					cb("");
				}
			}
	};
	xhr.send();
}
var get_date=function(url,cb) {
	get_head(url,"Last-Modified",function(value){
		cb(value);
	});
}
var get_size=function(url, cb) {
	get_head(url,"Content-Length",function(value){
		cb(parseInt(value));
	});
};
var checkUpdate=function(url,fn,cb) {
	if (!url) {
		cb(false);
		return;
	}
	get_date(url,function(d){
		API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
			fileEntry.getMetadata(function(metadata){
				var localDate=Date.parse(metadata.modificationTime);
				var urlDate=Date.parse(d);
				cb(urlDate>localDate);
			});
		},function(){
			cb(false);
		});
	});
}
var download=function(url,fn,cb,statuscb,context) {
	 var totalsize=0,batches=null,written=0;
	 var fileEntry=0, fileWriter=0;
	 var createBatches=function(size) {
		var bytes=1024*1024, out=[];
		var b=Math.floor(size / bytes);
		var last=size %bytes;
		for (var i=0;i<=b;i++) {
			out.push(i*bytes);
		}
		out.push(b*bytes+last);
		return out;
	 }
	 var finish=function() {
		 rm(fn,function(){
				fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
					setTimeout( cb.bind(context,false) , 0) ;
				},function(e){
					console.log("failed",e)
				});
		 },this);
	 };
		var tempfn="temp.kdb";
		var batch=function(b) {
		var abort=false;
		var xhr = new XMLHttpRequest();
		var requesturl=url+"?"+Math.random();
		xhr.open('get', requesturl, true);
		xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
		xhr.responseType = 'blob';
		xhr.addEventListener('load', function() {
			var blob=this.response;
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				fileWriter.write(blob);
				written+=blob.size;
				fileWriter.onwriteend = function(e) {
					if (statuscb) {
						abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
						if (abort) setTimeout( cb.bind(context,false) , 0) ;
				 	}
					b++;
					if (!abort) {
						if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
						else                    finish();
				 	}
			 	};
			}, console.error);
		},false);
		xhr.send();
	}

	get_size(url,function(size){
		totalsize=size;
		if (!size) {
			if (cb) cb.apply(context,[false]);
		} else {//ready to download
			rm(tempfn,function(){
				 batches=createBatches(size);
				 if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
				 API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
							fileEntry=_fileEntry;
						batch(0);
				 });
			},this);
		}
	});
}

var readFile=function(filename,cb,context) {
	API.fs.root.getFile(filename, {create: false, exclusive: false},function(fileEntry) {
		fileEntry.file(function(file){
			var reader = new FileReader();
			reader.onloadend = function(e) {
				if (cb) cb.call(cb,this.result);
			};
			reader.readAsText(file,"utf8");
		});
	}, console.error);
}

function createDir(rootDirEntry, folders,  cb) {
  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
  if (folders[0] == '.' || folders[0] == '') {
    folders = folders.slice(1);
  }
  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
    // Recursively add the new subfolder (if we still have another to create).
    if (folders.length) {
      createDir(dirEntry, folders.slice(1),cb);
    } else {
			cb();
		}
  }, cb);
};


var writeFile=function(filename,buf,cb,context){
	var write=function(fileEntry){
		fileEntry.createWriter(function(fileWriter) {
			fileWriter.write(buf);
			fileWriter.onwriteend = function(e) {
				if (cb) cb.apply(cb,[buf.byteLength]);
			};
		}, console.error);
	}

	var getFile=function(filename){
		API.fs.root.getFile(filename, {exclusive:true}, function(fileEntry) {
			write(fileEntry);
		}, function(){
				API.fs.root.getFile(filename, {create:true,exclusive:true}, function(fileEntry) {
					write(fileEntry);
				});

		});
	}
	var slash=filename.lastIndexOf("/");
	if (slash>-1) {
		createDir(API.fs.root, filename.substr(0,slash).split("/"),function(){
			getFile(filename);
		});
	} else {
		getFile(filename);
	}
}

var readdir=function(cb,context) {
	var dirReader = API.fs.root.createReader();
	var out=[],that=this;
	dirReader.readEntries(function(entries) {
		if (entries.length) {
			for (var i = 0, entry; entry = entries[i]; ++i) {
				if (entry.isFile) {
					out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
				}
			}
		}
		API.files=out;
		if (cb) cb.apply(context,[out]);
	}, function(){
		if (cb) cb.apply(context,[null]);
	});
}
var getFileURL=function(filename) {
	if (!API.files ) return null;
	var file= API.files.filter(function(f){return f[0]==filename});
	if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
	var url=getFileURL(filename);
	if (url) rmURL(url,cb,context);
	else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
	webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
		fileEntry.remove(function() {
			if (cb) cb.apply(context,[true]);
		}, console.error);
	},  function(e){
		if (cb) cb.apply(context,[false]);//no such file
	});
}
function errorHandler(e) {
	console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
	webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
		API.fs=fs;
		API.quota=grantedBytes;
		readdir(function(){
			API.initialized=true;
			cb.apply(context,[grantedBytes,fs]);
		},context);
	}, errorHandler);
}
var init=function(quota,cb,context) {
	if (!navigator.webkitPersistentStorage) return;
	navigator.webkitPersistentStorage.requestQuota(quota,
			function(grantedBytes) {
				initfs(grantedBytes,cb,context);
		}, errorHandler
	);
}
var queryQuota=function(cb,context) {
	var that=this;
	navigator.webkitPersistentStorage.queryUsageAndQuota(
	 function(usage,quota){
			initfs(quota,function(){
				cb.apply(context,[usage,quota]);
			},context);
	});
}
var API={
	init:init
	,readdir:readdir
	,checkUpdate:checkUpdate
	,rm:rm
	,rmURL:rmURL
	,getFileURL:getFileURL
	,writeFile:writeFile
	,readFile:readFile
	,download:download
	,get_head:get_head
	,get_date:get_date
	,get_size:get_size
	,getDownloadSize:get_size
	,queryQuota:queryQuota
}
module.exports=API;

},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js":[function(require,module,exports){
var appname="installer";
if (typeof ksana=="undefined") {
	window.ksana={platform:"chrome"};
	if (typeof process!=="undefined" && 
		process.versions && process.versions["node-webkit"]) {
		window.ksana.platform="node-webkit";
	}
}
var switchApp=function(path) {
	var fs=require("fs");
	path="../"+path;
	appname=path;
	document.location.href= path+"/index.html"; 
	process.chdir(path);
}
var downloader={};
var rootPath="";

var deleteApp=function(app) {
	console.error("not allow on PC, do it in File Explorer/ Finder");
}
var username=function() {
	return "";
}
var useremail=function() {
	return ""
}
var runtime_version=function() {
	return "1.4";
}

//copy from liveupdate
var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp2");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    if (typeof data=="object") {
      data.dbid=dbid;
      callback.apply(context,[data]);    
    }  
  }
  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }
  script=document.createElement('script');
  script.setAttribute('id', "jsonp2");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}


var loadKsanajs=function(){

	if (typeof process!="undefined" && !process.browser) {
		var ksanajs=require("fs").readFileSync("./ksana.js","utf8").trim();
		downloader=require("./downloader");
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		rootPath=process.cwd();
		rootPath=require("path").resolve(rootPath,"..").replace(/\\/g,"/")+'/';
		ksana.ready=true;
	} else{
		var url=window.location.origin+window.location.pathname.replace("index.html","")+"ksana.js";
		jsonp(url,appname,function(data){
			ksana.js=data;
			ksana.ready=true;
		});
	}
}

loadKsanajs();

var boot=function(appId,cb) {
	if (typeof appId=="function") {
		cb=appId;
		appId="unknownapp";
	}
	if (!ksana.js && ksana.platform=="node-webkit") {
		loadKsanajs();
	}
	ksana.appId=appId;
	if (ksana.ready) {
		cb();
		return;
	}
	var timer=setInterval(function(){
			if (ksana.ready){
				clearInterval(timer);
				cb();
			}
		},100);
}


var ksanagap={
	platform:"node-webkit",
	startDownload:downloader.startDownload,
	downloadedByte:downloader.downloadedByte,
	downloadingFile:downloader.downloadingFile,
	cancelDownload:downloader.cancelDownload,
	doneDownload:downloader.doneDownload,
	switchApp:switchApp,
	rootPath:rootPath,
	deleteApp: deleteApp,
	username:username, //not support on PC
	useremail:username,
	runtime_version:runtime_version,
	boot:boot
}
module.exports=ksanagap;
},{"./downloader":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","fs":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js":[function(require,module,exports){
var started=false;
var timer=null;
var bundledate=null;
var get_date=require("./html5fs").get_date;
var checkIfBundleUpdated=function() {
	get_date("bundle.js",function(date){
		if (bundledate &&bundledate!=date){
			location.reload();
		}
		bundledate=date;
	});
}
var livereload=function() {
	if(window.location.origin.indexOf("//127.0.0.1")===-1) return;

	if (started) return;

	timer1=setInterval(function(){
		checkIfBundleUpdated();
	},2000);
	started=true;
}

module.exports=livereload;
},{"./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js":[function(require,module,exports){
function mkdirP (p, mode, f, made) {
     var path = nodeRequire('path');
     var fs = nodeRequire('fs');
	
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    if (mode === undefined) {
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

},{}]},{},["C:\\ksana2015\\ccs2016\\index.js"])
//# sourceMappingURL=bundle.js.map
