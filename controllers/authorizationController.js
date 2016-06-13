'use strict';

const ValidationGenerator = require('validatron');

const BaseController = require('./baseController');
const RequestService = require('../services/requestService');
const RedisService = require('../services/redisService');

const secretUtils = require('../utils/secretUtils');
const socialRequestUtils = require('../utils/socialRequestUtils');
const TokenInfo = require('../config/methods');


class AuthorizationController extends BaseController {
	constructor(authorizationManager, userManager) {
		super();
		socialRequestUtils.init();
		this.authorizationClient = RedisService.getClientByName('authorizations');
		this.validationService = ValidationGenerator.createValidator({});

		this.userManager = userManager;

		this.verify = this.verify.bind(this);
		this.googleVerify = this.googleVerify.bind(this);
		this.facebookVerify = this.facebookVerify.bind(this);
		this.twitterVerify = this.twitterVerify.bind(this);
	}

	googleVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'tokenId')) this.error(res, 'Malformed');

		let user;

		RequestService
			.get(TokenInfo.google, { id_token: data.tokenId })
			.then(this.userManager.googleCheckExistence)
			.then(userModel => {
				user = userModel;
				return user;
			})
			.then(user => secretUtils.getUniqueHash(user.customId))
			.then(token => {
				user.token = token;
				console.log(token);
				return this.authorizationClient.set(token, user.customId);
			})
			.then(token => {
				console.log(token);
				this.success(res, user);
			})
			.catch(error => this.error(res, error));
	}

	facebookVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'accessToken')) this.error(res, 'Malformed');

		RequestService
			.get(TokenInfo.facebook, { access_token: data.accessToken })
			.then(this.userManager.facebookCheckExistence)
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	twitterVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'secret')) this.error(res, 'Malformed');

		socialRequestUtils
			.getTwitter(req.body.token, data.secret)
			.then(this.userManager.twitterCheckExistence)
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	verify(data, field) {
		return this.validationService.init(data).add(field).should.exist().and.have.type('String').validate();
	}
}

module.exports = AuthorizationController;
