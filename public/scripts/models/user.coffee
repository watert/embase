define ["backbone","jquery"],()->

    # parseData: (data)-> data.result or data
    # rpcCall = (url, data={})->
    #     url = "/user/docs/api/#{method}"
    #     $.post(url, data).then (data)-> data.result
    # class BaseAPIModel extends Backbone.Model
    #     idAttribute:"_id"
    #     parse: parseData
    #     @urlAPI:(method)-> "#{@prototype.urlRoot}#{method}"
    # class BaseAPICollection extends Backbone.Collection
    #     idAttribute:"_id"
    #     parse: parseData
    #     @urlAPI:(method)-> "#{@prototype.url}#{method}"
    #     @rpc:rpcCall

    class UserDocModel extends Backbone.Model
        idAttribute:"_id"
        parse: (data)-> data.result or data
    class UserDocs extends Backbone.Collection
        @storeName: "article"
        idAttribute:"_id"
        getStoreName:()-> @storeName or @constructor.storeName
        url: -> "/user/docs/#{@getStoreName()}/"
        model: UserDocModel
        parse: (data)-> data.result or data
        @call:(method, data={})->
            url = "/user/docs/#{@prototype.getStoreName()}/api/#{method}"
            $.post(url, data).then (data)-> data.result
        @create: (data)->
            (docs = new @).add(data)
            docs.at(0)
    class User extends Backbone.Model
        idAttribute: "_id"
        urlRoot: "/user/api/"
        @get: ()->
            (user = new User).fetch().then ->
                return user
        @urlApi: (method)->
            "#{@prototype.urlRoot}#{method}"
        @call:(method, data={})->
            url = @urlApi(method)
            $.post(url, data).then (data)->
                if data.result._id
                    return new User(data.result)
                else return data.result
        parse:(data)-> return data.result

    _.extend(User, {UserDocs})
    return User
