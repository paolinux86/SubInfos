steal('jquery/model', function(){

/**
 * @class Subinfos.Models.Commit
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend commit services.  
 */
$.Model('Subinfos.Models.Commit',
/* @Static */
{
	findAll: "/commits.json",
  	findOne : "/commit/{id}"
},
/* @Prototype */
{});

})
