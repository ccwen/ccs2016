var React=require("react");
var E=React.createElement;
var store=require("./store");
var PT=React.PropTypes;
var AuthorResult=require("./authorresult");
var CollResult=require("./collresult");
var TitleResult=require("./titleresult");
var RightHelp=require("./righthelp");
var ResultList=React.createClass({
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
				console.log(titles.length)
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