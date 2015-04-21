;(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        factory(require, exports, module);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['module', 'exports', 'require', './mixin', './runtime'], factory);
    } else {
        console && console.error('Unsupported module environment.'); // jshint ignore:line
    }
}(this, function (module, exports, require) {

    'use strict';

    var Mixin = require('./mixin'),

        Runtime = require('./runtime'),

        VanDyke;

    // Create the vandyke class
    VanDyke = Runtime.extend({}, {
        Mixin: Mixin,

        Runtime: Runtime,

        // Shortcut to create a mixin
        mixin: function (React) {
            // Initialize a mixin including the default runtime
            this.Runtime(React);
            this.Mixin(Runtime);

            return new this.Mixin();
        }
    });

    module.exports = VanDyke;

}));