angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, uiGmapGoogleMapApi) {
    var markers = [],
    studioIndex,
    latlong = {},
    markerIcon;

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.googleVersion = maps.version;
    maps.visualRefresh = true;
  });

  angular.extend($scope, {
    map: {
      disableDefaultUI: true,
      center: {
        latitude: 33,
        longitude: -117
      },
      zoom: 8,
      dragging: false,
      bounds: {},
    }
  });


});
