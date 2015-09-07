express = require('express')
_ = require('underscore')
router = express.Router()

# /* GET users listing. */
User = require("../models/user")
Dispatcher = require("../../public/scripts/libs/action-dispatcher")
api = new Dispatcher()
actions = for method in ["find"]
    [method, User[method]]
# console.log "actions",actions
api = new Dispatcher(actions: _.object(actions))

    # api.addActions
# console.log "what"
router.get '/api/:method', (req, res)->
    method = req.params.method
    # console.log "shit"
    api.call(method).then (data)->
        console.log "method #{method} then"
        res.json(data)
    .fail (err)->
        res.status(400).json(err)
router.get '/', (req, res, next)->
    res.render('index', { title: 'Express' })

module.exports = router
