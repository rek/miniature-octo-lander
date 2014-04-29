define(function(require) {
    'use strict';
    var App = require('app');

    // create a new module
    App.module('App', {
        startWithParent: false,
        // only avaiable with object literal def of module;
        initialize: function(options, moduleName, app) { // on prototype chain thus inheritable
            this.name = moduleName;
            App.log('Initalize: ' + App.getCurrentRoute(), this.name, 2);
        },
        // define: function(GameApp, App, Backbone, Marionette, $, _) { // non inheritable
        // temp stuff for logging
        // TODO: find a better way to get module name
        // }
    });

    // create a new sub module
    App.module('Routers.GameApp', function(GameAppRouter, App, Backbone, Marionette, $, _) {
        this.name = 'Routers.GameApp';

        GameAppRouter.Router = Marionette.AppRouter.extend({
            initialize: function() {
                App.log('Before Router', GameAppRouter.name);
                // start ourselves
                // App.switchApp('RotesApp', {});
            },
            appRoutes: {
                'game': 'listGame',
                'game/:slug': 'showGame'
            }
        });

        var executeAction = function(action, arg) {
            App.switchApp('GameApp');
            action(arg);
            // App.execute('set:active:page', 'game');
        };

        var API = {
            listGame: function() {
                require(['list_controller'], function(ListController) {
                    App.log('List game: Controller loaded, requesting game..', GameAppRouter.name, 2);
                    executeAction(ListController.listGame);
                });
            },
            showGame: function(name) {
                require(['list_controller'], function(ListController) {
                    App.log('Show game: List controller loaded, requesting game..', GameAppRouter.name, 2);
                    executeAction(ListController.showGame, name);
                });
            },
        };

        // also watch for manual events:
        App.on('game:list', function() {
            App.navigate('game');
            API.listGame();
        });

        App.on('game:show', function(name) {
            App.navigate('game/' + name);
            API.showGame(name);
        });

        App.addInitializer(function() {
            App.log('Initalizer running: Starting Router', GameAppRouter.name, 2);
            new GameAppRouter.Router({
                controller: API
            });
        });
    });

    return App.GameAppRouter;
});