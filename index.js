const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

const app = express()

// auto parse json post
app.use(bodyParser.json());

var db = null;

// var mongoURL = 'mongodb://172.17.0.2:27017/test';
// var mongoURL = 'mongodb://mongouser:mongopassword@test-mongo:27017/test';


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/api/:object', function (req, res) {
    db.collection(req.params.object).find().toArray( function(err,arr) {
        res.status(200).json(arr);
    });
})

app.get('/api/:object/:key/:val', function (req, res) {
  res.send("not impl");
})

app.put('/api/:object/:key/:val', function (req, res) {
    res.send("not impl");
})

app.post('/api/:object', function (req, res) {
    db.collection(req.params.object).insertOne(req.body, function(err, result) {
        if (err !== null) {
            res.status(400);
        }
        res.status(201);
        res.send();
    });
})

app.delete('/api/:object/:key/:val', function (req, res) {
    var data = {};
    data[req.params.key] = req.params.val;

    db.collection(req.params.object).deleteOne(data, function(err, results) {
            res.status(200);
            res.send();
        });
})

app.listen(port, function () {
    console.log('App listening on port ' + port + '!');

    console.log('Connecting to mongo on ' + mongoURL + '!');
    MongoClient.connect(mongoURL, function(err, database) {
        assert.equal(null, err);
        console.log("Connected correctly to mongo.");
        db = database;
    });
})

