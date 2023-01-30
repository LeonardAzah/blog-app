const User = require("../model/User");
const jwt = require("jsonwebtoken");

const userRefreshToken = async (req, res) => {
  const cookie = req.cookie;
  if (!cookie?.jwt) return res.sendStatus(401);
  const refreshToken = cookie.jwt;

  const foundUser = await User.findOne({ refreshtoken }).exec();

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username != decoded.username)
      return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        username: username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30min" }
    );

    res.json({ accessToken });
  });
};

module.exports = { userRefreshToken };
