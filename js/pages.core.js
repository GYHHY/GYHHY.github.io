/*
 * Copyright (c) 2018-2020 Karlatemp. All rights reserved.
 * @author Karlatemp <karlatemp@vip.qq.com> <https://github.com/Karlatemp>
 * @create 2020/02/21 08:24:59
 *
 * MXLib/expend.pages.core/pages.core.js
 */

PagesCore = (function () {
    // noinspection ES6ConvertVarToLetConst
    var sidebar = document.createElement("div");
    // noinspection ES6ConvertVarToLetConst
    var panel = document.createElement("div");
    sidebar.className = "sidebar";
    panel.className = "panel";
    var stored = {};
    var md = markdownit({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    //return '<pre class="hljs"><code>' +
                    return hljs.highlight(lang, str, true).value;// +
                    //'</code></pre>';
                } catch (__) {
                }
            }
            return /*'<pre class="hljs"><code>' +*/ md.utils.escapeHtml(str) /*+ '</code></pre>'*/;
        }
    });
    var buttons = {};

    /**
     * @param {HTMLDivElement} p
     * @param {*[][]}data
     */
    function add_buttons(p, data) {
        for (var comp of data) {
            if (comp.length === 0) continue;
            var title = comp[0];
            var href = String(comp[1]);
            var subs = comp[2];
            var but = document.createElement("div");
            but.className = "side-but-panel";
            var clicker = document.createElement("div");
            clicker.textContent = title;
            clicker.className = "side-button";
            if (href != null) {
                var link = document.createElement("a");
                if (href[0] === ':') {
                    var path = href.substring(1);
                    buttons[path] = clicker;
                    link.href = "javascript:void(0)";
                    link.onclick = (function (path) {
                        return function () {
                            result.open(path);
                        };
                    })(path);
                } else {
                    link.href = href;
                }
                link.appendChild(clicker);
                but.appendChild(link);
            } else {
                but.appendChild(clicker);
            }
            p.appendChild(but);
            if (subs != null && subs.length) {
                var store = document.createElement("div");
                store.className = "side-but-store";
                but.appendChild(store);
                add_buttons(store, subs);
            }
        }
    }

    // noinspection ES6ConvertVarToLetConst
    var result = {
        initialize: function () {
            document.body.appendChild(sidebar);
            document.body.appendChild(panel);
        },
        open: function (path) {
            if (path in stored) {
                var elm = stored[path];
                if (elm != null) {
                    while (panel.firstElementChild) panel.firstElementChild.remove();
                    panel.appendChild(elm);
                }
            } else {
                stored[path] = null;
                this.load(path);
            }
        },
        load: function (path) {
            var connect = new XMLHttpRequest();
            connect.onreadystatechange = function () {
                if (connect.readyState === XMLHttpRequest.DONE) {
                    if (connect.status === 200) {
                        var html = md.render(connect.responseText);
                        var dom = document.createElement("div");
                        dom.innerHTML = html;
                        stored[path] = dom;
                        result.open(path);
                    }
                }
            };
            connect.open('GET', path);
            connect.send();
        },
        pages: function (data, open) {
            add_buttons(sidebar, data);
            result.open(open);
        }
    };
    return result;
})();