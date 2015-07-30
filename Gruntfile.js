module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      // TODO:
      dist: {
        src: [
          'public/lib/underscore.js',
          'public/lib/jquery.js',         // libraries added
          'public/lib/backbone.js',
          'public/lib/handlebars.js',
          'public/client/app.js',
          'public/client/link.js',
          'public/client/links.js',       // mvc libraries added
          'public/client/linkView.js',
          'public/client/linksView.js',
          'public/client/createLinkView.js',
          'public/client/router.js'
        ], 
        dest: 'public/dist/production.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {

      build: {
        files: {
          'public/dist/production.min.js': 'public/dist/production.js',
        }
      }

    },

    jshint: {
      files: ['app/**/*.js', 'lib/*.js', '/public/client/*.js', '/*.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      // Add filespec list here
      // TODO:
      dist: {
        files: {
          'public/dist/style.min.css': 'public/*.css'
        }
      }

    },

    watch: {
      scripts: {
        files: [
          'public/lib/*.js', 'public/client/*.js'
        ],
        tasks: [
          'concat',
          'uglify',
          'jshint'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('default', [
    'concat', 'uglify', 'cssmin', 'jshint', 'watch'
  ]);
  

  // grunt.registerTask('build', [
  //   'concat', 'uglify', 'cssmin', 'jshint', 'watch'
  // ]);
  

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // TODO:
        // add your production server task here

    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      // TODO:
        // add your production server task here

  ]);
};
