define(['app', 'list_view'], function(App, View) {
    'use strict';
    App.module('GameApp.List', function(List, App, Backbone, Marionette, $) {
        this.name = 'GameApp.List';
        var gameListLayout = new View.Layout();
        List.Controller = {
            listGame: function() {
                require(['common/views', 'entities_game'], function(CommonViews) {

                    App.mainRegion.show(new CommonViews.Loading());

                    var fetchingGame = App.request('game:entities');

                    // var gameListPanel = new View.Panel();

                    $.when(fetchingGame).done(function(game) {
                        App.log('Fetched game data', List.name, 1);

                        var gameListView = new View.GameList({
                            collection: game
                        });

                        gameListLayout.on('show', function() {
                            // gameListLayout.panelRegion.show(contactsListPanel);
                            gameListLayout.listRegion.show(gameListView);
                        });

                        gameListView.on('itemview:game:show', function(childView, model) {
                            App.trigger('game:show', model.get('slug'));
                        });

                        // when the data is here, show it in this region
                        App.mainRegion.show(gameListLayout);
                    });
                });
            },
            showGame: function(slug) {
                require(['common/views', 'entities_game'], function(CommonViews) {
                    App.log('Show game: ' + slug, 'List Controller', 2);
                    var game = App.request('game:entity', slug);

                    var gameView = new View.GameShow({
                        model: game
                    });

                    gameListLayout.on('show', function() {
                        gameListLayout.showRegion.show(gameView);
                    });

                    App.mainRegion.show(gameListLayout);

                    // $.when(fetchingGame).done(function(game) {
                        // App.log('Show game returned a game', 'List Controller', 1);
                        // App.log(game, 'List Controller', 1);

                    // });
                });
            }
        };
    });
    return App.GameApp.List.Controller;
});