//js subinfos/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('subinfos/subinfos.html', {
		markdown : ['subinfos']
	});
});