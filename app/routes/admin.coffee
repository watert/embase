express = require('express')
_ = require('underscore')
User = require("../models/user")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
config = require("../config")

app = require("../app")
router = express.Router()


{restful, jsonrpc} = require("../middlewares/api")
# router.use('/api/*', utilRouter())
router.use "/api/users/", restful(model:User)
router.use "/api/users/", jsonrpc(model:User)

router.get '/*', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
