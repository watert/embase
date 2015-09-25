_ = require("underscore")
express = require("express")
q = require("q")
User = require("./models/user")
ejs = require("ejs")
path = require("path")
fs = require('fs')
crypto = require("crypto")


md5 = (_str)->
    crypto.createHash('md5').update(_str).digest('hex')
renderTemplate = (filename, data)->
    filePath = path.join(__dirname,filename)
    file = fs.readFileSync(filePath, 'utf8')
    tmpl = ejs.compile(file, cache:yes, filename:"indexview")
    return tmpl(data)
renderPage = (req,res)->
    # return res.json(req.url)
    data = _.pick(req,"baseUrl")
    _.extend(data, {title:"Common Auth"})
    html = renderTemplate("views/indexview.ejs",data)
    res.type("html").send(html)

Auth = (options)->
    router = express.Router()


    router.get "/user",(req,res)->
        res.json "/user"
    router.use("/public",express.static(path.join(__dirname, './public')));
    router.get "/test", (req,res)->
        html = renderTemplate("views/index.ejs",{baseUrl:req.baseUrl})
        res.type("html").send(html)
    router.get("/page", renderPage)
    router.get("/", renderPage)

    # Auth
    passport = require("passport")
    LocalStrategy = require("passport-local")
    passport.use(new LocalStrategy((name, password, done)->
        console.log "LocalStrategy",name, password
        User.login({name, password}).then ->
            done(null, user)
        fail(done)
    ))
    router.use(passport.initialize());
    router.use(passport.session());
    router.post "/api/login",
        passport.authenticate('local'),
        (req,res)->
            res.json("success")
    # APIs
    router.use "/api", (req,res,next)->
        res.retFail = (err)->
            res.status(err.error.code).json(err)
        res.ret = (ret)->
            delete ret._data["password"]
            res.json(data:ret._data)
        res.retPromise = (promise)->
            promise.then(res.ret).fail(res.retFail)
        next()
    sessionAuth = (req,res,next)->
        uid = req.session.user?.id
        if not uid
            res.retFail(error:{code:401, msg:"unauthorized"})
        else
            User.findByID(uid).then (user)->
                req.user = user
                next()
    router.delete "/api/", sessionAuth, (req,res)->
        req.user.remove().then((ret)-> {_data:ret})
            .then(res.ret)
    router.get "/api/", sessionAuth, (req,res)->
        hash = md5(req.user.get("email"))
        req.user.set({"emailHash": hash})
        res.ret(req.user)
    router.put "/api/", sessionAuth, (req,res)->
        res.retPromise req.user.set(_.omit(req.body, "_id")).save()
    # Actions
    router.post "/api/profile", sessionAuth, (req,res)->
        res.ret(req.user)
    # router.post "/api/login", (req,res)->
    #     res.retPromise User.login(req.body).then (ret)->
    #         req.session.user = ret
    #         return ret
    router.post "/api/register", (req,res)->
        res.retPromise User.register(req.body)
    return router


### run directly, run as root router ###
if require.main is module
    app = express()
    server = app.listen(3000)
    console.log("listen 3000")
    module.exports = server
    app.use(require('body-parser').json())
    app.use(require('body-parser').urlencoded({ extended: false }))
    app.use(require('compression')());
    session = require('express-session')
    app.use(session({secret:"auth",resave:true, saveUninitialized:false}));
    app.use(require('morgan')('dev'));
    app.use("/",Auth())

else
    module.exports = Auth
