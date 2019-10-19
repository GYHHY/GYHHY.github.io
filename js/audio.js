MAudio = (function () {
    function awx(x) {
        var k = Math.floor(x * 10) / 10;
        if ((k % 1) == 0) k += '.0';
        var w = String(k);
        if (w.length == 3) w = "0" + w;
        return w;
    }
    function timeToTime(v) {
        var mins = Math.floor(v / 60);
        var h = Math.floor(mins / 60);
        mins = mins % 60;
        var s = v % 60;
        return h + ":" + mins + ":" + awx(s);
    }
    var updates = [];
    function update(iv) {
        /**
         * @type {HTMLAudioElement}
         */
        var player = iv[0];
        if (iv[2] != player.currentTime) {
            iv[3].textContent = timeToTime(iv[2] = player.currentTime);
            iv[6].value = player.currentTime;
        }
        if (iv[4] != player.duration) {
            iv[5].textContent = timeToTime(iv[4] = player.duration);
            iv[6].max = player.duration;
        }
        var bb = player.buffered;
        var bt = 0;
        if (bb.length > 0) bt = bb.end(bb.length - 1);
        iv[6].buffered = bt;
    }
    setInterval(function () {
        for (var iv of updates) {
            if (iv[1]) {
                update(iv);
            }
        }
    }, 100);
    var rgg = [];
    (function () {
        /**
         * @type {HTMLDivElement}
         */
        var current;
        /**
         * @type {HTMLDivElement}
         */
        var current_size;
        var f = rgg.push;
        var hook;
        rgg.push = function (v) {
            /**
             * @type {HTMLDivElement}
             */
            var but = v[1];
            /**
             * @type {HTMLDivElement}
             */
            var div = v[0];
            var hk = v[2];
            but.addEventListener("mousedown", function (e) {
                current = but;
                current_size = div;
                div.updating = true;
                hook = hk;
                e.preventDefault();
            });
            return f.apply(this, arguments);
        };
        addEventListener("mousemove", function (e) {
            if (current != null) {
                var box = current_size.getBoundingClientRect();
                var ed = box.width;
                var fr = Math.min(Math.max(0, e.pageX - box.left), ed);
                var a = fr * 100 / ed;
                current.style.left = a + '%';
                current.value = a * current.max;
                e.preventDefault();
                // console.log(e.pageX, box.left, fr, ed);
            }
        });
        addEventListener("mouseup", function (e) {
            if (current_size != null) {
                current_size.updating = false;
                if (hook)
                    try { hook() } catch (e) { console.log(e) }
                current_size = null;
                current = null;
                hook = null;
                e.preventDefault();
            }
        });
    })();
    function RG(hook) {
        var div = document.createElement("div");
        div.className = "input-range";
        var bbed = document.createElement("div");
        div.appendChild(bbed).className = "range-buffered";
        var but = document.createElement("div");
        div.appendChild(but).appendChild(document.createElement("div"));
        but.className = "range-button";
        var max = 1, lm = 1;
        var current = 0, lc = 0;
        var buffered = 0, lb = 0;
        function upd() {
            if (div.updating) return;
            var o = 0b11;
            if (max == lm) {
                o = 0;
                if (current != lc) {
                    lc = current;
                    o |= 1;
                }
                if (buffered != lb) {
                    lb = buffered;
                    o |= 2;
                }
            } else {
                lm = max;
                lc = current;
                lb = buffered;
            }
            if (o & 2)
                bbed.style.width = buffered * 100 / max + '%';
            if (o & 1)
                but.style.left = current * 100 / max + '%';
        }
        Object.defineProperties(div, {
            value: {
                configurable: false, enumerable: true,
                get() { return current },
                set(v) { current = v; upd(); }
            },
            max: {
                configurable: false, enumerable: true,
                get() { return max },
                set(v) { max = v; upd() }
            },
            buffered: {
                configurable: false, enumerable: true,
                get() { return buffered },
                set(v) { buffered = v; upd() }
            }
        });
        rgg.push([div, but, hook]);
        return div;
    }
    return function create() {
        var player = document.createElement("audio");
        var doc = document.createElement("div");
        var manager;

        doc.player = player;
        Toolkit.ProxyMapping(player, doc, [
            "src", "translate", "videoTracks", "volume", "loop",
            "audioTracks", "autoplay", "buffered", "crossOrigin",
            "currentSrc", "currentTime", "duration", "ended", "error",
            "lang", "localName", "mediaKeys", "paused", "preload",
            "seekable", "seeking", "srcObject", "textTracks",
            "networkState", "playbackRate"
        ]);
        var shadow = doc.attachShadow({ mode: "closed" });
        var sty = document.createElement("style");
        shadow.appendChild(sty);
        sty.textContent = '\
*{ box-sizing: border-box; }\
.length{ background: #66ccff; color: white;}\
.pool{ background: black; width: 100%; height: 30px; padding: 2px }\
.pool>div{ float:left; height: 26px; margin-right: 2px;}\
.sbut{background:white; width: 26px; }\
.text{line-height:26px;}\
.input-range{top:11px;position:relative;min-width:90px;background-color:white;height:4px!important}\
.input-range>div{height:4px;position: absolute}\
.input-range>.range-button>div{position:relative;width:14px;height:14px;left:-5px;top:-5px;border-radius:100%;background:red;}\
.input-range>.range-buffered{background:#2fe67a}';
        var pool = document.createElement("div");
        pool.className = "pool";
        shadow.appendChild(pool);
        var st = document.createElement("div");
        st.className = "sbut";
        pool.appendChild(st);
        var leng = document.createElement("div");
        leng.className = "length text";
        var currentTime = document.createElement('span'),
            fullTime = document.createElement("span");
        leng.appendChild(currentTime);
        currentTime.textContent = timeToTime(player.currentTime);
        leng.appendChild(document.createTextNode(" / "));
        leng.appendChild(fullTime).textContent = timeToTime(player.duration);
        pool.appendChild(leng);
        var pl = RG(() => {
            player.currentTime = pl.value;
        });
        pl.min = 0;
        pl.max = player.duration;
        st.addEventListener("click", function (e) {
            if (player.paused) {
                player.play();
            } else {
                player.pause();
            }
            e.preventDefault();
            return false;
        });
        pool.appendChild(pl);
        updates.push(manager = [player, true,
            player.currentTime, currentTime,
            player.duration, fullTime, pl
        ]);
        doc.play = () => {
            player.play();
            manager[1] = true;
            update(manager);
        };
        doc.pause = () => {
            player.pause();
            manager[1] = false;
            update(manager);
        };
        return doc;
    };
})();