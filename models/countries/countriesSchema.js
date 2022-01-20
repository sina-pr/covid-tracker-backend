const mongoDB = require('mongoose');

const CountrySchema = mongoDB.Schema({
  countryName: {
    type: String,
    unique: true,
  },
  todayCases: {
    type: Number,
    default: 0,
  },
  todayRecovered: {
    type: Number,
    default: 0,
  },
  critical: {
    type: Number,
    default: 0,
  },
  permissions: {
    type: Array,
    default: [],
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoDB.model('Country', CountrySchema);
