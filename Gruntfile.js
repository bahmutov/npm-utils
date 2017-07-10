/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'nice-package': {
      all: {
        options: {}
      }
    },
    filenames: {
      options: {
        valid: 'dashes'
      },
      src: 'src/**/*.js'
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['nice-package', 'filenames']);
};
