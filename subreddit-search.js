/*
 * subreddit-search.js
 * 
 * search subreddits for the given, individually or in a batch
 */
const request = require("request")
const async = require("async")

const SEARCH_ENDPOINT = "https://www.reddit.com/subreddits/search.json"

function searchSubreddits (query, options, callback) {
	var options = options || {}

	if (!query) {
		callback(new Error("query not provided"))
		return
	}
	else {
		var limit = options.limit || 3
		var count = options.count || 0
		var sort = options.sort || "relevance"
		var nsfw = options.nsfw || false

		var queryObject = {
			limit: limit,
			q: query,
			count: count,
			sort: sort
		}


		request({
			url: SEARCH_ENDPOINT,
			qs: queryObject,
			headers: {
				"User-Agent": "request:nodejs:redditsuggest"
			}
		}, function (error, response, body) {
			if (error) {
				callback(error)
			}
			else if (body) {
				var parsedBody = JSON.parse(body)

				if (parsedBody && parsedBody.data && parsedBody.data.children) {
					var subreddits = parsedBody.data.children.map(function (subreddit) {
						console.log(subredditTruncate(subreddit.data))
						return subredditTruncate(subreddit.data)
					})


					callback(undefined, subreddits)
				}
			}
			else {
				callback(undefined, [])
			}
		})
	}
}

function searchAllTerms (terms, options, callback) {
	var options = options || {}

	var parallelLimit = options.parallelLimit || 5

	var termsFunctions = terms.map(function (term, index, array) {
		return function (callback) {
			searchSubreddits(term, {}, callback)
		}
	})

	async.parallelLimit(termsFunctions, parallelLimit, callback)
}


/*
 * truncate subreddit to leave only the important parts mostly
 */
function subredditTruncate (subreddit) {
	var fields = [
		"banner_img",
		"display_name",
		"title",
		"over18",
		"subscribers",
		"public_description",
		"created"
	]

	var object = {}

	fields.forEach(function (field, index, array) {
		object[field] = subreddit[field] || undefined
	})

	return object;
}


module.exports = {
	searchSubreddits: searchSubreddits,
	searchAllTerms: searchAllTerms
}