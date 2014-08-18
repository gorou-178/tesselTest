var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['B']);

var https = require('https');
var crypto = require('crypto');



// Copy your own keys here if you want
var oauth_consumer_key = "SNRLcK8gZ8GgmHdnqkbMcgAgH";
var oauth_consumer_secret = "5ku7TiBju31iauLL54stXI972Y8KyCbCR6BBnU10TjDyZwQKIj";
var oauth_access_token = "128296761-iJ864GLh0LMifVjjgpAhgLpO5bcETViZnibHA5qq";
var oauth_access_secret = "upQSWkS0oKKze80fuztInipfPeyo2DBdNJtQOwoiVqFP2";



ambient.on('ready', function () {
    // Get points of light and sound data.
    setInterval( function () {
        ambient.getSoundLevel( function(err, sdata) {
            if (err) throw err;
            console.log("Sound Level:", sdata.toFixed(8));
        });
    }, 500);

    // Set a sound level trigger
    // The trigger is a float between 0 and 1
    ambient.setSoundTrigger(0.1);

    ambient.on('sound-trigger', function(data) {
        console.log("Something happened with sound: ", data);

        // The status to tweet
        var status = 'わんわん SoundLevel('+data.toFixed(4)+') #tessel #ambient';
        // Timestamp
        var curtime = parseInt(process.env.DEPLOY_TIMESTAMP || Date.now());

        // Set up OAuth
        var oauth_data = {
            oauth_consumer_key: oauth_consumer_key,
            oauth_nonce: crypto.pseudoRandomBytes(32).toString('hex'),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(curtime / 1000),
            oauth_token: oauth_access_token,
            oauth_version: '1.0'
        };
        oauth_data.status = status;
        var out = [].concat(
            ['POST', 'https://api.twitter.com/1.1/statuses/update.json'],
            (Object.keys(oauth_data).sort().map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(oauth_data[k]);
            }).join('&'))
        ).map(encodeURIComponent).join('&');
        delete oauth_data.status;
        oauth_data.oauth_signature = crypto
            .createHmac('sha1', [oauth_consumer_secret, oauth_access_secret].join('&'))
            .update(out)
            .digest('base64');
        var auth_header = 'OAuth ' + Object.keys(oauth_data).sort().map(function (key) {
            return key + '="' + encodeURIComponent(oauth_data[key]) + '"';
        }).join(', ');

        // Set up a request
        var req = https.request({
            port: 443,
            method: 'POST',
            hostname: 'api.twitter.com',
            path: '/1.1/statuses/update.json',
            headers: {
                Host: 'api.twitter.com',
                'Accept': '*/*',
                "User-Agent": "tessel",
                'Authorization': auth_header,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'keep-alive'
            }
        }, function (res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);
            res.on('data', function(d) {
                console.log(' ');
                console.log(' ');
                console.log(String(d));
            });
        });

        // POST to Twitter
        req.write('status=' + encodeURIComponent(status));
        req.end();

        // Log any errors
        req.on('error', function(e) {
            console.error(e);
        });

        // Clear it
        ambient.clearSoundTrigger();

        //After 1.5 seconds reset sound trigger
        setTimeout(function () {

            ambient.setSoundTrigger(0.1);

        },1500);

    });
});

ambient.on('error', function (err) {
    console.log(err)
});
