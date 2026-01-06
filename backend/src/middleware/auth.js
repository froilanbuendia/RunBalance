const authController = require("../controllers/authController");

module.exports = (req, res, next) => {
  const token = authController.getValidAccessToken();
  if (!token) return res.status(401).send("Not authorized");
  next();
};
