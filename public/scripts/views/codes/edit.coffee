define ["views/_base/view","views/codes/tmpls"
],(BaseView, tmpls)->
    class MyCodesView extends BaseView
        events:
            "click .btn-add":()->
                app.router.navigate("codes/edit",trigger:yes)
        template: tmpls.extend
            index: """
                <%=invoke(pageTopbar,{title:"Edit"})%>
            """
