define ["views/baseview","tmpls/base"],(BaseView, baseTmpls)->
    {navbar, toolbar, templer} = baseTmpls
    class List extends BaseView
        tagName:"div"
        events: 
            "click .btn-edit":()->
                @$el.toggleClass("editing")
            "click .list-item": (e)->
                console.log "click item", e.currentTarget
                $item = $(e.currentTarget)
                if @$el.hasClass("editing")
                    $check = $item.find("[type=checkbox]")
                    $check.prop("checked", !$check.prop("checked"))
                else
                    id = $item.attr("data-id")
                    console.log "click",id
                    @navigate("users/?id=#{id}")
                # e.stopPropagation()
                # console.log $check.prop("checked")
        render:()->
            console.debug "render", @
            $.get("/users/api/find").then (data)=>
                @setModel(users:data,query:@query)
                super()
        template: templer
            detail: """
                
            """
            index: """
                <%=navbar()%>
                <% if(query.id) {%>
                    with id
                <%}else {%>
                    <ul class="list">
                        <%_.each(users, function(item){%>
                            <%=listItem({data:item})%>
                        <%})%>
                    </ul>
                <%}%>
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
