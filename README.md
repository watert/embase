# embase

my base code for embedded basement for fast prototype develop

- User Features
    - RESTful & JSONRPC API for User and User API
    - Login/Register/Profile view
    - User document management
    - Media files management
- System status admin

## Requests Guide

RESTful with JSONRPC support:

- User Basics
    - `GET user/*`: view routes
    - `POST user/api/login`: login
    - `POST user/api/register`: register
    - `POST user/api/[methodName]`: call other RPC methods (Model static method)
- User Articles RESTful with RPC
    - `GET user/docs/article`: get list
    - `POST user/docs/article`: add new article
    - `GET user/docs/article/:id`: get article with id
    - `PUT user/docs/article/:id`: update article with id
    - `DELETE user/docs/article/:id`: delete article with id
    - `POST user/docs/article/api/[methodName]`: call Model static method
    - `POST user/docs/article/:id/api/[methodName]`: call Method instance method
- User Other Documents:
    - just like articles api above
    - `ALL user/docs/[docname]/`
    - `ALL user/docs/[docname]/:id`
    - `ALL user/docs/[docname]/api/[methodName]`
    - `ALL user/docs/[docname]/:id/api/[methodName]`

## TODOs

- ~~User Login / Register / Profile~~
- User File Upload test
- Basic System Status Admin
- Editor for general doc and files
- User Files Gallery and upload
- Extract to basic middlewares and static files
