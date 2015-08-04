var express = require('express');
var router = express.Router();
var winston = require('winston');

var db = require('../bin/db');

/* GET home.js page. */
//router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Express' });
//});

// route middleware to validate :line
router.param('line', function(req, res, next, line) {
    winston.info('doing line validation on ' + line);

    var validator = /^(any|red|green|blue|T10|T11)$/;
    if ( validator.test(line) ) {
        req.line = line;
        next();
    } else {
        next("invalid line"); 
    }
});

// route middleware to validate :distance
router.param('distance', function(req, res, next, distance) {
    winston.info('doing distance validation on ' + distance);

    var validator = /^\d+(.\d+)?$/;
    if ( validator.test(distance) ) {
        req.distance = distance;
        next();
    } else {
        next("invalid distance"); 
    }
});

// route middleware to validate :price
router.param('price', function(req, res, next, price) {
    winston.info('doing price validation on ' + price);

    var validator = /^\d+$/;
    if ( validator.test(price) ) {
        req.price = price;
        next();
    } else {
        next("invalid price"); 
    }
});


router.get('/:line/:distance/:price', function(req, res, next) {
    res.render('index', { 
        title: 'Blocket Stockholm',
        lineOrColor: req.params.line,
        distance: req.params.distance,
        price: req.params.price
    });
});

router.get('/tunnelbana/', function(req, res, next) {
    db.allStations(function(err, results){
        res.json(results);
    });
});

router.get('/tunnelbana/:line', function(req, res, next) {
    db.allStationsOnLine(req.params.line,function(err, results){
        res.json(results);
    });
});

router.get('/blocket/:line/:distance/:price', function(req, res, next) {
    db.allAdsToDisplay(req.params.line, req.params.distance, req.params.price, function(err, results){
        res.json(results);
    });
});

router.get('/blocket/debug/', function(req, res, next) {
    // just returns everything
    db.allAds(function(err, results){
        res.json(results);
    });
});

router.get('/blocket/statistics/', function(req, res, next) {
    db.allAds(function(err, results){
        var withAddress = 0;
        var withCoordinates = 0;
        var withPrice = 0;
        var stats = {};

        for ( var i in results ) {
            if ( 'address' in results[i] ) {
                withAddress++;
            }

            if ( 'latitude' in results[i] ) {
                withCoordinates++;
            }

            if ( 'price' in results[i] ) {
                withPrice++;
            }
        }

        stats.total = results.length;
        stats.withAddress = withAddress;
        stats.withCoordinates = withCoordinates;
        stats.withPrice = withPrice;

        res.json(stats);
    });
});

module.exports = router;
