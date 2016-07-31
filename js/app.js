var resultArray = [];
angular.module('app', [])

.controller('MapCtrl', function($scope, $http, $q, $log) {

	$scope.appid = 'eb61143ddd92803a5fef77faeae6a72b';

	var mapOptions = {
		zoom: 7,
		center: new google.maps.LatLng(46.5467111, 2.5312002),
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}

	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	$scope.markers = [];
	
	var infoWindow = new google.maps.InfoWindow();
	
	var createMarker = function (info){
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(info.coord.lat, info.coord.lon),
			title: info.name
		});
		marker.content = '<div class="infoWindowContent">' + 'TEMP <span class="right">' + info.main.temp + '°C</span> <br />' + 'CLOUDS <span class="right">'+ info.clouds.all + '%</span> <br /> HUMIDITY <span class="right">' + info.main.humidity + '%</span> <br /> PRESSURE <span class="right">' +info.main.pressure +  'kPa</span> <br /> WIND DIRECTION <span class="right">' + info.wind.deg + '°</span> <br /> WIND SPEED <span class="right">' + info.wind.speed + 'm/s</span> </div>';
		
		google.maps.event.addListener(marker, 'click', function(){
			infoWindow.setContent('<h1>' + marker.title + '</h1>' + marker.content);
			infoWindow.open($scope.map, marker);
		});
		
		$scope.markers.push(marker);
		
	}
	
	var getWeather = function () {
		$http.get('//api.openweathermap.org/data/2.5/box/city?bbox=-5,42,8,50.5,30&cluster=yes&appid='+$scope.appid)
		.then(function(data) {
			for (var i = 0; i < data.data.list.length;i++) {
				createMarker(data.data.list[i]);
			}
		});
	}

	getWeather();
	setInterval(getWeather(), 60000);

	$scope.openInfoWindow = function(e, selectedMarker){
		e.preventDefault();
		google.maps.event.trigger(selectedMarker, 'click');
	}
})
