const router = require("express").Router();

router.get('/', (req, res) => {
  res.status(200).json({
    msg: "Post API"
  })
})

module.exports = router;
