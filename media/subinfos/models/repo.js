steal('jquery/model', function(){
	/**
	* @class Subinfos.Models.Repo
	* @parent index
	* @inherits jQuery.Model
	* Wraps backend repo services.  
	*/
	$.Model('Subinfos.Models.Repo',
	/* @Static */
	{
		findAll: "/repo/list",
		findOne : "/repo/{id}", 
	},
	/* @Prototype */
	{
	});
});
