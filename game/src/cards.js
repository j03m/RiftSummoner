/**
 * Kik Cards v0.11.0
 * Copyright (c) 2013 Kik Interactive, http://kik.com
 * All rights reserved
 * http://cards.kik.com/terms.html
 *
 * classList.js: Cross-browser full element.classList implementation.
 * By Eli Grey, http://eligrey.com
 * Public Domain
 * No warranty expressed or implied. Use at your own risk.
 */
(function (a) {
    var b = {};
    b.enabled = false;
    b.version = "0.11.0";
    b._ = {};
    a.cards = b
})(window);
(function () {
    if (!Object.keys) {
        Object.keys = function (c) {
            var b = [];
            for (var a in c) {
                b.push(a)
            }
            return b
        }
    }
    if (!Array.isArray) {
        Array.isArray = function (a) {
            return Object.prototype.toString.call(a) == "[object Array]"
        }
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (c, d) {
            for (var b = d || 0, a = this.length; b < a; b++) {
                if ((b in this) && (this[b] === c)) {
                    return b
                }
            }
            return -1
        }
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (d, b) {
            for (var c = 0, a = this.length; c < a; c++) {
                if (c in this) {
                    d.call(b, this[c], c, this)
                }
            }
        }
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function (e, b) {
            var a = this.length,
                c = new Array(a);
            for (var d = 0; d < a; d++) {
                if (d in this) {
                    c[d] = e.call(b, this[d], d, this)
                }
            }
            return c
        }
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (e, c) {
            var b = [];
            for (var f, d = 0, a = this.length; d < a; d++) {
                f = this[d];
                if ((d in this) && e.call(c, f, d, this)) {
                    b.push(f)
                }
            }
            return b
        }
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (c, d) {
            var b = 0,
                a = this.length;
            if (typeof d == "undefined") {
                d = this[0];
                b = 1
            }
            for (; b < a; b++) {
                if (b in this) {
                    d = c(d, this[b], b, this)
                }
            }
            return d
        }
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            var a = /^\s+|\s+$/g;
            return function () {
                return String(this).replace(a, "")
            }
        }()
    }
})();
if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {
    (function (s) {
        var B = "classList",
            w = "prototype",
            p = (s.HTMLElement || s.Element)[w],
            A = Object,
            r = String[w].trim ||
                function () {
                    return this.replace(/^\s+|\s+$/g, "")
                }, z = Array[w].indexOf ||
                function (a) {
                    var b = 0,
                        c = this.length;
                    for (; b < c; b++) {
                        if (b in this && this[b] === a) {
                            return b
                        }
                    }
                    return -1
                }, o = function (b, a) {
                this.name = b;
                this.code = DOMException[b];
                this.message = a
            }, v = function (a, b) {
                if (b === "") {
                    throw new o("SYNTAX_ERR", "An invalid or illegal string was specified")
                }
                if (/\s/.test(b)) {
                    throw new o("INVALID_CHARACTER_ERR", "String contains an invalid character")
                }
                return z.call(a, b)
            }, y = function (a) {
                var b = r.call(a.className),
                    c = b ? b.split(/\s+/) : [],
                    d = 0,
                    e = c.length;
                for (; d < e; d++) {
                    this.push(c[d])
                }
                this._updateClassName = function () {
                    a.className = this.toString()
                }
            }, x = y[w] = [], t = function () {
                return new y(this)
            };
        o[w] = Error[w];
        x.item = function (a) {
            return this[a] || null
        };
        x.contains = function (a) {
            a += "";
            return v(this, a) !== -1
        };
        x.add = function (a) {
            a += "";
            if (v(this, a) === -1) {
                this.push(a);
                this._updateClassName()
            }
        };
        x.remove = function (a) {
            a += "";
            var b = v(this, a);
            if (b !== -1) {
                this.splice(b, 1);
                this._updateClassName()
            }
        };
        x.toggle = function (a) {
            a += "";
            if (v(this, a) === -1) {
                this.add(a)
            } else {
                this.remove(a)
            }
        };
        x.toString = function () {
            return this.join(" ")
        };
        if (A.defineProperty) {
            var q = {
                get: t,
                enumerable: true,
                configurable: true
            };
            try {
                A.defineProperty(p, B, q)
            } catch (u) {
                if (u.number === -2146823252) {
                    q.enumerable = false;
                    A.defineProperty(p, B, q)
                }
            }
        } else {
            if (A[w].__defineGetter__) {
                p.__defineGetter__(B, t)
            }
        }
    }(self))
}(function (f, h, d) {
    var j = false,
        g = [];
    c();
    d._.onLog = i;

    function i(k) {
        if (typeof k !== "function") {
            throw TypeError("log listener must be a function, got " + k)
        }
        g.push(k)
    }
    function e(l, k) {
        if (j) {
            return
        }
        j = true;
        g.forEach(function (n) {
            try {
                n(l, k)
            } catch (m) {}
        });
        j = false
    }
    function c() {
        var k = f.console;
        if (typeof k !== "object") {
            k = {}
        }
        k.log = b(k.log, "log");
        k.warn = b(k.warn, "warn");
        k.error = b(k.error, "error");
        a();
        f.console = k
    }
    function b(k, l) {
        switch (typeof k) {
            case "undefined":
                k = function () {};
            case "function":
                break;
            default:
                return k
        }
        return function () {
            var m = Array.prototype.map.call(arguments, function (n) {
                if ((typeof n === "object") && (n !== null) && f.JSON && JSON.stringify) {
                    try {
                        return JSON.stringify(n)
                    } catch (o) {}
                }
                return n + ""
            }).join(" ");
            e(l, m);
            k.apply(this, arguments)
        }
    }
    function a() {
        if (!f.addEventListener) {
            return
        }
        f.addEventListener("error", function (k) {
            e("exception", k.message + "")
        }, false)
    }
})(window, document, cards);
(function (d, a, c) {
    var b = {};
    c.utils = b;
    b.error = function (e) {
        if (d.console && d.console.error) {
            if ((typeof e === "object") && e.stack) {
                d.console.error(e.stack)
            } else {
                d.console.error(e + "")
            }
        }
    };
    b.platform = {};
    b.platform.os = function () {
        var h = d.navigator.userAgent,
            g, f, e;
        if ((e = /\bCPU.*OS (\d+(_\d+)?)/i.exec(h))) {
            g = "ios";
            f = e[1].replace("_", ".")
        } else {
            if ((e = /\bAndroid (\d+(\.\d+)?)/.exec(h))) {
                g = "android";
                f = e[1]
            } else {
                if ((e = /\bWindows Phone OS (\d+(\.\d+)?)/.exec(h))) {
                    g = "winphone";
                    f = e[1]
                } else {
                    if ((e = /\bMac OS X (\d+(_\d+)?)/.exec(h))) {
                        g = "osx";
                        f = e[1].replace("_", ".")
                    } else {
                        if ((e = /\bWindows NT (\d+(.\d+)?)/.exec(h))) {
                            g = "windows";
                            f = e[1]
                        } else {
                            if ((e = /\bLinux\b/.exec(h))) {
                                g = "linux";
                                f = null
                            } else {
                                if ((e = /\b(Free|Net|Open)BSD\b/.exec(h))) {
                                    g = "bsd";
                                    f = null
                                }
                            }
                        }
                    }
                }
            }
        }
        var i = {
            name: g,
            version: f && d.parseFloat(f),
            versionString: f
        };
        i[g] = true;
        return i
    }();
    b.os = b.platform.os;
    b.platform.browser = function () {
        var h = d.navigator.userAgent,
            g, f, e;
        if ((e = /\bMSIE (\d+(\.\d+)?)/i.exec(h))) {
            g = "msie";
            f = e[1]
        } else {
            if ((e = /\bOpera\/(\d+(\.\d+)?)/i.exec(h))) {
                g = "opera";
                f = e[1];
                if ((e = /\bVersion\/(\d+(\.\d+)?)/i.exec(h))) {
                    f = e[1]
                }
            } else {
                if ((e = /\bChrome\/(\d+(\.\d+)?)/i.exec(h))) {
                    g = "chrome";
                    f = e[1]
                } else {
                    if ((h.indexOf("Safari/") != -1) && (e = /\bVersion\/(\d+(\.\d+)?)/i.exec(h))) {
                        if (b.platform.os.android) {
                            g = "android"
                        } else {
                            g = "safari"
                        }
                        f = e[1]
                    } else {
                        if ((e = /\bFirefox\/(\d+(\.\d+)?)/i.exec(h))) {
                            g = "firefox";
                            f = e[1]
                        }
                    }
                }
            }
        }
        var i = {
            name: g,
            version: f && d.parseFloat(f),
            versionString: f
        };
        i[g] = true;
        return i
    }();
    b.browser = b.platform.browser;
    b.platform.engine = function () {
        var h = d.navigator.userAgent,
            g, f, e;
        if ((e = /\bTrident\/(\d+(\.\d+)?)/i.exec(h))) {
            g = "trident";
            f = e[1]
        } else {
            if ((e = /\bMSIE 7/i.exec(h))) {
                g = "trident";
                f = "3.1"
            } else {
                if ((e = /\bPresto\/(\d+(\.\d+)?)/i.exec(h))) {
                    g = "presto";
                    f = e[1]
                } else {
                    if ((e = /\bAppleWebKit\/(\d+(\.\d+)?)/i.exec(h))) {
                        g = "webkit";
                        f = e[1]
                    } else {
                        if ((e = /\brv\:(\d+(\.\d+)?)/i.exec(h))) {
                            g = "gecko";
                            f = e[1]
                        }
                    }
                }
            }
        }
        var i = {
            name: g,
            version: f && d.parseFloat(f),
            versionString: f
        };
        i[g] = true;
        return i
    }();
    b.engine = b.platform.engine;
    b.random = {};
    b.random.name = function (e) {
        return ("____" + (e || "") + "____" + Math.random()).replace(/\.|\-/g, "")
    };
    b.random.num = function () {
        return Math.floor((Math.random() * 18014398509481984) - 9007199254740992)
    };
    b.random.uuid = function () {
        var e = 36,
            g = new Array(e),
            h = "0123456789abcdef",
            f;
        for (f = 0; f < e; f++) {
            g[f] = Math.floor(Math.random() * 16)
        }
        g[14] = 4;
        g[19] = (g[19] & 3) | 8;
        for (f = 0; f < e; f++) {
            g[f] = h[g[f]]
        }
        g[8] = g[13] = g[18] = g[23] = "-";
        return g.join("")
    };
    b.enumerate = function (f) {
        if (typeof f !== "object") {
            f = Array.prototype.slice.call(arguments)
        }
        var h = {};
        for (var g = 0, e = f.length; g < e; g++) {
            h[f[g]] = g
        }
        return h
    };
    b.preloadImage = function () {
        var f = {};
        return e;

        function e() {
            var h = arguments;
            cards.ready(function () {
                g.apply(b, h)
            })
        }
        function g(j, l) {
            if (typeof j != "string") {
                b.asyncJoin(j.map(function (m) {
                    return function (n) {
                        b.preloadImage(m, n)
                    }
                }), l ||
                    function () {});
                return
            }
            if (f[j] === true) {
                if (l) {
                    setTimeout(function () {
                        l(true)
                    }, 0)
                }
                return
            } else {
                if (f[j]) {
                    f[j].push(l);
                    return
                }
            }
            f[j] = [l];
            var h = false;

            function k(o) {
                if (h) {
                    return
                }
                h = true;
                var q = f[j];
                f[j] = o;
                for (var n, p = 0, m = q.length; p < m; p++) {
                    n = q[p];
                    if (n) {
                        n(o)
                    }
                }
            }
            var i = new Image();
            i.onload = function () {
                k(true)
            };
            i.onerror = function () {
                k(false)
            };
            i.src = j
        }
    }();
    b.url = {};
    b.url.dir = function () {
        var e = /\/[^\/]*$/;
        return function (f) {
            switch (typeof f) {
                case "undefined":
                    f = d.location.href;
                case "string":
                    break;
                default:
                    throw TypeError("url " + f + " must be string if defined")
            }
            f = ((f.split("?")[0] || "").split("#")[0] || "");
            return f.replace(e, "/")
        }
    }();
    b.url.host = function () {
        var e = /^https?\:\/\/([^\/]+)\/.*$/;
        return function (g) {
            switch (typeof g) {
                case "undefined":
                    return d.location.host;
                case "string":
                    break;
                default:
                    throw TypeError("url " + g + " must be string if defined")
            }
            var f = e.exec(g);
            return f && f[1]
        }
    }();
    b.url.path = function () {
        var e = /^https?\:\/\/[^\/]+(\/.*)$/;
        return function (g) {
            switch (typeof g) {
                case "undefined":
                    return d.location.pathname;
                case "string":
                    break;
                default:
                    throw TypeError("url " + g + " must be string if defined")
            }
            var f = e.exec(g);
            return f && f[1]
        }
    }();
    b.url.dataToQuery = function () {
        var e = /%20/g;
        return function (k) {
            var h = [],
                j, f, i;
            for (var g in k) {
                j = k[g];
                if ((j !== null) && (j !== undefined)) {
                    f = encodeURIComponent(g);
                    i = encodeURIComponent(j);
                    h.push(f + "=" + i)
                }
            }
            return h.join("&").replace(e, "+")
        }
    }();
    b.url.queryToData = function () {
        var f = /([^&=]+)=([^&]+)/g,
            e = /\+/g;
        return function (k) {
            var h = {},
                g, i, j;
            if (k) {
                k = k.replace(e, "%20");
                while ((g = f.exec(k))) {
                    i = decodeURIComponent(g[1]);
                    j = decodeURIComponent(g[2]);
                    h[i] = j
                }
            }
            return h
        }
    }();
    b.url.withQuery = function (e, f) {
        if (!f) {
            f = e;
            e = d.location.href
        }
        e = e.split("?")[0];
        var g = b.url.dataToQuery(f);
        if (g) {
            e += "?" + g
        }
        return e
    };
    b.url.updateQuery = function (e, f) {
        if (!f) {
            f = e;
            e = d.location.href
        }
        var g = b.url.parseQuery(e);
        b.obj.extend(g, f);
        return b.url.withQuery(e, g)
    };
    b.url.parseQuery = function (e) {
        e = e || d.location.href;
        return b.url.queryToData(e.split("?")[1])
    };
    b.url.query = b.url.parseQuery();
    b.jsonp = function (s) {
        var q = false,
            l = function () {},
            h = b.random.name("PICARD_UTILS_JSONP_CALLBACK"),
            e = s.url,
            i = b.obj.copy(s.data),
            m = s.callbackName || "callback",
            p = s.callback || l,
            f = s.success || l,
            j = s.error || l,
            o = s.complete || l,
            r = a.getElementsByTagName("script")[0],
            k = a.createElement("script");
        i[m] = "window." + h;
        k.type = "text/javascript";
        k.async = true;
        k.onerror = g;
        k.src = b.url.updateQuery(e, i);

        function n() {
            d[h] = l;
            try {
                r.parentNode.removeChild(k)
            } catch (t) {}
        }
        function g() {
            if (q) {
                return
            }
            n();
            p = l;
            f = l;
            j();
            j = l;
            o();
            o = l
        }
        d[h] = function () {
            q = true;
            n();
            p.apply(this, arguments);
            p = l;
            f.apply(this, arguments);
            f = l;
            j = l;
            o();
            o = l
        };
        if (s.timeout) {
            setTimeout(g, s.timeout)
        }
        r.parentNode.insertBefore(k, r)
    };
    b.asyncJoin = function (e, k) {
        var g = true;
        if (!Array.isArray(e)) {
            g = false;
            e = Array.prototype.slice.call(arguments);
            k = e.pop()
        }
        var f = false,
            j = e.length,
            i = new Array(j);
        if (j === 0) {
            h();
            return
        }
        e.forEach(function (m, l) {
            setTimeout(function () {
                var n = false;
                m(function () {
                    if (n) {
                        return
                    }
                    n = true;
                    if (i[l]) {
                        return
                    }
                    var o = Array.prototype.slice.call(arguments);
                    i[l] = o;
                    j--;
                    h()
                })
            }, 0)
        });

        function h() {
            if ((j !== 0) || f) {
                return
            }
            f = true;
            setTimeout(function () {
                if (g) {
                    k.call(d, i)
                } else {
                    k.apply(d, i)
                }
            }, 0)
        }
    };
    b.obj = {};
    b.obj.extend = function (g, f) {
        for (var e in f) {
            val1 = g[e];
            val2 = f[e];
            if (val1 !== val2) {
                g[e] = val2
            }
        }
        return g
    };
    b.obj.copy = function (e) {
        return b.obj.extend({}, e)
    };
    b.obj.forEach = function (g, h, e) {
        for (var f in g) {
            h.call(e, f, g[f], g)
        }
    };
    b.obj.inverse = function (g) {
        var e = {};
        for (var f in g) {
            e[g[f]] = f
        }
        return e
    };
    b.obj.values = function (g) {
        var e = [];
        for (var f in g) {
            e.push(g[f])
        }
        return e
    };
    b.obj.has = function (g, f) {
        for (var e in g) {
            if (g[e] === f) {
                return true
            }
        }
        return false
    };
    b.windowReady = function (f) {
        if (a.readyState === "complete") {
            setTimeout(function () {
                f()
            }, 0);
            return
        }
        d.addEventListener("load", e, false);

        function e() {
            d.removeEventListener("load", e);
            setTimeout(function () {
                f()
            }, 0)
        }
    };
    b.ready = function () {
        var g = false,
            f = [];

        function h() {
            if (g) {
                return
            }
            g = true;
            for (var k;
                 (k = f.shift());) {
                try {
                    k()
                } catch (j) {
                    b.error(j)
                }
            }
        }
        function e(k) {
            try {
                a.documentElement.doScroll("left")
            } catch (j) {
                setTimeout(function () {
                    e(k)
                }, 1);
                return
            }
            if (k) {
                k()
            }
        }
        function i(l) {
            if (a.readyState === "complete") {
                setTimeout(l, 0);
                return
            }
            if (a.addEventListener) {
                a.addEventListener("DOMContentLoaded", l, false);
                d.addEventListener("load", l, false)
            } else {
                if (a.attachEvent) {
                    a.attachEvent("onreadystatechange", l);
                    d.attachEvent("onload", l);
                    var j = false;
                    try {
                        j = (d.frameElement === null)
                    } catch (k) {}
                    if (a.documentElement.doScroll && j) {
                        setTimeout(function () {
                            e(l)
                        }, 0)
                    }
                }
            }
        }
        i(h);
        return function (j) {
            if (typeof j !== "function") {
                throw TypeError("callback " + j + " must be a function")
            }
            if (g) {
                setTimeout(function () {
                    j()
                }, 0)
            } else {
                f.push(j)
            }
        }
    }()
})(window, document, cards);
(function (f, a, e) {
    e.events = d;
    e.events.handlers = g;

    function b() {
        this.handlers = {};
        this.onceHandlers = {};
        this.globalHandlers = [];
        this.globalOnceHandlers = []
    }
    b.prototype.insureNamespace = function (i) {
        if (!this.handlers[i]) {
            this.handlers[i] = []
        }
        if (!this.onceHandlers[i]) {
            this.onceHandlers[i] = []
        }
    };
    b.prototype.bind = function (i, j) {
        this.insureNamespace(i);
        this.handlers[i].push(j)
    };
    b.prototype.bindToAll = function (i) {
        this.globalHandlers.push(i)
    };
    b.prototype.bindOnce = function (i, j) {
        this.insureNamespace(i);
        this.onceHandlers[i].push(j)
    };
    b.prototype.bindToAllOnce = function (i) {
        this.globalOnceHandlers.push(i)
    };
    b.prototype.unbind = function (i, j) {
        this.insureNamespace(i);
        h(this.handlers[i], j);
        h(this.onceHandlers[i], j)
    };
    b.prototype.unbindFromAll = function (j) {
        h(this.globalHandlers, j);
        h(this.globalOnceHandlers, j);
        for (var i in this.handlers) {
            h(this.handlers[i], j);
            h(this.onceHandlers[i], j)
        }
    };
    b.prototype.trigger = function (j, k, i) {
        this.insureNamespace(j);
        if (typeof i === "undefined") {
            i = this
        }
        function l(m) {
            try {
                m.call(i, k, j)
            } catch (n) {
                e.utils.error(n)
            }
        }
        this.handlers[j].forEach(l);
        this.globalHandlers.forEach(l);
        this.onceHandlers[j].forEach(l);
        this.globalOnceHandlers.forEach(l);
        this.onceHandlers[j].splice(0);
        this.globalOnceHandlers.splice(0)
    };

    function h(j, l) {
        for (var k = j.length; k--;) {
            if (j[k] === l) {
                j.splice(k, 1)
            }
        }
    }
    function d(j) {
        if (typeof j === "undefined") {
            j = {}
        }
        var i = new b();
        j.on = function (k, l) {
            if (Array.isArray(k)) {
                k.forEach(function (m) {
                    j.on(m, l)
                });
                return
            }
            if (typeof l === "undefined") {
                l = k;
                k = ""
            }
            if (typeof k !== "string") {
                throw TypeError("name " + k + " must be a string")
            }
            if (typeof l !== "function") {
                throw TypeError("handler " + l + " must be a function")
            }
            if (k) {
                i.bind(k, l)
            } else {
                i.bindToAll(l)
            }
        };
        j.off = function (k, l) {
            if (Array.isArray(k)) {
                k.forEach(function (m) {
                    j.off(m, l)
                });
                return
            }
            if (typeof l === "undefined") {
                l = k;
                k = ""
            }
            if (typeof k !== "string") {
                throw TypeError("name " + k + " must be a string")
            }
            if (typeof l !== "function") {
                throw TypeError("handler " + l + " must be a function")
            }
            if (k) {
                i.unbind(k, l)
            } else {
                i.unbindFromAll(l)
            }
        };
        j.once = function (k, l) {
            if (Array.isArray(k)) {
                k.forEach(function (m) {
                    j.once(m, l)
                });
                return
            }
            if (typeof l === "undefined") {
                l = k;
                k = ""
            }
            if (typeof k !== "string") {
                throw TypeError("name " + k + " must be a string")
            }
            if (typeof l !== "function") {
                throw TypeError("handler " + l + " must be a function")
            }
            if (k) {
                i.bindOnce(k, l)
            } else {
                i.bindToAllOnce(l)
            }
        };
        j.trigger = function (l, m, k) {
            if (Array.isArray(l)) {
                l.forEach(function (n) {
                    j.trigger(n, m, k)
                });
                return
            }
            if (typeof l !== "string") {
                throw TypeError("name " + l + " must be a string")
            }
            i.trigger(l, m, k)
        };
        return j
    }
    function c() {
        this.handlers = [];
        this.events = []
    }
    c.prototype.addHandler = function (i) {
        this.handlers.push(i);
        return this.processEvents()
    };
    c.prototype.triggerEvent = function (i) {
        this.events.push(i);
        this.processEvents()
    };
    c.prototype.triggerEvents = function (i) {
        this.events = this.events.concat(i);
        this.processEvents()
    };
    c.prototype.processEvents = function () {
        if (!this.events.length || !this.handlers.length) {
            return
        }
        var j = this.events.splice(0),
            i = this.handlers;
        j.forEach(function (k) {
            i.forEach(function (l) {
                l(k)
            })
        });
        return true
    };

    function g() {
        var i = new c();
        return {
            handler: function (j) {
                return i.addHandler(j)
            },
            trigger: function (j) {
                i.triggerEvent(j)
            },
            triggerMulti: function (j) {
                i.triggerEvents(j)
            }
        }
    }
})(window, document, cards);
cards.ready = function (d, e) {
    var b = [];
    a();
    return c;

    function c(g) {
        if (b) {
            b.push(g)
        } else {
            f(g)
        }
    }
    function a() {
        e.utils.windowReady(function () {
            setTimeout(function () {
                var g = b.slice();
                b = null;
                g.forEach(f)
            }, 3)
        })
    }
    function f(h) {
        try {
            h()
        } catch (g) {
            e.utils.error(g)
        }
    }
}(window, cards);
cards.open = function (c, f) {
    var e = f.utils.platform.os,
        a = f.utils.platform.browser;
    c.open = function (g) {
        d(g)
    };
    d.card = b;
    return d;

    function d(i, h) {
        if (typeof i !== "string") {
            throw TypeError("url must be a string, got " + i)
        }
        switch (typeof h) {
            case "object":
                h = JSON.stringify(h);
            case "undefined":
            case "string":
                break;
            default:
                throw TypeError("linkData must be a string of JSON if defined, got " + h)
        }
        if (f.browser && f.browser.open) {
            f.browser.open(i, h);
            return
        }
        if (h) {
            i = i.split("#")[0] + "#" + encodeURIComponent(h)
        }
        var g = i.substr(0, 7) === "card://",
            j = i.substr(0, 8) === "cards://";
        if (!g && !j) {
            c.location.href = i;
            return
        }
        b(i, "http" + i.substr(4))
    }
    function b(i, g, h) {
        if (!e.ios && !e.android) {
            if (g) {
                c.location.href = g
            }
            return
        }
        if (e.ios || a.chrome) {
            if (g) {
                setTimeout(function () {
                    if (!document.webkitHidden) {
                        c.location.href = g
                    }
                }, e.ios ? 25 : 1000)
            }
            if (h) {
                f.ready(function () {
                    setTimeout(function () {
                        c.location.href = i
                    }, 0)
                })
            } else {
                c.location.href = i
            }
            return
        }
        var k;
        if (g) {
            k = setTimeout(function () {
                c.location = g
            }, 1000)
        }
        var j = document.createElement("iframe");
        j.style.position = "fixed";
        j.style.top = "0";
        j.style.left = "0";
        j.style.width = "1px";
        j.style.height = "1px";
        j.style.border = "none";
        j.style.opacity = "0";
        j.onload = function () {
            if (g) {
                clearTimeout(k)
            }
            try {
                document.documentElement.removeChild(j)
            } catch (l) {}
        };
        j.src = i;
        document.documentElement.appendChild(j)
    }
}(window, cards);
(function (b, c) {
    var a = "__PICARD_ID__";
    if (!b.localStorage) {
        return
    }
    if (!b.localStorage[a]) {
        b.localStorage[a] = c.utils.random.uuid()
    }
    c._.id = b.localStorage[a]
})(window, cards);
(function (b, a) {
    if (navigator.userAgent.indexOf("Kik/") === -1) {
        return
    }
    if (!/\bandroid/i.test(navigator.userAgent)) {
        return
    }
    if (!a || b.CardsBridge) {
        return
    }
    var c = b.CardsBridge = {};
    ["invokeAsyncFunction", "invokeFunction", "poll"].forEach(function (d) {
        c[d] = function () {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(d);
            return a("CardsBridge", JSON.stringify(e)) || ""
        }
    })
})(window, window.prompt);
(function (window) {
    if (!window.chrome) {
        return
    }
    if (!window.chrome.app) {
        return
    }
    if (window.shimsham) {
        return
    }
    var shimshamMeta = document.getElementById("shimsham-meta");
    if (shimshamMeta && (shimshamMeta.nodeName === "META")) {
        var url = shimshamMeta.content;
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            if (xhr.status === 200) {
                eval(xhr.responseText)
            } else {
                console.log("Failed to load shimsham, extension not installed get it at cards.kik.com")
            }
        } catch (e) {}
    }
})(window);
(function (window, document, picard) {
    var BRIDGE_SIGNAL_URL = window.location.protocol + "//cardsbridge.kik.com/",
        PLUGIN_REQUEST_BATCH = "batch-call",
        PLUGIN_REQUEST_NAME = "requestPlugin",
        PLUGIN_REQUEST_VERSION = "requestVersion",
        PLUGIN_LOG = "log";
    var plugins = {},
        os = picard.utils.platform.os,
        androidBridge = window.CardsBridge;

    function getBridge() {
        var bridgeInfo = getAndroidBridge();
        if (bridgeInfo) {
            return bridgeInfo
        }
        if (os.ios && !looksLikeChrome()) {
            return getIPhoneBridge()
        }
        return false
    }
    function looksLikeChrome() {
        try {
            return (typeof window.chrome.send === "function")
        } catch (err) {
            return false
        }
    }
    function getAndroidBridge() {
        if (!androidBridge) {
            return false
        }
        if (typeof androidBridge.invokeFunction !== "function") {
            return false
        }
        if (typeof androidBridge.poll !== "function") {
            return false
        }
        return makeBridgeCall(PLUGIN_REQUEST_VERSION).data
    }
    function getIPhoneBridge() {
        var bridgeInfo;
        try {
            bridgeInfo = makeBridgeCall(PLUGIN_REQUEST_VERSION).data
        } catch (err) {}
        return bridgeInfo ? bridgeInfo : false
    }
    function sendIFrameSignal(bridgeFunctionName, argData, asyncCallbackName) {
        var callbackName = picard.utils.random.name("PICARD_BRIDGE_CALLBACK"),
            status, data;
        window[callbackName] = function (callbackStatus, callbackData) {
            delete window[callbackName];
            status = callbackStatus;
            data = callbackData
        };
        var url = BRIDGE_SIGNAL_URL + bridgeFunctionName + "/" + callbackName + "?args=" + encodeURIComponent(argData) + "&async=" + (asyncCallbackName || "");
        var doc = document.documentElement,
            iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        doc.appendChild(iframe);
        doc.removeChild(iframe);
        if (window[callbackName]) {
            delete window[callbackName];
            throw Error("bridge call " + bridgeFunctionName + " failed to return")
        }
        return {
            status: status,
            data: data
        }
    }
    function sendBatchIFrameSignal(urls) {
        var calls = urls.map(function (url) {
            return encodeURIComponent(url)
        }).join(",");
        var url = BRIDGE_SIGNAL_URL + PLUGIN_REQUEST_BATCH + "?calls=" + calls;
        var doc = document.documentElement,
            iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        doc.appendChild(iframe);
        doc.removeChild(iframe)
    }
    function androidBridgeCall(bridgeFunctionName, argData, asyncCallbackName) {
        var response, result;
        if (!asyncCallbackName) {
            response = androidBridge.invokeFunction(bridgeFunctionName, argData)
        } else {
            if (androidBridge.invokeAsyncFunction) {
                response = androidBridge.invokeAsyncFunction(bridgeFunctionName, argData, asyncCallbackName)
            } else {
                throw TypeError("bridge: android bridge does not support async callbacks")
            }
        }
        try {
            result = JSON.parse(response)
        } catch (err) {
            throw TypeError("bridge call for " + bridgeFunctionName + " responded with invalid JSON")
        }
        return {
            status: result.status,
            data: result.data
        }
    }
    function makeBridgeCall(bridgeFunctionName, args, asyncCallback) {
        if (typeof bridgeFunctionName !== "string") {
            throw TypeError("bridge call " + bridgeFunctionName + " must be a string")
        }
        switch (typeof args) {
            case "function":
                asyncCallback = args;
                args = undefined;
            case "undefined":
                args = {};
            case "object":
                break;
            default:
                throw TypeError("bridge call arguments " + args + " must be a JSON object if specified")
        }
        switch (typeof asyncCallback) {
            case "undefined":
            case "function":
                break;
            default:
                throw TypeError("bridge async callback must be a function if defined, got " + asyncCallback)
        }
        var argData;
        try {
            argData = JSON.stringify(args)
        } catch (err) {
            throw TypeError("bridge call arguments " + args + " must be a JSON object")
        }
        var asyncCallbackName;
        if (asyncCallback) {
            asyncCallbackName = setupAsyncCallback(asyncCallback)
        }
        var result;
        if (androidBridge) {
            result = androidBridgeCall(bridgeFunctionName, argData, asyncCallbackName)
        } else {
            result = sendIFrameSignal(bridgeFunctionName, argData, asyncCallbackName)
        }
        if (asyncCallbackName && (!result || !result.status || (result.status !== 202))) {
            setTimeout(function () {
                if (!window[asyncCallbackName]) {
                    return
                }
                if (androidBridge) {
                    window[asyncCallbackName](JSON.stringify({
                        status: 500,
                        data: null
                    }))
                } else {
                    window[asyncCallbackName](500, null)
                }
            }, 0);
            result = {
                status: 202,
                data: {}
            }
        }
        return result
    }
    function setupAsyncCallback(asyncCallback) {
        var callbackName = picard.utils.random.name("PICARD_BRIDGE_ASYNC_CALLBACK");
        window[callbackName] = function (status, data) {
            delete window[callbackName];
            if (androidBridge) {
                try {
                    var response = JSON.parse(status);
                    status = response.status;
                    data = response.data
                } catch (err) {
                    throw Error("bridge failed to parse android async data, " + status)
                }
            }
            if ((typeof data !== "object") || (data === null)) {
                asyncCallback()
            } else {
                if (!status || (status < 200) || (status >= 300)) {
                    asyncCallback()
                } else {
                    asyncCallback(data)
                }
            }
        };
        return callbackName
    }
    function setupEventCallback(eventCallback) {
        var callbackName = picard.utils.random.name("PICARD_BRIDGE_EVENT_CALLBACK");
        window[callbackName] = function (name, data) {
            if (androidBridge) {
                try {
                    data = JSON.parse(data)
                } catch (err) {
                    throw Error("bridge failed to parse android event data, " + data)
                }
            }
            eventCallback(name, data)
        };
        return callbackName
    }
    function setupAndroidPoll() {
        window.addEventListener("keyup", function (e) {
            if (e.which !== 0) {
                return
            }
            performAndroidPoll();
            return false
        })
    }
    function performAndroidPoll() {
        var result = androidBridge.poll();
        if (!result) {
            return
        }
        var code = result + "";
        if (!code) {
            return
        }
        try {
            eval(code)
        } catch (err) {
            if (window.console && window.console.error) {
                window.console.error("android poll failed to evaluate " + code + ", " + err)
            }
        }
        performAndroidPoll()
    }
    function setupIOSLogging() {
        picard._.onLog(function (level, message) {
            try {
                makeBridgeCall(PLUGIN_LOG, {
                    level: level,
                    message: message
                })
            } catch (err) {}
        })
    }
    function bridgeFunctionCall(bridgeFunctionName, args, callback) {
        var data = makeBridgeCall(bridgeFunctionName, args, callback);
        if (!data) {
            throw Error("bridge call " + bridgeFunctionName + " did not return")
        }
        if (!data.status || (data.status < 200) || (data.status >= 300)) {
            throw Error("bridge call " + bridgeFunctionName + " did not complete successfully, " + data.status)
        }
        if (typeof data.data !== "object") {
            throw TypeError("bridge call " + bridgeFunctionName + " did not return an object, " + data.data)
        }
        return data.data
    }
    function setupFunction(bridgeFunctionName) {
        return function (args, callback) {
            return bridgeFunctionCall(bridgeFunctionName, args, callback)
        }
    }
    function setupFunctions(namespace, functionNames, pluginObj) {
        if (!Array.isArray(functionNames)) {
            throw TypeError("functions " + functionNames + " must be an array")
        }
        if (typeof pluginObj === "undefined") {
            pluginObj = {}
        }
        functionNames.forEach(function (functionName) {
            if (typeof functionName !== "string") {
                throw TypeError("function " + functionName + " must be a string")
            }
            pluginObj[functionName] = setupFunction(namespace + "." + functionName)
        })
    }
    function setupPlugin(pluginName) {
        var pluginObj = picard.events(),
            pluginData = makeBridgeCall(PLUGIN_REQUEST_NAME, {
                name: pluginName,
                eventCallback: setupEventCallback(pluginObj.trigger)
            });
        if (pluginData.status !== 200) {
            throw TypeError("plugin " + pluginName + " failed to initialize")
        }
        setupFunctions(pluginName, pluginData.data.functions, pluginObj);
        return pluginObj
    }
    function bridge(pluginName) {
        if (typeof pluginName !== "string") {
            throw TypeError("plugin name must be a string, got " + pluginName)
        }
        if (!plugins[pluginName]) {
            var plugin = setupPlugin(pluginName);
            plugins[pluginName] = plugin
        }
        return plugins[pluginName]
    }
    function batchRequest(calls) {
        if (!Array.isArray(calls)) {
            throw TypeError("batch calls must be an array, got " + calls)
        }
        calls.forEach(function (data) {
            if (typeof data !== "object") {
                throw TypeError("batch call must be an object, got " + data)
            }
            if (typeof data.name !== "string") {
                throw TypeError("batch call name must be a string, got " + data.name)
            }
            switch (typeof data.args) {
                case "undefined":
                case "object":
                    break;
                default:
                    throw TypeError("batch call args must be an object if defined, got " + data.args)
            }
            switch (typeof data.callback) {
                case "function":
                case "undefined":
                    break;
                default:
                    throw TypeError("batch call callback must be a function if defined, got " + data.callback)
            }
        });
        if (androidBridge) {
            return calls.map(function (data) {
                try {
                    if (data.name.indexOf(".") === -1) {
                        return bridge(data.name)
                    } else {
                        return bridgeFunctionCall(data.name, data.args, data.callback)
                    }
                } catch (err) {}
            })
        }
        var batchCalls = [],
            responses = new Array(calls.length);
        calls.forEach(function (data, index) {
            var isPluginRequest = (data.name.indexOf(".") === -1);
            if (!isPluginRequest) {
                batchCalls.push(generateBatchSegment(data, function (responseData) {
                    responses[index] = responseData
                }))
            } else {
                if (plugins[data.name]) {
                    responses[index] = plugins[data.name]
                } else {
                    batchCalls.push(generatePluginBatchSegment(data, function (responseData) {
                        responses[index] = responseData
                    }))
                }
            }
        });
        sendBatchIFrameSignal(batchCalls);
        return responses
    }
    function generateBatchSegment(data, callback) {
        var argData = JSON.stringify(data.args);
        var asyncCallbackName;
        if (data.callback) {
            asyncCallbackName = setupAsyncCallback(data.callback)
        }
        var callbackName = picard.utils.random.name("PICARD_BRIDGE_CALLBACK");
        setTimeout(function () {
            delete window[callbackName]
        }, 0);
        window[callbackName] = function (callbackStatus, callbackData) {
            delete window[callbackName];
            if (asyncCallbackName && callbackStatus !== 202) {
                delete window[asyncCallbackName]
            }
            if (callbackStatus >= 200 && callbackStatus < 300) {
                callback(callbackData)
            }
        };
        var url = BRIDGE_SIGNAL_URL + data.name + "/" + callbackName + "?args=" + encodeURIComponent(argData) + "&async=" + (asyncCallbackName || "");
        return url
    }
    function generatePluginBatchSegment(data, callback) {
        var pluginObj = picard.events(),
            argData = JSON.stringify({
                name: data.name,
                eventCallback: setupEventCallback(pluginObj.trigger)
            });
        var callbackName = picard.utils.random.name("PICARD_BRIDGE_CALLBACK");
        setTimeout(function () {
            delete window[callbackName]
        }, 0);
        window[callbackName] = function (callbackStatus, callbackData) {
            delete window[callbackName];
            if (callbackStatus === 200) {
                setupFunctions(data.name, callbackData.functions, pluginObj);
                plugins[data.name] = pluginObj;
                callback(pluginObj)
            }
        };
        var url = BRIDGE_SIGNAL_URL + PLUGIN_REQUEST_NAME + "/" + callbackName + "?args=" + encodeURIComponent(argData) + "&async=";
        return url
    }
    function redirectToCards() {
        var os = picard.utils.platform.os,
            urllib = picard.utils.url;
        if (!urllib.query.kikme || (!os.ios && !os.android)) {
            return
        }
        try {
            var iframe = document.createElement("iframe");
            iframe.src = "card" + urllib.updateQuery({
                kikme: null
            }).substr(4);
            iframe.style.display = "none";
            var cleanup = function () {
                try {
                    document.documentElement.removeChild(iframe)
                } catch (err) {}
            };
            iframe.onload = cleanup;
            iframe.onerror = cleanup;
            setTimeout(cleanup, 1000);
            document.documentElement.appendChild(iframe)
        } catch (err) {}
    }
    function main() {
        var bridgeInfo = getBridge();
        if (!bridgeInfo) {
            redirectToCards();
            return
        }
        picard._.bridge = bridge;
        picard._.bridge.batch = batchRequest;
        if (androidBridge) {
            setupAndroidPoll();
            picard._.bridge.forceAndroidPoll = performAndroidPoll
        } else {
            setupIOSLogging()
        }
        picard.enabled = true;
        bridge.info = bridgeInfo;
        bridge.version = bridgeInfo.version;
        picard.utils.platform.browser.name = "cards";
        picard.utils.platform.browser.cards = true;
        picard.utils.platform.browser.version = window.parseFloat(bridge.version);
        picard.utils.platform.browser.versionString = bridge.version
    }
    main()
})(window, document, cards);
(function (b, g) {
    var c = "kik-transform-fix";
    if (a()) {
        d()
    }
    function a() {
        var h = true;
        if (!g.enabled) {
            h = false
        } else {
            if (!g.utils.platform.os.android) {
                h = false
            } else {
                Array.prototype.forEach.call(b.getElementsByTagName("meta"), function (i) {
                    if ((i.name === c) && (i.content === "false")) {
                        h = false
                    }
                })
            }
        }
        return h
    }
    function d() {
        var h = b.documentElement;
        e(h, "translate3d(0,0,0)");
        setTimeout(function () {
            f(h, "transform 10ms linear");
            setTimeout(function () {
                e(h, "translate3d(0,0,1px)");
                setTimeout(function () {
                    f(h, "");
                    setTimeout(function () {
                        e(h, "")
                    }, 0)
                }, 10)
            }, 0)
        }, 0)
    }
    function e(i, h) {
        i.style["-webkit-transform"] = h;
        i.style["-moz-transform"] = h;
        i.style["-ms-transform"] = h;
        i.style["-o-transform"] = h;
        i.style.transform = h
    }
    function f(h, i) {
        if (i) {
            h.style["-webkit-transition"] = "-webkit-" + i;
            h.style["-moz-transition"] = "-moz-" + i;
            h.style["-ms-transition"] = "-ms-" + i;
            h.style["-o-transition"] = "-o-" + i;
            h.style.transition = i
        } else {
            h.style["-webkit-transition"] = "";
            h.style["-moz-transition"] = "";
            h.style["-ms-transition"] = "";
            h.style["-o-transition"] = "";
            h.style.transition = ""
        }
    }
})(document, cards);
(function () {
    try {
        var a = document.querySelector('meta[name="viewport"]');
        if (cards.enabled && a && /\bipad\b/i.test(navigator.userAgent)) {
            a.setAttribute("content", "initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
        }
    } catch (b) {}
})();
(function (c, a, b) {
    if (b._.bridge) {
        c.alert = function () {};
        c.confirm = function () {};
        c.prompt = function () {}
    }
})(window, document, cards);
(function (c, a, e) {
    var d = e.utils.platform.os,
        b = e.utils.platform.browser;
    if (c.navigator && b.cards && (b.version < 6.7) && d.android) {
        c.navigator.geolocation = undefined
    }
})(window, document, cards);
(function (d) {
    var b = {};
    d._.firstBatch = b;
    if (!d._.bridge || !d.utils.platform.os.ios || (d.utils.platform.browser.version < 6.5)) {
        return
    }
    var a = [{
        name: "Metrics"
    }, {
        name: "Browser"
    }, {
        name: "Media"
    }, {
        name: "Kik"
    }, {
        name: "Profile"
    }, {
        name: "UserData"
    }, {
        name: "Auth"
    }, {
        name: "Photo"
    }, {
        name: "Keyboard"
    }, {
        name: "Push"
    }, {
        name: "Picker"
    }];
    var c = [{
        name: "Browser.getLastLinkData",
        args: {}
    }, {
        name: "Browser.isPopupMode",
        args: {}
    }, {
        name: "Kik.getLastMessage",
        args: {}
    }, {
        name: "Push.getNotificationList",
        args: {}
    }, {
        name: "Picker.getRequest",
        args: {}
    }];
    d._.bridge.batch(a.concat(c)).slice(a.length).forEach(function (e, g) {
        var f = c[g];
        b[f.name] = e;
        if (!e) {} else {
            if (!d._.secondBatch) {
                d._.secondBatch = []
            }
        }
    })
})(cards);
(function (i, a) {
    var f;
    try {
        f = a._.bridge("Metrics")
    } catch (e) {}
    var k = a.events(),
        h = [];
    a.metrics = k;
    k.loadTime = null;
    k.coverTime = null;
    if (f) {
        f.on("loadData", function (o) {
            if (typeof o.loadTime === "number") {
                k.loadTime = o.loadTime;
                k.trigger("loadTime", o.loadTime)
            }
            if (typeof o.coverTime === "number") {
                k.coverTime = o.coverTime;
                k.trigger("coverTime", o.coverTime)
            }
        })
    }
    var n = false;
    k.enableGoogleAnalytics = m;
    k.event = j;
    k._cardsEvent = c;

    function m(q, o, p) {
        if (n) {
            return
        }
        n = true;
        if (q) {
            if (!p) {
                d(q, o)
            } else {
                l(q)
            }
        }
        g()
    }
    function d(p, o) {
        if (typeof p !== "string") {
            throw TypeError("google analytics ID must be a string, got " + p)
        }
        if (typeof o !== "string") {
            throw TypeError("google analytics host must be a string, got " + o)
        }
        i.GoogleAnalyticsObject = "ga";
        i.ga = i.ga ||
            function () {
                (i.ga.q = i.ga.q || []).push(arguments)
            }, i.ga.l = +new Date();
        a.ready(function () {
            var q = document.createElement("script"),
                r = document.getElementsByTagName("script")[0];
            q.async = 1;
            q.src = "//www.google-analytics.com/analytics.js";
            r.parentNode.insertBefore(q, r)
        });
        i.ga("create", p, o);
        i.ga("send", "pageview")
    }
    function l(o) {
        if (typeof o !== "string") {
            throw TypeError("google analytics ID must be a string, got " + o)
        }
        var p = i._gaq = [];
        p.push(["_setAccount", o]);
        p.push(["_trackPageview"]);
        a.ready(function () {
            var r = document.createElement("script");
            r.async = true;
            r.defer = true;
            r.id = "ga";
            r.src = "//www.google-analytics.com/ga.js";
            var q = document.getElementsByTagName("script")[0];
            q.parentNode.insertBefore(r, q)
        })
    }
    function g() {
        i.addEventListener("error", function (q) {
            var p = q.message || "";
            p += " (" + (q.filename || i.location.href);
            if (q.lineno) {
                p += ":" + q.lineno
            }
            p += ")";
            c("error", p)
        }, false);
        if ((typeof App === "object") && (typeof App.enableGoogleAnalytics === "function")) {
            App.enableGoogleAnalytics()
        }
        if (f) {
            b("loadTime");
            b("coverTime")
        }
        var o = h.slice();
        h = null;
        o.forEach(function (p) {
            j(p[0], p[1], p[2], p[3])
        })
    }
    function j(q, p, o, r) {
        if (typeof q !== "string") {
            throw TypeError("event category must be a string, got " + q)
        }
        if (typeof p !== "string") {
            throw TypeError("event name must be a string, got " + p)
        }
        switch (typeof o) {
            case "string":
                break;
            case "number":
                r = o;
            default:
                o = ""
        }
        switch (typeof r) {
            case "number":
                r = Math.floor(r);
                break;
            default:
                r = 0
        }
        if (h) {
            h.push([q, p, o, r]);
            return
        }
        if (typeof i.ga === "function") {
            i.ga("send", "event", q, p, o, r)
        } else {
            if (!i._gaq) {
                i._gaq = []
            }
            if (typeof i._gaq.push === "function") {
                i._gaq.push(["_trackEvent", q, p, o, r, true])
            }
        }
    }
    function c(p, o, q) {
        j("Cards", p, o, q)
    }
    function b(o) {
        if (k[o]) {
            c(o, k[o])
        } else {
            k.once(o, function () {
                c(o, k[o])
            })
        }
    }
})(window, cards);
(function (k, q, p) {
    function u(D, H) {
        var C = k.applicationCache,
            G = false;
        if (!C || !C.addEventListener || !C.swapCache || !C.update) {
            H(false);
            return
        }
        if (C.status === C.UPDATEREADY) {
            B();
            return
        }
        if ((C.status !== C.IDLE) && (C.status !== C.CHECKING) && (C.status !== C.DOWNLOADING)) {
            H(false);
            return
        }
        C.addEventListener("noupdate", E, false);
        C.addEventListener("updateready", B, false);
        C.addEventListener("error", B, false);
        C.addEventListener("obsolete", B, false);
        setTimeout(B, 30 * 1000);
        if (C.status === C.IDLE) {
            try {
                C.update()
            } catch (F) {
                B()
            }
        }
        function E() {
            if (G) {
                return
            }
            G = true;
            if (!D && k.console && k.console.log) {
                k.console.log("refresh requested but no update to manifest found");
                k.console.log("** update your manifest to see changes reflected")
            }
            setTimeout(function () {
                H(true)
            }, 1000)
        }
        function B() {
            if (G) {
                return
            }
            G = true;
            var I = false;
            if (C.status === C.UPDATEREADY) {
                try {
                    C.swapCache();
                    I = true
                } catch (J) {}
            }
            H(I)
        }
    }
    if (p.utils.platform.os.ios) {
        setTimeout(function () {
            u(true, function (B) {})
        }, 5000)
    }
    k.ZERVER_REFRESH = function () {
        c();
        u(true, function () {
            k.location.reload()
        })
    };

    function c() {
        try {
            k.ZERVER_KILL_STREAM()
        } catch (B) {}
    }
    function j(D) {
        if (typeof D !== "string") {
            return undefined
        }
        D = decodeURIComponent(D);
        var B;
        try {
            B = JSON.parse(D)
        } catch (C) {}
        if ((typeof B === "object") && (B !== null)) {
            return B
        } else {
            return D || undefined
        }
    }
    if (k.location.hash) {
        p.linkData = j(k.location.hash.substr(1))
    }
    var a;
    try {
        a = p._.bridge("Browser")
    } catch (d) {
        return
    }
    var y = p.events();
    p.browser = y;
    var A = {};
    if (a.setCardInfo) {
        var n = /(^|\s)icon(\s|$)/i,
            w, g, z, i;
        Array.prototype.forEach.call(q.getElementsByTagName("link"), function (B) {
            if (!w) {
                if ((B.rel === "kik-icon") || (n.test(B.rel) && !w)) {
                    w = B.href
                }
            }
            if (!g) {
                if (B.rel === "kik-tray-icon") {
                    g = B.href
                }
            }
            if (!z) {
                if (B.rel === "privacy") {
                    z = B.href
                }
            }
            if (!i) {
                if (B.rel === "terms") {
                    i = B.href
                }
            }
        });
        var m = {
            title: q.title,
            icon: w,
            mediaTrayIcon: g,
            privacy: z,
            terms: i
        };
        if (cards._.secondBatch) {
            cards._.secondBatch.push({
                name: "Browser.setCardInfo",
                args: m
            })
        } else {
            a.setCardInfo(m)
        }
    }
    if (a.pageLoaded) {
        p.utils.windowReady(function () {
            if (q.body) {
                var B = q.body.offsetWidth;
                (function (C) {
                    return C
                })(B)
            }
            setTimeout(function () {
                a.pageLoaded()
            }, 1)
        })
    }
    k.addEventListener("unload", function () {
        try {
            a.navigationAttempted()
        } catch (B) {}
    }, false);
    var s = true;
    if (a.setStatusBarVisible) {
        var l = false;
        y.statusBar = function (B) {
            l = true;
            a.setStatusBarVisible({
                visible: !! B
            });
            s = !! B
        }
    }
    if (a.setStatusBarTransparent) {
        y.statusBarTransparent = function (C) {
            var B;
            if (C === "black") {
                B = false
            } else {
                if (C) {
                    B = true
                }
            }
            try {
                if (a.setStatusBarTransparent({
                    transparent: !! C,
                    light: B
                })) {
                    return true
                }
            } catch (D) {}
            return false
        };
        var t;
        Array.prototype.forEach.call(q.getElementsByTagName("meta"), function (B) {
            if (B.name === "kik-transparent-statusbar") {
                t = (B.content || "").trim()
            }
        });
        if (t && (t !== "false") && y.statusBarTransparent(t)) {
            k.APP_ENABLE_IOS_STATUSBAR = true;
            try {
                if (typeof App._enableIOSStatusBar === "function") {
                    App._enableIOSStatusBar()
                }
            } catch (d) {}
        }
    }
    if (a.getOrientationLock && a.setOrientationLock) {
        y.getOrientationLock = function () {
            var B = a.getOrientationLock().position;
            return (B === "free") ? null : B
        };
        y.setOrientationLock = function (B) {
            switch (B) {
                case "free":
                case "portrait":
                case "landscape":
                    break;
                default:
                    if (!B) {
                        B = "free";
                        break
                    }
                    throw TypeError("if defined, position " + B + ' must be one of "free", "portrait", or "landscape"')
            }
            try {
                a.setOrientationLock({
                    position: B
                });
                if (!l && a.setStatusBarVisible && (s !== (B !== "landscape"))) {
                    a.setStatusBarVisible({
                        visible: (B !== "landscape")
                    });
                    s = (B !== "landscape")
                }
                return true
            } catch (C) {
                return false
            }
        }
    }
    a.on("orientationChanged", function () {
        try {
            k.App._layout()
        } catch (B) {}
    });
    if (a.setBacklightTimeoutEnabled) {
        y.backlightTimeout = function (B) {
            a.setBacklightTimeoutEnabled({
                enabled: !! B
            })
        }
    }
    if (a.forceRepaint) {
        y.paint = function () {
            if (q.body) {
                var B = q.body.offsetWidth;
                (function (C) {
                    return C
                })(B)
            }
            a.forceRepaint()
        }
    }
    var e = [];
    y.back = function (B) {
        if (typeof B !== "function") {
            throw TypeError("back handler " + B + " must be a function")
        }
        e.push(B)
    };
    y.unbindBack = function (C) {
        if (typeof C !== "function") {
            throw TypeError("back handler " + C + " must be a function")
        }
        for (var B = e.length; B--;) {
            if (e[B] === C) {
                e.splice(B, 1)
            }
        }
    };
    a.on("back", function (E) {
        var C = false;
        for (var B = e.length; B--;) {
            try {
                if (e[B]() === false) {
                    C = true;
                    break
                }
            } catch (D) {
                p.utils.error(D)
            }
        }
        a.handleBack({
            requestToken: E.requestToken,
            override: C
        })
    });
    y.back(function () {
        if (k.App && (typeof k.App.back === "function")) {
            try {
                if (App.back() !== false) {
                    return false
                }
            } catch (B) {}
        }
    });
    if (a.refresh && a.refreshPlanned) {
        y.refresh = function () {
            var B = k.applicationCache;
            c();
            if (!B || (B.status === B.UNCACHED)) {
                a.refresh({
                    withCache: false
                });
                return
            }
            u(false, function (C) {
                a.refresh({
                    withCache: true
                })
            })
        };
        a.on("refresh", function () {
            setTimeout(function () {
                a.refreshPlanned();
                y.refresh()
            }, 0)
        });
        k.ZERVER_REFRESH = function () {
            y.refresh()
        }
    }
    if (a.openCard && a.openExternal) {
        y.open = function (D, C, E) {
            if (typeof D !== "string") {
                throw TypeError("url " + D + " must be a string")
            }
            switch (typeof C) {
                case "undefined":
                case "string":
                    break;
                case "object":
                    C = JSON.stringify(C);
                    break;
                default:
                    throw TypeError("card linkData must be a string or JSON if defined, got " + C)
            }
            switch (typeof E) {
                case "undefined":
                    E = {};
                    break;
                case "object":
                    break;
                default:
                    throw TypeError("card data must be an object if defined, got " + E)
            }
            var B = D.substr(0, 7) === "card://",
                F = D.substr(0, 8) === "cards://";
            if (!B && !F) {
                a.openExternal({
                    url: D
                });
                return
            }
            D = "http" + D.substr(4);
            if (C) {
                D = D.split("#")[0] + "#" + encodeURIComponent(C)
            }
            a.openCard({
                url: D,
                title: E.title || undefined,
                icon: E.icon || undefined,
                clearHistory: !! E.clearHistory
            })
        }
    }
    var h = false;
    Array.prototype.forEach.call(q.getElementsByTagName("meta"), function (B) {
        if (B.name === "kik-https") {
            h = B.content
        }
    });
    if (h === k.location.host) {
        if (k.location.protocol === "https:") {
            try {
                a.performHttpsUpgradeCleanup()
            } catch (d) {}
        } else {
            try {
                a.openCard({
                    url: k.location.href.split("#")[0].replace(/^http\:/, "https:"),
                    title: q.title,
                    icon: w,
                    clearHistory: true
                })
            } catch (d) {}
        }
    }
    function r(C, B) {
        y.linkData = j(C && C.data);
        p.linkData = y.linkData;
        if ((B !== false) && y.linkData) {
            y.trigger("linkData", y.linkData)
        }
    }
    y._processLinkData = r;
    if (a.getLastLinkData) {
        r(cards._.firstBatch["Browser.getLastLinkData"] || a.getLastLinkData(), false)
    }
    a.on("linkData", r);
    var o = true,
        x = false,
        v = true;
    y.background = o;
    a.on("pause", function (B) {
        x = true;
        f()
    });
    a.on("unpause", function (B) {
        x = false;
        f()
    });
    a.on("conceal", function (B) {
        v = true;
        f()
    });
    a.on("reveal", function (B) {
        v = false;
        f()
    });

    function b() {
        return x || v
    }
    function f() {
        var B = o;
        o = b();
        y.background = o;
        if (B !== o) {
            y.trigger(o ? "background" : "foreground")
        }
    }
})(window, document, cards);
(function (g, c, f) {
    var d;
    try {
        d = f._.bridge("Media")
    } catch (e) {}
    if (!d || !d.setMediaCategory || !d.unsetMediaCategory) {
        f._mediaEnabled = function () {}
    } else {
        f._mediaEnabled = a;
        b()
    }
    function b() {
        var h = false;
        Array.prototype.forEach.call(c.getElementsByTagName("meta"), function (i) {
            if ((i.name === "kik-media-enabled") && (i.content === "true")) {
                h = true
            }
        });
        a(h)
    }
    function a(h) {
        if (cards._.secondBatch) {
            cards._.secondBatch.push({
                name: "Media." + (h ? "" : "un") + "setMediaCategory",
                args: {}
            })
        } else {
            try {
                if (h) {
                    d.setMediaCategory()
                } else {
                    d.unsetMediaCategory()
                }
            } catch (i) {}
        }
    }
})(window, document, cards);
(function (j, k, i) {
    var c;
    try {
        c = i._.bridge("Kik")
    } catch (f) {
        return
    }
    var b = i.events();
    i.kik = b;
    b._formatMessage = e;

    function e(o) {
        var m;
        if (typeof o !== "object") {
            throw TypeError("message " + o + " must be an object")
        }
        switch (typeof o.big) {
            case "undefined":
            case "boolean":
                break;
            default:
                throw TypeError("message size (big) " + o.big + " must be a boolean if defined")
        }
        switch (typeof o.title) {
            case "undefined":
            case "string":
                if (!o.big && !o.title) {
                    throw TypeError("message title must be a string")
                }
                o.title = o.title || "";
                break;
            default:
                throw TypeError("message title " + o.title + " must be a string")
        }
        switch (typeof o.text) {
            case "string":
            case "undefined":
                break;
            default:
                throw TypeError("message text " + o.text + " must be a string")
        }
        switch (typeof o.pic) {
            case "undefined":
            case "string":
                break;
            default:
                throw TypeError("message pic " + o.pic + " must be a string if defined")
        }
        switch (typeof o.noForward) {
            case "undefined":
            case "boolean":
                break;
            default:
                throw TypeError("message noForward flag must be a boolean if defined, got " + o.noForward)
        }
        switch (typeof o.fallback) {
            case "undefined":
            case "string":
                break;
            default:
                throw TypeError("message fallback URL must be a string if defined, got " + o.fallback)
        }
        switch (typeof o.linkData) {
            case "undefined":
            case "string":
                break;
            case "object":
                try {
                    m = JSON.stringify(o.linkData)
                } catch (n) {
                    throw TypeError("message linkData must be a string or JSON if defined, got " + o.linkData)
                }
                break;
            default:
                throw TypeError("message linkData must be a string or JSON if defined, got " + o.linkData)
        }
        var p = m || o.linkData;
        if (typeof p === "string") {
            p = encodeURIComponent(p)
        }
        var m;
        switch (typeof o.data) {
            case "object":
                if (o.data !== null) {
                    try {
                        m = JSON.stringify(o.data)
                    } catch (n) {
                        throw TypeError("message data must be a json object if defined, got " + o.data)
                    }
                }
            case "undefined":
                break;
            default:
                throw TypeError("message data must be a json object if defined, got " + o.data)
        }
        var l;
        if ((typeof o.data === "object") && (o.data !== null) && o.data.id) {
            l = o.data.id + ""
        }
        cards.metrics._cardsEvent("kikSend", l);
        return {
            title: o.title,
            text: o.text,
            image: o.pic,
            forwardable: !o.noForward,
            fallbackUrl: o.fallback,
            layout: o.big ? "photo" : "article",
            extras: {
                sender: i._.id,
                dataID: l,
                messageID: i.utils.random.uuid(),
                linkData: p || "",
                jsonData: m || ""
            }
        }
    }
    b.send = function (m, l) {
        if (typeof m !== "string") {
            l = m;
            m = undefined
        }
        l = e(l);
        l.targetUser = m;
        if (m && c.sendKikToUser) {
            c.sendKikToUser(l)
        } else {
            c.sendKik(l)
        }
    };
    var h = i.events.handlers();
    b.handler = function (l) {
        return h.handler(l)
    };

    function g(o, l) {
        a();
        if (!o.extras.sender || (o.extras.sender !== i._.id)) {
            cards.metrics._cardsEvent("kikReceive", o.extras.dataID)
        }
        if (o.extras.jsonData) {
            var m;
            try {
                m = JSON.parse(o.extras.jsonData)
            } catch (n) {}
            if ((typeof m === "object") && (m !== null)) {
                b.message = m;
                h.trigger(m);
                b.trigger("message", m)
            }
        }
        if (o.extras && o.extras.linkData && i.browser && i.browser._processLinkData) {
            i.browser._processLinkData({
                data: o.extras.linkData
            }, l)
        }
    }
    if (c.getLastMessage) {
        var d = cards._.firstBatch["Kik.getLastMessage"] || c.getLastMessage();
        if (d && d.message) {
            g(d.message, false)
        }
    }
    c.on("message", g);
    if (c.openConversation) {
        b.open = function () {
            c.openConversation()
        }
    }
    if (c.openConversationWithUser) {
        b.openConversation = function (m, l) {
            c.openConversationWithUser({
                username: m
            }, function (n) {
                l && l(n)
            })
        }
    }
    function a() {
        if (!c.openConversation) {
            return
        }
        b.returnToConversation = function (l) {
            b.returnToConversation = null;
            if (!l) {
                c.openConversation({
                    returnToSender: true
                });
                return
            }
            l = e(l);
            l.returnToSender = true;
            c.sendKik(l)
        }
    }
})(window, document, cards);
(function (f, a, e) {
    var b;
    try {
        b = e._.bridge("Profile")
    } catch (d) {
        return
    }
    var c = e.kik;
    if (!c) {
        c = e.events();
        e.kik = c
    }
    if (b.openProfile) {
        c.showProfile = function (h) {
            if (typeof h !== "string") {
                throw TypeError("username must be a string, got " + h)
            }
            try {
                b.openProfile({
                    username: h
                })
            } catch (g) {}
        }
    }
})(window, document, cards);
(function (h, i, b) {
    var k;
    try {
        k = b._.bridge("UserData")
    } catch (e) {
        return
    }
    var c = b.kik;
    if (!c) {
        c = b.events();
        b.kik = c
    }
    function j(l) {
        if (!l) {
            return undefined
        }
        l.fullName = (l.displayName || "");
        var m = l.fullName.indexOf(" ");
        if (m === -1) {
            l.firstName = l.fullName;
            l.lastName = ""
        } else {
            l.firstName = l.fullName.substr(0, m);
            l.lastName = l.fullName.substr(m + 1)
        }
        delete l.displayName;
        l.pic = f(l.pic);
        l.thumbnail = f(l.thumbnail);
        return l
    }
    function f(l) {
        if (typeof l !== "string") {
            return l
        }
        var m = l.replace(/^https?\:\/\/[^\/]*/, "");
        return "//d33vud085sp3wg.cloudfront.net" + m
    }
    var g;
    if (k.getUserData) {
        c.getUser = function (n) {
            switch (typeof n) {
                case "undefined":
                    n = function () {};
                case "function":
                    break;
                default:
                    throw TypeError("callback must be a function if defined, got " + n)
            }
            if (g) {
                n(g);
                return
            }
            var m = c.hasPermission(),
                l = b.utils.platform.os;
            k.getUserData({
                fields: ["profile"]
            }, function (p) {
                var o = j(p && p.userData);
                if (o) {
                    g = o
                }
                if (l.ios && !m) {
                    setTimeout(function () {
                        n(o)
                    }, 600)
                } else {
                    n(o)
                }
            })
        }
    }
    c.hasPermission = function () {
        try {
            return !!k.checkPermissions({
                fields: ["profile"]
            }).permitted
        } catch (l) {
            return false
        }
    };
    if (k.pickUsers || k.pickFilteredUsers) {
        c.pickUsers = function (l, m) {
            switch (typeof l) {
                case "function":
                    m = l;
                case "undefined":
                    l = {};
                case "object":
                    break;
                default:
                    throw TypeError("options must be an object if defined, got " + l)
            }
            if (typeof m !== "function") {
                throw TypeError("callback must be a function, got " + m)
            }
            switch (typeof l.preselected) {
                case "undefined":
                    l.preselected = [];
                    break;
                default:
                    if (!Array.isArray(l.preselected)) {
                        throw TypeError("preselected users must be an array of users if defined, got " + l.preselected)
                    }
                    l.preselected.forEach(function (n) {
                        if (typeof n !== "object") {
                            throw TypeError("user must be an object, got " + n)
                        }
                        if (typeof n.username !== "string") {
                            throw TypeError("user.username must be a string, got " + n.username)
                        }
                    });
                    break
            }
            switch (typeof l.filtered) {
                case "undefined":
                    l.filtered = [];
                    break;
                default:
                    if (!Array.isArray(l.filtered)) {
                        throw TypeError("filtered users must be an array of users if defined, got " + l.filtered)
                    }
                    l.filtered = l.filtered.map(function (n) {
                        switch (typeof n) {
                            case "string":
                                return n;
                            case "object":
                                if (n !== null && typeof n.username === "string") {
                                    return n.username
                                }
                            default:
                                throw TypeError("filtered user didnt have a username, got " + n)
                        }
                    });
                    break
            }
            switch (typeof l.filterSelf) {
                case "undefined":
                    l.filterSelf = true;
                case "boolean":
                    break;
                default:
                    throw TypeError("filterSelf must be a boolean if defined, got " + l.filterSelf)
            }
            switch (typeof l.minResults) {
                case "undefined":
                    break;
                case "number":
                    if (l.minResults < 0) {
                        throw TypeError("minResults must be non-negative if defined, got " + l.minResults)
                    }
                    break;
                default:
                    throw TypeError("minResults must be a number if defined, got " + l.minResults)
            }
            switch (typeof l.maxResults) {
                case "undefined":
                    break;
                case "number":
                    if (l.maxResults < 1) {
                        throw TypeError("maxResults must be greater than 1 if defined, got " + l.maxResults)
                    }
                    break;
                default:
                    throw TypeError("maxResults must be a number if defined, got " + l.maxResults)
            }
            switch (typeof m) {
                case "undefined":
                    m = function () {};
                    break;
                case "function":
                    break;
                default:
                    throw TypeError("callback must be a function if defined, got " + m)
            }
            if (l.preselected.length && l.filtered.length) {
                throw TypeError("can only preselect or filter users, not both")
            }
            if (k.pickFilteredUsers && !l.preselected.length) {
                d(l, m)
            } else {
                a(l, m)
            }
        }
    }
    function d(l, m) {
        l.minResults = l.minResults || 1;
        k.pickFilteredUsers({
            minResults: l.minResults,
            maxResults: l.maxResults,
            filtered: l.filtered,
            filterSelf: l.filterSelf
        }, function (n) {
            if (!n || !n.userDataList) {
                m();
                return
            }
            var o = n.userDataList.map(j);
            if (l.filtered) {
                o = o.filter(function (p) {
                    return l.filtered.indexOf(p.username) === -1
                })
            }
            m(o)
        })
    }
    function a(n, r) {
        var p = false;
        if (!n.preselected || !n.preselected.length) {
            n.minResults = n.minResults || 1
        }
        var l = {},
            o = [];
        n.preselected.forEach(function (s) {
            l[s.username] = s;
            o.push(s.username)
        });
        k.pickUsers({
            minResults: n.minResults,
            maxResults: n.maxResults,
            preselected: o,
            filterSelf: n.filterSelf
        }, function (s) {
            if (p) {
                return
            }
            if (!s || !s.userDataList) {
                p = true;
                r();
                return
            }
            var t = s.userDataList.map(function (u) {
                if (u.username in l) {
                    return l[u.username]
                } else {
                    return j(u)
                }
            });
            if (n.filtered) {
                t = t.filter(function (u) {
                    return n.filtered.indexOf(u.username) === -1
                })
            }
            p = true;
            r(t)
        });
        var q = b.utils.platform.os,
            m = b.utils.platform.browser;
        if (q.ios && m.cards && m.version < 6.5) {
            b.browser.once("foreground", function () {
                setTimeout(function () {
                    if (!p) {
                        p = true;
                        r()
                    }
                }, 0)
            })
        }
    }
})(window, document, cards);
(function (e, a, g) {
    var b;
    try {
        b = g._.bridge("Auth")
    } catch (d) {}
    if (!b || !b.signRequest) {
        return
    }
    var c = g.kik;
    if (!c) {
        c = g.events();
        g.kik = c
    }
    c.sign = function (j, l, h) {
        if (typeof j !== "string") {
            throw TypeError("data to be signed must be a string, got " + j)
        }
        if (typeof l !== "function") {
            throw TypeError("callback must be a function, got " + l)
        }
        h = !! h;
        var k = g.utils.platform.os,
            i = g.utils.platform.browser;
        if (k.android && i.version < 6.5) {
            g.ready(function () {
                f(j, l, h)
            })
        } else {
            f(j, l, h)
        }
    };

    function f(i, j, h) {
        b.signRequest({
            request: i,
            skipPrompt: h
        }, function (l) {
            if (!l || !l.signedRequest) {
                j()
            } else {
                var k = l.host || e.location.host;
                j(l.signedRequest, l.username, k)
            }
        })
    }
    if (b.getAnonymousId) {
        c.getAnonymousUser = function (h) {
            b.getAnonymousId(function (i) {
                if (i && i.anonymousId) {
                    h(i.anonymousId)
                } else {
                    h()
                }
            })
        }
    }
    if (b.signAnonymousRequest) {
        c.anonymousSign = function (h, i) {
            if (typeof h !== "string") {
                throw TypeError("data to be signed must be a string, got " + h)
            }
            if (typeof i !== "function") {
                throw TypeError("callback must be a function, got " + i)
            }
            b.signAnonymousRequest({
                request: h
            }, function (j) {
                if (!j || !j.signedRequest) {
                    i()
                } else {
                    i(j.signedRequest, j.anonymousId, j.host)
                }
            })
        }
    }
})(window, document, cards);
(function (f, h, d) {
    var i;
    try {
        i = d._.bridge("Photo")
    } catch (b) {
        return
    }
    var a = d.events();
    d.photo = a;
    if (i.getPhoto) {
        a.get = function (j, k) {
            e(j, k)
        };
        a.getFromCamera = function (j, k) {
            e("camera", j, k)
        };
        a.getFromGallery = function (j, k) {
            e("gallery", j, k)
        }
    }
    function c(j, k) {
        switch (typeof k) {
            case "undefined":
            case "function":
                break;
            default:
                throw TypeError(j + " must be a function if defined, got " + k)
        }
    }
    function g(j, l, k, m) {
        switch (typeof l) {
            case "undefined":
                break;
            case "number":
                if (l < k || l > m) {
                    throw TypeError(j + " must be within " + k + " and " + m + " if defined, got " + l)
                }
                break;
            default:
                throw TypeError(j + " must be a number if defined, got " + l)
        }
    }
    function e(j, y, x) {
        if (typeof j !== "string") {
            x = y;
            y = j;
            j = undefined
        }
        switch (typeof y) {
            case "function":
                x = y;
                y = {};
            case "object":
                break;
            default:
                throw TypeError("options must be an object, got " + y)
        }
        c("callback", x);
        c("onCancel", y.onCancel);
        c("onSelect", y.onSelect);
        c("onPhoto", y.onPhoto);
        c("onComplete", y.onComplete);
        g("quality", y.quality, 0, 1);
        g("minResults", y.minResults, 0, 25);
        g("maxResults", y.maxResults, 1, 25);
        g("maxHeight", y.maxHeight, 0, 1280);
        g("maxWidth", y.maxWidth, 0, 1280);
        var r = y.onSelect,
            t = y.onCancel,
            v = y.onPhoto,
            l = y.onComplete,
            s = false,
            m = d.utils.platform.os,
            o = d.utils.platform.browser,
            q, u;
        if (y.minResults === 0) {
            y.minResults = 1
        }
        i.getPhoto({
            source: j,
            quality: y.quality,
            minResults: y.minResults,
            maxResults: y.maxResults,
            maxHeight: y.maxHeight,
            maxWidth: y.maxWidth,
            autoSave: y.saveToGallery
        }, n);
        if (m.android && (o.version < 6.7)) {
            d.browser.once("foreground", function () {
                setTimeout(function () {
                    if (s) {
                        return
                    }
                    s = true;
                    p(t);
                    p(x)
                }, 0)
            })
        }
        function n(z) {
            if (s) {
                return
            }
            s = true;
            q = z && z.photoIds;
            var A = q && q.length;
            if (!A) {
                p(t);
                p(x);
                return
            }
            p(r, A);
            u = new Array(A);
            i.on("photo", w)
        }
        function w(D) {
            if (!D) {
                return
            }
            var B = q.indexOf(D.id);
            if (B === -1) {
                return
            }
            D.url = D.url || null;
            q[B] = null;
            u[B] = D.url;
            var A = 0;
            for (var C = 0, z = q.length; C < z; C++) {
                if (q[C] !== null) {
                    A++
                }
            }
            p(v, D.url, B);
            if (A === 0) {
                k()
            }
        }
        function k() {
            i.off("photo", w);
            p(l, u);
            p(x, u)
        }
        function p(C, A, z) {
            if (!C) {
                return
            }
            try {
                C(A, z)
            } catch (B) {
                d.utils.error(B)
            }
        }
    }
    if (i.savePhoto) {
        a.saveToGallery = function (j, m) {
            switch (typeof m) {
                case "undefined":
                    m = function () {};
                case "function":
                    break;
                default:
                    throw TypeError("callback must be a function, got " + m)
            }
            try {
                i.savePhoto({
                    url: j
                }, function (n) {
                    k( !! n)
                })
            } catch (l) {
                k(false)
            }
            function k(n) {
                k = function () {};
                m(n)
            }
        }
    }
})(window, document, cards);
(function (i, j, a) {
    var b;
    try {
        b = a._.bridge("Keyboard")
    } catch (f) {}
    var k = "kik-hide-form-helpers";
    var h = a.utils.platform.browser;
    l();
    a.formHelpers = {
        show: g,
        hide: e,
        isEnabled: c
    };

    function l() {
        var m;
        Array.prototype.forEach.call(j.getElementsByTagName("meta"), function (n) {
            if (n.name === k) {
                m = (n.content || "").trim()
            }
        });
        if (m !== "true") {
            return
        }
        if (h.cards && h.version <= 6.5) {
            a.ready(function () {
                d(false)
            })
        } else {
            d(false)
        }
    }
    function e() {
        d(false)
    }
    function g() {
        d(true)
    }
    function d(m) {
        if (a._.secondBatch) {
            a._.secondBatch.push({
                name: "Keyboard.setFormNavigationEnabled",
                args: {
                    enabled: m
                }
            })
        } else {
            try {
                b.setFormNavigationEnabled({
                    enabled: m
                })
            } catch (n) {}
        }
    }
    function c() {
        try {
            return !!b.isFormNavigationEnabled().enabled
        } catch (m) {
            return !!a.utils.platform.os.ios
        }
    }
})(window, document, cards);
(function (e, f, a) {
    var g;
    try {
        g = a._.bridge("Picker")
    } catch (b) {
        return
    }
    if (!g.startRequest) {
        return
    }
    var d = a.events(h);
    a.picker = d;

    function h(k, j, l) {
        if (typeof k !== "string") {
            throw TypeError("picker url must be a string, got " + k)
        }
        switch (typeof j) {
            case "function":
                l = j;
            case "undefined":
                j = {};
            case "object":
                break;
            default:
                throw TypeError("picker options must be an object if defined, got " + j)
        }
        if (typeof l !== "function") {
            throw TypeError("picker callback must be a function, got " + l)
        }
        g.startRequest({
            requestUrl: k,
            requestData: j
        }, function (m) {
            l(m && m.responseData)
        })
    }
    if (g.getRequest && g.completeRequest) {
        var c, i;
        try {
            c = (a._.secondBatch ? a._.firstBatch["Picker.getRequest"] : g.getRequest()).requestData
        } catch (b) {}
        if (c && f.referrer) {
            i = !! (c && c.kik && (f.referrer.split("?")[0] === "https://kik.com/"));
            d.url = f.referrer;
            d.data = c;
            d.fromKik = i;
            d.reply = function (k) {
                if (i && k) {
                    k = a.kik._formatMessage(k)
                }
                try {
                    g.completeRequest({
                        responseData: k
                    })
                } catch (j) {}
            };
            d.cancel = function () {
                try {
                    g.cancelRequest()
                } catch (j) {}
                if (!d.isPopup) {
                    d.url = undefined;
                    d.data = undefined;
                    d.reply = undefined;
                    d.cancel = undefined;
                    d.trigger("cancel")
                }
            }
        } else {}
    } else {}
    try {
        if (a._.firstBatch && a._.firstBatch["Browser.isPopupMode"]) {
            d.isPopup = a._.firstBatch["Browser.isPopupMode"].popup
        } else {
            d.isPopup = a._.bridge("Browser").isPopupMode().popup
        }
    } catch (b) {
        d.isPopup = false
    }
})(window, document, cards);
(function (g, b, h) {
    var a;
    try {
        a = h._.bridge("Push")
    } catch (f) {
        return
    }
    var c = h.events();
    h.push = c;
    if (a.setBadgeVisibility) {
        c.badge = function (i) {
            a.setBadgeVisibility({
                visible: !! i,
                blue: true
            });
            c.trigger("badge", !! i)
        }
    }
    if (a.getPushToken) {
        c.getToken = function (i) {
            if (typeof i !== "function") {
                throw TypeError("callback must be a function, got " + i)
            }
            a.getPushToken(function (j) {
                i(j && j.token)
            })
        }
    }
    if (a.getNotificationList) {
        var d = h.events.handlers();
        var e = function () {
            var p;
            try {
                if (h._.firstBatch && h._.firstBatch["Push.getNotificationList"]) {
                    p = h._.firstBatch["Push.getNotificationList"]
                } else {
                    p = a.getNotificationList()
                }
            } catch (o) {}
            var k = (h.picker && h.picker.isPopup),
                r = true;
            if (!k) {
                r = false;
                try {
                    a.setBadgeVisibility({
                        visible: false
                    });
                    c.trigger("badge", false)
                } catch (o) {}
            } else {
                c.once("badge", function () {
                    r = false
                })
            }
            var n = [];
            if (p && p.notifications) {
                for (var m = 0, j = p.notifications.length; m < j; m++) {
                    if (typeof p.notifications[m] === "object") {
                        switch (typeof p.notifications[m].data) {
                            case "object":
                                n.push(p.notifications[m].data);
                                break;
                            case "string":
                                try {
                                    var q = JSON.parse(p.notifications[m].data);
                                    if (typeof q === "object") {
                                        n.push(q)
                                    } else {}
                                } catch (o) {}
                                break;
                            default:
                                break
                        }
                    }
                }
            }
            if (n.length) {
                d.triggerMulti(n);
                n.forEach(function (i) {
                    c.trigger("push", i)
                })
            } else {
                r = false
            }
            if (r) {
                try {
                    a.setBadgeVisibility({
                        visible: true,
                        blue: true
                    });
                    c.trigger("badge", true)
                } catch (o) {}
            }
        };
        c.handler = function (i) {
            return d.handler(i)
        };
        a.on("notificationReceived", function () {
            var i = h.utils.platform;
            if (i.os.ios && i.browser.version < 6.4) {
                setTimeout(e, 0)
            } else {
                e()
            }
        });
        e()
    }
})(window, document, cards);
(function (f, g, b) {
    var h;
    try {
        h = b._.bridge("IAP")
    } catch (d) {
        return
    }
    if (!h.purchase || !h.markTransactionStored || !h.getTransactionList) {
        return
    }
    var c = b.events(a);
    c.init = i;
    b.purchase = c;

    function i(j, n) {
        if (typeof arguments[0] === "string") {
            j = Array.prototype.slice.call(arguments)
        }
        if (!Array.isArray(j)) {
            throw TypeError("list of SKUs must be an array")
        }
        j.forEach(function (o) {
            if (typeof o !== "string") {
                throw TypeError("SKU must be a string, got " + o)
            }
        });
        if (typeof n === "function") {
            if (!h.getAvailableItemsAsynchronously) {
                var m;
                try {
                    m = h.getAvailableItems({
                        skus: j
                    })
                } catch (k) {}
                l(m)
            } else {
                h.getAvailableItemsAsynchronously({
                    skus: j
                }, l)
            }
        } else {
            if (!h.getAvailableItems) {
                l()
            } else {
                var m;
                try {
                    m = h.getAvailableItems({
                        skus: j
                    })
                } catch (k) {}
                l(m)
            }
        }
        function l(q) {
            var o;
            try {
                o = q.items
            } catch (p) {}
            if (!o || !Array.isArray(o)) {
                o = []
            }
            var r;
            try {
                r = h.getTransactionList({
                    skus: j
                }).transactions
            } catch (p) {
                r = []
            }
            r.forEach(function (t) {
                if (!t.sku) {
                    try {
                        t.sku = JSON.parse(f.atob(t.content.split(".")[1])).item.sku
                    } catch (s) {}
                }
            });
            c.init = null;
            c.complete = e;
            c.items = o;
            c.pending = r;
            if (typeof n === "function") {
                n()
            }
        }
    }
    function a(n, l, m, j) {
        switch (typeof n) {
            case "object":
                if (n === null) {
                    throw TypeError("SKU must be a string, got " + n)
                }
                if (typeof n.sku !== "string") {
                    throw TypeError("SKU must be a string, got " + n.sku)
                }
                n = n.sku;
            case "string":
                break;
            default:
                throw TypeError("SKU must be a string, got " + n)
        }
        var k = c.items.map(function (o) {
            return o.sku
        }).indexOf(n);
        if (k === -1) {
            throw TypeError("SKU not available, got " + n)
        }
        switch (typeof l) {
            case "boolean":
                m = l;
                l = undefined;
            case "function":
                j = m;
                m = l;
            case "undefined":
                l = {};
            case "object":
                break;
            default:
                throw TypeError("purchase data must be a JSON object if defined, got " + l)
        }
        switch (typeof m) {
            case "boolean":
                j = m;
            case "undefined":
                m = function () {};
            case "function":
                break;
            default:
                throw TypeError("purchase callback must be a function if defined, got " + m)
        }
        switch (typeof j) {
            case "undefined":
                j = false;
            case "boolean":
                break;
            default:
                throw TypeError("skipPrompt must be a boolean if defined, got " + j)
        }
        h.purchase({
            sku: n,
            data: l,
            skipPrompt: j
        }, function (o) {
            if (!o) {
                m(undefined, true);
                return
            }
            if (!o.transaction) {
                m();
                return
            }
            c.pending.push(o.transaction);
            m(o.transaction)
        })
    }
    function e(k) {
        if (typeof k !== "string") {
            throw TypeError("transactionId must be a string, got " + k)
        }
        h.markTransactionStored({
            transactionId: k
        });
        for (var j = c.pending.length; j--;) {
            if (c.pending[j].transactionId === k) {
                c.pending.splice(j, 1)
            }
        }
    }
})(window, document, cards);
(function (c, a, d) {
    if (b()) {
        e()
    }
    function b() {
        var g = d.utils.platform.os,
            f = d.utils.platform.browser;
        return (g.ios && f.cards && (f.version < 6.5))
    }
    function e() {
        a.documentElement.addEventListener("click", function (g) {
            if (!g.defaultPrevented && g.target && g.target.nodeName === "A" && g.target.href && !g.target._clickable) {
                var f = d.browser;
                if (f) {
                    f.open(g.target.href);
                    g.preventDefault();
                    return false
                }
            }
        })
    }
})(window, document, cards);
(function (a) {
    delete a._.firstBatch;
    if (a._.secondBatch) {
        a._.bridge.batch(a._.secondBatch);
        delete a._.secondBatch
    }
})(cards);
(function (h, i, a) {
    var c = "kik-prefer",
        f = "kik-more",
        d = "kik-unsupported";
    b();
    k();

    function b() {
        if (a.enabled) {
            return
        }
        var m = a.utils.url;
        if (m.query._app_platform) {
            return
        }
        var n = "card" + m.updateQuery({
                kikme: null
            }).substr(4),
            l = !! m.query.kikme,
            o;
        if (!l) {
            Array.prototype.forEach.call(i.getElementsByTagName("meta"), function (p) {
                if ((p.name === c) && (p.content || "").trim()) {
                    l = true
                } else {
                    if (p.name === f) {
                        o = (p.content || "").trim();
                        if (o.substr(0, 7) === "http://") {
                            o = o.substr(7)
                        } else {
                            if (o.substr(0, 8) === "https://") {
                                o = o.substr(8)
                            }
                        }
                    }
                }
            });
            if (o && (o.substr(0, h.location.host.length) !== h.location.host)) {
                l = false
            }
        }
        if (l) {
            a.ready(function () {
                a.open.card(n, undefined, true)
            })
        }
    }
    function e() {
        var s = a.utils.platform.os,
            o;
        Array.prototype.forEach.call(i.getElementsByTagName("meta"), function (l) {
            if (l.name === d) {
                o = (l.content || "").trim()
            }
        });
        if (!o) {
            return true
        }
        var m = true;
        var t = o.split(",");
        for (var q = 0, n = t.length; q < n; q++) {
            var r = t[q].trim();
            var p = g(r);
            if (r && p) {
                if (p.ios && s.ios) {
                    if (s.version < (p.version + 1)) {
                        m = false
                    }
                } else {
                    if (p.android && s.android) {
                        if (s.version <= p.version) {
                            m = false
                        }
                    }
                }
            }
        }
        return m
    }
    function g(l) {
        var o = -1,
            n = false,
            m = false;
        if (l.indexOf("android-") === 0) {
            m = true;
            o = parseFloat(l.replace("android-", ""));
            if (o >= 2.3) {
                return j(l)
            }
        } else {
            if (l.indexOf("ios-") === 0) {
                n = true;
                o = parseFloat(l.replace("ios-", ""));
                if (o >= 5) {
                    return j(l)
                }
            } else {
                return j(l)
            }
        }
        return {
            ios: n,
            android: m,
            version: o
        }
    }
    function j(l) {
        if (h.console && h.console.error) {
            h.console.error('"' + l + '" is an unsupported value for the "' + d + '" meta tag')
        }
        return false
    }
    function k() {
        if (e()) {
            return
        }
        var m = a.utils.platform.os,
            t = i.documentElement;
        Array.prototype.forEach.call(t.childNodes, function (w) {
            t.removeChild(w)
        });
        t.style["min-height"] = "0";
        t.style["min-width"] = "0";
        t.style.height = "0";
        t.style.width = "0";
        t.style.padding = "0";
        t.style.border = "none";
        t.style.margin = "0";
        t.style.overflow = "hidden";
        var r = i.createElement("head"),
            v = i.createElement("meta");
        v.name = "viewport";
        v.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        r.appendChild(v);
        t.appendChild(r);
        var n = i.createElement("body");
        n.style.margin = "0";
        n.style.padding = "0";
        var l = i.createElement("div");
        l.style.position = "absolute";
        l.style.top = "0";
        l.style.left = "0";
        l.style.height = "0";
        l.style.width = "0";
        l.style.background = "#31333B";
        l.style.zIndex = "100000000000";
        l.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
        if (m.android) {
            l.style.fontFamily = '"Roboto", sans-serif'
        }
        var o = i.createElement("div");
        o.style.position = "fixed";
        o.style.left = "0";
        o.style.zIndex = "100000000000";
        var q = i.createElement("div");
        q.style.backgroundImage = "url('http://cdn.kik.com/cards/unsupported_icon.png')";
        q.style["background-size"] = "100%";
        q.style.width = "100px";
        q.style.height = "100px";
        q.style.margin = "0 auto";
        var s = i.createElement("div");
        s.style.color = "#E0E0E0";
        s.style.padding = "20px";
        s.style.textAlign = "center";
        s.style.margin = "0 auto";
        s.style.fontSize = "16px";
        s.innerHTML = "Oh no! This Card isn't supported on your phone.";
        var u = i.createElement("div");
        u.style.color = "#979799";
        u.style.padding = "0 20px";
        u.style.textAlign = "center";
        u.style.margin = "0 auto";
        u.innerHTML = "This card is not available for your phone. But don't worry! You can still use the Kik Messenger you know and love :)";
        o.appendChild(q);
        o.appendChild(s);
        o.appendChild(u);
        l.appendChild(o);
        if (m.android && m.version < 2.3) {
            Array.prototype.forEach.call(t.childNodes, function (w) {
                t.removeChild(w)
            })
        }
        n.appendChild(l);
        t.appendChild(n);
        t.style["-webkit-user-select"] = "none";
        t.style["user-select"] = "none";
        t.style.background = "#31333B";

        function p() {
            t.style.height = screen.height + "px";
            t.style.width = screen.width + "px";
            t.style["max-height"] = screen.height + "px";
            t.style["max-width"] = screen.width + "px";
            n.style.height = screen.height + "px";
            n.style.width = screen.width + "px";
            l.style.height = screen.height + "px";
            l.style.width = screen.width + "px";
            o.style.width = screen.width + "px";
            o.style.top = screen.height * 0.15 + "px";
            s.style.width = screen.width * 0.65 + "px";
            u.style.width = screen.width * 0.65 + "px"
        }
        h.onorientationchange = function (w) {
            if (w.stopImmediatePropagation) {
                w.stopImmediatePropagation()
            }
            w.preventDefault();
            w.stopPropagation();
            w.cancelBubble = true;
            w.returnValue = false;
            return false
        };
        setTimeout(p, 50);
        if (t.addEventListener) {
            t.addEventListener("resize", p, false)
        }
        delete h.cards;
        throw TypeError("OS Version is not supported.")
    }
})(window, document, cards);