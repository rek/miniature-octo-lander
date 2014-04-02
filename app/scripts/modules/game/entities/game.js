define(['app'], function(App) {
  App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var contextName = 'Entity';
    Entities.Game = Backbone.Model.extend({
      urlRoot: 'game',

      defaults: {
        name: '',
        slug: ''
      },

      validate: function(attrs, options) {
        var errors = {}
    //     if (! attrs.something) {
    //       errors.something = 'can't be blank';
    //     }
    //     else{
    //       if (attrs.something.length < 2) {
    //         errors.something = 'is too short';
    //       }
    //     }
        if( ! _.isEmpty(errors)) {
          return errors;
        }
      }
    });

    Entities.GameCollection = Backbone.Collection.extend({
      url: '/',
      model: Entities.Game
    });

    var initializeGames = function() {
      App.log('Initializing Fake Games', contextName, 1);

      var fakeGames = new Entities.GameCollection([
          { name: 'Top Hatty Bird',  slug: 'tophattybird' },
          { name: 'Gunday', slug: 'gunday' }
      ]);

      return fakeGames;
    };

    var API = {
      getGameEntities: function() {
        App.log('game:entities event detected', contextName, 1);
        var gameCollection = new Entities.GameCollection();
        var defer = $.Deferred();
        gameCollection.fetch({
          complete: function(data){
            defer.resolve(gameCollection); // send back the collection
          },
          // success: function(data){
            // App.log('success data', contextName, 1);
            // defer.resolve(data);
          // }
        });
        // chain the above promise,
        var promise = defer.promise();
        $.when(promise).done(function(gameCollection) {
          // check to see if it had content:
          if (gameCollection.length === 0) { // if not, get defaults.
            // FAKE NETWORK LAG
            setTimeout(function () {
              // App.trigger('page:register', models); // add each game to the menu
              // if we don't have any imageCollection yet, create some for convenience
              gameCollection.reset(initializeGames().models); // update the collection
            }, 2000);

          }
        });
        return promise;
      },

    };

    App.reqres.setHandler('game:entities', function() {
      return API.getGameEntities();
    });

    // App.reqres.setHandler('game:entity', function(id) {
      // return API.getGameEntity(id);
    // });

    App.reqres.setHandler('game:entity:new', function(id) {
      App.log('Making new game', this.name, 1);
      return new Entities.Game();
    });
  });

  return ;
});
