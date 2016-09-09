var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var SearchPanel=require("./searchpanel");
var BookView=require("./bookview");
var {action,listen,unlistenAll,getter,registerGetter,unregisterGetter}=require("./model");

var styles={
  container:{display:"flex"},
  searchpanel:{flex:1},
  bookview:{flex:1}
}
var maincomponent = React.createClass({
  getInitialState:function() {
    return {};
  }
  ,childContextTypes: {
    listen: PT.func
    ,unlistenAll: PT.func
    ,action: PT.func
    ,getter: PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,getChildContext:function(){
    return {action,listen,unlistenAll,getter,registerGetter,unregisterGetter};
  }
  ,render: function() {
    return E("div",{style:styles.container},
      E("div",{style:styles.searchpanel},E(SearchPanel)),
      E("div",{style:styles.bookview},E(BookView))
    )
  }
});
module.exports=maincomponent;