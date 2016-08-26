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
	.exec(callback)
}


module.exports = mongoose.model("Tag", tagSchema)