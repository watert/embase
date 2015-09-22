define ["views/_base/view","marked"], (BaseView, marked)->
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
        users: "/admin/api/users/"
        articles: "/admin/api/articles/"
        files: "/admin/api/files/"

    navbarBack = baseTmpl.navbar.extend
        backTitle: "Back"
        left: baseTmpl.templer """
            <div class="btn-back">
                <i class="fa fa-angle-left"></i>
                <%=backTitle%></div>
        """


    class DocEditView extends BaseView
        events:
            "click .btn-back":()->
                history.back()
            "click .btn-save":()->
                $btn = @$(".btn-save").css({opacity:.5,transition:"all .5s"}).attr("disabled",yes)
                @doc.save().then -> $btn.css(opacity:1).attr("disabled",no)
            "click .confirm-delete":()->
                @doc.destroy().then =>
                    @render("msg", {msg: "Document <code>#{@doc.id}</code> deleted"})
                    @trigger("deleted", @doc.id)
            "click .btn-delete":()->
                @$(".btn-delete").hide()
                @$(".confirm-delete").show()
        render: (name="index")->
            if name isnt "index" then return super(arguments...)
            {store, id} = @options
            @loadCSS("bower_components/codemirror/lib/codemirror.css")
            if not storeURL = stores[store]
                return super("error", {code:-1, message:"Can't find store"})
            whenLoadDoc = do ()->
                class ModelClass extends BaseAPIModel
                    urlRoot: storeURL
                (doc = new ModelClass(_id: id)).fetch().then -> doc
            require ["codemirror"], (CM)=>
                super("index", {store, id, @query})
                $editor = @$("textarea")
                whenLoadDoc.then (doc)=>
                    @doc = doc
                    editor = CM.fromTextArea($editor[0], { lineNumbers:yes })
                    json = JSON.stringify(doc.toJSON(),null,"\t")
                    editor.setValue(json)
                .fail =>
                    super("error", {code:-1, message:"Document <code>#{id}</code> not found"})
        template: baseTmpl.extend
            navbarBack: navbarBack
            edgeNavbarBack: """
                <div class="edge when-mobile">
                    <%=navbarBack({backTitle:backTitle})%>
                </div>
            """
            error:"""
                <%=invoke(edgeNavbarBack, {backTitle:"List"})%>
                <div class="text-center">
                    <br /> <strong> ERROR </strong>
                    <br /> <code> <%=message%> </code>
                </div>
            """
            index: """ <div class="editor container">
                    <%=invoke(edgeNavbarBack, {backTitle:"List"})%>
                    <h2>Edit Document</h2>
                    <div class="doc-info">
                        <code> doc: <%=store%> / <%=id%> </code>
                        <div class="actions">

                        </div>
                    </div>
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                    <div class="actions">
                        <button class="btn btn-save">Save</button>
                        <button class="btn btn-delete btn-danger">Delete</button>
                        <button class="btn confirm-delete btn-danger hide">Confirm Delete</button>
                    </div>
                </div>
            """
    class AdminView extends BaseView.SplitView
        events:
            "click .cell-status":()->
                @renderStatus()
            "click .btn-back":()->
                @hideDetail()
                @setQuery({}).render()
            "click .view-detail .btn-query":(e)->
                query = JSON.parse(@$(".view-detail [name=query]").val() or "{}")
                query = _.extend({},@query, query:JSON.stringify(query))
                @setQuery(query).render()

            "click .view-detail [data-id]":(e)->
                id = $(e.target).closest("[data-id]").data("id")
                query = _.extend({},@query, docId:id)
                @setQuery(query)
                @render()

            "click .view-master [data-id]":(e)->
                id = $(e.target).closest("[data-id]").data("id")
                @setQuery({store:id})
                @render()
        renderDocDetail:(store, id)->
            detailView = new DocEditView({@query, store, id})
            @$(".view-detail").empty().append(detailView.el)
            detailView.render()

            @once "remove render", ->
                detailView.remove()
        renderList:(store)->
            if not storeURL = stores[store]
                return @renderDetail("detailError", {code:-1, message:"Can't find store"})
            class ListClass extends BaseAPICollection
                url: storeURL
            list = new ListClass()
            where = @query.query or "{}"
            where = JSON.parse(where)
            list.fetch(data:where).then =>
                @renderDetail("jsonList", {list:list.toJSON(), @query})
            .fail (err)=>
                @renderDetail("detailError", {code:-1, message:"List Fetch Error"})
        renderStatus:()->
            @$(".view-master .cell-status").addClass("active")
                .siblings().removeClass("active")
            $.post("/admin/api/status/").then (data)=>
                console.log data.result
                @renderDetail("dbstatus",data)
                $markdown = @$(".view-detail .markdown")
                text = $markdown.text()

                $markdown.html(marked.parse(text))

        render:()->
            super(arguments...)
            {store, docId} = @query ?= {}
            @model = query:@query
            if store
                @$(".view-master [data-id=#{store}]").addClass("active")
                @showDetail()
            if store and docId
                @renderDocDetail(store, docId)
            else if store
                @renderList(store)
            else @renderStatus()

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
            dbstatus: """
                <div class="container">
                <h2>Status:</h2>
                <div class="markdown">
                |name|size|
                |----|----|<% _.each(result, function(row){ %>
                |<%-row.name%>|<%-(row.size/1000).toFixed(2)%>K| <%}) %>
                </pre>
                </div>
                </div>
            """
            navbarBack: navbarBack
            master:"""
                <div class="container">
                    <h2>Admin</h2>
                    <div class="tableview">
                        <div class="tableview-cell cell-status">
                            <span>Status</span><i class="fa fa-angle-right"></i>
                        </div>
                        <div class="tableview-header">Tables</div>
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

                </div>
            """
            jsonList: """
                <div class="edge when-mobile">
                    <%=navbarBack({backTitle:"Admin"})%>
                </div>
                <div class="tableview">
                    <div class="tableview-header"> Query </div>
                    <div class="tableview-cell">
                        <input type="text" name="query" value="<%-query.query%>"
                            placeholder="NeDB Query JSON"/>
                        <button class="btn btn-primary btn-query"> Query </button>
                    </div>
                    <div class="tableview-header"> Data set </div>
                    <%_.each(list, function(item){ %>
                        <div class="list-item tableview-cell" data-id="<%=item._id%>">
                            <div class="body">
                                <code><%=item._id%></code>
                                <%=JSON.stringify(_.omit(item, "_id"))%>
                            </div>
                            <i class="fa fa-angle-right"></i>
                        </div>
                    <% }); %>
                </div>
            """
