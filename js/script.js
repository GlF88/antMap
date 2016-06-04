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

  $scope.addPlacemarkCheckFunc = function () {
    if ($scope.addPlacemarkCheck.check) {
      $scope.addPlacemarkCheck.check = false;
      document.getElementsByClassName("ymaps-layers-pane")[0].style.webkitFilter = "grayscale(0%)";
      myMap.balloon.close();
    } else {
      $scope.addPlacemarkCheck.check = true;
      document.getElementsByClassName("ymaps-layers-pane")[0].style.webkitFilter = "grayscale(100%)";
    }
  };

  $scope.sender = {
    coordinateX: '',
    coordinateY: ''
  };

  $scope.funcInitPlacemark = function () {
    var interval = setInterval(function() {
      if ($scope.tasks[0]) {
        clearInterval(interval);
        arrPlacemark = [];

        for (var i = 0; i < $scope.tasks.length; i++) {
          arrPlacemark[i] = new ymaps.Placemark([parseFloat($scope.tasks[i].coordinateX), parseFloat($scope.tasks[i].coordinateY)], {
          iconContent: $scope.tasks[i].name.split(' ')[0].slice(0,1) + '. ' + $scope.tasks[i].name.split(' ')[1],
          balloonContent: '<strong>' + $scope.tasks[i].name + '</strong> <br /> <br />' + $scope.tasks[i].comment + ' <br /><br /> Добавлена: ' + $scope.tasks[i].time
        }, {
          preset: 'twirl#blueStretchyIcon'
        });

        myMap.geoObjects
          .add(arrPlacemark[i]);
        };
      } else {
        $scope.tasks = Task.query();
      };
    }, 500);
  };

  // if ($scope.addPlacemarkCheck.check) {
  //   $('.ymaps-layers-pane').css({'-webkit-filter': 'grayscale(100%)'});
  // } else {
  //   $('.ymaps-layers-pane').css({'-webkit-filter': 'grayscale(0%)'});
  // }

  initPlacemark = function() {
    ymaps.ready(init);

    function init() {
      myMap = new ymaps.Map("map", {
          center: [55.76, 37.64],
          zoom: 10
      });

      // $('.wrapper-progress').css({'display': 'none'});
      document.getElementsByClassName("wrapper-progress")[0].style.display = 'none';

      myMap.behaviors.enable('scrollZoom');
      myMap.controls.add('typeSelector');

      myMap.events.add('click', function (e) {
        if ($scope.addPlacemarkCheck.check) {
          if (!myMap.balloon.isOpen()) {
              var coords = e.get('coordPosition');
              myMap.balloon.open(coords, {
                  contentHeader:'Муравьи тут!'
              });
              $scope.coordinateInput(coords[0].toPrecision(10),coords[1].toPrecision(10));
              $scope.dateInput (new Date().toDateString());
              openModalPlace ();
          } else {
              myMap.balloon.close();
          };
        } else {
          return false;
        };
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
    $scope.sender.time = '';
  };

  $scope.coordinateInput = function (x,y) {
    document.getElementById('inputCoorX').value = x;
    document.getElementById('inputCoorY').value = y;
    $scope.sender.coordinateX = x;
    $scope.sender.coordinateY = y;
  };

  $scope.dateInput = function (time) {
    document.getElementById('time').value = time;
    $scope.sender.time = time;
  };

  $scope.send = function () {
    Task.save($scope.sender, function() {
      $scope.tasks = Task.query();
      $scope.funcInitPlacemark ();
      $scope.clearInput ();
      $scope.addPlacemarkCheckFunc()
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
