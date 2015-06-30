angular.module('wolkidee.controllers').controller('HomeCtrl', function($scope, $meteor, $state, $filter, $stateParams, $timeout){

	function createIsotope(){
		console.log('createIsotope');
		var elem = document.querySelector('.grid');
		$scope.iso = new Isotope( elem, {
			itemSelector: '.grid-item',
			layoutMode: 'masonry'
		});
	}

	

	var done = false;

	if($stateParams.academie){
		$scope.academie = { name: $stateParams.academie };
		$scope.allquotes = $meteor.collection(Quotes);
  		$scope.quotes = $meteor.collection(Quotes);
  		
		$timeout(function(){
			if(!done){
				swal({
					title: 'De quotes worden geladen',
					text: 'Het laden duurt langer dan verwacht, even geduld a.u.b.',
					allowEscapeKey: false,
					allowOutsideClick: false,
					showConfirmButton: false,
				});
			}
		}, 5000);

		Quotes.find().observeChanges({
			changed: function (id, fields) {
        		console.log('changed: ' + id);
       			$scope.quotes = $filter('filter')($scope.allquotes, {'state': 'accepted', 'academie': $scope.academie.name});
        		$timeout(function(){
        			if($scope.iso){
        				createIsotope();
        				console.log('arrange');
	        			}
        		}, 1000);
			}
		});
	} else {
		$state.go('home.academie');
	}
	
  	var once = true;
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	console.log('ngRepeatFinished');
  	    if(once){
	  		once = false;
	  		createIsotope();
			$timeout(function(){
				$scope.setContainerWidth();
			}, 300);
  	    }
		$(window).resize(function(){
			$scope.setContainerWidth();
		});
		$(window).load(function(){
			console.log('window load');
			swal.close();
			done = true;
			$scope.setContainerWidth();
		});

	});
	
	$scope.setContainerWidth = function(){
		console.log('setContainerWidth');
		$scope.iso.arrange();
		$('.grid').css('width', 'auto'); //reset
		var windowWidth = $(document).width();
		var blockWidth = $('.quoteCard').outerWidth(true);
		var maxBoxPerRow = Math.floor(windowWidth / blockWidth);
		var newWidth = Math.floor(maxBoxPerRow * blockWidth);
		$('.grid').width(newWidth);
	};

	$scope.back = function(){
		$state.go('home.academie');
	};
});