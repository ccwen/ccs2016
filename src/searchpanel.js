var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var ResultList=require("./resultlist");
var styles={
	tofind:{margin:5,fontSize:"120%",background:"silver"},
	scroller:{height:"100%",overflowY:"auto"}
}
var SearchPanel=React.createClass({
	contextTypes:{
		listen:PT.func.isRequired,
		unlistenAll:PT.func.isRequired
	}
	,getInitialState:function(){
		var value=document.location.hash.substr(1)||localStorage.getItem("ccs2016_tofind")||"";
		return {value,tofind:"",oldTofind:"",oldScrollTop:-1}
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
		var oldTofind=this.state.oldTofind;
		var oldScrollTop=-1;
		if (tofind[0]=="@" && this.state.tofind[0]!=="@") {
			oldTofind=this.state.tofind;
			oldScrollTop=ReactDOM.findDOMNode(this.refs.scroller).scrollTop;
		}
		this.setState({tofind,value:tofind,oldTofind,oldScrollTop},function(){
			ReactDOM.findDOMNode(this.refs.scroller).scrollTop=0;	
		}.bind(this));
	}
	,dofilter:function(){
		if (this.state.tofind!==this.state.value) {
			if (this.state.value[0]!="@"){
				localStorage.setItem("ccs2016_tofind",this.state.value);	
				document.location.hash=this.state.value;
			}
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
	,setOldTofind:function(){
		var oldScrollTop=this.state.oldScrollTop;
		this.setState({value:this.state.oldTofind,tofind:this.state.oldTofind,oldTofind:"",oldScrollTop:0},function(){
			ReactDOM.findDOMNode(this.refs.scroller).scrollTop=oldScrollTop;
		}.bind(this));
	}
	,renderOldTofind:function(){
		if (this.state.oldTofind){
			return E("span",{onClick:this.setOldTofind,className:"oldtofind"},this.state.oldTofind);
		}
	}
	,render:function(){
		return E("div",{style:styles.scroller,ref:"scroller"},
			E("div",{className:"floatinginput"},
				E("input",{size:5,style:styles.tofind,ref:"input",
					placeholder:"查詢條件",
				onKeyPress:this.onKeyPress,
				onChange:this.onChange,
				value:this.state.value}),
				this.renderOldTofind()
			),
			E("div",{},"　"),
			E("div",{},"　"),
			E(ResultList,{tofind:this.state.tofind})
		);
	}
});
module.exports=SearchPanel;