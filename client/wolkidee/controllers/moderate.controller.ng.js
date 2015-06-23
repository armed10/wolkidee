angular.module('wolkidee.controllers').controller('ModerateCtrl', function($scope, $meteor, $filter) {
	$scope.pendingQuotes = $meteor.collection(Quotes)
	
	$scope.accept = function(quote){
		Quotes.update({"_id":quote._id}, {$set: {"state": "accepted"}});
		swal({ title: "Geaccepteerd!",
			   showConfirmButton: false,
			   timer: 800,
			   type: "success" });
	}

	$scope.decline = function(quote){
		Quotes.update({"_id":quote._id}, {$set: {"state": "rejected"}});
		swal({ title: "Geweigerd!",
			   showConfirmButton: false,
			   timer: 800,
			   type: "error" });
	}

	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
  		$(document).ready(function(){
  			$('.grid').css('margin', 'auto');
		    $scope.setContainerWidth();
		});

		$(window).resize(function(){
			$scope.setContainerWidth();
		});
	});

	$scope.setContainerWidth = function(){
			$('.grid').css('width', 'auto'); //reset
			var windowWidth = $(document).width();
			var blockWidth = $('.quoteCard').outerWidth(true);
			var maxBoxPerRow = Math.floor(windowWidth / blockWidth);
			var newWidth = Math.floor(maxBoxPerRow * blockWidth);
			$('.grid').width(newWidth);
			$('.grid').css('marg', 'auto'); //reset
		};

});