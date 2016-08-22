'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const companyResponseModel = require('../models/response/companyResponseModel');
const subscribersResponseModel = require('../models/response/subscribersResponseModel');

const _ = require('underscore');

class CompanyController extends BaseController {
	constructor(companiesManager) {
		super({ companiesManager });
	}

	_onBind() {
		super._onBind();

		this.edit = this.edit.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
		this.findByAlias = this.findByAlias.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		//TODO: Проверка на наличие хотя бы одного строкового символа
		const invalid = this.validate(req)
			//.add('name').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('description').should.have.type('String').and.be.in.rangeOf(3, 400)
			//.add('site').should.have.type('String').and.be.in.rangeOf(3, 63)
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { alias, description, logoUrl, site, contactPhones, activity, coordinates, socialLinks, name } = req.body;

		this
			.companiesManager
			.edit(userId, { alias, description, logoUrl, site, contactPhones, activity, coordinates, socialLinks, name })
			.then(businessUser => this.success(res, companyResponseModel(businessUser)))
			.catch(next);
	}

	findByAlias(req, res, next) {
		const invalid = this.validate(req)
			.add('alias').should.have.type('String').and.be.in.rangeOf(3, 63)
			.validate();

		if (invalid) return next(invalid.name);

		const { alias } = req.params;

		this
			.companiesManager
			.findByAlias(alias)
			.then(company => companyResponseModel(company))
			.then(response => this.success(res, response))
			.catch(next);
	}

	getSubscribers(req, res, next) {
		this
			.companiesManager
			.getSubscribers(req.userId)
			.then(company => this.success(res, subscribersResponseModel(company)))
			.catch(next);
	}
}

module.exports = CompanyController;
