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
        $scope.key;
        $scope.date = formatDate(new Date());
        console.log($scope.date);
        var weatherIcon = L.Icon.extend({
            options: {
                iconSize:     [15, 15], // size of the icon
                iconAnchor:   [8, 8],   // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }
        });

        $scope.powerPlants = function ()
        {
            $scope.key = "powerPlants";
            if($scope.powerPlant)
            {
                notifyService.showLoading();
                $http.get("/json/natural_gas_station1.json").success(function(data, status) {
                    $scope.showResourcesOnMap(data,$scope.key);
                });
            }
            else
            {
                $scope.removeShapeLayers('feature-' + $scope.key);
            }
        }

        $scope.transmissionLines = function ()
        {
            $scope.key = "transmissionLines";
            if($scope.transmissionLine)
            {
                console.log("show");
                notifyService.showLoading();
                $http.get("/json/natural_gas_pipelines.json").success(function(data, status) {
                    $scope.showResourcesOnMap(data, $scope.key);
                });
            }
            else
            {
                $scope.removeShapeLayers('feature-' + $scope.key);
            }

        }

        $scope.generators = function ()
        {
            console.log("in generators")
            $scope.key = "generators";
            if($scope.generator)
            {
                notifyService.showLoading();
                $http.get("/json/electric_generators.json").success(function(data, status) {
                    $scope.showResourcesOnMap(data,$scope.key);

                });
            }
            else
            {
                $scope.removeShapeLayers('feature-' + $scope.key);
            }
        }
        $scope.heatmap_data;
        $scope.heatmaps = function ()
        {
            $scope.key = "heatmap"
            if($scope.heatmap)
            {
                firePredictorService.getFirePredictorValues().success(function (res) {
                    if(res.status)
                    {
                        $scope.fire_array = [];
                        $scope.fire_obj = {
                            latlng:[],
                            counties:[],
                            wind:[],
                            temperature:[],
                            humidity:[]
                        };
                        var dd,mm,yyyy;
                        var keys = []
                        $scope.fire_data = [];
                        $scope.latlang = [];
                        console.log(res.data);
                        $scope.fire_predictor_values = res.data;
                        for(i = 0; i < $scope.fire_predictor_values.length; i++)
                        {
                            prediction_outer_object_keys = []
                            var day,month,year;
                            prediction_outer_object_keys = Object.keys($scope.fire_predictor_values[i]);
                            prediction_outer_object_keys.forEach(function(outer_key){
                                if(outer_key != "_id")
                                {
                                    $scope.latlang.push($scope.fire_predictor_values[i][outer_key]["latitude"]);
                                    $scope.latlang.push($scope.fire_predictor_values[i][outer_key]["longitude"]);
                                    $scope.latlang.push($scope.fire_predictor_values[i][outer_key]["Predictions"]);
                                    $scope.fire_obj.latlng.push($scope.latlang);
                                    $scope.latlang = [];
                                    $scope.fire_obj.wind.push($scope.fire_predictor_values[i][outer_key]["Wind"]);
                                    $scope.fire_obj.temperature.push($scope.fire_predictor_values[i][outer_key]["Temp"]);
                                    $scope.fire_obj.humidity.push($scope.fire_predictor_values[i][outer_key]["Rel_Humidity"]);
                                    $scope.fire_obj.counties.push($scope.fire_predictor_values[i][outer_key]["county"]);
                                    dd = $scope.fire_predictor_values[i][outer_key]["Day"];
                                    if(dd < 10)
                                    {
                                        dd = "0" + dd;
                                    }
                                    mm = $scope.fire_predictor_values[i][outer_key]["Month"];
                                    if(mm < 10)
                                    {
                                        mm = "0" + mm;
                                    }
                                    yyyy = $scope.fire_predictor_values[i][outer_key]["Year"];
                                    $scope.fire_obj.date = mm + "-" + dd + "-" + yyyy;
                                }
                            });
                            $scope.fire_array.push($scope.fire_obj);
                            $scope.fire_obj = {
                                latlng:[],
                                counties:[],
                                wind:[],
                                temperature:[],
                                humidity:[]
                            };
                        }
                        $scope.showHeatmap();
                    }
                });
            }
            else
            {
                $scope.removeShapeLayers('feature-' + $scope.key);
            }
        }

        $scope.showHeatmap = function()
        {
            var flag = false;
            for(i = 0; i < $scope.fire_array.length; i++)
            {
                if($scope.date == $scope.fire_array[i].date)
                {
                    flag = true;
                    $scope.heatmap_data = $scope.fire_array[i];
                }
            }
            if(!flag)
            {
                notifyService.notify("no record for this date found");
                return;
            }
            var data = setArray($scope.heatmap_data.latlng)
            $scope.layers.overlays = {
                heat: {
                    name: 'Heat Map',
                    type: 'heat',
                    data: data,
                    layerOptions: {
                        radius: 20,
                        blur: 15,
                        source_id:'feature-' + $scope.key,
                        gradient: {
                            '0.20': 'Green',
                            '0.40': 'Blue',
                            '0.60': 'Yellow',
                            '0.80': 'Orange',
                            '1': 'Red'
                        }
                    },
                    visible: true
                }/*,
                 onEachFeature: function (feature, layer) {
                 layer.on('click', function(e){
                 console.log(e);
                 var coordinates = e.target.feature.geometry.coordinates;
                 var swapped_coordinates = [coordinates[1], coordinates[0]];  //Swap Lat and Lng
                 if ($scope.G) {
                 layerPopup = L.popup()
                 .setLatLng(swapped_coordinates)
                 .setContent('Popup for feature #'+e.target.feature.properties.County)
                 .openOn($scope.G);
                 }
                 });
                 }*/
            };
            console.log($scope.G);
        }

        $scope.showResourcesOnMap = function(json,type)
        {
            var stormIcon = new weatherIcon({iconUrl: '/images/natural-gas-icon.png'});
            var layerPopup;
            $scope.geojsonLayer = L.geoJson(json, {
                pointToLayer: function(feature, LatLng) {
                    return L.marker(LatLng, {icon: stormIcon});
                },
                onEachFeature: function (feature, layer) {
                    layer.on('click', function(e){
                        console.log(e);
                        var coordinates = e.target.feature.geometry.coordinates;
                        var swapped_coordinates = [coordinates[1], coordinates[0]];  //Swap Lat and Lng
                        if ($scope.G) {
                            layerPopup = L.popup()
                                .setLatLng(swapped_coordinates)
                                .setContent('Popup for feature #'+e.target.feature.properties.County)
                                .openOn($scope.G);
                        }
                    });
                    if(type == "transmissionLines"){
                        layer.setStyle({
                            weight: 2,
                            opacity: 1,
                            dashArray: '3',
                            fillOpacity: 0.7
                        });
                    }
                    // At this point 'layer._path' exists in the layer object
                    // but it will return as 'undefined' so this is of no use
                    // So the following doesn't work:
                    layer.source_id = 'feature-' + type
                }
            }).addTo($scope.G);
            notifyService.hideLoading();
            console.log($scope.G);
            /*$scope.G.on('click', function(e){
                console.log(e);
                /!*var coordinates = e.target.feature.geometry.coordinates;
                 var swapped_coordinates = [coordinates[1], coordinates[0]];  //Swap Lat and Lng
                 if ($scope.G) {
                 layerPopup = L.popup()
                 .setLatLng(swapped_coordinates)
                 .setContent('Popup for feature #'+e.target.feature.properties.County)
                 .openOn($scope.G);
                 }*!/
            });*/
        }

        $scope.removeShapeLayers = function(id){
            console.log("in removeShapeLayers");
            //console.log($scope.G);
            for(var key in $scope.G._layers){
                /*console.log($scope.G._layers[key]);
                console.log($scope.G._layers[key].source_id);*/
                if(id == "feature-heatmap")
                {
                    console.log($scope.G._layers[key].options);
                    if(undefined != $scope.G._layers[key].options && undefined != $scope.G._layers[key].options.source_id) {
                        if ($scope.G._layers[key].options.source_id == id) {
                            console.log($scope.G._layers[key].options.source_id);
                            $scope.G.removeLayer($scope.G._layers[key]);
                            $scope.layers.overlays = {};
                        }
                    }
                }
                else if($scope.G._layers[key].source_id == id) {
                    $scope.G.removeLayer($scope.G._layers[key]);
                }
            }
        }

        $scope.increaseDate = function()
        {

            console.log("in increaseDate");
            if(!$scope.heatmap)
            {
                notifyService.notify("Heat map is not checked");
                return;
            }
            else
            {
                $scope.date = increment(new Date($scope.date));
                $scope.showHeatmap();
            }
        }

        $scope.decreaseDate = function()
        {
            console.log("in decreaseDate");
            if(!$scope.heatmap)
            {
                notifyService.notify("Heat map is not checked");
                return;
            }
            else
            {
                $scope.date = decrement(new Date($scope.date));
                $scope.showHeatmap();
            }
        }

        function formatDate(date) {
            var today = new Date(date);
            var dd = today.getDate();
            if(dd < 10)
                dd = "0" + dd;
            var mm = today.getMonth()+1; //January is 0!
            if(mm < 10)
                mm = "0" + mm;
            var yyyy = today.getFullYear();
            return mm + "-" + dd + "-" + yyyy;
        }
        function increment(date){
            date.setDate(date.getDate()+1);
            return formatDate(date);
        }
        function decrement(date){
            date.setDate(date.getDate()-1);
            return formatDate(date);
        }
        function setArray(array)
        {
            var newArray = []
            var outerArray = [];
            for(i = 0; i < array.length; i++)
            {
                for(j = 0; j < 100; j++)
                {
                    newArray.push(array[i]);
                }
            }
            return newArray;

        }

    }]);
