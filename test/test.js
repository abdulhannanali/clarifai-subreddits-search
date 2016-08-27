const Clarifai = require("clarifai")
const fs = require("fs")

Clarifai.initialize({
	clientId: '0Zo_NrQg97eswVShafk2dnFXdydsU6edLAYmKQlQ',
	clientSecret : 'WxfQc6BFC_dDXVbAirqnQFGCbCeWAoAKIWx0rF6v'
})

const redditClarifai = require("../reddit-clarifai")(Clarifai)


redditClarifai.getSubreddits([
	"http://cdn.static-economist.com/sites/default/files/imagecache/full-width/images/print-edition/20160416_WBP001_1.jpg",
	"https://cdn.static-economist.com/sites/default/files/imagecache/full-width/images/2016/08/blogs/economist-explains/20160827_blp537.jpg"
	], function (error, results) {
	if (error) {
		console.log(error)
	}
	else if (results) {
		fs.writeFileSync("./resultData1.json", JSON.stringify(results, null, 4))
	}
})
