define ["backbone","jquery"],()->

    class UserDocs extends Backbone.Collection
        @storeName: "article"
        idAttribute:"_id"
        url: -> "/user/docs/#{@storeName or @constructor.storeName}/"
        model: class UserDocModel extends Backbone.Model
            idAttribute:"_id"
            parse: (data)-> data.result or data
        parse: (data)-> data.result or data
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
                # console.log data.length
                return new User(data.result)
        parse:(data)-> return data.result

    _.extend(User, {UserDocs})
    return User
