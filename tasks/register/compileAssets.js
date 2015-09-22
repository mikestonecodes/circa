module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
   		 'browserify',
		'sass:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
