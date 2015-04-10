'use strict';

module.exports = {
    dev: {
        options: {
            jshintrc: true
        },
        files: {
            src: [
                '<%= meta.cwdAll %>.js',
                '!<%= meta.buildAll %>',
                '!<%= meta.testAll %>',
                '!<%= meta.npmAll %>'
            ]
        }
    },
    build: {
        options: {
            "bitwise": true,   // Prohibits the use of bitwise operators (not confuse & with &&)
            "curly": true,   // Requires to always put curly braces around blocks in loops and conditionals
            "eqeqeq": true,   // Prohibits the use of == and != in favor of === and !==
            "eqnull": true,   // Suppresses warnings about == null comparisons
            "immed": true,   // Requires immediate invocations to be wrapped in parens e.g. `(function () { } ());`
            "latedef": true,   // Prohibits the use of a variable before it was defined
            "noarg": true,   // Prohibits the use of arguments.caller and arguments.callee
            "undef": true,   // Require non-global variables to be declared (prevents global leaks)

            "node": true,

            "globalstrict": false,   // Requires to run in ECMAScript 5's strict mode
            "globals": {
                "define": true
            }
        },
        files: {
            src: [
                '<%= meta.buildAll %>.js'
            ]
        }
    }
};