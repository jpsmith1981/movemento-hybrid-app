angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope) {
    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        }
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function ($scope, uiGmapGoogleMapApi) {
        //   var markers = [],
        //   studioIndex,
        //   latlong = {},
        //   markerIcon;

        uiGmapGoogleMapApi.then(function (maps) {
            $scope.googleVersion = maps.version;
            maps.visualRefresh = true;

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: 34.018357,
                    longitude: -118.486918
                },
                options: {draggable: true}
            };
        });

        angular.extend($scope, {
            map: {
                disableDefaultUI: true,
                center: {
                    latitude: 34.018357,
                    longitude: -118.486918
                },
                zoom: 17,
                dragging: false,
                bounds: {}
            }
        });


    })

    .controller('MomentNote', function ($scope, $stateParams, $ionicModal) {
        // $scope.friend = Friends.get($stateParams.friendId);
        $scope.user = {
            avatar: 'img/ben.jpeg',
            name: 'Ben Canales'
        }

        $ionicModal.fromTemplateUrl('templates/payment/payment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        console.log('here');
        $scope.$on('go', function () {
            alert('event is clicked')
        });

    })
    .controller('createMoment', function ($scope, $stateParams) {
        // $scope.friend = Friends.get($stateParams.friendId);

    });
