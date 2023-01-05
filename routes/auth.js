const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    msg: "Auth Route",
  });
});

module.exports = router;
