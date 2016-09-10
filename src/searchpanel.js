var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var ResultList=require("./resultlist");
var styles={
	tofind:{margin:5,fontSize:"120%",width:"90%",background:"silver"},
	scroller:{height:"100%",overflowY:"auto"}
}
var SearchPanel=React.createClass({
	contextTypes:{
		listen:PT.func.isRequired,
		unlistenAll:PT.func.isRequired
	}
	,getInitialState:function(){
		return {value:"學海",tofind:""}
	}
	,componentDidMount:function(){
		this.context.listen("setTofind",this.setTofind,this);
		if (this.state.value) {
			setTimeout(function(){
				this.dofilter();
			}.bind(this),100);
		}
	}
	,componentWillUnmount:function(){
		this.context.unlistenAll(this);
	}
	,setTofind:function(tofind){
		this.setState({tofind,value:tofind});
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
			ReactDOM.findDOMNode(this.refs.scroller).scrollTop=0;
			this.dofilter();
		}.bind(this),300);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			this.dofilter();
		}
	}
	,render:function(){
		return E("div",{style:styles.scroller,ref:"scroller"},
			E("div",{className:"floatinginput"},
				E("input",{size:5,style:styles.tofind,
				onKeyPress:this.onKeyPress,
				onChange:this.onChange,
				value:this.state.value})
			),
			E("div",{},"　"),
			E("div",{},"　"),
			E(ResultList,{tofind:this.state.tofind})
		);
	}
});
module.exports=SearchPanel;