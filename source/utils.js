/*global require, exports, module*/

var _ = {
        slice: function (arr, index, length) {
            return Array.prototype.slice.call(arr, index, length || arr.length)
        },

        isArray: Array.isArray || function(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        },

        isObject: function(obj) {
            return obj === Object(obj);
        },

        assign: function assign(target, source) {
            var key;

            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }

            return target;
        },

        result: function(object, property, fallback) {
            var value = object == null ? undefined : object[property];

            if (value === undefined) {
                value = fallback;
            }

            return typeof value === 'function' ? value.call(object) : value;
        },

        bind: (
            Function.prototype.bind ?
            function (func, context) {
                return Function.prototype.bind.apply(func, _.slice(arguments, 1));
            } :
            function (func, context) {
                var args = _.slice(arguments, 2);

                if (typeof func !== 'function') {
                    throw new TypeError('Bind must be called on a function');
                }

                return function () {
                    func.apply(context, args);
                };
            }
        ),

        create: Object.create || (function () {
            var Creator = function Creator() {
                    Creator.prototype = proto;
                },

                proto = Creator.prototype;

            return function (obj) {
                Creator.prototype = obj;

                return new Creator();
            }
        }())
    };

module.exports = _;
