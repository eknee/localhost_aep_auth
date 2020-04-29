// auth.js
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('@adobe/jwt-auth');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


//Handle Request
app.post('/', async (req, res) => {

	try {

		//set config
		const config = {
		  clientId: req.body.client_id,
		  clientSecret: req.body.client_secret,
		  technicalAccountId: req.body.technical_account_id,
		  orgId: req.body.org_id,
		  privateKey: req.body.private_key,
		  metaScopes: ['ent_dataservices_sdk']
		};

		let tokenResponse = await auth(config);	//jwt-auth response
		console.log(tokenResponse);

		if(req.body.host_name && req.body.sandbox_name) {
			var psql = "psql 'sslmode=require host=" + req.body.host_name + ".platform-query.adobe.io port=80 dbname=" + req.body.sandbox_name + ":all user=" + req.body.org_id + " password=" + tokenResponse.access_token + "'"
			tokenResponse['psql'] = psql;
			console.log(tokenResponse)
		}

		res.status(200).send(tokenResponse);  //return response to client
	}
	catch (error) {
		res.status(404).send(error)
		console.log(error)
	}
});

var port = 3000;
app.listen(port, () => console.log('Started server at http://localhost:'+port));