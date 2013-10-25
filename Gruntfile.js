'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        jshint: {
            options: {
                globalstrict: true,
                newcap: false,
                node: true,
                expr: true
            },
            gruntfile: {
                files: {
                    src: [
                        'Gruntfile.js'
                    ]
                }
            },
            nth: {
                files: {
                    src: [
                        'lib/evaluations/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    globals: {
                        describe: true,
                        it: true,
                        beforeEach: true
                    }
                },
                files: {
                    src: [
                        'test/config/**/*.js',
                        'test/unit/**/*.js'
                    ]
                }
            }
        },

        mochaTest: {
            unit: ['<%= jshint.test.files.src %>']
        }
    });

    grunt.registerTask('default', 'test');

    grunt.registerTask('test', [
        'jshint',
        'mochaTest:unit'
    ]);
};