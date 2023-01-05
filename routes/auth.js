/** importing dependencies */
const bcrypt = require("bcryptjs");

const router = require("express").Router();

/** imporing Models */
const User = require("../models/User");

/** Register User ---> http://localhost:5000/api/auth/register */
router.post("/register", async (req, res) => {
  try {
    /** generate hashed password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    /** create new user */
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    /** saving user to database */
    const user = await newUser.save();
    res.status(201).json({
      message: `New user created ---> ${user.username}`,
    });
  } catch (error) {
    return res.status(400).send({ error });
  }
});

/** Login User ---> http://localhost:5000/api/auth/login */
router.post("/login", async (req, res) => {
  try {
    /** find user by email in database */
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("user not found!");

    /** comparing original typed user password */
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    /** send response if email and passwrd are valid */
    res.status(200).json({
      success: `${user.username} loggedin successfully🥰`,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
