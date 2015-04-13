'use strict';

var _ = require('./utils'),

    Cla55 = require('cla55'),

    VanDyke,

    // Define default objects (don't create always new objects)
    emptyObject = {},

    emptyTemplate = function () {
        return null;
    };

// Create the vandyke class
VanDyke = Cla55.extend({
    constructor: function constructor(template) {
        if (this instanceof VanDyke) {
            // Initialize instance of VanDyke

            // Set the template
            this.template = template || this.template || emptyTemplate;
        } else {
            // Static initialize of VanDyke

            // Initial define of React
            this.prototype.React = template;
        }

        return this;
    },

    helpers: {
        'if': function (args, body, alternate) {
            if (args.length && args[0]) {
                return body && body();
            } else {
                return alternate && alternate();
            }
        },

        'unless': function (args, body, alternate) {
            if (args.length && !args[0]) {
                return body && body();
            } else {
                return alternate && alternate();
            }
        },

        'each': function (args, body) {
            var list = args[0],
                l = list && list.length,
                i = 0,
                result;

            if (_.isArray(list)) {
                result = [];

                for (; i < l; i++) {
                    result[i] = body(list[i], {
                        index: i,
                        position: i + 1,
                        first: i === 0,
                        last: i + 1 === l
                    });
                }
            }

            return result;
        },

        'with': function (args, body) {
            if (_.isObject(args[0])) {
                return body(args[0]);
            }
        }
    },

    components: {},

    // Template related methods
    data: function data(ctx, path, fromScope) {
        var last = ctx.scope.length - 1,
            store = fromScope ? ctx.scope[last] : ctx.store[last],
            key,
            i,
            l;

        try {
            for (i = 0, l = path.length; i < l; i++) {
                key = path[i];

                if (key === '..') {
                    store = fromScope ? ctx.scope[--last] : ctx.store[--last];
                } else {
                    store = store[key];
                }
            }
        } catch (error) {
            store = void 0;
        }

        return store;
    },

    listener: function listener (ctx, name) {
        return ctx.listeners[name];
    },

    helper: function helper(ctx, name, args, body, alternate) {
        var helperArgs = [],
            helperMethod = ctx.helpers[name] || this.helpers[name];

        // Iterate over array / use object context
        if (!helperMethod && !args.length) {
            args = [this.data(ctx, [name])];

            name = _.isArray(args[0]) ? 'each' : 'with';
            helperMethod = ctx.helpers[name] || this.helpers[name];
        }

        if (!helperMethod) {
            return null;
        }

        helperArgs.push(args);

        if (body) {
            helperArgs.push(function (data, scope) {
                var result;

                // Create new data scope
                if (data) {
                    ctx.scope.push(scope || emptyObject);
                    ctx.store.push(data);
                }

                // Render helper body
                result = body();

                // Restore previous data scope
                if (data) {
                    ctx.scope.pop();
                    ctx.store.pop();
                }

                return result;
            });

            if (alternate) {
                helperArgs.push(function (data, scope) {
                    var result;

                    // Create new data scope
                    if (data) {
                        ctx.scope.push(scope || emptyObject);
                        ctx.store.push(data);
                    }

                    // Render alternate helper body
                    result = alternate();

                    // Restore previous data scope
                    if (data) {
                        ctx.scope.pop();
                        ctx.store.pop();
                    }

                    return result;
                });
            }
        }

        return helperMethod.apply(this, helperArgs) || null;
    },

    component: function element(ctx, name) {
        var args = _.slice(arguments, 1);

        // Get non-native component
        if (!this.React.DOM[name]) {
            args[0] = ctx.components[name] || this.components[name];
        }

        return this.React.createElement.apply(this.React, args);
    },

    concat: function concat(/*ctx*/) {
        var list = _.slice(arguments, 1);

        return list
            .map(function (item) {
                var type = typeof item,

                    skip = (item === null || item === undefined || type === 'boolean'),

                    str = !skip && item.toString && item.toString();

                if (skip || (str && str.match(/^\[object .*?\]$/))) {
                    return '';
                }

                return str;
            })
            .join('');
    },

    list: function list(/*ctx*/) {
        return _.slice(arguments, 1);
    },

    proxy: function proxy(method) {
        var args = [this[method], this].concat(_.slice(arguments, 1));

        return args[0] && _.bind.apply(_, args);
    },

    // General public methods
    render: function render(data, options) {
        if (!options) {
            options = emptyObject;
        }

        // Create render context
        var ctx = {
                scope: [{}],
                store: [data],
                helpers: _.result(options, 'listeners', emptyObject),
                components: _.result(options, 'components', emptyObject),
                listeners: _.result(options, 'listeners', emptyObject)
            };

        // Render virtual dom
        return this.template(this, ctx);
    },

    registerHelper: function registerHelper(name, helper) {
        this.helpers[name] = helper;

        return this;
    },

    registerComponent: function registerComponent(name, component) {
        this.helpers[name] = component;

        return this;
    }
}, {
    registerHelper: function registerHelper(name, helper) {
        this.prototype.registerHelper(name, helper);

        return this;
    },

    registerComponent: function registerComponent(name, component) {
        this.prototype.registerComponent(name, component);

        return this;
    },

    template: function template(templateMethod) {
        var runtime = new this(templateMethod);

        return runtime.render.bind(runtime);
    },

    extend: function extend() {
        // For overwriting extend the static extend of the base class in required (not the extend shortcut)
        var Child = Cla55.Cla55.extend.apply(this, arguments);

        // Prevent changes on child class affects parent class
        Child.prototype.helpers = _.create(Child.prototype.helpers);
        Child.prototype.components = _.create(Child.prototype.components);

        return Child;
    }
});

module.exports = VanDyke;
