var React=require("react");
var E=React.createElement;
var store=require("./store");
var PT=React.PropTypes;
var AuthorResult=require("./authorresult");
var CollResult=require("./collresult");
var TitleResult=require("./titleresult");

var ResultList=React.createClass({
	getInitialState:function(){
		return {result:[],authors:[]}
	}
	,contextTypes:{
		getter:PT.func.isRequired
	}
	,dosearch:function(tofind){
		tofind=tofind||this.props.tofind;
		if (tofind[0]=="@") {
			//TODO find coll by author(compiler)
			this.context.getter("titleByAuthor",tofind.substr(1),function(titles){
				this.setState({titles,authors:[],colls:[]});
			}.bind(this));
		} else {
			this.context.getter("filterAuthor",tofind,function(authors){
				this.setState({authors});
			}.bind(this));
			this.context.getter("filterColl",tofind,function(colls){
				this.setState({colls});
			}.bind(this));
			this.context.getter("filterTitle",tofind,function(titles){
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
		text.replace(this.props.tofind,function(m,idx){
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
	,render:function(){
		return E("div",{},
			E(AuthorResult,{authors:this.state.authors}),
			E(CollResult,{colls:this.state.colls
				,highlight:this.highlight}),
			E(TitleResult,{titles:this.state.titles
				,highlight:this.highlight}),
			this.state.result.map(this.renderItem));
	}
});
module.exports=ResultList;