'use strict';

const express = require('express');

const AppRoutes = require('./routes');
const AppDatabase = require('./database');

const RedisService = require('../services/redisService');
const { mixedLogger } = require('../utils/loggerUtils');
const redisConfig = require('../config/redis');
const httpConfig = require('../config/http');

class AppServer {
	constructor() {
		const app = express();
		app.listen(httpConfig.PORT, () => mixedLogger.info(`App is started on ${httpConfig.PORT} port`));

		RedisService.init(redisConfig);
		const managers = new AppDatabase().managers();
		this.routes = new AppRoutes(app, managers);

		this.start = this.start.bind(this);
	}

	start() {
		this.routes.register();
	}
}

module.exports = AppServer;
