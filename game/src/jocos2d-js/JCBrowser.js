var jc = jc || {};
jc.oldSetInterval = setInterval;
jc.oldSetTimeout = setTimeout;
if (typeof window === 'undefined') {
    jc.isBrowser = false;
}else{
    jc.isBrowser = true;
}