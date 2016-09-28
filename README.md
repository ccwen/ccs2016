# ccs2016
Chinese Classic Serials 2016 user interface

need dataset from https://github.com/ksanaforge/ccs (private repo)

build
build-react
build-data

open index.html with http:// or file:// protocol

node wget-souyun //get links to archive.org
node gen-souyun //generate title name to archive.org mapping books-archive.json

node matcharchive //create archive property, titles.txt
copy archive.js ../ccs  //copy archive.js to ccs  (ksanaforge/ccs)
build-data   //rebuil data



TODO
and editor for building title id  and PDF mapping
title id : page number + seq

right side : title filter, click to bring title id to right side
use node webkit

