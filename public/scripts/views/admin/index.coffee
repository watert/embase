define ["views/_base/view"], (BaseView)->
    {baseTmpl, splitViewTmpl} = BaseView

    parseData = (data)-> data.result or data
    rpcCall = (url, data={})->
        url = "/user/docs/api/#{method}"
        $.post(url, data).then (data)-> data.result
    class BaseAPIModel extends Backbone.Model
        parse: parseData
        idAttribute: "_id"
    class BaseAPICollection extends Backbone.Collection
        idAttribute:"_id"
        parse: parseData
        @urlAPI:(method)-> "#{@prototype.url}#{method}"
        @rpc:rpcCall
    class Users extends BaseAPICollection
        url: "/users/api/restful/"
    stores =
        users: "/users/api/restful/"
        articles: "/admin/api/articles/"
        files: "/admin/api/files/"
    class AdminView extends BaseView.SplitView
        events:
            "click .view-detail [data-id]":(e)->
                id = $(e.target).closest("[data-id]").data("id")
                query = _.extend({},@query, docId:id)
                @setQuery(query, trigger:yes)

            "click .view-master [data-id]":(e)->
                id = $(e.target).closest("[data-id]").data("id")
                @setQuery({store:id}, trigger:yes)
        renderDocDetail:(store, id)->
            @loadCSS("bower_components/codemirror/lib/codemirror.css")
            if not storeURL = stores[store]
                return @renderDetail("detailError", {code:-1, message:"Can't find store"})

            whenLoadDoc = do ()->
                class ModelClass extends BaseAPIModel
                    urlRoot: storeURL
                (doc = new ModelClass(_id: id)).fetch().then -> doc
            require ["codemirror"], (CM)=>
                # console.log "load codemirror",CM
                @renderDetail("jsonEditor", {store, id})
                $editor = @$(".view-detail textarea")
                whenLoadDoc.then (doc)=>
                    editor = CM.fromTextArea($editor[0], { lineNumbers:yes })
                    json = JSON.stringify(doc.toJSON(),null,"\t")
                    editor.setValue(json)

        renderList:(store)->
            if not storeURL = stores[store]
                return @renderDetail("detailError", {code:-1, message:"Can't find store"})
            class ListClass extends BaseAPICollection
                url: storeURL
            list = new ListClass()
            list.fetch().then =>
                @renderDetail("jsonList", list:list.toJSON())
            .fail (err)=>
                @renderDetail("detailError", {code:-1, message:"List Fetch Error"})
        render:()->
            super(arguments...)
            {store, docId} = @query ?= {}
            if store then @$(".view-master [data-id=#{store}]").addClass("active")

            if store and docId
                @renderDocDetail(store, docId)
            else if store
                @renderList(store)

        template: BaseView.splitViewTmpl.extend
            navbar: baseTmpl.navbar.extend
                title:"Admin"
                right:""
            cell: """
                <div class="tableview-cell" data-id="<%=id%>">
                    <span class="body"><%=title%></span>
                    <i class="fa fa-angle-right"></i>
                </div>
            """

            master:"""
                <div class="container">
                    <h2>Admin</h2>
                    <div class="tableview">
                        <%=invoke(cell, {id:"users", title:"users"})%>
                        <%=invoke(cell, {id:"articles", title:"articles"})%>
                        <%=invoke(cell, {id:"files", title:"files"})%>
                    </div>
                </div>
            """
            detailError:"""
                <div class="text-center">
                <br />
                <code> <%=code%> <%=message%> </code>
                </div>
            """
            detail:"""
                <div class="container">
                    Detail
                </div>
            """
            jsonEditor: """
                <div class="editor container">
                    <h2>Edit Document</h2>
                    <div class="doc-info">
                        <code> doc: <%=store%> / <%=id%> </code>
                        <div class="actions">

                        </div>
                    </div>
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                    <div class="actions">
                        <button class="btn">Save</button>
                        <button class="btn btn-danger">Delete</button>
                    </div>
                </div>
            """
            jsonList: """
                <div class="tableview">
                    <div class="tableview-header"> Query </div>
                    <div class="tableview-cell">
                        <input type="text" placeholder="NeDB Query JSON"/>
                        <button class="btn btn-primary"> Query </button>
                    </div>
                    <div class="tableview-header"> Data set </div>
                    <%_.each(list, function(item){ %>
                        <div class="list-item tableview-cell" data-id="<%=item._id%>">
                            <div class="body"> <code><%=item._id%></code> <%=item.name||item.title%> </div>
                            <i class="fa fa-angle-right"></i>
                        </div>
                    <% }); %>
                </div>
            """
