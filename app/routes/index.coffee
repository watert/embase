q = require('q')
express = require('express')
_ = require('underscore')
router = express.Router()



# Front ends
router.get '/codes/*', (req,res)->
    res.render("index")
router.get '/user/', (req, res, next)->
    res.render("index")
userRouter = require("../middlewares/user")
router.use('/user/', userRouter)
router.use '/auth/',require("../middlewares/auth")()


module.exports = router
