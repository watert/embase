
express = require('express')
router = express.Router()

router.get '/', (req, res, next)->
    res.render('index', { title: 'Express' })
router.get '/codes/*', (req,res)->
    res.render("index")

module.exports = router
