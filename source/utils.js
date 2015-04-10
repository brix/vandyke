/*global require, exports, module*/

'use strict';

var _ = {
        slice: function slice(arr, index, length) {
            return Array.prototype.slice.call(arr, index, length || arr.length);
        },

        isArray: Array.isArray || function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        isObject: function isObject(obj) {
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

        result: function result(object, property, fallback) {
            /*jshint eqnull: true*/
            var value = object == null ? undefined : object[property];
            /*jshint eqnull: false*/

            if (value === undefined) {
                value = fallback;
            }

            return typeof value === 'function' ? value.call(object) : value;
        },

        bind: (
            Function.prototype.bind ?
            function bind(func, context) {
                return Function.prototype.bind.apply(func, _.slice(arguments, 1));
            } :
            function bind(func, context) {
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

            return function create(obj) {
                Creator.prototype = obj;

                return new Creator();
            };
        }())
    };

module.exports = _;
