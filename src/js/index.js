(function($){
	var coord_m = (function(){
		var coordinates = [],
			cardsPerRow = 0,
			cardWidth = 350,
			cardHeight = 300,
			margin = 20, 
			updateArea = $('.js-home-content'),
			win = $(window);

		var adjustArea = function(noOfCards, cardsPerRow){
			var lastRowTop = coordinates[noOfCards-1].top + cardHeight + 20;
			updateArea.height(lastRowTop);
			var cardsWidth = cardsPerRow*(cardWidth+margin);
			var areaMargin = (win.width()-cardsWidth)/2;
			updateArea.css('margin-left', areaMargin+'px');
		};

		var initialize = function(noOfCards){
			coordinates = [];
			cardsPerRow = Math.floor(win.width()/(cardWidth + margin));
			for(var i=0; i<noOfCards; i++){
				var coord = {top: 0, left: 0};
				coord.top = Math.floor(i/cardsPerRow) * (cardHeight + margin);
				coord.left = (i%cardsPerRow) * (cardWidth + margin);
				coordinates.push(coord);
			}
			adjustArea(noOfCards, cardsPerRow);
			return coordinates;
		};

		return {
			get: initialize
		};
	})();

	var content_m = (function(){
		var data = [], //data for each card
			coordinates = [],
			contentArea = $('.js-home-content');

		var addHandlers = function(){
			$(window).resize(function(){
				adjustCoords();
			});
		};

		var read = function(){
			$.getJSON('content/allMd.json', function( fetched_data ){
				data = fetched_data;
				renderAllCards();
			});
		};

		var adjustCoords = function(){
			coordinates = coord_m.get(data.length);
			$('.update-card.shown').each(function(i){
				$(this).css('top', coordinates[i].top+'px');
				$(this).css('left', coordinates[i].left+'px');
			});
			$('.update-card.shown').each(function(){
				var self = $(this);
				self.on('click', function(){
					self.toggleClass('shown');
				});
			});
		};

		var renderCard = function(cData){
			contentArea.append(pApp.templates.card(cData));
		};

		var renderAllCards = function(){
			console.log('rendering...');
			_.forEach(data, function(value, key){
				renderCard(value);
			});
			adjustCoords();
		};

		var initialize = function(){
			//get all content. They will be in memory
			//from here on.
			read();
			addHandlers();
		};

		return {
			init: initialize	
		};
	})();

	content_m.init();

})(jQuery);