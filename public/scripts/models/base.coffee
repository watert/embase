define ["backbone","jquery"], ->
    parseData = (data)-> return data.result or data
    rpcCall = (url, data={})->
        # url = "/user/docs/api/#{method}"
        $.post(url, data).then (data)-> data.result
    class BaseModel extends Backbone.Model
        parse: parseData
        idAttribute: "_id"
    class BaseCollection extends Backbone.Collection
        idAttribute:"_id"
        parse: parseData
        model: BaseModel
        @urlAPI:(method)-> "#{@prototype.url}#{method}"
        @rpc: rpcCall
    generate = (options={})->
        url = options.url
        if not url then throw("no url specified when generating")
        class Model extends BaseModel
            urlRoot: url
        class Collection extends BaseCollection
            model:Model
            url:url
        return {Model, Collection}
    {Model:BaseModel, Collection:BaseCollection, generate}
