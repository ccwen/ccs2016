const fs=require("fs");
const titles=require("./titles-sim").split("\n");
const bookarchive=fs.readFileSync("book-archive.txt","utf8").split(/\r?\n/);
var atitle=[],aid=[];
for (var i=0;i<bookarchive.length;i++){
	var r=bookarchive[i].split(",");
	atitle.push(r[0]);
	aid.push(r[1]);
}

var indexOfSorted_str = function (array, obj) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]===obj) return mid;
    //(array[mid].localeCompare(obj)<0) ? low = mid + 1 : high = mid;
    array[mid]<obj ? low=mid+1 : high=mid;
  }
  if (array[low]===obj) return low;else return -1;
};
var out=[];
const match=function(t,idx){
	var i=indexOfSorted_str(atitle,t);
	if (i>-1) {
		out[idx]=aid[i];
	}
}

titles.forEach(match);
for (var i=0;i<out.length;i++){
	if (!out[i])out[i]="";
}
fs.writeFileSync("archive.js","module.exports=`"+out.join("\n")+"`");