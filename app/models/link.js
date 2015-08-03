// var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose'); // added

// We enforce a schema from db adapter here, in mongoose
var linkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

// Bookshelf version:
/*
db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('base_url', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});
*/

// Link is our model
var Link = mongoose.model('Link', linkSchema);

linkSchema.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url); // changed
  this.code = shasum.digest('hex').slice(0, 5); // changed
  next(); // ex of chaining multiple life-cycle events
});

/*
var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){ // need to replicate this functionality in mongoose somehow
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});
*/

module.exports = Link;
