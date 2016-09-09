var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var SearchPanel=React.createClass({
	getInitialState:function(){
		return {nColl:0}
	},
	contextTypes:{
		action:PT.func.isRequired,
		listen:PT.func.isRequired,
		getter:PT.func.isRequired
	}
	,componentDidMount:function(){
		this.context.listen("showColl" ,this.showColl, this);
	}
	,showColl:function(nColl){
		this.setState({nColl});
	}
	,componentWillUnmount:function(){
		this.context.unlistenAll(this);
	}
	,render:function(){
		return E("div",{},"showing"+this.state.nColl);
	}
});
module.exports=SearchPanel;