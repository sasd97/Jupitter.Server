'use strict';

const _ = require('underscore');
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const postSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		author: {
			type: String,
			required: true,
			ref: 'Companies'    //  TODO: решить проблему со сылками
		},
		title: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		isRemoved: {
			type: Boolean,
			default: false
		},
		comments: {
			type: [String], //  TODO: add reference to comment Model
			default: []
		},
		createdDate: {
			type: Date,
			default: Date.now
		},
		updatedDate: {
			type: Date
		},
		likes: {
			type: Number,
			default: 0
		},
		likeVoters: [{
			type: String,
			ref: 'Users'
		}],
		watches: {
			type: Number,
			default: 0
		},
		watchers: [{
			type: String,
			ref: 'Users'
		}],
		variants: [{
			value: {
				type: String
			},
			count: {
				type: Number,
				default: 0
			},
			voters: {
				type: [String],
				default: []
			}
		}],
		media: [{
			kind: String,
			url: String
		}],
		location: {
			type: [Number],
			required: true,
			index: '2dsphere'
		},
		votersForVariants: [{
			type: [String],
			default: []
		}]
	});

	postSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.posts.name, counterConfig.posts.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	postSchema.statics.getPosts = function (latitude, longitude, radius, limit, category) {
		const query = {
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [
							parseFloat(latitude),
							parseFloat(longitude)
						]
					},
					$maxDistance: radius
				}
			},
			isRemoved: false
		};

		if (category) query.category = category;

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.limit(limit)
			.exec();
	};

	postSchema.statics.getNew = function (postId, latitude, longitude, radius, category) {
		postId = parseInt(postId, 10);

		const query = {
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [
							parseFloat(latitude),
							parseFloat(longitude)
						]
					},
					$maxDistance: radius
				}
			},
			isRemoved: false,
			customId: {
				$gt: postId
			}
		};

		if (category) query.category = category;

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.exec();
	};

	postSchema.statics.getOld = function (postId, latitude, longitude, radius, category, limit) {
		const query = {
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [
							parseFloat(latitude),
							parseFloat(longitude)
						]
					},
					$maxDistance: radius
				}
			},
			isRemoved: false,
			customId: {
				$lt: postId
			}
		};

		if (category) query.category = category;

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.limit(limit)
			.exec();
	};

	return mongoose.model('Posts', postSchema);
};
