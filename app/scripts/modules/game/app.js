define(function(require) {
    var App = require('app');
    var path = 'modules/game/';

    requirejs.config({
        baseUrl: 'scripts/',
        paths: {
            list_view       : path + 'list/list_view',
            list_controller : path + 'list/list_controller',
            show_view       : path + 'show/show_view',
            show_controller : path + 'show/show_controller',
            entities_game  : path + 'entities/game',
        }
    });

    // create a new module
    App.module('App', {
        startWithParent: false,
        // only avaiable with object literal def of module;
        initialize: function (options, moduleName, app) { // on prototype chain thus inheritable
            this.name = moduleName;
            App.log('Initalize: ' + App.getCurrentRoute(), this.name, 2);
        },
        define: function (GameApp, App, Backbone, Marionette, $, _) { // non inheritable
            // temp stuff for logging
            // TODO: find a better way to get module name
        }
    });

    // create a new sub module
    App.module('Routers.GameApp', function(GameAppRouter, App, Backbone, Marionette, $, _){
        this.name = 'Routers.GameApp';

        GameAppRouter.Router = Marionette.AppRouter.extend({
            initialize: function () {
                // App.log('Before Router', RotesAppRouter.name);
                // start ourselves
                // App.switchApp('RotesApp', {});
            },
            appRoutes: {
                ''           : 'listGame',
                'game'       : 'listGame',
                // 'game/create': 'createGame',
                // 'game/:slug'  : 'showGame'
            }
        });

        var executeAction = function(action, arg){
            App.switchApp('GameApp');
            action(arg);
            // App.execute('set:active:page', 'game');
        };

        var API = {
            listGame: function(){
                require(['list_controller'], function(ListController){
                    App.log('List game: Controller loaded, requesting game..', GameAppRouter.name, 2);
                    executeAction(ListController.listGame);
                });
            },
        };

        // also watch for manual events:
        App.on('game:list', function(){
          App.navigate('/game');
          API.listGame();
        });

        App.addInitializer(function(){
            App.log('Initalizer running: Starting Router', GameAppRouter.name, 2);
            new GameAppRouter.Router({
                controller: API
            });
        });
    });

    return App.GameAppRouter;
});