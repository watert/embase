express = require("express")
router = express.Router()
router.get "/", (req,res)->
    res.json("actions!")
module.exports = router
