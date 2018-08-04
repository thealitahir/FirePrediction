/**
 * Created by usman on 04/08/2018.
 */
var app = angular.module("webApp", ["leaflet-directive"]);
app.controller("BasicGeoJSONUpdateController", [ '$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
        center: {
            lat: 36.7783,
            lng: -119.4179,
            zoom: 4
        },
        defaults: {
            scrollWheelZoom: false
        }
    });



    $http.get("/json/natural_gas_pipelines.json").success(function(data, status) {
        angular.extend($scope, {
            geojson: {
                data: data,
                style: {
                    weight: 2,
                    opacity: 1,
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        });
    });
    $scope.updateGeojson = function() {
        $scope.geojson.data = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    -41.8359375,
                                    28.92163128242129
                                ],
                                [
                                    -41.8359375,
                                    38.272688535980976
                                ],
                                [
                                    -26.015625,
                                    38.272688535980976
                                ],
                                [
                                    -26.015625,
                                    28.92163128242129
                                ],
                                [
                                    -41.8359375,
                                    28.92163128242129
                                ]
                            ]
                        ]
                    }
                }
            ]
        };
    }
}]);
