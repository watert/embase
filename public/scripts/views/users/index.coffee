define ["views/_base/view","tmpls/base"],(BaseView, baseTmpls)->
    class Users extends Backbone.Collection
        model: Backbone.Model.extend
            defaults: {email:"",name:""}
        url: "/users/api/restful"
        parse: (data)-> data.result
    {navbar, toolbar, templer} = baseTmpls
    class UserIndexView extends BaseView
        tagName:"div"
        events: 
            "click .btn-add":()->
                @navigate("users/detail")

            "click .btn-edit":()->
                @$el.toggleClass("editing")
            "click .users .list-item": (e)->
                console.log "click item", e.currentTarget
                $item = $(e.currentTarget)
                if @$el.hasClass("editing")
                    $check = $item.find("[type=checkbox]")
                    $check.prop("checked", !$check.prop("checked"))
                else
                    id = $item.attr("data-id")
                    console.log "click",id
                    @navigate("users/detail?id=#{id}")
                # e.stopPropagation()
                # console.log $check.prop("checked")
        render:()->
            console.debug "render", @
            users = new Users
            users.fetch().then (data)=>
                console.log "try render",data
                @setModel(users:users.toJSON(),query:@query)
                super()
                # console.log "coll",users
            # $.get("/users/api/find").then (data)=>
        template: templer
            detail: """

            """
            index: """
                <%=navbar()%>
                <ul class="list">
                    <li class="list-item btn-add">
                        Add
                    </li>
                </ul>
                <ul class="list users">
                    <%_.each(users, function(item){%>
                        <%=listItem({data:item})%>
                    <%})%>
                </ul>
                <%=toolbar()%>
            """
            onRender:()->
                console.debug "tmpl onRender"
            toolbar: toolbar
            navbar: navbar.extend
                title:"Users"
                right:"""
                    <div class="btn btn-edit">Edit</div>
                """
            listItemBody: templer """
                <div class="item-body">
                <%=name%> <small> (<%=email%>) </small>
                </div>
            """
            listItem: templer """
                <li class="list-item" data-id="<%=data._id%>">
                    <div class="list-check">
                        <input type="checkbox" name="check[<%=data._id%>]" id="" />
                    </div>
                    <%=listItemBody(data)%>
                    <div class="arrow"> <i class="fa fa-angle-right"></i> </div>
                </li>
            """
