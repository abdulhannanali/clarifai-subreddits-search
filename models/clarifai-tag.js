const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({
	tag: {
		unique: true,
		type: String,
		required: true
	},
	subreddits: [
		{
			type: String, 
			ref: "Subreddit"
		}
	]
})

tagSchema.statics.findSubreddits = function (tags, callback) {
	this.find({
		'tag': {
			$in: tags
		}
	})
	.populate('subreddits')
	.exec(function (error, results) {
		if (error) {
			callback(error)
		}
		else if (results) {
			var remainingTags = tags.filter(function (tag) {
				var contained = false;

				results.map(function (result) {
					if (result.tag == tag) {
						contained = true
					}
				})

				return contained
			})

			var tagsObject = {
				found: results
				notFound: remainingTags
			}

			callback(undefined, tagsObject)

		}
		else {
			callback(error, results)
		}
	})
}


module.exports = mongoose.model("Tag", tagSchema)