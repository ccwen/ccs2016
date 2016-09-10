var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var MaxButton=10;
var styles={
	authorbutton:{fontSize:"80%"}
}
var AuthorResult=React.createClass({
	contextTypes:{
		action:PT.func.isRequired
	},
	listBookByAuthor:function(e){
		var author=e.target.dataset.author;
		this.context.action("setTofind","@"+author);
	},
	renderAuthorButton:function(){
		var authors=this.props.authors;
		var max=authors.length;
		var out=[];
		if (max>MaxButton) max=MaxButton;
		for (var i=0;i<max;i++) {
			var item=authors[i];
			out.push(E("button",{key:i,style:styles.authorbutton
					,onClick:this.listBookByAuthor
					,"data-author":item[0]}
				,item[0]));
		}
		return out;
	}
	,shouldComponentUpdate:function(nextProps){
		return (nextProps.authors!==this.props.authors);
	}
	,getDefaultProps:function(){
		return {authors:[]}
	}
	,renderCount:function(){
		if (this.props.authors.length<MaxButton) return;
		return E("span",{},"還有"+(this.props.authors.length-MaxButton),"位出者未列出")
	}
	,render:function(){
		return E("div",{},
			this.renderAuthorButton(),
			this.renderCount()
		)
	}
});
module.exports=AuthorResult;
