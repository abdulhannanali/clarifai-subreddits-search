const Clarifai = require("clarifai")
const redditClarifai = require("./reddit-clarifai")

module.exports = function (clientId, clientSecret) {
	if (!clientId || !clientSecret) {
		throw new Error("Clarifai credentials not provided")
	}

	Clarifai.initialize({
		clientId: clientId,
		clientSecret: clientSecret
	})

	var redditSearch = redditClarifai(Clarifai)


	return {
		Clarifai: Clarifai,
		getSubreddits: redditSearch.getSubreddits
	}
}