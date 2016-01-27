/**
 * Browserify files with React as an option.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [browserify](https://github.com/gruntjs/grunt-browserify)
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-browserify
 */
module.exports = function(grunt) {

  grunt.config.set('browserify', {
    options: {
     
     
      external:['react','react-dom'],
      transform: [
      ["exposify",   {"global": true, "expose": {"react": "React","react-dom": "ReactDOM"}}],
        ["babelify",{presets: ["es2015", "react"]}]
      ],
      
      harmony: true
    },
    dev: {
      src: ['./components/app.js'],
      dest: './assets/js/bundle.js'
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
};
