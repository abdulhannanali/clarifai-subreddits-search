const Tag = require("../models/clarifai-tag")
const Subreddit = require("../models/subreddit")

const async = require("async")

module.exports = function () {

	function checkCache (tags, callback) {
		return Tag.findSubreddits(tags, callback)
	}

	function checkSubredditsCache (subreddits, callback) {
		return Subreddit.findSubreddits(subreddits, callback)
	}

	function saveSubreddits (tag, subreddits, callback) {
		var subredditsFunctions = subreddits.map(function (subreddit) {
			return function (callback) {
				Subreddit.saveSubreddit(subreddit, callback)
			}
		})

		async.parallel(subredditsFunctions, function (error, results) {
			if (!error && results) {
				var clarifaiTag = new Tag({
					tag: tag,
					subreddits: results.map(() => results._id.toString())
				})

				clarifaiTag.save(function (error) {
					if (error) {
						callback(error)
					}
					else {
						callback(undefined, clarifaiTag)
					}
				})

				console.log(clarifaiTag)
			}
			else if (error) {
				callback(error)
			}
			else {
				callback()
			}
		})
	}

}