var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
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
		this.showTitle(first);
	}
	,componentDidUpdate:function(){
		if (this.scrollto) {
			var ele=this.refs[this.scrollto];
			ele&&ele.scrollIntoView();;
			this.scrollto=null;
		}
	}
	,showTitle:function(nTitle){
		nTitle=parseInt(nTitle);
		if (isNaN(nTitle))return;
		var nColl=this.context.getter("collOf",nTitle);
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
			if (text) {
				out.push(E("span",{key:'t'+key},text));
				text="";
			}
		}
		while (i<line.length){
			if (line[i]=="@") {
				emitNormalText(i);
				var title=this.context.getter("titleCaption",opts.nTitle);
				opts.nTitle++;
				out.push(E("span",{className:"title",key:i},title));
				var m=line.substr(i+1).match(/(\d+)/);
				if (m) {
					out.push(E("span",{className:"juan",key:'j'+i},m[0],"卷 "));
					i+=m[0].length;
				}
			} else if (line[i]=="#"){
				emitNormalText(i);
				var m=line.substr(i+1).match(/([0-9a-f]+)/);
				if (m) {
					var nAuthor=parseInt(m,16)-1;
					var author=this.context.getter("authorCaption",nAuthor);
					out.push(E("span",{className:"author",key:'a'+i,
						onClick:this.searchAuthor},author+" "));
					i+=m[0].length;
				}
				
			} else {
				var m=line.substr(i,2).match(/[A-Z]+/);
				if (m) {
					i+=(m[0].length-1);
					var dyn=this.context.getter("dynastyByCode",m[0]);
					if (dyn) {
						out.push(E("span",{className:"dyn",key:'d'+i},dyn));
					} else{
						text+=m[0];
					}
				} else {
					text+=line[i];	
				}
			}
			
			i++;
		}
		emitNormalText();
		return E("div",{key},out);
		//render title
		//render author
		//render Dynasty
	}
	,renderPageNumber:function(page,key){
		return E("div",{className:"page",key,ref:'pg'+page},"綜錄第",page,"頁");
	}
	,onSelectCat:function(e){
		var idx=e.target.selectedIndex;
		this.refs['cat'+idx].scrollIntoView();
	}
	,renderCategory:function(category,idx){
		if (!category.length)return null;
		return E("select",{key:idx,className:"category",onChange:this.onSelectCat},
			category.map(function(cat,key){
				return E("option",{key},cat);
			})
		)
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
						out.push(E("div",{key:'cat'+category.length,ref:'cat'+category.length},cat));
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
		return E("div",{style:styles.scroller},this.startRendering());
	}
});
module.exports=SearchPanel;