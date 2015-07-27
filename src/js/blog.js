var blog_m = (function($){
	
	//prettify date
	var publish_div = $('.js-create-date');
	publish_div.text(moment(publish_div.text()).calendar());

})(jQuery);