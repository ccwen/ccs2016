var React=require("react");
var E=React.createElement;
var store=require("./store");
var PT=React.PropTypes;
var AuthorResult=require("./authorresult");
var CollResult=require("./collresult");
var TitleResult=require("./titleresult");

var ResultList=React.createClass({
	getInitialState:function(){
		return {result:["5","6"],authors:[]}
	}
	,contextTypes:{
		getter:PT.func.isRequired
	}
	,dosearch:function(tofind){
		tofind=tofind||this.props.tofind;
		this.context.getter("filterauthor",tofind,function(authors){
			this.setState({authors});
		}.bind(this));
		this.context.getter("filtercoll",tofind,function(colls){
			this.setState({colls});
		}.bind(this));
		this.context.getter("filtertitle",tofind,function(titles){
			this.setState({titles});
		}.bind(this));
	}
	,componentWillReceiveProps:function(nextProps){
		if (nextProps.tofind!==this.props.tofind) {
			this.dosearch(nextProps.tofind);
		}
	}
	,renderItem:function(item,key){
		return E("div",{key},item);
	}
	,render:function(){
		return E("div",{},
			E(AuthorResult,{authors:this.state.authors}),
			E(CollResult,{colls:this.state.colls}),
			E(TitleResult,{titles:this.state.titles}),
			this.state.result.map(this.renderItem));
	}
});
module.exports=ResultList;