express = require('express')
_ = require('underscore')
User = require("../models/user")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
config = require("../config")

app = require("../app")
router = express.Router()


{restful, jsonrpc} = require("../middlewares/api")
# router.use('/api/*', utilRouter())
router.use "/api/restful/", restful(model:User)
router.use "/api/", jsonrpc(model:User, methods:["find","findOne","register"])

router.get '/*', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
