#broken, order matters
#find RunFighter-X-JS/platform/ -name "*.js" -exec cat {} \; -exec echo \; > cocosCat.js
#uglifyjs cocosCat.js -m -c -o cocos2dHtml5.min.js
#mv cocos2dhtml5.min.js deploy/cocos2dHtml5.min.js

while read p; do
	echo $p
	cat $p >> catSrc.js
	echo >> catSrc.js
done < buildorder.txt
uglifyjs catSrc.js -m -c -o hotr.min.js
mv hotr.min.js game/hotr.min.js
mv catSrc.js catSrcLast.js


