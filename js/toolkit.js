Toolkit = (function () {
    var FinalPointer = (function (thiz, propertie) {
        var setted = false;
        var val;
        Object.defineProperty(thiz, propertie, {
            get() { return val; },
            set(v) {
                if (setted) return;
                setted = true;
                val = v;
            },
            enumerable: true, configurable: false
        });
        return thiz;
    });
    var Optional = (function () {
        var emp;
        class Optional {
            constructor(val) {
                if (val == null && emp != null) {
                    throw new Error("Optianl unsupport null value.");
                }
                FinalPointer(this, "$val");
                this.$val = val;
            }
            static empty() {
                return emp;
            }
            static ofNullable(value) {
                if (value == null) return emp;
                return new Optional(value);
            }
            static of(value) {
                if (value == null) throw new TypeError("Null Pointer Exception.");
                return new Optional(value);
            }
            get() {
                if (this.$val == null)
                    throw new TypeError("Value has not present.");
                return this.$val;
            }
            isPresent() {
                return this.$val != null;
            }
            isEmpty() {
                return this.$val == null;
            }
            isPresent(func) {
                if (this.$val != null) {
                    func(this.$val);
                }
            }
            ifPresentOrElse(func, emp) {
                if (this.$val == null) {
                    emp();
                } else {
                    func(this.$val);
                }
            }
            filter(filt) {
                if (this.$val == null) return this;
                return filt(this.$val) ? this : emp;
            }
            map(func) {
                if (this.$val == null) {
                    return this;
                }
                return Optional.ofNullable(func(this.$val));
            }
            orElseGet(func) {
                if (this.$val == null) return func();
                return this.$val;
            }
            orElseThrow(func) {
                if (this.$val != null) return this.$val;
                throw func();
            }
            orElse(vv) {
                return this.$val == null ? vv : this.$val;
            }
        }
        emp = new Optional(null);
        return Optional;
    })();
    var ProxyMapping = (function () {
        function nothing() { }
        function dump(vv, source, proxy, onlyread) {
            Object.defineProperty(proxy, vv, {
                enumerable: true, configurable: false,
                get: function () { return source[vv]; },
                set: onlyread ? nothing : function (v) {
                    source[vv] = v;
                }
            });
        }
        return function (source, proxy, properties, onlyread) {
            for (var v of properties) {
                dump(v, source, proxy, onlyread);
            }
        }
    })();
    var JsonBuilder = (function () {
        class JsonBuilder {
            static create(w) {
                return new JsonBuilder(w);
            }
            constructor(wrap) {
                if (wrap == null) {
                    this.path = [];
                } else {
                    this.path = [wrap];
                }
            }
            current() {
                var pt = this.path;
                if (pt.length == 0) return undefined;
                return pt[pt.length - 1];
            }
            name(ne) {
                var curr = this.current();
                if (!curr) throw new TypeError("Error in setting name with no element.");
                if (curr instanceof Array) throw new TypeError("Error in setting name with a array.");
                this.name_ = ne;
                return this;
            }
            value(val) {
                var curr = this.current();
                if (curr) {
                    if (curr instanceof Array) {
                        curr.push(val);
                    } else if (!this.name_) {
                        throw new TypeError("Error in pushing value with no name.");
                    } else {
                        curr[this.name_] = val;
                        this.name_ = undefined;
                    }
                    return this;
                }
                throw new TypeError("Cannot put a value with no element");
            }
            beginArray() {
                var pt = this.path, ox;
                var last = this.current();
                pt.push(ox = []);
                if (last) {
                    if (last instanceof Array) {
                        last.push(ox);
                    } else {
                        var n = this.name_;
                        if (n == null) throw new TypeError("Error in beginArray this no name.");
                        last[n] = ox;
                        this.name_ = undefined;
                    }
                }
                return this;
            }
            beginObject() {
                var pt = this.path, ox;
                var last = this.current();
                pt.push(ox = {});
                if (last) {
                    if (last instanceof Array) {
                        last.push(ox);
                    } else {
                        var ne = this.name_;
                        if (ne == null) throw new TypeError("Error in beginObject with no name.");
                        last[ne] = ox;
                        this.name_ = undefined;
                    }
                }
                return this;
            }
            end() {
                var pt = this.path;
                if (pt.length == 1) {
                    return pt[0];
                }
                pt.pop();
                return this;
            }
            endObject() {
                if (this.current() instanceof Array) {
                    throw new TypeError("Cannot end with a array.");
                }
                return this.end();
            }
            endArray() {
                if (this.current() instanceof Array) {
                    return this.end();
                }
                throw new TypeError("Cannot end with a object.");
            }
            finish() {
                return this.path[0];
            }
        }
        return JsonBuilder;
    })();
    return {
        Optional: Optional,
        FinalPointer: FinalPointer,
        ProxyMapping: ProxyMapping,
        JsonBuilder: JsonBuilder
    };
})();