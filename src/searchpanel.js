var React=require("react");
var E=React.createElement;
var ResultList=require("./resultlist");
var styles={
	tofind:{margin:5,fontSize:"120%",width:"90%"}
}
var SearchPanel=React.createClass({
	getInitialState:function(){
		return {value:"金石",tofind:""}
	}
	,dofilter:function(){
		if (this.state.tofind!==this.state.value) {
			this.setState({tofind:this.state.value});
		}
	}
	,onChange:function(e){
		this.setState({value:e.target.value});
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			this.dofilter();
		}.bind(this),300);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			this.dofilter();
		}
	}
	,render:function(){
		return E("div",{},
			E("input",{size:5,style:styles.tofind,
				onKeyPress:this.onKeyPress,
				onChange:this.onChange,
				value:this.state.value}),
			E(ResultList,{tofind:this.state.tofind})
		);
	}
});
module.exports=SearchPanel;