// load('subinfos/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("subinfos/subinfos.html","subinfos/out")
});
