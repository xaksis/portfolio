(function($){
	$(window).load(function(){

	var coord_m = (function(){
		var coordinates = [],
			cardsPerRow = 0,
			cardWidth = 350,
			cardHeight = 300,
			margin = 20,
			marginTop = 80,
			updateArea = $('.js-home-content'),
			win = $('.main-content');

		var adjustArea = function(noOfCards, cardsPerRow){
			var lastRowTop = coordinates[noOfCards-1].top + cardHeight + marginTop;
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
			cardsPerRow = Math.floor(win.width()/(cardWidth + margin))===0?1:Math.floor(win.width()/(cardWidth + margin));
			for(var i=0; i<noOfCards; i++){
				var coord = {top: 0, left: 0};
				coord.top = Math.floor(i/cardsPerRow) * (cardHeight + marginTop);
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
		var savedState = null;
		
		var initialize = function(data){
			allData = data;
			addHandlers();
			if (savedState) {
				filter(savedState);
			}
		};

		function highlight(dom){
			$('.main-menu__link').each(function(){
				$(this).removeClass('active');
			});
			dom.addClass('active');
		}

		var addHandlers = function(){
			$('.js-blog-link').on('click', function(){
				router_m.handleRouteChange('blog');
				return false;
			});
			$('.js-project-link').on('click', function(){
				router_m.handleRouteChange('project');
				return false;
			});
			$('.js-design-link').on('click', function(){
				router_m.handleRouteChange('design');
				return false;
			});
			$('.js-all-link').on('click', function(){
				router_m.handleRouteChange('all');
				return false;
			});
		};

		var showAll = function(){
			$('.update-card').each(function(){
				$(this).addClass('shown');
			});
			content_m.adjust();
		};

		var handleHistory = function (type) {
			history.pushState({type: type}, '', '#/'+type);
		};

		var filter = function(type){
			if (!allData.length) {
				savedState = type;
				return;
			}
			savedState = null;

			filtered = _.filter(allData, function(value){
				return value.type != type;
			});
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
			}, 500);
		};

		return{
			init: initialize,
			filter: filter,
			highlight: highlight,
			showAll: showAll,
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
			router_m.init();
		};

		return {
			init: initialize,
			adjust: adjustCoords
		};
	})();

	var router_m = (function () {
		var handleState = function(state) {
			switch(state) {
				case 'blog':
					filter_m.highlight($('.js-blog-link'));
					filter_m.filter('blog');
					break;
				case 'project':
					filter_m.highlight($('.js-project-link'));
					filter_m.filter('project');
					break;
				case 'design':
					filter_m.highlight($('.js-design-link'));
					filter_m.filter('design');
					break;
				default: 
					filter_m.highlight($('.js-all-link'));
					filter_m.showAll();
					break;
			}
		};

		var handleRoute = function (state) {
			switch(state) {
				case 'blog':
				case 'project':
				case 'design':
					history.pushState({type: state}, '', '#/'+state);
					break;
				default:
					history.pushState({type: 'all'}, '', '#/');
					break;
			}
		};

		var handleRouteChange = function(stateName) {
			handleState(stateName);
			handleRoute(stateName);
		};

		var initialize = function() {
			$(window).on('popstate', function(e){
				if (e.originalEvent && e.originalEvent.state) {
					handleState(e.originalEvent.state.type);
				}
			});

			var p = window.location.href.split("/");
			var stateName = p[p.length-1];
			handleRouteChange(stateName);
		};

		return {
			handleRouteChange: handleRouteChange,
			init: initialize,
		};
	})();

	var p = window.location.pathname.split("/");
	var filename = p[p.length-1];
	if(!filename || filename === "index.html") {
		content_m.init();
	}

});

})(jQuery);