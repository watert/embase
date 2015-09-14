{BaseDoc, DBStore} = require("./db")
crypto = require('crypto')
_ = require('underscore')
q = require("q")
# Dispatcher = require("../../public/scripts/libs/action-dispatcher")

_hasKeys = (obj, keys)->
    for k in keys
        if not obj[k] then return no
    return yes

class UserDoc extends BaseDoc
    @store: "userdoc"
    constructor:(data)->
        super(data)
    checkData:(data)->
        data ?= @_data
        if user = data.user
            data.user_id = user.id or user._id
            delete(data.user)
        if not data.user_id
            throw "UserDoc #{@store} must have user data or user_id"
    save:(data=null)->
        @checkData(data)
        super(data)
class User extends BaseDoc
    @UserDoc: UserDoc
    md5 = (_str)->
        crypto.createHash('md5').update(_str).digest('hex')
    @hash: (str)-> md5(str)
    @store: "user"
    @register:(data)->
        if not _hasKeys(data, ["email", "name", "password"])
            # console.log data
            return Promise.reject({error:{code:406, message: "needed more info to register"},data:data})
        @find({$or: [email:data.email, name:data.name]}).then (ret)=>
            if ret.length
                console.log "register already has reacord"
                return Promise.reject({error:{code:406, message:"name or email already exists"}})
            else
                data = _.extend({}, data, password: @hash(data.password))
                user = new this(data)
                user.save().then -> user
    @login:(data)->
        if not data.password
            Promise.reject({error:{code:406, message: "no password"},data:data})
        data.password = @hash(data.password)
        @findOne(data).then (user)-> user
    # @api: ()-> new Dispatcher
    #     actions:
    #         register:(data)=> @register.bind(@)
    #         login:(data)=> @login.bind(@)
    #         find:(data)=> @find.bind(@)

console.log "log userdoc",User.UserDoc

module.exports = User
