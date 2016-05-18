'use strict';

angular
    .module('listings')
    .factory('recipeService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {
  var client = elasticsearch({
    host: $location.host() + ':9200'
  });

  /**
   * Given a term and an offset, load another round of 10 recipes.
   *  var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:9200/listings/listing/_search', true);

//xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send('{"query":{"match_all":{}}}');
   * Returns a promise.
   */
   console.log($location.host() + ':9200');
  var search = function(term, offset) {
    var deferred = $q.defer();
    console.log(term);
    var query = {
      match: {
        _all: term
      }
    };

    client.search({
      index: 'listings',
      type: 'listing',
      body: {
        size: 10,
        from: (offset || 0) * 10,
        query: query
      }
    }).then(function(result) {
      var ii = 0, hits_in, hits_out = [];

      hits_in = (result.hits || {}).hits || [];

      for(; ii < hits_in.length; ii++) {
        hits_out.push(hits_in[ii]._source);
      }

      deferred.resolve(hits_out);
    }, deferred.reject);

    return deferred.promise;
  };

  // Since this is a factory method, we return an object representing the actual service.
  return {
    search: search
  };
}]);