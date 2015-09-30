var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["backbone", "jquery"], function() {
  var BaseCollection, BaseModel, generate, parseData, rpcCall;
  parseData = function(data) {
    return data.result || data;
  };
  rpcCall = function(url, data) {
    if (data == null) {
      data = {};
    }
    return $.post(url, data).then(function(data) {
      return data.result;
    });
  };
  BaseModel = (function(superClass) {
    extend(BaseModel, superClass);

    function BaseModel() {
      return BaseModel.__super__.constructor.apply(this, arguments);
    }

    BaseModel.prototype.parse = parseData;

    BaseModel.prototype.idAttribute = "_id";

    return BaseModel;

  })(Backbone.Model);
  BaseCollection = (function(superClass) {
    extend(BaseCollection, superClass);

    function BaseCollection() {
      return BaseCollection.__super__.constructor.apply(this, arguments);
    }

    BaseCollection.prototype.idAttribute = "_id";

    BaseCollection.prototype.parse = parseData;

    BaseCollection.prototype.model = BaseModel;

    BaseCollection.urlAPI = function(method) {
      return "" + this.prototype.url + method;
    };

    BaseCollection.rpc = rpcCall;

    return BaseCollection;

  })(Backbone.Collection);
  generate = function(options) {
    var Collection, Model, url;
    if (options == null) {
      options = {};
    }
    url = options.url;
    if (!url) {
      throw "no url specified when generating";
    }
    Model = (function(superClass) {
      extend(Model, superClass);

      function Model() {
        return Model.__super__.constructor.apply(this, arguments);
      }

      Model.prototype.urlRoot = url;

      return Model;

    })(BaseModel);
    Collection = (function(superClass) {
      extend(Collection, superClass);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.model = Model;

      Collection.prototype.url = url;

      return Collection;

    })(BaseCollection);
    return {
      Model: Model,
      Collection: Collection
    };
  };
  return {
    Model: BaseModel,
    Collection: BaseCollection,
    generate: generate
  };
});
