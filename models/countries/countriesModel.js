const Country = require('./countriesSchema');

exports.getSpecificCountry = (req, res) => {
  const { cName } = req.params;
  Country.findOne(
    { countryName: cName },
    'countryName todayCases todayRecovered critical'
  )
    .then((result) => {
      if (!!result) {
        res.status(200).json({
          result,
          message: 'Country received successfully',
        });
      } else {
        res.status(404).json({
          message: `Could not find country: ${cName} `,
        });
      }
    })
    .catch((err) => {
      res.status(403).send({
        err,
      });
    });
};

exports.getAllCountries = (req, res) => {
  const sortQuery = req.query.sort;

  Country.find({}, 'countryName todayCases todayRecovered critical')
    .sort([[sortQuery, -1]])
    .then((data) => {
      res.status(200).send({
        data,
        message: 'All countries recevied successfully ',
      });
    });
};

//private-> access LVL : super user only ---------------------------------------

exports.createNewCountry = (req, res) => {
  const { countryName } = req.body;

  const newCountry = new Country({
    countryName: countryName,
  });

  newCountry
    .save()
    .then((result) => {
      res.status(201).send({
        result,
        message: 'Country created successfully',
      });
    })
    .catch((err) => {
      res.status(403).send({
        err,
        message: 'Country name is already exist',
      });
    });
};
exports.updateCountryPermission = (req, res) => {
  const { countryName, adminIDs, add } = req.body;

  if (!!add) {
    Country.findOneAndUpdate(
      { countryName: countryName },
      {
        $push: {
          permissions: adminIDs,
        },
      }
    ).then((data) => {
      res.status(201).send({
        countryName: data.countryName,
        permissions: [...adminIDs, ...data.permissions],
        message: 'Admin IDs added to promissions',
      });
    });
  } else {
    Country.findOneAndUpdate(
      { countryName: countryName },
      {
        $pullAll: {
          permissions: adminIDs,
        },
      }
    ).then((data) => {
      res.status(200).send({
        countryName: data.countryName,
        todayCases: data.todayCases,
        todayRecovered: data.todayRecovered,
        critical: data.critical,
        permissions: data.permissions,
        message: '',
      });
    });
  }
};

//------------------------------------------------------------------------------

//private-> access LVL : admins only -------------------------------------------

exports.updateCountryInfo = (req, res) => {
  const { cName } = req.params;
  const userId = req.user.id;
  console.log(userId);

  const updateValues = req.body;
  Country.findOne({ countryName: cName }).then((data) => {
    const hasPermission =
      data.permissions.length > 0 && data.permissions.includes(userId);
    //if admin has permission update country info else response with 403 code
    if (hasPermission) {
      Country.findOneAndUpdate(
        { countryName: cName },
        { last_update: Date.now(), ...updateValues }
      ).then((result) => {
        res.status(201).send({
          countryName: result.countryName,
          todayCases: result.todayCases,
          todayRecovered: result.todayRecovered,
          critical: result.critical,
          last_update: result.last_update,
          ...updateValues,
          message: 'Country information updated successfully',
        });
      });
    } else {
      res.status(403).send({
        message: "You don't have permission to update this country",
      });
    }
  });
};

//------------------------------------------------------------------------------
