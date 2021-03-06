var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userpostRelationSchema = new Schema({
  userID: { type: String, required: true },
  postID: { type: String, required: true }
});

userpostRelationSchema.index({userID: 1});

var UserpostRelation = mongoose.model('Userpostrelation', userpostRelationSchema);

module.exports = UserpostRelation;