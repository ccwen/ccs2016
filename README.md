# ccs2016
Chinese Classic Serials 2016 user interface

need dataset from ksanaforge/ccs

build
build-react
build-data

open index.html with http:// or file:// protocol


TODO: add variant search
(extract unihan variant)
replace input with variant to [v1v2]

from unihan variant, generate a string of "v1v2v3,v4v5v6,v7v8"
build character map of entire dataset
remove unused character from unihan variant string

when input: for each character , scan the variant string.
fetch entire group.
replace the character with unicode char range.
