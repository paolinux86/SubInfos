steal('funcunit').then(function(){

module("Subinfos.Menu", { 
	setup: function(){
		S.open("//subinfos/menu/menu.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Subinfos.Menu Demo","demo text");
});


});