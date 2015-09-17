define ["views/_base/view"], (BaseView)->
    {baseTmpl, splitViewTmpl} = BaseView

    parseData = (data)-> data.result or data
    rpcCall = (url, data={})->
        url = "/user/docs/api/#{method}"
        $.post(url, data).then (data)-> data.result
    class BaseAPICollection extends Backbone.Collection
        idAttribute:"_id"
        parse: parseData
        @urlAPI:(method)-> "#{@prototype.url}#{method}"
        @rpc:rpcCall
    class Users extends BaseAPICollection
        url: "/users/api/restful/"

    class AdminView extends BaseView.SplitView
        render:()->
            super(arguments...)
            list = new Users()
            list.fetch().then ()=>
                console.log data = list.toJSON()
                @renderDetail("jsonList", list:data)
        template: BaseView.splitViewTmpl.extend
            navbar: baseTmpl.navbar.extend
                title:"Admin"
                right:""
            cell: """
                <div class="tableview-cell" data-id="id">
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
            detail:"""
                <div class="container">
                    Detail
                </div>
            """
            jsonList: """
                <div class="tableview">
                    <div class="tableview-header"> Data set </div>
                    <%_.each(list, function(item){ %>
                        <div class="tableview-cell">
                            <div class="body"> <code><%=item._id%></code> <%=item.name||item.title%> </div>
                        </div>
                    <% }); %>
                </div>
            """
