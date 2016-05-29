var app = angular.module('app', ['mongolab']);

app.controller('homeCtrl', ['$scope', '$location', 'Task', function($scope, $location, Task) {

 $scope.tasks = Task.query();

  var interval = setInterval(function() {
    if ($scope.tasks[0]) {
      clearInterval(interval);
      initPlacemark();
    } else {
      $scope.tasks = Task.query();
    }
  }, 500);

  $scope.addPlacemarkCheck = {
    check: false
  };

  $scope.sender = {
    coordinateX: '',
    coordinateY: ''
  }

  $scope.funcInitPlacemark = function () {
    var interval = setInterval(function() {
      if ($scope.tasks[0]) {
        clearInterval(interval);
        arrPlacemark = [];

        for (var i = 0; i < $scope.tasks.length; i++) {
          arrPlacemark[i] = new ymaps.Placemark([parseFloat($scope.tasks[i].coordinateX), parseFloat($scope.tasks[i].coordinateY)], {
          iconContent: $scope.tasks[i].name,
          balloonContent: $scope.tasks[i].comment
        });

        myMap.geoObjects
          .add(arrPlacemark[i]);
        }
      } else {
        $scope.tasks = Task.query();
      }
    }, 500);
  };

  initPlacemark = function() {
    ymaps.ready(init);

    function init() {
      myMap = new ymaps.Map("map", {
          center: [55.76, 37.64],
          zoom: 10
      });


      myMap.events.add('click', function (e) {
        if ($scope.addPlacemarkCheck.check) {
          if (!myMap.balloon.isOpen()) {
              var coords = e.get('coordPosition');
              myMap.balloon.open(coords, {
                  contentHeader:'Событие!',
                  contentBody:'hello',
                  contentFooter:'<sup>Щелкните еще раз</sup>'
              });
              $scope.coordinateInput(coords[0].toPrecision(6),coords[1].toPrecision(6));
          }
          else {
              myMap.balloon.close();
          }
        } else {
          return false;
        }
      });

      myMap.controls.add('smallZoomControl', {
        top: 5
      });

      $scope.funcInitPlacemark ();
    };
  };

  $scope.clearInput = function () {
    $scope.sender.name = '';
    $scope.sender.comment = '';
    $scope.sender.coordinateX = '';
    $scope.sender.coordinateY = '';
  };

  $scope.coordinateInput = function (x,y) {
    document.getElementById('inputCoorX').value = x;
    document.getElementById('inputCoorY').value = y;
    $scope.sender.coordinateX = x;
    $scope.sender.coordinateY = y;
  }

  $scope.send = function () {
    Task.save($scope.sender, function() {
      $scope.tasks = Task.query();
      $scope.funcInitPlacemark ();
      $scope.clearInput ();
    });
  }

  $scope.del = function (dele) {
    Task.remove({
      id: dele
    }, function() {
      $scope.tasks = Task.query();
    });
  }

}])

angular.module('mongolab', ['ngResource']).
factory('Task', function($resource) {
  var Task = $resource('https://api.mongolab.com/api/1/databases' + '/ant_map/collections/tasks/:id', {
    apiKey: 'qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9'
  }, {
    update: {
      method: 'PUT'
    }
  });

  return Task;
});
