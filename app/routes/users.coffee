express = require('express')
_ = require('underscore')
User = require("../models/user")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
config = require("../config")

app = require("../app")
router = express.Router()
actions = for method in ["find"]
    [method, User[method]]

console.log config.appPath("db/user.db")
api = Dispatcher.createAPI(User, ["find"])

router.get '/api/:method', (req, res)->
    method = req.params.method
    console.log "method", method
    api.call(method).then (data)->
        console.log "method #{method} then"
        res.json(data)
    .fail (err)->
        console.log "method #{method} fail",err
        res.status(400).json(err)
router.get '/', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
