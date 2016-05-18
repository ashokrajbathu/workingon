(function () {
  'use strict';

  angular
    .module('listings',['elasticsearch'] , ['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }])
    .run(menuConfig)

    .service('client', function (esFactory) {
      return esFactory({
        host: 'localhost:9200',
        apiVersion: '2.1',
        log: 'trace'
      });
    });

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu itemss
    Menus.addMenuItem('topbar', {
      title: 'Dashboard',
      state: 'listings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'listings', {
      title: 'List Listings',
      state: 'listings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'listings', {
      title: 'Create Listing',
      state: 'listings.create',
      roles: ['user']
    });
  }
})();
