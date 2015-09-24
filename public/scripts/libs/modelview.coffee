Factory = ($, Backbone)-> # Initializer
	class ModelView extends Backbone.View
		constructor:(options)->
			# 将必要属性放到this中
			attrs = ["path", "query", "model", "collection", "templateHelpers"]
			_.extend(this, _.pick(options, attrs))
			# appMethods = ["call", "deparamQuery", "appLinkWithQuery", "getState"]
			# _(appMethods).each (method)=>
			# 	@[method] = -> app[method](arguments...)


			# 预处理tmpl,query
			@initTemplates()
			# @query = @deparamQuery(@query) if @query

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
		# linkWithState: ->
		# 	app.linkWithState(arguments...)
		# getState: ->
		# 	app.getState(arguments...)
		# deparamQuery: app.deparamQuery

		tagName:"div"
		template: _.template """
			Empty ModelView
		"""
		show:()->
			@trigger("show")
			@onShow?()
		render:(name="index", argData)->
			data = @model?.toJSON?() || @model || {}
			if @collection
				data.collection = @collection.toJSON?() || @collection
			data = _.extend(data, @templateHelpers, argData)

			tmpl = @template?[name] or @template
			# console.warn name, data, tmpl, typeof tmpl
			# console.error tmpl?(data)
			html = tmpl?(data) or @template.invoke?(tmpl, data) or tmpl
			@$el.html(html)
			if tmplRenderer = @template._context?.onRender
				tmplRenderer.bind(@)()
			@trigger("render")
			@onRender?()
			return $.when(@)
		renderError:(message)->
			code = null
			if res = message.err
				code = res.code
				msg = res.message
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
	define(["jquery","backbone"], Factory)
else window.ModelView = Factory($, Backbone)
