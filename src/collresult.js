var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;

var CollResult=React.createClass({
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
			,this.props.highlight(item[0]),this.renderTitle(item[1]));
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
