steal("funcunit", function(){
	module("subinfos test", { 
		setup: function(){
			S.open("//subinfos/subinfos.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})