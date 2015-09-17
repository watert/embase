define ["views/_base/view"], (BaseView)->
    {baseTmpl, splitViewTmpl} = BaseView
    class AdminView extends BaseView.SplitView
        template: BaseView.splitViewTmpl.extend
            navbar: baseTmpl.navbar.extend
                title:"Admin"
                right:""
            master:"""
                <div class="app">
                    <h2>Admin</h2>

                </div>
            """
            detail:"""
                Detail View
            """
