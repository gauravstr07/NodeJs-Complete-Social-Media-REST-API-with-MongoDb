const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    msg: "User API",
  });
});

module.exports = router;
