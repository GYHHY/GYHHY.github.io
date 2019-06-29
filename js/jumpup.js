var jjp = (function () {
    /**
     * @type {HTMLDivElement}
     */
    var pg;
    var p = {};
    function search() {
        if (pg == null) {
            pg = document.getElementById("page");
            console.log(pg);
        }
    }
    p.jump = function (link) {
        search();
        if (link != null) {
            var d = document.createElement("span");
            var lk = document.createElement("a");
            lk.textContent = lk.href = link;
            d.appendChild(document.createTextNode("Will jump to "));
            d.appendChild(lk);
            d.appendChild(document.createTextNode(" at "));
            var time = document.createTextNode("5");
            d.appendChild(time);
            d.appendChild(document.createTextNode(" times."));
            var t = 5;
            var jumped = false;
            var inv = setInterval(function () {
                if (t-- <= 0) {
                    clearInterval(inv);
                    if (!jumped) {
                        jumped = true;
                        location.href = link;
                    }
                }
                time.textContent = t;
            }, 1000);
            lk.onclick = function () {
                clearInterval(inv);
                jumped = true;
            }
            pg.appendChild(d);
        }
    }
    return p;
})();