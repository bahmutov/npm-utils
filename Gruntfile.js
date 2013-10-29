/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: grunt.file.readJSON('jshint.json'),
    complexity: {
      default: grunt.file.readJSON('complexity.json')
    },
    'nice-package': {
      all: {
        options: {}
      }
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['nice-package', 'jshint', 'complexity']);
};
