
express = require('express')
router = express.Router()

router.get '/', (req, res, next)->
    res.render('index', { title: 'Express' })
router.get '/codes/*', (req,res)->
    res.render("index")

# Single user actions
router.get '/user/*', (req, res, next)->
    if req.session.user then next()
    else
router.get '/user/', (req, res, next)->
    res.render("index")
router.post '/user/:action', (req,res)->


module.exports = router
