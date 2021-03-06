/**
 * Created by edt on 7/29/15.
 */


var winston = require('winston');
var async   = require('async');
var config  = require('../config');
var GoogleMapsAPI = require('googlemaps');

var publicConfig = {
  key: config.google.key,
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);


module.exports = {
    singleGeocode: function (ad, callback) {
        gmAPI.geocode({'address': ad.address, 'city': 'Stockholm', 'country': 'Sweden'}, function(err, res) {
            if (err) {
                throw err;
            }

            if (res.length > 0) {
                winston.info("geocoded '" + ad.address + "'");
                ad.latitude = res[0].latitude;
                ad.longitude = res[0].longitude;
            }

            setTimeout(function(){
                callback(null);
            }, 250);
        });
    },
    geocode: function (ads, callback) {
        // https://github.com/nchaulet/node-geocoder
        adsToGeocode = ads.filter(function(ad){
            return !('latitude' in ad) && ('address' in ad);
        });

        async.eachSeries(adsToGeocode, module.exports.singleGeocode, function(err){
            if (err) {
                throw err;
            }

            winston.info("geocoded " + adsToGeocode.length + " ads.");
            callback(null, ads);
        });
    }
};