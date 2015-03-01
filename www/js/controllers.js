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

    .controller('AccountCtrl', function($scope, $http, $ionicBackdrop, $ionicPopup, uiGmapGoogleMapApi) {
        var markers = [],
            studioIndex,
            latlong = {},
            lats = 34.018357,
            longs = -118.486918,
            charityMarker,
            publicMarker,
            friendMarker,
            markerIcon;

        $scope.showPopup = function() {
            $scope.data = {}
            console.log("CLICKED");
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: 'templates/moments/moment-profile.html',
                // title: 'Moment',
                subTitle: 'This moment was shared <span style="font-weight:bold;">1 min</span> ago.',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        // onTap: function(e) {
                        //   if (!$scope.data.wifi) {
                        //     //don't allow the user to close unless he enters wifi password
                        //     e.preventDefault();
                        //   } else {
                        //     return $scope.data.wifi;
                        //   }
                        // }
                    }
                ]
            });
            $scope.$apply();
        };

        $scope.action = function() {
            console.log("ACTION");
            $ionicBackdrop.retain();
            $timeout(function() {
                $ionicBackdrop.release();
            }, 1000);
        };

        uiGmapGoogleMapApi.then(function(maps) {
            $scope.googleVersion = maps.version;
            maps.visualRefresh = true;

            charityMarker = new maps.MarkerImage("img/charity_pin.png", null, null, null, new google.maps.Size(24,36));
            publicMarker = new maps.MarkerImage("img/public_pin.png", null, null, null, new google.maps.Size(24,36));
            friendMarker = new maps.MarkerImage("img/friend_pin.png", null, null, null, new google.maps.Size(24,36));

            $http.get('http://107.170.215.238/movemento/?user_id=2')
                .success(function (data) {
                    console.log(data);
                    for (var momentIndex = 0; momentIndex < data.length; momentIndex += 1) {

                        markers.push(createMarker(data[momentIndex]));
                        console.log("Created Marker: ", momentIndex);
                    }
                })
                .error(function(data){

                });
        });

        var createMarker = function (moment) {
            var setMarker;
            var momentTitle;
            switch(moment.type) {
                case 'gift':
                    momentTitle = 'A charity ';
                    setMarker = charityMarker;
                    break;
                case 'general':
                    momentTitle = 'Someone ';
                    setMarker = publicMarker;
                    break;
                case 'friend':
                    momentTitle = 'A friend ';
                    setMarker = friendMarker;
                    break;
                default:
                    momentTitle = 'Someone ';
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
                onClicked : function () {
                    console.log("onCLicked");
                    onMarkerClicked(this);
                },
                closeClick : function () {
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
                                labelAnchor:"50 0"
                            },
                            latitude: lat,
                            longitude: lon
                        };
                        //scope apply required because this event handler is outside of the angular domain
                        $scope.$apply();
                    },
                }
            }
        });


    })

    .controller('MomentNote', function($scope, $stateParams, $ionicModal, Movemento) {
        // $scope.friend = Friends.get($stateParams.friendId);
        $scope.user = {
            avatar: 'img/ben.jpeg',
            name: 'Ben Canales'
        }
        $scope.active = false;
        $scope.form_data = {};
        $scope.note = '';
        navigator.geolocation.getCurrentPosition(function(data){
            console.log('data', data.coords.latitude);
            console.log('data', data.coords.longitude);
            $scope.form_data.latitude = data.coords.latitude;
            $scope.form_data.longitude = data.coords.longitude;
        })

        $ionicModal.fromTemplateUrl('templates/payment/payment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.$on('go', function () {
            $scope.form_data.gift = true;
            console.log('Form Data', $scope.form_data);
            $scope.modal.hide();
            $scope.active = true;


        });

        $scope.post = function(){
            $scope.form_data.user_id = 3;
            Movemento.post($scope.form_data);
        }

    })
    .controller('createMoment', function($scope, $stateParams) {
        // $scope.friend = Friends.get($stateParams.friendId);

    });