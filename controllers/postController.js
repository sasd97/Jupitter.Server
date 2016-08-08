'use strict';
const _ = require('underscore');

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const PostResponse = require('../models/response/postResponseModel');
const fileServerUtils = require('../utils/fileServerUtils');
const CompanyResponse = require('../models/response/companyResponseModel');

class PostsController extends BaseController {
	constructor(postsManager, usersManager) {
		super({ postsManager, usersManager });
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this._savePost = this._savePost.bind(this);
		this.edit = this.edit.bind(this);
		this.favorite = this.favorite.bind(this);
		this.remove = this.remove.bind(this);
		this.findById = this.findById.bind(this);
		this.obtain = this.obtain.bind(this);
		this.obtainNew = this.obtainNew.bind(this);
		this.obtainOld = this.obtainOld.bind(this);
		this.like = this.like.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
		this.watch = this.watch.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	_savePost(companyId, title, text, category, latitude, longitude, variants, images, userId, ln, res, next) {
		return this
			.postsManager
			.create(companyId, title, text, category, latitude, longitude, variants, images)
			.then(post => PostResponse(userId, post, ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	create(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('title').should.exist().and.have.type('String').and.be.in.rangeOf(3, 63)
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 500)
			.add('category').should.exist().and.have.type('String')
			.add('latitude').should.exist().and.have.type('Number')
			.add('longitude').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		const companyId = req.userId;
		const { variants } = req.body;

		if (variants &&
			variants.length < 0 &&
			!this.validationUtils.checkArray(variants, 1, 12)) return next('PROPERTY_NOT_SUPPLIED');

		const { title, text, category, latitude, longitude, images } = req.body;

		if (images && images.length) {
			return fileServerUtils.getInfoByFidsArray(companyId, images).then(images => {
				return this._savePost(companyId, title, text, category, latitude, longitude, variants, images, req.userId, req.ln, res, next);
			});
		} else {
			return this._savePost(companyId, title, text, category, latitude, longitude, variants, images, req.userId, req.ln, res, next);
		}
	}

	findById(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const postId = req.params.postId;

		this
			.postsManager
			.findById(postId)
			.then(({ post, author }) => PostResponse(req.userId, post, req.ln, CompanyResponse(author)))
			.then(response => this.success(res, response))
			.catch(next);
	}

	edit(req, res, next) {
		//  TODO: add coordinates
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			//.add('title').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('text').should.have.type('String').and.be.in.rangeOf(3, 500)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;
		const companyId = req.userId;

		this
			.postsManager
			.edit(companyId, body.postId, body)
			.then(post => PostResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	favorite(req, res, next) {
		const { postId } = req.params;
		const { ln, userId } = req;

		this
			.usersManager
			.favorite(userId, postId)
			.then(post => PostResponse(userId, post, ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	remove(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const postId = req.query.postId;
		const companyId = req.userId;

		this
			.postsManager
			.remove(companyId, postId)
			.then(removedId => this.success(res, removedId))
			.catch(next);
	}

	obtain(req, res, next) {
		const invalid = this.validate(req)
			.add('latitude').should.exist().and.have.type('String')
			.add('longitude').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		if (req.query.limit) {
			try {
				req.query.limit = parseInt(req.query.limit, 10);
			} catch (e) {
				req.query.limit = 20;
			}
		}

		const { latitude, longitude, radius = 0, limit = 20, category, activity } = req.query;

		this
			.postsManager
			.obtain(latitude, longitude, radius, limit, category, activity)
			.then(posts => _.map(posts, post => PostResponse(req.userId, post, req.ln)))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	obtainNew(req, res, next) {
		const invalid = this.validate(req)
			.add('latitude').should.exist().and.have.type('String')
			.add('longitude').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		const { postId, latitude, longitude, radius = 0, category, activity } = req.query;

		this
			.postsManager
			.obtainNew(postId, latitude, longitude, radius, category, activity)
			.then(posts => _.map(posts, post => PostResponse(req.userId, post, req.ln)))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	obtainOld(req, res, next) {
		const invalid = this.validate(req)
			.add('latitude').should.exist().and.have.type('String')
			.add('longitude').should.exist().and.have.type('String')
			.add('category').should.have.type('String')
			.add('limit').should.have.type('String')
			.add('postId').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		const { postId, latitude, longitude, radius = 0, category, limit = 20, activity } = req.query;

		this
			.postsManager
			.obtainOld(postId, latitude, longitude, radius, category, limit, activity)
			.then(posts => _.map(posts, post => PostResponse(req.userId, post, req.ln)))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	like(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId } = req.params;

		this
			.postsManager
			.like(userId, postId)
			.then(post => PostResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	watch(req, res, next) {
		console.log('PRIVET ANDREW');
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId } = req.params;

		this.postsManager
			.watch(userId, postId)
			.then(post => PostResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	voteForVariant(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.add('variantIndex').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId } = req.params;
		const variantIndex = req.params.variantIndex;

		this
			.postsManager
			.voteForVariant(userId, postId, variantIndex)
			.then(post => PostResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = PostsController;
