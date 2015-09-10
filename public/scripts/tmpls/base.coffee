define ["libs/templer"],(templer)->

    base = templer
        # for more usage
        # events:
        #     extend:(ctx)->
        #         console.log "extend",ctx
        templer: templer
        invoke: (method, data)->
            tmpl = method
            tmpl = templer(method) if _.isString(method)
            data = _.extend({},this,data)
            return tmpl.bind(this)(data)

        # base layout
        index:" <%=navbar()+invoke(indexBody)+toolbar()%> "
        indexBody:"Hello World"

        # components
        tableview: templer
            cells: ["Empty Cell Item"]
            cellItem: """
                <div class="tableview-cell">
                    <%=invoke(html)%>
                </div>
            """
            header: ""
            index: """
                <div class="tableview">
                    <%if(header){ %>
                        <div class="tableview-header">
                        <%=invoke(header)%></div>
                    <% }%>
                    <%_.each(cells, function(cell){
                        print(invoke(cellItem,{html:cell}));
                    })%>
                </div>
            """
        # list:
        #     index: templer """
        #         <ul class="list">
        #             <%_.each(data, function(item){%>
        #                 <%=listItem({data:item})%>
        #             <%})%>
        #         </ul>
        #     """
        #     body:""
        #     listItemBody: templer """
        #     <div class="item-body">
        #     <%=name%> <small> (<%=email%>) </small>
        #     </div>
        #     """
        #     listItem: templer """
        #     <li class="list-item" data-id="<%=data._id%>">
        #         <div class="list-check">
        #             <input type="checkbox" name="check[<%=data._id%>]" id="" />
        #         </div>
        #         <%=listItemBody(data)%>
        #         <div class="arrow"> <i class="fa fa-angle-right"></i> </div>
        #     </li>
        #     """
        toolbar: templer
            items: ["Delete","Mark"]
            itemTmpl: templer """
                <div class="toolbar-item">
                    <div class="btn"><%=name%></div>
                </div>
            """
            index:"""
                <div class="toolbar">
                    <div class="toolbar-inner">
                    <% _.each(items, function(item){ %>
                        <%=itemTmpl({name:item})%>
                    <% });%>
                    </div>
                </div>
            """

        navbar: templer
            left: ""
            right: "Right"
            title: "Navbar"
            index: """
                <div class="navbar">
                    <div class="navbar-inner">
                        <div class="navbar-left">
                            <%=left%>
                        </div>
                        <div class="navbar-title">
                            <%=title%>
                        </div>
                        <div class="navbar-right">
                            <%=right%>
                        </div>
                    </div>
                </div>
            """
