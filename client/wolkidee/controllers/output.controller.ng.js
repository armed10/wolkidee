angular.module('wolkidee.controllers').controller('OutputCtrl', function($scope, $meteor, $filter, $stateParams) {
    var fadeInClasses = 'animated fadeInLeft';
    var fadeOutClasses = 'animated fadeOutRight';
    var hideClasses = 'hidden';
    var once = true;
    var frequency = 9000;
    var acceptedQuotes;
    var offlineCounter = {'-1': Number.POSITIVE_INFINITY};
    $scope.outputCard = "#outputCardContainer";
    
    if($stateParams.academie){
        acceptedQuotes = $filter('filter')($meteor.collection(Quotes), {'state': 'accepted', 'academie': $stateParams.academie});
    } else {
        acceptedQuotes = $filter('filter')($meteor.collection(Quotes), {'state': 'accepted'});
    }

    var count = acceptedQuotes.length;


    function randomNumber(limit) {
    	var result = Math.floor(Math.random() * limit);
        return result;
    }

    function countQuotes(){
    	count = acceptedQuotes.length;
    }

    function nextQuote() {
        delete $scope.quote;
        console.log(count);
        if(count > 0) {
            var lowest = {_id: '-1'};
            var tmp;
            for (var i=acceptedQuotes.length-1; i>=0; i--) {
                tmp = acceptedQuotes[i];
                if(!angular.isDefined(offlineCounter[tmp._id])){
                    offlineCounter[tmp._id] = 0;
                }
                if (offlineCounter[tmp._id] < offlineCounter[lowest._id]) lowest = tmp;
                // if (tmp.views < lowest.views) lowest = tmp;
            }
            offlineCounter[lowest._id]++;
            // console.log(offlineCounter[lowest._id]);
            $scope.quote = lowest;
            $scope.quote.views++;
            Quotes.update({"_id":$scope.quote._id}, {$set: {'views': $scope.quote.views}});
        } else {
            $scope.quote = {
                name: 'Avans Hogeschool',
                title: 'Voer je quote in bij de iPads',
                quote: 'Je kunt je eigen quote uploaden voor dit jaarboek bij de iPad stands.',
                views: 1,
                image: 'http://i.imgur.com/swL1ZRDl.png'
            };
        }
        
    }

    function getAcceptedQuotes(){
        if($stateParams.academie){
            acceptedQuotes = $filter('filter')($meteor.collection(Quotes), {'state': 'accepted', 'academie': $stateParams.academie});
        } else {
    	   acceptedQuotes = $filter('filter')($meteor.collection(Quotes), {'state': 'accepted'}); 
        }

    }

    function fadeOut() {
        $($scope.outputCard).removeClass(fadeInClasses);
        $($scope.outputCard).addClass(fadeOutClasses);
    }

    function fadeIn() {
        $($scope.outputCard).removeClass(hideClasses);
        resizeQuote();
        center(".thumbnail");
        $($scope.outputCard).removeClass(fadeOutClasses);
        $($scope.outputCard).addClass(fadeInClasses);
    }

    function resizeQuote(){
        var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var height = document.getElementById('quoteContent').offsetHeight;
        var newMaxHeight = windowHeight - height - 20;
        $(".card-image-output").css({ "max-height": newMaxHeight + 'px' });
    }
    var looptimes = 0;
    function fadeLoop() {
        setInterval(function() {
                fadeOut();
                setTimeout(function(){
                    getAcceptedQuotes();
                    countQuotes();
                    nextQuote();
                }, 1000);
                setTimeout(function() {
                    // console.log($scope.quote);
                    fadeIn();
                }, frequency / 3);
        }, frequency);
    }

    $scope.$on('$viewContentLoaded', function() {
        if (once) {
            fadeLoop();
            once = false;
        }
    });
});