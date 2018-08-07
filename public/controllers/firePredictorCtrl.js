/**
 * Created by ali on 7/27/2018.
 */

angular.module('webApp.controllers')
    .controller('firePredictorCtrl', ['$scope','$state','firePredictorService','notifyService','$http','leafletData', function ($scope,$state,firePredictorService,notifyService,$http,leafletData) {


        angular.extend($scope, {
            center: {
                lat: 36.7783,
                lng: -119.4179,
                zoom: 6
            },
            defaults: {
                scrollWheelZoom: false
            },
            layers: {
                baselayers: {
                    mapbox_light: {
                        name: 'open streetmap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz',
                        layerOptions: {
                            apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                            mapid: 'bufanuvols.lia22g09'
                        }
                    }
                }
            }
        });

        leafletData.getMap("map").then(
            function (map) {
                $scope.G = map;
            }
        );
        $scope.check;
        var weatherIcon = L.Icon.extend({
            options: {
                iconSize:     [15, 15], // size of the icon
                iconAnchor:   [8, 8],   // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }
        });

        $scope.powerPlants = function ()
        {
            $scope.check = "powerPlants";
            if($scope.powerPlant)
            {
                $http.get("/json/natural_gas_station.json").success(function(data, status) {
                    $scope.showResourcesOnMap(data,"s");
                });
            }
            else
            {
                /*$scope.geojsonLayer.clearLayers();*/
            }
        }

        $scope.transmissionLines = function ()
        {
            if($scope.transmissionLine)
            {
                console.log("show");
                $http.get("/json/natural_gas_pipelines.json").success(function(data, status) {
                    $scope.showResourcesOnMap(data, "s");
                });
            }
            else
            {
                /*$scope.geojsonLayer.clearLayers();*/
            }
            $scope.check = "transmissionLines";
        }

        $scope.generators = function ()
        {
            $scope.check = "generators";
            console.log($scope.check);
        }

        $scope.heatmaps = function ()
        {
            if($scope.heatmap)
            {
                $http.get("json/heat-points.json").success(function(data) {
                    $scope.layers.overlays = {
                        heat: {
                            name: 'Heat Map',
                            type: 'heat',
                            data: data,
                            layerOptions: {
                                radius: 15,
                                blur: 0,
                                max: 1.0,
                                gradient: {
                                    '0.20': 'Green',
                                    '0.40': 'Blue',
                                    '0.60': 'Yellow',
                                    '0.80': 'Orange',
                                    '1': 'Red'
                                }
                            },
                            visible: true
                        }
                    };
                });
            }
            else
            {
                /*$scope.geojsonLayer.clearLayers();*/
            }
            $scope.check = "heatmap";
        }

        $scope.showResourcesOnMap = function(json,type)
        {
            var hurricaneIcon = new weatherIcon({iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QoBAxAud5K8hAAAAVFJREFUOMulk7FqwlAUhn9LHbIZwSmIxClbwMnNsWQqTnmDvEOewM3Nl4gU2i2lUPAFhEwREUXUJUIchRT6d7ia9GpiIz3ww73n3vvBPec/FZIojP0+xnSqYjIBlktgvRZ5VQWaTcA0gecnPBYCxmNiOMRXEKB6PIqcYQD9PtDrCZCuHwAAJGVtF6TjMFEUEshk2+R2wav74vRXIopi2rb8+KTvep20LNL3eRviurkASZpGeh5zIck8FBf+ggCkYTCZhyno4VzH6ssrsNuhVMxmqH58ptsUgtUKd0UQ5ED+ERnENO97qevZWiqsYZQrrKZJhZVb7HnlOuS6LPYJCfo+aVnCXHkA2yajKL4NOX/twrmJopCOk2v9dF6SeSgsPRhItUkUhex2ydEod25IosLtgnh7F33fbIRfajWg1QLabTGxnc4BjUa9sFNX5Iv/ltEPO/n21h3V82sAAAAASUVORK5CYII='});
            var stormIcon = new weatherIcon({iconUrl: '/images/natural-gas-icon.png'});
            var depressionIcon = new weatherIcon({iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QoBAxIgohzzAQAAARlJREFUOMutlLFqwzAQhk8FF1xwqdNRW7poy+pX8ByC3kDvkFdyyJ5X8JgtUMgDSEQJ9WZD/w7CkR07AuMeHEb+pc/H3S8zADQ3XoKqMbb5PoGMsaFtbLSS3Q603xMdj/7dakW0XhNtNmywH4BPrS2UQh3HANEg6zgGlAK0tt1zfUgXIAQgJbDduifnHqgUxiFF4QFZBpQlelGWQJ77ig4HDCFSuiXnQ0AX1FYk5QNEawshuuLzaD8mxL03bsT1T0pV5Tq9XIZN0epVRc3tknqfvL5fKUmceD6HIa2eJBR9fF77I57dk8fp5Pn4dLIMIMLvYgEUBZ765O4Fzp0fJvlkhmP/5e6w4K/AGNvcLmn0FhHxLzbtFk+MP6p09GzHwZBXAAAAAElFTkSuQmCC'});
            var prestormIcon = new weatherIcon({iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QoBAxU3bo7gAQAAALNJREFUOMvNU8sOwyAMc6epE9de+938BHwJfE9pSzXNO6BuoPKY1h0WKZfEcQyGjiTOxgU/iDeJtYTWhJuLYL9tgNaEtal8kiGVIseRlJKvWpSr96CUAaNUgjmAHsNASsnV+5So0jtsjME58pxK5IrJUE1djSTevglRVLBn1uJb3wMA7suCqxBtj2sqvj/ObmM89OnF1ixu2Z99bCXZzcdGY0JzckUXOLmwzJiEpPvDX3winqe9C5rOnaU+AAAAAElFTkSuQmCC'});
            var poststormIcon = new weatherIcon({iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QoBAxYc6R9KggAAAWdJREFUOMutUz1PwlAUPSUppBBCYGDpBFM3/oD+BgaGzixv073RUcOu6cJPaMKo4W+wmZiUuR0KBGpoGY7Ds69URFS8yc3Lux/n3XfPvRpJnCulY44kTYEwjHavL0QYRkmaHgXRDiqJ34DnJ2IyAWaz3N7rAcMhcHGpoVYt5pDMNQgiCsHUMEjgQFPDIIUggyDaz8sBNjEKAKZJ2jbpOPI0zRxQCHITfwHieQogNQzSdVkQ1y36PY8FkG2SgLZdrMCyskByOpX3j4pSwyBtm9sk2askCCJalrzaNrmJydFIJgohT8eR9uwxy1K9KQHAbhU1Vae7XaBWBa6uJSPjMdDpADe30t7tqtAsrwQAeqO1UB7flzQ/PkiKhQDmc+D+Ttp9X4XqVT2n+Lc9Ud/+d3aUCpHPwuc5yRr/7ZycMbGnd2e9Bup1ydRggKTf1yrl8okF3NviynIZ7VZRU2+0Fmi3Wz/f4j/IO6YU957m4lBDAAAAAElFTkSuQmCC'});
            $scope.geojsonLayer = L.geoJson(json, {
                pointToLayer: function(feature, LatLng) {
                    var icon;
                    icon = stormIcon;
                    /*switch (type) {
                        case 's': icon = stormIcon; break;
                        case 'x': icon = prestormIcon; break;
                        case 'm': icon = hurricaneIcon; break;
                        case 'h': icon = hurricaneIcon; break;
                        case 'd': icon = depressionIcon; break;
                        case 'i': icon = poststormIcon; break;
                    }*/
                    return L.marker(LatLng, {icon: icon});
                }

            }).addTo($scope.G);
            $scope.geojsonLayer.addData(json);
        }

        function getJson(simp){  //Removed unneeded arguments here
            var url = 'file' + simp + '.json';
            map.removeLayer(geojsonLayer);
            //geojsonLayer.clearLayers();  I don't believe this needed.
            $.getJSON(url, function(data){
                geojsonLayer = L.geoJson(data, {
                    style: defaultStyle,
                    onEachFeature: onEachFeature
                });
                geojsonLayer.addTo(map);
            });
        }

        /*firePredictorService.getFirePredictorValues().success(function (res) {
            if(res.status)
            {
                $scope.fire_predictor_values = res.data;
            }
        });*/

    }]);
