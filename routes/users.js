const User = require("../models/User");

const router = require("express").Router();
const bcrypt = require("bcryptjs");

/** update user ---> http://localhost:5000/api/user/userId */
router.put("/:id", async (req, res) => {
  /** check if user is admin or not */
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    /** check password */
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json({ error });
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Accound has been updated successfully!");
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({
      warning: "You can update only your account!",
    });
  }
});

/** delete user ---> http://localhost:5000/api/user/userId */
router.delete("/:id", async (req, res) => {
  /** check if user is admin or not */
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json("Accound has been deleted!");
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({
      messge: `user deleted successfully!`,
    });
  }
});

/** get a user ---> http://localhost:5000/api/user/userId */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({ error });
  }
});

/** follow a user  ---> http://localhost:5000/api/user/userId/follow */
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const curruntUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await curruntUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({
          follow: `${user.username} has been followed`,
        });
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});

/** follow a user  ---> http://localhost:5000/api/user/userId/unfollow */
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const curruntUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await curruntUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({
          follow: `${user.username} has been unfollowed`,
        });
      } else {
        res.status(403).json("you already unfollow this user");
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});

module.exports = router;
