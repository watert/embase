define ["views/_base/view","tmpls/base","libs/util","models/user"],(BaseView, baseTmpls, util, User)->
    # class User extends Backbone.Model
    #     defaults: {email:"",name:""}
    #     url: "/user/api/"
    #     parse:(data)-> data.result or data
    class UserIndex extends BaseView
        events:
            "click .btn-login": -> @render("login", yes)
            "click .btn-register": -> @render("register")
            "click .form .btn-submit": (e)->
                $form = $(e.target).closest("form")
                formData = util.deparamQuery($form.serialize())
                action = $form.data("action")

                console.log "formData",formData
                User.call(action, formData).then (data)=>
                    if action is "register"
                        alert("Register sussessfully.")
                        @render("login")
                    if action is "login"
                        @render("index")
        render:(tmpl, imediately=no)->
            return super(tmpl) if imediately
            tmpl ?= @query.view or "index"
            if tmpl is "register"
                return super(tmpl)
            user = new User()
            user.fetch().then (data)=>
                console.log user.toJSON()
                @setModel(user)
                super(tmpl)
            .fail =>
                console.log "try login", tmpl
                super("login")
        parse: (data)-> data.result
        template: baseTmpls.extend
            index: """
                <div class="profile">
                    <div class="avatar">
                        <img src="http://www.gravatar.com/avatar/<%=emailHash%>?s=200" alt="" />
                        <h3> <%=name%> </h3>
                    </div>
                    <div class="info">
                        <div class="small"> Email </div>
                        <p><%=email%></p>
                    </div>
                    <div class="actions">
                        <button class="btn btn-logout">Logout</button>
                    </div>
                </div>
            """
            register: """
                <form data-action="register" class="form form-register">
                    <h2> User Register </h2>
                    <input type="text" name="name" placeholder="Name"/>
                    <input type="email" name="email" placeholder="Email"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <div class="actions">
                        <button class="btn btn-submit" type="button">Register</button>
                        <a class="btn btn-login btn-link" href="javascript:void(0)"> Already has account </a>
                    </div>
                </form>
            """
            login: """
                <form data-action="login" class="form form-login">
                    <h2> User Login </h2>
                    <input type="email" name="email" placeholder="Email"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <div class="actions">
                        <button class="btn btn-submit" type="button">Login</button>
                        <button class="btn btn-register" type="button">Register</button>
                    </div>
                </form>
            """
