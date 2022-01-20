const User = require('./userSchema');
const bcrypt = require('bcrypt');
const auth = require('../../auth/index');

//public -----------------------------------------------------------------------
exports.loginAdmin = (req, res) => {
  const { adminUserName, adminPassword } = req.body;

  User.findOne({ userName: adminUserName }).then((user) => {
    if (!user) {
      res.status(401).send({
        message: 'Incorrect username or password',
      });
    }
    bcrypt.compare(adminPassword, user.password, (err, result) => {
      if (err) {
        res.status(400).send({
          message: 'Could not compare passwords',
        });
      } else {
        if (result) {
          res.status(200).send({
            TOKEN: auth.generateToken(user),
            message: 'Authentication was successful',
          });
        } else {
          res.status(401).send({
            message: 'Incorrect username or password',
          });
        }
      }
    });
  });
};

//------------------------------------------------------------------------------

//private-> access LVL : super user only ---------------------------------------

exports.createNewAdmin = (req, res) => {
  const { adminUserName, adminPassword } = req.body;
  User.exists({ userName: adminUserName }, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (result) {
        res.status(400).send({
          message: 'Username is already exist',
        });
      } else {
        const salt = bcrypt.genSaltSync(10);
        bcrypt.hash(adminPassword, salt, (err, hash) => {
          if (err) {
            res.status(500).send({
              message: 'Failed when encrypting user password',
            });
          }
          const newAdmin = new User({
            userName: adminUserName,
            password: hash,
          });
          newAdmin.save().then((result) => {
            res.status(201).send({
              result,
              message: 'Admin created successfully',
            });
          });
        });
      }
    }
  });
};

//------------------------------------------------------------------------------
