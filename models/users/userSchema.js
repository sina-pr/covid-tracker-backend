const mongoDB = require('mongoose');

const UserSchema = mongoDB.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoDB.model('User', UserSchema);
