angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
    })

// LOGIN CONTROLLER HERE
.controller('LoginCtrl', function ($scope, $location, userService, $state) {
        $scope.login = function (id) {
            userService.login(id);
            $state.transitionTo('tab.account');
            // $location.path('#/tab/account/'+id);
          }
})

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

    .controller('AccountCtrl', function ($scope, $http, $stateParams, $ionicPopup, uiGmapGoogleMapApi, userService) {
        var markers = [],
            studioIndex,
            latlong = {},
            lats = 34.018357,
            longs = -118.486918,
            charityMarker,
            publicMarker,
            friendMarker,
            personalMarker,
            markerIcon,
            userID;

        uiGmapGoogleMapApi.then(function (maps) {
            $scope.googleVersion = maps.version;
            maps.visualRefresh = true;

            userID = userService.getId();
            charityMarker = new maps.MarkerImage("img/charity_pin.png", null, null, null, new google.maps.Size(24, 24));
            publicMarker = new maps.MarkerImage("img/public_pin.png", null, null, null, new google.maps.Size(24, 24));
            friendMarker = new maps.MarkerImage("img/friend_pin.png", null, null, null, new google.maps.Size(24, 36));
            personalMarker = new maps.MarkerImage("img/personal_pin.png", null, null, null, new google.maps.Size(24, 36));
            indicatorMarker = new maps.MarkerImage("img/nav_dot.png", null, null, null, new google.maps.Size(20,20));
            $scope.indicator = {
              id: 0,
              coords: {
                latitude: 34.018357,
                longitude: -118.486918
              },
              icon: indicatorMarker,
              options: { draggable: false }
            };

            $http.get('http://107.170.215.238/movemento/?user_id='+userID)
                .success(function (data) {
                    console.log(data);
                    for (var momentIndex = 0; momentIndex < data.length; momentIndex += 1) {

                        markers.push(createMarker(data[momentIndex]));
                        console.log("Created Marker: ", momentIndex);
                    }
                })
                .error(function (data) {

                });
        });

        var createMarker = function (moment) {
            var setMarker;
            var momentTitle;
            switch (moment.type) {
                case 'gift':
                    momentTitle = 'Someone just left a gift moment! ';
                    setMarker = charityMarker;
                    break;
                case 'general':
                    momentTitle = 'Someone just shared a moment!';
                    setMarker = publicMarker;
                    break;
                case 'friend':
                    momentTitle = 'A friend just shared a moment!';
                    setMarker = friendMarker;
                    break;
                case 'mine':
                    momentTitle = 'My moment!';
                    setMarker = personalMarker;
                    break;
                default:
                    momentTitle = 'Someone just shared a moment!';
                    setMarker = publicMarker;
            }
            return {
                name: moment.user.name,
                title: momentTitle,
                studioID: moment.id,
                distance: moment.distance,
                avatar: moment.avatar,
                showWindow: false,
                id: moment.id,
                // coords: {
                //     latitude: studio.latitude,
                //     longitude: studio.longitude
                // },
                latitude: moment.latitude,
                longitude: moment.longitude,
                icon: setMarker,
                options: {
                    animation: 4,
                    labelContent: ' ',
                    // labelAnchor: "22 0",
                    labelClass: "marker-labels"
                },
                onClicked: function () {
                    console.log("onCLicked");
                    onMarkerClicked(this);
                },
                closeClick: function () {
                    this.showWindow = false;
                }
            };
        };

        var onMarkerClicked = function (marker) {
            console.log("onMarkerClicked");
            marker.showWindow = true;
            $scope.$apply();
        };


        angular.extend($scope, {
            map: {
                disableDefaultUI: true,
                center: {
                    latitude: 34.018357,
                    longitude: -118.486918
                },
                dragging: false,
                bounds: {},
                markers: markers,
                zoom: 16,
                events: {
//This turns of events and hits against scope from gMap events this does speed things up
// adding a blacklist for watching your controller scope should even be better
//        blacklist: ['drag', 'dragend','dragstart','zoom_changed', 'center_changed'],
                    tilesloaded: function (map, eventName, originalEventArgs) {
                    },
                    click: function (mapModel, eventName, originalEventArgs) {
                        // 'this' is the directive's scope
                        $log.info("user defined event: " + eventName, mapModel, originalEventArgs);
                        console.log("click");
                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                            lon = e.latLng.lng();
                        $scope.map.clickedMarker = {
                            id: 0,
                            options: {
                                labelContent: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
                                labelClass: "marker-labels",
                                labelAnchor: "50 0"
                            },
                            latitude: lat,
                            longitude: lon
                        };
                        //scope apply required because this event handler is outside of the angular domain
                        $scope.$apply();
                    }
                }
            }
        });
    $scope.$watch(
      function() {
        return $scope.map;
      }, 
      function(nv, ov) {
      // Only need to regenerate once
        if (!ov.southwest && nv.southwest) {
          // markerClickInit();
          // $scope.preloader = false;
          console.log('WATCHING');
          $scope.studioMarkers = markers;
        };
      }, true);

    })

    .controller('MomentNote', function ($scope, $stateParams, $ionicModal, Movemento, userService, $state) {
        // $scope.friend = Friends.get($stateParams.friendId);
        //

        var User = userService.get();

        $scope.user = {
            avatar: 'img/' + User.id + '.jpg',
            name: User.name
        }
        $scope.active = false;
        $scope.form_data = {};
        $scope.note = '';

        navigator.geolocation.getCurrentPosition(function (data) {
            console.log('data', data.coords.latitude);
            console.log('data', data.coords.longitude);
            console.log("CALLIGN GEOLOCATION");
            $scope.form_data.latitude = data.coords.latitude;
            $scope.form_data.longitude = data.coords.longitude;
        })

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

        $scope.$on('go', function () {
            $scope.form_data.gift = true;
            console.log('Form Data', $scope.form_data);
            $scope.modal.hide();
            $scope.active = true;


        });

        $scope.post = function () {
            console.log("User", userService.getId());
            $scope.form_data.user_id = userService.getId();
            Movemento.post($scope.form_data).success(function (data) {
                if (data == "missing data")
                    alert('Missing Data');
                else
                    $state.transitionTo('tab.account');
            });

        }

    })
    .controller('createMoment', function ($scope, $stateParams) {
        // $scope.friend = Friends.get($stateParams.friendId);

    })
    .controller('profileMoment', function ($scope, $stateParams, Movemento, userService, likeService) {
        // $scope.friend = Friends.get($stateParams.friendId);
        // $scope.user = Chats.get($stateParams.userId);
        var user = userService.get()
        var userID = userService.getId();

        $scope.liked = false;
        $scope.movemento = false;

        $scope.isGift = function(){

        }


        angular.forEach(user.likes, function(like) {
            if($stateParams.movemento_id == like.movemento_id){
                $scope.liked= true;

            }
        });

        $scope.is_redeemed = function(){

            if($scope.movemento && $scope.movemento.gift != null && $scope.movemento.gift.redeemed_on != null){
                console.log('redeemed true');
                return true;

            }
            return false;
        }

        $scope.is_gift = function(){

            if($scope.movemento && $scope.movemento.gift != null && $scope.movemento.gift.redeemed_on == null){
                console.log('gift true');
                return true;

            }
            return false;
        }

        $scope.like = function(){
            console.log('like');

            if(!$scope.liked){
                likeService.post( {'movemento_id' : $scope.movemento.id, 'user_id' : userID} );
                $scope.likeCount ++;
                $scope.liked = !$scope.liked;
            }

        }

        $scope.redeem = function(){
            Movemento.claim($scope.movemento.gift.id).success(function(data){
                $scope.movemento = data;

            });

        }

        Movemento.show($stateParams.movemento_id)
            .success(function (data) {
                console.log('Movemento Data', data);
                $scope.movemento = data;
                $scope.likeCount = data.likes.length;
            })
            .error(function (data) {
                console.log("ERROR");
            });
    });
