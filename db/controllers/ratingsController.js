var db = require('../index.js');

exports.saveRating = function(userRating, cb) {
  var username = userRating.username;
  var rating = userRating.rating;
  var product = userRating.product;
  //get customer ID from Customers database
  db.Customers.findOne({where: {username: username}})
  .then(function(user) {
  	var customerId = user.id;
  	db.ProductRatings.findOrCreate({where: {productName: product.name, customer: customerId}, 
  	  defaults: {
        productId: product.id,
        productDescription: product.description,
        productAbv: product.abv,
        productIsOrganic: product.isOrganic,
        productStyleId: product.styleId,
        productBrewery: product.name,
        rating: rating}})
  	.spread(function(obj, created) {
  		if (created === false) {
  		  obj.rating = rating;
        obj.save().then(function(rating) {
          cb(null, obj);
        }).catch(function(err) {
          cb(err);
        });
  		} else {
  		  cb(null, obj);
  		}
  	});
  }).catch(function(err) {
  	cb(err);
  });
};

//////////////////////////////////////////////////////////////////////

exports.getRatings = function(customerName, cb) {
  db.Customers.findOne({where: {username: customerName}})
  .then(function(user) {
    var customerId = user.id;
    db.ProductRatings.findAll({where: {customer: customerId}})
    .then(function(ratings) {
      cb(null, ratings);
    }).catch(function(err) {
      console.log('this is the error from finding ratings', err);
      cb(err);
    });
  }).catch(function(err) {
      console.log('this is the error', err);
      cb(err);
  });
};

