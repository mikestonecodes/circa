module.exports = function(grunt) {

	grunt.config.set('watch', {
		api: {

			// API files to watch:
			files: ['api/**/*', '!**/node_modules/**']
		},
		assets: {

			// Assets to watch:
			files: ['assets/**/*', 'tasks/pipeline.js', '!**/node_modules/**','!assets/js/bundle.js'],

			// When assets are changed:
			tasks: ['syncAssets' , 'linkAssets']
		},
		react: {

			// components to watch:
			files: ['components/**/*.*','shared/**/*.*','components/*.*','shared/*.*'],

			// When components are changed:
			tasks: ['compileAssets']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};