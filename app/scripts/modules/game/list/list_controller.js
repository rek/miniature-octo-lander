define(['app', 'list_view'], function (App, View) {
  App.module('GameApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = {
      listGame: function () {
        require(['common/views', 'entities_game'], function(CommonViews) {

          App.mainRegion.show(new CommonViews.Loading());

          var fetchingGame = App.request('game:entities');

          var gameListLayout = new View.Layout();
          // var gameListPanel = new View.Panel();

          $.when(fetchingGame).done(function(game) {
            App.log('Fetched game data', 'App', 1);

            var gameListView = new View.Game({
              collection: game
            });

            gameListLayout.on('show', function(){
              App.log('something, check this out, in list', this.name, 1);
              // gameListLayout.panelRegion.show(contactsListPanel);
              gameListLayout.listRegion.show(gameListView);
            });

            gameListView.on('itemview:game:show', function(childView, model){
              App.trigger('game:show', model.get('id'));
            });

            // when the data is here, show it in this region
            App.mainRegion.show(gameListLayout);

          });

        });
      }
    }
  });
  return App.GameApp.List.Controller;
});