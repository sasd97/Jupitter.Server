'use strict';

class FeedbackManager {
	constructor(feedbackModel) {
		this.feedbacksModel = feedbackModel;
		this.trySave = this.trySave.bind(this);
		this.getFeedback = this.getFeedback.bind(this);
	}

	trySave(userId, message) {
		const data = { userId, message, createdDate: Date.now() };
		const feedback = new this.feedbacksModel(data);
		return feedback.save();
	}

	getFeedback(limit = 20, offset) {
		return this
			.feedbacksModel
			.getFeedback(parseInt(limit, 10), parseInt(offset, 10))
			.then(feedback => {
				if (!feedback) throw new Error(500);
				return this
					.feedbacksModel
					.count()
					.then(count => {
						const oSet = count - offset - feedback.length;
						return { offset: oSet, items: feedback };
					});
			});
	}
}

module.exports = FeedbackManager;
