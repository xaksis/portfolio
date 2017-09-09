var blog_m = (function($){
	
	//prettify date
	var publish_div = $('.js-create-date');
  var dateString = publish_div.text().substring(0, publish_div.text().length-15);
  //Tue Mar 11 2014 20:00:00 GMT-0400 (EDT)
	publish_div.text(moment(dateString, 'ddd MMM DD YYYY HH:mm:ss').calendar());

})(jQuery);