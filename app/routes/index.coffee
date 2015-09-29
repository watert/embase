q = require('q')
express = require('express')
_ = require('underscore')
router = express.Router()



# Front ends
# router.get '/codes/*', (req,res)->
#     res.render("index")



passport = require("passport")



# router.get '/user/', (req, res, next)->
#     res.render("index")
# userRouter = require("../middlewares/user")
# router.use('/user/', require("../middlewares/user"))
router.use '/user/',(req,res)->
    console.log req.oauth2, req.user, req.session.user
    res.json("shit")
router.use '/auth/',require("../middlewares/auth")()
router.get '/*', (req, res)->

    console.log "render index with user",req.user,req.session
    res.render('index', { title: 'Express', user: req.user?._data or null})

module.exports = router
