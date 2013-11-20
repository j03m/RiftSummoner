find RunFighter-X-JS/platform/ -name "*.js" -exec cat {} \; -exec echo \; > cocosCat.js
uglifyjs cocosCat.js -m -c -o cocos2dHtml5.min.js
mv cocos2dhtml5.min.js deploy/cocos2dHtml5.min.js
find RunFighter-X-JS/src/ -name "*.js" -exec cat {} \; -exec echo \; > srcCat.js
uglifyjs srcCat.js -m -c -o hotr.min.js
mv hotr.min.js deploy/hotr.min.js

