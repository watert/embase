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
        msg: templer """
            <br />
            <div class="text-center"><%=msg%></div>
        """
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
    base = base.extend
        navbar: base.extend
            left: ""
            right: "Right"
            title: "Navbar"
            index: """
                <div class="navbar">
                    <div class="navbar-inner">
                        <div class="navbar-left">
                            <%=invoke(left)%>
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
