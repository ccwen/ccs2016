var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;
var styles={
	title:{fontSize:"80%",color:"#0f0f0f"},
	coll:{fontSize:"80%",color:"#0f0f7f"}
}
var TitleResult=React.createClass({
	propTypes:{
		highlight:PT.func.isRequired,
		titles:PT.array.isRequired
	}
	,getDefaultProps:function(){
		return {titles:[]};
	}
	,contextTypes:{
		getter:PT.func.isRequired,
		action:PT.func.isRequired
	}
	,showTitle:function(e){
		this.context.action("showTitle",e.target.dataset.title);
	}
	,renderColl:function(nTitle){
		var res=this.context.getter("collOf",nTitle);// [CollCaption,nColl]
		return E("span",{style:styles.coll}
			,E("button",{"data-title":nTitle,
				style:styles.coll,onClick:this.showTitle},res[0]));
	}
	,renderItem:function(item,key){
		return E("div",{key,style:styles.title},this.props.highlight(item[0]),
			this.renderColl(item[1]));
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
