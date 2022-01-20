const router = require('express').Router();
const auth = require('../auth');
const countryModel = require('../models/countries/countriesModel');

//public
router.get('/', countryModel.getAllCountries);
router.get('/:cName', countryModel.getSpecificCountry);

//private
router.post(
  '/country',
  auth.authenticateSuperUser,
  countryModel.createNewCountry
);
router.put(
  '/country',
  auth.authenticateSuperUser,
  countryModel.updateCountryPermission
);
router.put('/:cName', auth.authenticateAdmin, countryModel.updateCountryInfo);

module.exports = router;
