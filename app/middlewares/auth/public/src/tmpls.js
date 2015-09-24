
module.exports = {
    index: `
        <div class="profile">
            <div class="avatar">
                <img src="http://www.gravatar.com/avatar/<%=emailHash%>?s=200" alt="" />
                <h3> <%=name%> </h3>
            </div>
            <div class="info">
                <div class="small"> Email </div>
                <p><%=email%></p>
                <div class="dashboard">
                    <div class="item">
                        <div class="small"> Articles </div>
                        <div class="value"> <%=status.docCount%> </div>
                    </div>
                    <div class="item">
                        <div class="small"> Files </div>
                        <div class="value"> <%=status.filesCount%> </div>
                    </div>
                </div>
            </div>
            <div class="actions">
                <button class="btn btn-logout">Logout</button>
            </div>
        </div>
    `,
    register: `
        <form data-action="register" class="form form-register">
            <h2> User Register </h2>
            <input type="text" name="name" placeholder="Name"/>
            <input type="email" name="email" placeholder="Email"/>
            <input type="password" name="password" placeholder="Password"/>
            <div class="actions">
                <button class="btn btn-submit" type="submit">Register</button>
                <a class="btn btn-login btn-link" href="javascript:void(0)"> Already has account </a>
            </div>
        </form>
    `,
    login: `
        <form method="post" data-action="login" class="form form-login">
            <h2> User Login </h2>
            <input type="email" name="email" placeholder="Email"/>
            <input type="password" name="password" placeholder="Password"/>
            <div class="actions">
                <button class="btn btn-submit" type="submit">Login</button>
                <button class="btn btn-register" type="button">Register</button>
            </div>
        </form>`
}
