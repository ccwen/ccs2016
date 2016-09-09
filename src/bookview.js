var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
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
		this.context.listen("showTitle" ,this.showTitle, this);
	}
	,showColl:function(nColl){
		this.setState({nColl,nTitle:0});
	}
	,showTitle:function(nTitle){
		var nColl=this.context.getter("collOf",nTitle);
		this.setState({nTitle,nColl});
	}
	,componentWillUnmount:function(){
		this.context.unlistenAll(this);
	}
	,render:function(){
		return E("div",{},"showing Title"+this.state.nTitle+"of Coll"+this.state.nColl);
	}
});
module.exports=SearchPanel;