var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;
var styles={
	title:{fontSize:"80%",background:"#ffff7f"}
}
var TitleResult=React.createClass({
	renderItem:function(item,key){
		return E("div",{key,style:styles.title},item[0]);
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.titles!==this.props.titles);
	}
	,getDefaultProps:function(){
		return {titles:[]}
	}
	,render:function(){
		var titles=this.props.titles;
		if (this.props.titles.length>MaxItem) {
			titles=this.props.titles.slice(0,MaxItem);
		}

		return E("div",{},
			titles.map(this.renderItem)
		)
	}
});
module.exports=TitleResult;
