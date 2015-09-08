Factory = ($, Backbone)-> # Initializer
	class ModelView extends Backbone.View
		constructor:(options)->
			# 将必要属性放到this中
			attrs = ["path", "query", "model", "collection", "templateHelpers"]
			_.extend(this, _.pick(options, attrs))
			appMethods = ["call", "deparamQuery", "appLinkWithQuery", "getState"]
			_(appMethods).each (method)=>
				@[method] = -> app[method](arguments...)


			# 预处理tmpl,query
			@initTemplates()
			@query = @deparamQuery(@query) if @query

			@renderError = @renderError.bind(@)
			@renderLoading = @renderLoading.bind(@)


			super(options) #invokes initialize method
			@setModel(@model) if @model
			@setCollection(@collection) if @collection

		setModel:(model)->
			model?.on?("sync", @render, @)
			@model = model
		setCollection:(collection)->
			collection?.on?("sync", @render, @)
			@collection = collection

		initTemplates:()->
			# 将template用i18n方法包装
			invokeTmpl = (tmpl)->
				return tmpl
			@template = invokeTmpl(@template)
			_.each @templateHelpers, (helper, key)=>
				@templateHelpers[key] = invokeTmpl(helper)
		navigateWithQuery:(link, query)->
			if -1 is link.indexOf("?") then link += "?"
			else link += "&"
			link = link + $.param(query)
			app.router.navigate(link, {trigger:yes})
		navigate: (link)->
			app.router.navigate(link, {trigger:yes})
		# linkWithState: ->
		# 	app.linkWithState(arguments...)
		# getState: ->
		# 	app.getState(arguments...)
		# deparamQuery: app.deparamQuery

		tagName:"div"
		template:_.template """
			Empty ModelView
		"""
		show:()->
			# console.debug "modelview show", @$el.parents()
			@trigger("show")
			@onShow?()
		render:()->
			data = @model?.toJSON?() || @model || {}
			if @collection
				data.collection = @collection.toJSON?() || @collection
			data = _.extend(data, @templateHelpers)

			html = @template?(data) or @template
			@$el.html(html)
			if tmplRenderer = @template._context?.onRender
				tmplRenderer.bind(@)()
			@trigger("render")
			@onRender?()
			return $.when()
		renderError:(message)->
			code = null
			if res = message.base_rsp
				code = res.ret
				msg = res.msg
			# console.debug code,msg
			@$el.html("""
				<br />
				<div class="text-center text-danger">
					<h3 class=""> ERROR #{code or ""}</h3>
					<p class="">#{msg or message}</p>
				</div>
			""")
		renderLoading:(msg="Loading...")->
			@$el.html("""
				<br />
				<p class="text-center"> #{msg} </p>
			""")
if window.require&&require.defined
	# console.debug "try define"
	define(["jquery","backbone", "app"], Factory)
else window.ModelView = Factory($, Backbone, App)
