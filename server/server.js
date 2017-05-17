const express = require('express');

// middleware
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

const limiter = new RateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	delayMs: 0
});

const app = express();
// the rate limiter needs this if it's behind a reverse proxy
app.enable('trust proxy');

// use the middleware
app.use(helmet());
app.use(limiter);

const exec = require('child_process').exec;

app.get('/getId', (req, res) => {
	exec('node getSessionId.js', (error, stdout, stderr) => {
		if (error) {
			console.log(stderr);
			res.status(500).send({
				ok: false,
				error: stderr
			});
		} else {
			res.status(200).send({
				ok: true,
				sessionId: stdout
			});
		}
	});
});

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3001; // eslint-disable-line
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
