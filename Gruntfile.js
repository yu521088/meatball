module.exports = function(grunt){

	grunt.initConfig({
		less:{

		},
		jshint:{
			files: ['public/javascripts/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['less', 'watch']);
    grunt.registerTask('test',['jshint']);
};