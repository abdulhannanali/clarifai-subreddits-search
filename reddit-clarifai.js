const subreddits = require("./subreddit-search")

const async = require("async")
	
module.exports = function (Clarifai) {

	function getSubreddits (urls, callback) {
		Clarifai.getTagsByUrl(urls, function (error, response) {
			if (error) {
				callback(error)
			}
			else if (response && response.status_code == "OK") {

				async.map(response.results, fetchSubreddits, function (error, results) {
					callback(error, results)
				})
			}
		})
	}


	function fetchSubreddits (data, callback) {

		var tag = data.result.tag 
		var classes = tag.classes



		subreddits.searchAllTerms(classes, {}, function (error, results) {
			if (!error && results) {

				var taggedResults = tag_results(tag, results)

				var fullTaggedResults = {
					url: data.url,
					docid: data.docid,
					results: taggedResults
				}

				callback(undefined, fullTaggedResults)
			}
		})

	}

	function tag_results (tag, results) {
		return results.map(function (subreddits, index, array) {
			return {
				className: tag.classes[index],
				probability: tag.probs[index],
				subreddits: subreddits
			}	
		})
	}

	return {
		getSubreddits: getSubreddits
	}
}
