(function($){
	$(window).load(function(){

	var coord_m = (function(){
		var coordinates = [],
			cardsPerRow = 0,
			cardWidth = 350,
			cardHeight = 300,
			margin = 20, 
			updateArea = $('.js-home-content'),
			win = $('.main-content');

		var adjustArea = function(noOfCards, cardsPerRow){
			var lastRowTop = coordinates[noOfCards-1].top + cardHeight + 20;
			updateArea.height(lastRowTop);
			var cardsWidth = cardsPerRow*(cardWidth+margin)===0?350:cardsPerRow*(cardWidth+margin);
			var extraSpace = win.width()-cardsWidth;
			if(extraSpace > 0){
				var areaMargin = (extraSpace)/2;
				updateArea.css('margin-left', areaMargin+'px');
			}
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

	var filter_m = (function(){
		var allData = [], filtered = [];
		
		var initialize = function(data){
			allData = data;
			addHandlers();
		};

		function highlight(dom){
			$('.main-menu__link').each(function(){
				$(this).removeClass('active');
			});
			dom.addClass('active');
		}

		var addHandlers = function(){
			$('.js-blog-link').on('click', function(){
				highlight($(this));
				filter('blog');
				return false;
			});
			$('.js-project-link').on('click', function(){
				highlight($(this));
				filter('project');
				return false;
			});
			$('.js-design-link').on('click', function(){
				highlight($(this));
				filter('design');
				return false;
			});
			$('.js-all-link').on('click', function(){
				highlight($(this));
				showAll();
				return false;
			});
		};

		var showAll = function(){
			$('.update-card').each(function(){
				$(this).addClass('shown');
			});
			content_m.adjust();
		};

		var filter = function(type){
			console.log('filtering...');
			filtered = _.filter(allData, function(value){
				return value.type != type;
			});
			console.log(filtered.length);
			//show everything first
			$('.update-card').each(function(){
				$(this).addClass('shown');
			});
			content_m.adjust();
			for(var i=filtered.length-1; i>=0; i--){
				$('.update-card.shown')
					.eq(_.findIndex(allData, filtered[i]))
						.removeClass('shown');
			}
			setTimeout(function(){
				content_m.adjust();
			}, 200);
		};

		return{
			init: initialize
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
				data = _.sortBy(data, function(n){
					var cdate = moment(n.createDate);
					n.prettyDate = cdate.calendar();
					return -cdate.valueOf();
				});
				renderAllCards();
				filter_m.init(data);				
			});
		};

		var adjustCoords = function(){
			coordinates = coord_m.get(data.length);
			$('.update-card.shown').each(function(i){
				$(this).css('top', coordinates[i].top+'px');
				$(this).css('left', coordinates[i].left+'px');
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
			init: initialize,
			adjust: adjustCoords
		};
	})();

	content_m.init();

});

})(jQuery);