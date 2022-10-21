const CustomError = require("../errors");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid----");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, userId, role } = decoded;

    req.user = { name, userId, role };

    next();
  } catch (error) {
    throw new CustomError.UnauthorizedError("Unauthorized User!");
  }
};

module.exports = authentication;
