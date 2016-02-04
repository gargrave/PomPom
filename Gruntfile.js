module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({

    config: {
      title: 'PomPom',
      buildDir: 'app-build',
      distDir: 'app-dist',
      date: function() {
        var d = new Date();
        return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      }
    },

    /*==============================================
     = sass
     ==============================================*/
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '<%= config.buildDir %>/css/main.css': 'app/css/main.scss'
        }
      }
    },

    /*==============================================
     = cssmin
     ==============================================*/
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= config.buildDir %>/css/',
          src: ['*.css'],
          dest: '<%= config.distDir %>/app/css',
          ext: '.min.css'
        }]
      }
    },

    /*==============================================
     = typescript
     ==============================================*/
    typescript: {
      base: {
        src: ['app/ts/**/*.ts'],
        dest: '<%= config.buildDir %>/js/',
        options: {
          module: 'commonjs',
          target: 'es5',
          removeComments: true
        }
      }
    },

    /*==============================================
     = clean
     ==============================================*/
    clean: {
      main: [
        '<%= config.distDir %>/*'
      ]
    },

    /*=============================================
     = uglify
     =============================================*/
    uglify: {
      main: {
        options: {
          mangle: false,
          banner: '/* <%= config.title %> | v. <%= config.date() %> */\n'
        },
        files: [{
          '<%= config.distDir %>/app/app.min.js': [
            '<%= config.buildDir %>/js/app.js',
            '<%= config.buildDir %>/js/main.ctrl.js'
          ]
        }]
      }
    },

    /*=============================================
     = copy
     =============================================*/
    copy: {
      libs: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular/angular.min.js.map'
          ],
          dest: '<%= config.distDir %>/app/libs/'
        }]
      }
    },

    /*=============================================
     = replace
     =============================================*/
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /<!--%APP_SCRIPTS%-->[\s\S]+<!--%END_APP_SCRIPTS%-->/,
              replace: '<script src="app/app.min.js"></script>'
            },
            {
              match: /app-build/,
              replace: 'app'
            },
            {
              match: /\.css/g,
              replacement: '.min.css'
            },
            {
              match: /\.js/g,
              replacement: '.min.js'
            }
          ]
        },
        files: [
          {
            src: 'index.html',
            dest: '<%= config.distDir %>/index.html'
          }
        ]
      }
    },

    /*=============================================
     = watch
     =============================================*/
    watch: {
      sass: {
        files: ['**/*.scss'],
        tasks: ['sass', 'cssmin']
      },
      ts: {
        files: ['app/ts/**/*.ts'],
        tasks: ['typescript', 'uglify']
      }
    }
  });

  grunt.registerTask('build', [
    'sass', 'typescript'
  ]);
  grunt.registerTask('dist', [
    'clean',
    'sass', 'cssmin',
    'typescript', 'uglify',
    'copy', 'replace'
  ]);
};
