'use strict';

var http = require('http'),
    request = require('request'),
    express = require('express'),
    q = require('q'),
    app = express(),
    router = express.Router(),
    cors = require('cors'),
    user = require('./.auth'),
    config = require('./config.js');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var corsOptions = {
    allowedHeaders: ['Content-Type', 'Accept'],
    origin: '*'
};

router.get('/', cors(corsOptions), function(req, res) {
    var encodedUri = req.query.uri || 'no uri';
    try {
	    var uri = decodeURIComponent(encodedUri);

	    requestResults(uri, req).then(function(data) {
	        if (data.error) {
	            res.status(500).send({
	                error: error
	            });
	        } else {
	            var headers = data.response.headers;
	            headers['access-control-allow-origin'] = '*';
	            res.set(headers);
	            res.send(data.response.body);
	        }
	        res.end();
	    });
	} catch(e) {
		res.status(500).send({
            error: error
        });
	}
});

var requestResults = function(uri, req) {

    var deferred = q.defer();
    var options = {
        auth: {
            'user': user.basicAuth.username,
            'pass': user.basicAuth.password,
            'sendImmediately': false
        },
        url: uri,
        headers: {
            'Accept': req.headers.accept,
        }
    };

    request.get(options, function(error, response, body) {
        deferred.resolve({
            error: error,
            response: response,
            body: body
        });
    });

    return deferred.promise;
};

app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(config.port);

console.log("listening on port " + config.port);