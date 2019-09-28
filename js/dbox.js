var BBox = (function () {
    function Box(/** @type {HTMLElement} */dom) {
        this.dom = dom;
        /**
         * @type {Box}
         */
        this.parent_ = null;
    }
    Box.prototype.append = function (elm) {
        if (elm.dom) elm = elm.dom;
        this.dom.appendChild(elm);
        return this;
    };
    Box.prototype.text = function (t) {
        this.dom.textContent = t;
        return this;
    };
    Box.prototype.html = function (htm) {
        this.dom.innerHTML = htm;
        return this;
    };
    Box.prototype.css = function (k, v) {
        this.dom.style[k] = v;
        return this;
    };
    Box.prototype.create = function (name) {
        var d = document.createElement(name);
        this.dom.appendChild(d);
        var b = new Box(d);
        b.parent_ = this;
        return b;
    };
    Box.prototype.parent = function () {
        var p = this.parent_;
        if (p == null) p = this.dom.parentElement;
        if (p instanceof Box) {
            return p;
        }
        if (p == null) return null;
        return this.parent_ = new Box(p);
    };
    Box.prototype.node = function (nd) {
        this.dom.appendChild(document.createTextNode(nd));
        return this;
    };
    Box.prototype.span = function (nd) {
        return this.create("span").text(nd);
    };
    Box.prototype.on = Box.prototype.event = function (ev, cb) {
        this.dom.addEventListener(ev, cb);
        return this;
    };
    Box.prototype.prop = function (k) {
        return this.dom[k];
    }
    Box.prototype.propertie = function (k, v) {
        this.dom[k] = v;
        return this;
    };
    Box.prototype.attr = function (k, v) {
        this.dom.setAttribute(k, v);
        return this;
    };
    Box.prototype.att = function (k) {
        return this.dom.getAttribute(k);
    };
    Box.prototype.invoke = function (/** @type {(dom:HTMLElement,box:Box)=>void}*/fun) {
        fun(this.dom, this);
        return this;
    };
    Box.prototype.newLink = function (href, text, returnLink) {
        if (text == null) text = href;
        var r = this.create("a").text(text).propertie("href", href);
        if (returnLink) return r;
        return this;
    };
    Box.prototype.color = function (color) {
        this.dom.style.color = color;
        return this;
    };
    Box.prototype.bg = function (color) {
        this.dom.style.background = color;
        return this;
    };
    Box.create = function (name) {
        return new Box(document.createElement(name));
    }
    Box.newLink = function (href, text, returnLink) {
        if (text == null) text = href;
        var dom = document.createElement("a");
        var box = new Box(dom).text(text).propertie("href", href);
        if (returnLink) return box;
        return dom;
    }
    return Box;
})();