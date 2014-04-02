define(['app'], function (App) {
  App.module('GameApp.List.View', function (View, App, Backbone, Marionette, $, _) {
    View.Layout = Marionette.Layout.extend({
      template: 'game_layout',

      regions: {
        showRegion: '#show-region',
        listRegion: '#list-region'
      },

      flash: function(cssClass) {  // fade in and out.
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function() {
          setTimeout(function() {
            $view.toggleClass(cssClass)
          }, 500);
        });
      },
    });

    View.Panel = Marionette.ItemView.extend({
      template: 'game_list',

      // triggers: {
      //   'click button.js-new': 'contact:new'
      // },

      // events: {
      //   'submit #filter-form': 'filterContacts'
      // },

    });

    View.Game = Marionette.ItemView.extend({
      tagName: 'div',
      template: 'game_list_one',

      events: {
        'click div': 'showClicked',
      },

      showClicked: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger('game:show', this.model);
      },

    });

    var NoGameView = Marionette.ItemView.extend({
      template: 'game_none',
      // tagName: 'tr',
      className: 'alert'
    });

    View.Game = Marionette.CompositeView.extend({
      tagName: 'div',
      className: '',
      template: 'game_list',
      emptyView: NoGameView,
      itemView: View.Game,
      itemViewContainer: '', // required in this template

      initialize: function(){
        this.listenTo(this.collection, 'reset', function() {
          App.log('reset called', 'game list view', 1);
          this.appendHtml = function(collectionView, itemView, index){
            collectionView.$el.append(itemView.el);
          }
        });
      },

      onCompositeCollectionRendered: function() {
        App.log('rendered called', 'game list view', 1);
        this.appendHtml = function(collectionView, itemView, index){
          collectionView.$el.prepend(itemView.el);
        }
      }
    });
  });

  return App.GameApp.List.View;
});
