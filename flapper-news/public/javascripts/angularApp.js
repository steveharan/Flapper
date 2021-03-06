var app = angular.module('flapperNews', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
              resolve: {
                  postPromise: ['posts', function(posts) {
                      return posts.getAll();
                  }]
              }
          })
          .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
              resolve: {
                  post: ['$stateParams', 'posts', function($stateParams, posts) {
                      return posts.get($stateParams.id);
                  }]
              }
          });

      $urlRouterProvider.otherwise('home');
    }
]);

app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.posts = posts.posts;
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') {
        return; }
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
         ]
      });
      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
  }]);

app.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post) {
      $scope.post = post;

      $scope.addComment = function() {
        if (!$scope.body || $scope.body === '') {
          return;
        }
        $scope.post.comments.push({
          body: $scope.body,
          author: 'user',
          upvotes: 0
        });
        $scope.body = '';

        $scope.incrementUpvotes = function(comment) {
          comment.upvotes += 1;
        };

      }
    }]);

app.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };
    o.getAll = function() {
        return $http.get('/posts').success(function(data) {
            angular.copy(data, o.posts);
        });
    }
    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };
  return o;
}]);
