//    0 -      UNKNOWN ERROR
//    1 - 1000 INTERNAL SERVER ERRORS
// 1001 - 2000 CLIENT ERRORS
// 2001 - 3000 ACCESS ERRORS
// 3001 - 4000 EXTERNAL SERVICES ERRORS

module.exports = {

	//UNKNOWN ERROR
	UNKNOWN_ERROR: {
		INNER_CODE: 0,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	// INTERNAL SERVER ERRORS
	INTERNAL_SERVER_ERROR: {
		INNER_CODE: 1,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	INTERNAL_REDIS_ERROR: {
		INNER_CODE: 2,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	// CLIENT ERRORS

	PROPERTY_HAS_INCORRECT_TYPE: {
		INNER_CODE: 1001,
		EXTERNAL_CODE: 422,
		TO_LOG: false
	},

	PROPERTY_NOT_SUPPLIED: {
		INNER_CODE: 1002,
		EXTERNAL_CODE: 403,
		TO_LOG: false
	},

	PROPERTY_OUT_OF_RANGE: {
		INNER_CODE: 1003,
		EXTERNAL_CODE: 403,
		TO_LOG: false
	},

	IS_NOT_EQUAL: {
		INNER_CODE: 1004,
		EXTERNAL_CODE: 403,
		TO_LOG: false
	},

	PHONE_NOT_FOUND: {
		INNER_CODE: 1005,
		EXTERNAL_CODE: 403,
		TO_LOG: false
	},

	NUMBER_OF_ATTEMPTS_EXCEEDED: {
		INNER_CODE: 1006,
		EXTERNAL_CODE: 403,
		TO_LOG: false
	},

	USER_ALREADY_EXISTS: {
		INNER_CODE: 1007,
		EXTERNAL_CODE: 403,
		TO_LOG: true
	},

	USER_ALREADY_VOTED: {
		INNER_CODE: 1008,
		EXTERNAL_CODE: 403,
		TO_LOG: false
	},

	// ACCESS ERRORS
	INCORRECT_CREDENTIALS: {
		INNER_CODE: 2001,
		EXTERNAL_CODE: 401,
		TO_LOG: true
	},

	INCORRECT_SMS_CODE: {
		INNER_CODE: 2002,
		EXTERNAL_CODE: 401,
		TO_LOG: false
	},

	UNAUTHORIZED: {
		INNER_CODE: 2003,
		EXTERNAL_CODE: 401,
		TO_LOG: true
	},

	NO_TEMPORARY_TOKEN_IN_DB: {
		INNER_CODE: 2004,
		EXTERNAL_CODE: 401,
		TO_LOG: true
	},

	INVALID_TEMPORARY_TOKEN: {
		INNER_CODE: 2005,
		EXTERNAL_CODE: 401,
		TO_LOG: true
	},

	ACCESS_DENIED: {
		INNER_CODE: 2006,
		EXTERNAL_CODE: 401,
		TO_LOG: true
	},

	INCORRECT_REPORT_TYPE: {
		INNER_CODE: 2007,
		EXTERNAL_CODE: 401,
		TO_LOG: false
	},

	// EXTERNAL SERVICES ERROR
	INVALID_TOKEN_FOR_TIMELINER: {
		INNER_CODE: 3001,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	BAD_REQUEST_FOR_TIMELINER: {
		INNER_CODE: 3002,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	TIMELINER_INNER_ERROR: {
		INNER_CODE: 3003,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	INVALID_TIMELINER_SECRET: {
		INNER_CODE: 3004,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	REQUEST_SERVICE_ERROR: {
		INNER_CODE: 3005,
		EXTERNAL_CODE: 500,
		TO_LOG: true
	},

	SMS_SERVICE_ERROR: {
		INNER_CODE: 3006,
		EXTERNAL_CODE: 500,
		TO_LOG: false
	},

	SUBSCRIBE_ERROR_1: {
		INNER_CODE: 3007,
		EXTERNAL_CODE: 500,
		TO_LOG: false
	},

	SUBSCRIBE_ERROR_2: {
		INNER_CODE: 3008,
		EXTERNAL_CODE: 500,
		TO_LOG: false
	}
};
