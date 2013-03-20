steal("funcunit/qunit", "subinfos/fixtures", "subinfos/models/commit.js", function(){
	module("Model: Subinfos.Models.Commit")
	
	test("findAll", function(){
		expect(4);
		stop();
		Subinfos.Models.Commit.findAll({}, function(commits){
			ok(commits)
	        ok(commits.length)
	        ok(commits[0].name)
	        ok(commits[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Subinfos.Models.Commit({name: "dry cleaning", description: "take to street corner"}).save(function(commit){
			ok(commit);
	        ok(commit.id);
	        equals(commit.name,"dry cleaning")
	        commit.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Subinfos.Models.Commit({name: "cook dinner", description: "chicken"}).
	            save(function(commit){
	            	equals(commit.description,"chicken");
	        		commit.update({description: "steak"},function(commit){
	        			equals(commit.description,"steak");
	        			commit.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Subinfos.Models.Commit({name: "mow grass", description: "use riding mower"}).
	            destroy(function(commit){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})