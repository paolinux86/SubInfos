steal('funcunit').then(function(){

module("Subinfos.Commit.Detail", { 
	setup: function(){
		S.open("//subinfos/commit/detail/detail.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Subinfos.Commit.Detail Demo","demo text");
});


});