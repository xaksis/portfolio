var blog_m = (function($){
	
	//prettify date
	var publish_div = $('.js-create-date');
  var dateString = publish_div.text().substring(0, publish_div.text().length-5);
	publish_div.text(moment(dateString).calendar());

})(jQuery);