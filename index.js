const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;


const app = express()

app.use(bodyParser.json());

// var mongoURL = 'mongodb://172.17.0.2:27017/test';


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/api/:object', function (req, res) {
    MongoClient.connect(mongoURL, function(err, db) {
        db.collection(req.params.object).find().toArray( function(err,arr) {
            res.status(200).json(arr);
        });
        db.close();
    });
})

app.get('/api/:object/:key/:val', function (req, res) {
  res.send("not impl");
})

app.put('/api/:object/:key/:val', function (req, res) {
    // MongoClient.connect(mongoURL, function(err, db) {
    //     db.collection(req.params.object).insertOne(req.body);
    //     res.status(201);
    //     db.close();
    // });
    res.send("not impl");
})

app.post('/api/:object', function (req, res) {
    // res.send(req.body);
    MongoClient.connect(mongoURL, function(err, db) {
        db.collection(req.params.object).insertOne(req.body, function(err, result) {
            if (err !== null) {
                res.status(400);
            }
            res.status(201);
            res.send();
        });
        db.close()
    });
})

app.delete('/api/:object/:key/:val', function (req, res) {
  res.send(req.params)
    MongoClient.connect(mongoURL, function(err, db) {
        var data = {};
        data[req.params.key] = req.params.val;

        db.collection(req.params.object).deleteOne(data, function(err, results) {
                res.status(200);
                res.send();
            });
    });
})

app.listen(port, function () {
    console.log('App listening on port ' + port + '!');

    console.log('Connecting to mongo on ' + mongoURL + '!');
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to mongo.");
        db.close();
    });

})

