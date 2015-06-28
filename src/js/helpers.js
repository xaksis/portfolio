Handlebars.registerHelper("typeIcon", function(type) {
	var imgSrc = '';
	switch(type){
		case 'blog':
			imgSrc = 'images/blog-menu-icon-sm.png';
			break; 
		case 'project':
			imgSrc = 'images/project-menu-icon-sm.png';
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