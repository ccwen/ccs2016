var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;
var styles={
	coll:{fontSize:"80%",background:"#7fff7f"}
}
var CollResult=React.createClass({
	renderItem:function(item,key){
		return E("div",{key,style:styles.coll},item[0]);
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.colls!==this.props.colls);
	}
	,getDefaultProps:function(){
		return {colls:[]}
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
