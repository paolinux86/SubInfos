steal('funcunit').then(function(){

module("Gcm.Dispatcher", { 
	setup: function(){
		S.open("//gcm/dispatcher/dispatcher.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Gcm.Dispatcher Demo","demo text");
});


});