const mongoose = require("mongoose")

const subredditSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: String,
	public_description: String,
	title: String,
	over18: Boolean,
	subscribers: Number,
	subreddit_type: String,
	header_img: String,
	banner_img: String,
	subredditCreated: Number,
	subreddit_raw: String
})

subredditSchema.statics.findSubreddits = function (subreddits, callback) {
	return this.find({
		name: {
			$in: subreddits
		}
	}, callback)
}

subredditSchema.statics.findSubreddit = function (subreddit, callback) {
	return this.findOne({
		name: subreddit
	}, callback)
}

subredditSchema.statics.saveSubreddit = function (rawData, rawSave, callback) {
	let parsedRaw;
	let subredditData;

	rawSave = rawSave || false

	try {
		if (typeof rawData == "string") {
			parsedRaw = JSON.parse(rawData)
		}
		else if (typeof rawData != "object") {
			return callback(new Error("provided rawData is not of valid type"))
		}
		else {
			parsedRaw = rawData
		}
	}
	catch (error) {
		callback(error)
	}


	if (parsedRaw && parsedRaw.data) {
		subredditData = parsedRaw.data
	}
	else {
		subredditData = parsedRaw
	}

	var subreddit = new this ({
		name: subredditData.display_name,
		banner_img: subredditData.banner_img,
		header_img: subredditData.header_img,
		title: subredditData.title,
		description: subredditData.description,
		public_description: subredditData.public_description,
		subscribers: subredditData.subscribers,
		subreddit_type: subredditData.subreddit_type,
		subredditCreated: subredditData.created,
		over18: subredditData.over18
	})

	if (rawSave) {
		subreddit.subreddit_raw = JSON.stringify(subredditData)
	}

	subreddit.save(function (error) {
		if (error) {
			callback(error)
		}
		else {
			callback(undefined, subreddit)
		}
	})
}

module.exports = mongoose.model("Subreddit", subredditSchema)