/**
 * Created by ali on 7/27/2018.
 */

angular.module('webApp.controllers')
    .controller('firePredictorCtrl', ['$scope','$state','firePredictorService','notifyService','$http','leafletData', function ($scope,$state,firePredictorService,notifyService,$http,leafletData) {
        angular.extend($scope, {
            center: {
                lat: 36.7783,
                lng: -119.4179,
                zoom: 8
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

        firePredictorService.getUser().success(function(res){
            $scope.user = res.data;
            console.log($scope.user)
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
                iconSize:     [22, 40], // size of the icon
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
                $http.get("/json/natural_gas_station.json").success(function(data, status) {
                    $scope.showResourcesOnMap(data,$scope.key);
                });
            }
            else
            {
                notifyService.showLoading();
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
                notifyService.showLoading();
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
                notifyService.showLoading();
                $scope.removeShapeLayers('feature-' + $scope.key);
            }
        }
        $scope.heatmap_data;
        $scope.fire_array = [];
        $scope.heatmaps = function ()
        {
            $scope.key = "heatmap"
            if($scope.heatmap)
            {
                firePredictorService.getFirePredictorValues().success(function (res) {
                    if(res.status)
                    {

                        $scope.fire_obj = {
                            latlng:[],
                            counties:[],
                            wind:[],
                            temperature:[],
                            humidity:[],
                            precipitation:[]
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
                                    $scope.fire_obj.precipitation.push($scope.fire_predictor_values[i][outer_key]["Precipitation"]);
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
                                humidity:[],
                                precipitation:[]
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
            notifyService.showLoading();
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
            $scope.layers.overlays = {};
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
                        gradient: false
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
            notifyService.hideLoading();
            console.log($scope.G);
        }
        $scope.drawCircle = function()
        {
            console.log("in drawCircle")
            $scope.key = "circle";
            var markersLayer = new L.LayerGroup();
            $scope.G.addLayer(markersLayer);
            if($scope.circle)
            {
                notifyService.showLoading();
                firePredictorService.getFirePredictorValues().success(function (res) {
                    if(res.status)
                    {

                        $scope.fire_obj = {
                            latlng:[],
                            counties:[],
                            wind:[],
                            temperature:[],
                            humidity:[],
                            precipitation:[]
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
                                    $scope.fire_obj.precipitation.push($scope.fire_predictor_values[i][outer_key]["Precipitation"]);
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
                                humidity:[],
                                precipitation:[]
                            };
                        }
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
                        for(i = 0; i < $scope.heatmap_data.latlng.length; i++)
                        {
                            var color, probablity;
                            if($scope.heatmap_data.latlng[i][2] >= 0 &&  $scope.heatmap_data.latlng[i][2] <= 5)
                            {
                                color = 'green';
                                probablity = 'Low';
                            }
                            else if ($scope.heatmap_data.latlng[i][2] > 5 &&  $scope.heatmap_data.latlng[i][2] <= 14)
                            {
                                color = 'blue';
                                probablity = 'Moderate';
                            }
                            else if ($scope.heatmap_data.latlng[i][2] > 14 &&  $scope.heatmap_data.latlng[i][2] <= 21)
                            {
                                color = 'yellow';
                                probablity = 'High';
                            }
                            else if ($scope.heatmap_data.latlng[i][2] > 21 &&  $scope.heatmap_data.latlng[i][2] <= 33)
                            {
                                color = 'orange';
                                probablity = 'Very High';
                            }
                            else if ($scope.heatmap_data.latlng[i][2] > 33)
                            {
                                color = 'red';
                                probablity = 'Extreme';
                            }
                            var circle = L.circle([$scope.heatmap_data.latlng[i][0], $scope.heatmap_data.latlng[i][1]], 1000, {
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.5,
                                fill:true,
                                opacity:0.5,
                                clickable:true,
                                source_id : 'feature-' + $scope.key
                            }).addTo($scope.G).on("click", groupClick).bindPopup( " Fire Probablitiy : " + probablity + "<br>"
                                                                                + " Temperature : " + $scope.heatmap_data.temperature[i]+ "&deg;C " + "<br>"
                                                                                + " Wind : " + $scope.heatmap_data.wind[i] + "<br>"
                                                                                + " Humidity : " + $scope.heatmap_data.humidity[i] + "<br>"
                                                                                + " Precipitation : " + $scope.heatmap_data.precipitation[i]);

                        }
                        /*$scope.G.on('click', 'feature-circle', function (e) {
                            console.log(e);
                            var coordinates = e.features[0].geometry.coordinates.slice();
                            var description = e.features[0].properties.description;

                            // Ensure that if the map is zoomed out such that multiple
                            // copies of the feature are visible, the popup appears
                            // over the copy being pointed to.
                            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                            }

                            new mapboxgl.Popup()
                                .setLngLat(coordinates)
                                .setHTML(description)
                                .addTo($scope.G);
                        });*/
                    }
                    notifyService.hideLoading();
                });
            }
            else
            {
                notifyService.showLoading();
                $scope.removeShapeLayers("feature-"+$scope.key);
            }
        }
        function groupClick(event) {
            console.log("Clicked on marker ");
        }
        $scope.showResourcesOnMap = function(json,type)
        {
            var power_plant_icon = new weatherIcon({iconUrl: '/images/marker-pole.png'});
            var generator_icon = new weatherIcon({iconUrl: '/images/marker-power.png'});
            var layerPopup;
            var icon;
            if(type == "generators")
                icon = generator_icon;
            else if(type == "powerPlants")
                icon = power_plant_icon;
            $scope.geojsonLayer = L.geoJson(json, {
                pointToLayer: function(feature, LatLng) {
                    return L.marker(LatLng, {icon: icon});
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
            console.log("in removeShapeLayers-> " + id);
            //console.log($scope.G);
            for(var key in $scope.G._layers){
                /*console.log($scope.G._layers[key]);
                console.log($scope.G._layers[key].source_id);*/
                if(id == "feature-heatmap" || id == "feature-circle" )
                {
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
            notifyService.hideLoading();
        }


        $scope.increaseDate = function()
        {

            console.log("in increaseDate");
            if(!$scope.heatmap && !$scope.circle)
            {
                notifyService.notify("Heat map is not checked");
                return;
            }
            else
            {
                $scope.date = increment(new Date($scope.date));
                if($scope.heatmap )
                    $scope.showHeatmap();
                else if ($scope.circle)
                    $scope.drawCircle();
            }
        }

        $scope.decreaseDate = function()
        {
            console.log("in decreaseDate");
            if(!$scope.heatmap && !$scope.circle)
            {
                notifyService.notify("Heat map is not checked");
                return;
            }
            else
            {
                $scope.date = decrement(new Date($scope.date));
                if($scope.heatmap )
                    $scope.showHeatmap();
                else if ($scope.circle)
                    $scope.drawCircle();
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
            /*debugger;*/
            var newArray = []
            var outerArray = [];
            var popLocation;
            var popup;
            for(i = 0; i < array.length; i++)
            {
                var size = parseInt(array[i][2]);
                for(j = 0; j < size; j++)
                {
                    newArray.push(array[i]);
                }
            }
            return newArray;

        }

    }]);
