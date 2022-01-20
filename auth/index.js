const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const accessToken = jwt.sign(
    { userName: user.userName, id: user._id },
    process.env.TOKEN_SECRET_KEY,
    {
      expiresIn: '6h',
    }
  );
  return accessToken;
};

exports.authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

exports.authenticateSuperUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token !== process.env.SUPER_USER_TOKEN) {
      return res.sendStatus(403);
    }
    next();
  } else {
    res.sendStatus(401);
  }
};
