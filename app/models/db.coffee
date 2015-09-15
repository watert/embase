_ = require("underscore")
DBStore = require("nedb")
config = require("../config")

wrapMethods = (obj,methods)->
    generateNewMethod = (oldMethod)-> (args...)->
        new Promise (res,rej)->
            callback = (err,ret...)->
                if err then rej(err,ret...)
                else res(ret...)
            if args.length then oldMethod(args...,callback)
            else oldMethod(callback)
    for m in methods
        do (oldMethod = obj[m].bind(obj) )->
            obj[m] = generateNewMethod(oldMethod)
    return obj

DBStore.storePath = (name)->
    config.appPath("db/#{name}.db")
DBStore.storeConfig = (name)->
    ret = filename: DBStore.storePath(name)
    return ret

DBStore.getStore = (name)->
    dbconfig = DBStore.storeConfig(name)
    store = new DBStore(dbconfig)
    new Promise (res,rej)->
        store.loadDatabase (err)->
            wrapMethods(store, ["find","findOne","insert","update","remove"])
            if not err then res(store) else rej(err)

class BaseDoc
    @store: "test"
    constructor: (data)->
        @_data = _.extend({},data)
        @changed = yes
        @id = data._id
        _.extend(@, _.pick(@constructor,["store","getStore"]))
    set:(object)->
        _.extend(@_data, object)
        @changed = yes
    get:(key=null)->
        if not key then return @_data
        else return @_data[key]
    omit:(args...)->
        @_data = _.omit(@_data, args...)
    save:(object)->
        if object then @set(object)
        data = @_data
        where = _.pick(data, "_id")
        # @beforeSave?(data)
        @getStore().then (store)=>
            if data._id
                return store.update(where, data, {}).then =>
                    @constructor.findOne(_id:data._id)
            else store.insert(data).then (data)=>
                @_data = data
                @id = data._id
                return new @constructor(data)
        .then (data)=>
            @changed = no
            return data
    remove: ()->
        @getStore().then (store)=>
            where = _.pick(@_data, "_id")
            store.remove(where, {})
        .then (num)=>
            id = @_data._id
            delete @_data._id
            @isDeleted = yes
            return num
    @findByID:(id)->
        DocClass = this
        @getStore().then (store)->
            store.find({_id:id}).then (data)->
                new DocClass(data[0])
    @remove: (where)->
        @getStore().then (store)->
            store.remove(where, {multi:yes})
    @removeByID:(id)->
        @getStore().then (store)->
            store.remove({_id:id}, {})
    @getStore:()->
        DBStore.getStore(@store)
    @findOne:(args...)->
        DocClass = this
        @getStore().then (store)->
            store.findOne(args...).then (data)-> new DocClass(data)
    @find:(where={}, args...)->
        @getStore().then (store)->
            store.find(where, args...)

module.exports = {BaseDoc, DBStore}
