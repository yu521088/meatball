module.exports = function(grunt){

	grunt.initConfig({
		less:{
			development:{
				options:{
					compress:true
				},
				files:{
					'public/stylesheets/index-less.css':['public/stylesheets/index.less']
				}
			}
		},
		jshint:{
			publicfiles:{
				files: [{
					src:'public/javascripts/**/*.js',
					filter:function(filepath){
						return filepath.indexOf('lib')<0;
					}
				}]
			},
			routes:{
				src:['routes/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['less', 'watch']);
    grunt.registerTask('runless', ['less']);
    grunt.registerTask('test',['jshint']);
};