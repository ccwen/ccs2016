var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var MaxRange=200;
var styles={
	scroller:{height:"100%",overflowY:"auto",overflowWrap:"normal"}
}
var SearchPanel=React.createClass({
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
		this.setState({nColl,nTitle:0,showloading:true});
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
				inrange&&out.push(E("span",obj,title));
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
	,renderCategory:function(category,idx){
		if (!category.length)return null;
		return E("select",{key:idx,className:"category",onChange:this.onSelectCat},
			category.map(function(cat,key){
				return E("option",{key},cat);
			})
		)
	}
	,onCatClick:function(e){
		this.showTitle(e.target.dataset.title);
	}
	,renderContent:function(){
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
						category.push(cat);
					}
				}
			}
		}
		//insert subcategory dropdown collname
		category_select=this.renderCategory(category,"cat");
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