var MongoClient = require('mongodb').MongoClient
    , ObjectID = require('mongodb').ObjectID;

var state = {
  db: null,
};

exports.connect = function(host, port, database, callback) {
  if (state.db) return callback();

  MongoClient.connect('mongodb://'+ host +':'+ port +'/'+database, function(err, db) {
    if (err) return callback(err);
    state.db = db;
    callback();
  });
};

exports.close = function(callback) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      state.mode = null;
      callback(err);
    });
  }
};

// Support
// ==============================================
exports.getCollection = function(_collectionName, callback) {
  if(!state.db) return callback("No Db.");

  state.db.collection(_collectionName, function(err, _collection){
    callback(null, _collection);
  });
};

//find all
// ==============================================
exports.findAll = function(collection, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.find().toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

//find by ID
// ==============================================
exports.findById = function(collection, id, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.findOne({_id: id}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

//find by object
// ==============================================
exports.findByObject = function(collection, query, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.findOne(query, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

//find by objects
// ==============================================
exports.findByObjects = function(collection, query, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.find(query).toArray(function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

//find by objects in sort order
// ==============================================
exports.findSortedObjects = function(collection, query, sortQuery, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.find(query).sort(sortQuery).toArray(function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

// update
// ==============================================
exports.update = function(collection, id, providerObjects, callback) {
  if(typeof id == "string"){
    id = ObjectID(id);    
  }
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error);
    else {
    //  if(!_collection.hasOwnProperty('created_at'))
    //   providerObjects.created_at = new Date();
    
    // providerObjects.modified_at = new Date();

    _collection.update(
      {_id: id},
      {$set: providerObjects},
      function(error, providerObjects) {
        if(error) callback(error);
        else callback(null, providerObjects)
      });
    }
  });
};

// update by Query
// ==============================================
exports.updateByQuery = function(collection, query, providerObjects, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error);
    else {
    //  if(!_collection.hasOwnProperty('created_at'))
    //   providerObjects.created_at = new Date();
    
    // providerObjects.modified_at = new Date();

    _collection.update(
      query,
      {$set: providerObjects},
      { multi: true },
      function(error, providerObjects) {
        if(error) callback(error);
        else callback(null, providerObjects)       
      });
    }
  });
};

//save
// ==============================================
exports.save = function(collection, providerObjects, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      // if(typeof(providerObjects.length)=="undefined"){
      //   providerObjects.created_at = new Date();
      //   providerObjects.modified_at = new Date();
      // }else{
      //   for( var i =0;i< providerObjects.length;i++ ) {
      //     var obj = providerObjects[i];
      //     obj.created_at = new Date();
      //     obj.modified_at = new Date();
      //   }
      // }
      _collection.insert(providerObjects, function() {
        callback(null, providerObjects);
      });
    }
  });
};

//delete one
// ==============================================
exports.deleteOneByID = function(collection, _id, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.deleteOne({_id: new ObjectID(_id)}, function(err, result) {
        callback(null);
      });
    }
  });
};

//delete many
// ==============================================
exports.deleteManyByObject = function(collection, providerObjects, callback) {
  this.getCollection(collection, function(error, _collection) {
    if( error ) callback(error)
    else {
      _collection.deleteMany(providerObjects, function() {
        callback(null);
      });
    }
  });
};