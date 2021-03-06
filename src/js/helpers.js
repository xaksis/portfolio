Handlebars.registerHelper("typeIcon", function(type) {
	var imgSrc = '';
	switch(type){
		case 'blog':
			imgSrc = 'images/blog-menu-icon-sm.png';
			break; 
		case 'project':
			imgSrc = 'images/experiment-menu-icon-sm.png';
			break;
		case 'design':
			imgSrc = 'images/design-menu-icon-sm.png';
			break;
		case 'experiment':
			imgSrc = 'images/experiment-menu-icon-sm.png';
			break;
	} 
	return '<img src="'+imgSrc+'" />';
});

Handlebars.registerHelper("getHtmlPath", function(rawPath) {
	return rawPath.substr(0, rawPath.lastIndexOf('.'))+'.html';
});

Handlebars.registerHelper("getImageUrl", function(rawPath) {
	for(var i=0; i<rawPath.length; i++){
		if(rawPath[i] !== '.' && rawPath[i] !== '/'){
			return 'http://crayonbytes.us/'+
				rawPath.substr(i,rawPath.length);
		}
	}
	return '';
});

Handlebars.registerHelper("getPrettyDate", function(rawDate) {
	var mDate = moment(rawDate);
	return mDate.calendar();
});

Handlebars.registerHelper("getMomentDate", function(rawDate) {
	var dateStr = rawDate.substr(0,rawDate.length-5);
	var mDate = moment(dateStr);
	return mDate.calendar();
});