var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxItem=500;
const archivePDF=require("./archivepdf");
var styles={
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
		return E("span",{className:"coll",key:"1"}
			,E("button",{"data-title":nTitle,
				style:styles.coll,onClick:this.showTitle},res[0]));
	}
	,renderItem:function(item,key){
		return E("div",{key,className:"title"},
			key+1+".",
			archivePDF.call(this,{},item[1],this.props.highlight(item[0]),key),
			this.renderColl(item[1])
		);
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.titles!==this.props.titles);
	}
	,getDefaultProps:function(){
		return {titles:[]}
	}
	,render:function(){
		var titles=this.props.titles;
		var warning=null;
		if (!this.props.titles.length){
			return E("div",{},"查無資料");
		}

		if (this.props.titles.length>MaxItem) {
			warning=E("span",{className:"warning"},"共有"+this.props.titles.length+"筆，只列出前500筆");
			titles=this.props.titles.slice(0,MaxItem);
		}

		return E("div",{},
			warning,
			titles.map(this.renderItem)
		)
	}
});
module.exports=TitleResult;
