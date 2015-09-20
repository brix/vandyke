;(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        factory(require, exports, module);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['require', 'exports', 'module', './utils', 'cla55'], factory);
    } else {
        console && console.error('Unsupported module environment.'); // jshint ignore:line
    }
}(this, function (require, exports, module) {

    'use strict';

    var _ = require('./utils'),

        // Pseudo class implementation (all mixin properties needs to be own properties)
        Cla55 = (function () {
            var Cla55 = require('cla55').Cla55;

            return Cla55.extend({}, {
                // jscs:disable safeContextKeyword
                extend: function () {
                    var Parent = this,
                        Child = Cla55.extend.apply(this, arguments),
                        key;

                    // Ensure static copy from parent
                    for (key in Parent.prototype) {
                        if (Parent.prototype.hasOwnProperty(key) && !Child.prototype.hasOwnProperty(key)) {
                            Child.prototype[key] = Parent.prototype[key];
                        }
                    }

                    // Make the static class accessable when creating instance
                    Child.prototype.__STATIC = Child;

                    return Child;
                }
                // jscs:enable safeContextKeyword
            });
        }()),

        emptyTemplate = function () {
            return null;
        },

        Mixin;

    Mixin = Cla55.extend({
        constructor: function constructor(VanDykeRuntime) {
            var that = this;

            if (that instanceof Mixin) {
                // Initialize instance of Mixin

                that = _.assign({}, that.__STATIC.prototype);

                // Prefere runtime from arguments
                if (!VanDykeRuntime) {
                    VanDykeRuntime = that.vandyke;
                }

                // Check whether a VanDyke Runtime is defined
                if (!VanDykeRuntime) {
                    throw 'VanDyke Mixin needs a defined VanDyke Runtime';
                }

                // Prevent React to context binding for this class
                that.vandyke = function (template) {
                    return new VanDykeRuntime(template);
                };

                // Remove the constructor to avoid conflicts in React
                delete that.constructor;

                // Remove the reference of the static class
                delete that.__STATIC;
            } else {
                // Static initialize of Mixin

                // Initial define of React
                that.prototype.vandyke = VanDykeRuntime;
            }

            return that;
        },

        // VanDyke runtime
        vandyke: null,

        // Mixin defaults rewritable by extending the class
        _vandykeHelpers: {},

        _vandykeComponents: {},

        _vandykeListeners: function () {
            return this;
        },

        _vandykeData: function () {
            return _.assign({}, this.props, this.state);
        },

        _vandykeTemplate: function () {
            return this.template || emptyTemplate;
        },

        _vandykeRender: function () {
            // Set the template to render
            this.vandyke.template = _.result(this, 'vandykeTemplate', this._vandykeTemplate);

            // Render
            return this.vandyke.render(
                _.result(this, 'vandykeData', this._vandykeData),
                {
                    listeners: _.result(this, 'vandykeListeners', this._vandykeListeners),
                    helpers: _.result(this, 'vandykeHelpers', this._vandykeHelpers),
                    components: _.result(this, 'vandykeComponents', this._vandykeComponents)
                }
            );
        },

        // Overwrite defaults by defining your own for each component
        /*
        template: require('path-to/template.vandyke'),

        vandykeHelpers: {},

        vandykeComponents: {},

        vandykeListeners: function () {
            return this;
        },

        vandykeData: function () {
            return {};
        },

        vandykeTemplate: function () {
            return this.props.foo ? templateFoo : templateBar;
        },

        vandykeRender: function () {
            return this._vandykeRender();
        },
        */

        // React life cycle
        componentWillMount: function () {
            // Create vandyke instance
            this.vandyke = this.vandyke();
        },

        render: function () {
            return _.result(this, 'vandykeRender', this._vandykeRender);
        }
    }, {});

    module.exports = Mixin;

}));