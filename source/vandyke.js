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
