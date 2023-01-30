const User = require("../model/User");
const bycrypt = require("bcrypt");
const { formateName } = require("../util/utilfxn");

const createUser = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  //check for duplicate username in the db
  // const name = formateName(req.body.username);
  //   console.log(req.body.username);

  const duplicate = await User.findOne({
    username: username,
  }).exec();

  if (duplicate)
    return res.status(409).json({ message: "Username already exist" });

  try {
    const hashedPwd = await bycrypt.hash(password, 10);

    const result = await User.create({
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: hashedPwd,
      articles: [],
    });
    res.status(201).json({ sucess: "New user created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createUser };
