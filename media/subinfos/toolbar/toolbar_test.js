steal('funcunit').then(function(){

module("Subinfos.Toolbar", { 
	setup: function(){
		S.open("//subinfos/toolbar/toolbar.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Subinfos.Toolbar Demo","demo text");
});


});