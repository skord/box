"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('maxpanel-ember/adapters/application', ['exports', 'ember-data/adapters/json-api'], function (exports, _emberDataAdaptersJsonApi) {
  exports['default'] = _emberDataAdaptersJsonApi['default'].extend({
    namespace: 'api'
  });
});
define('maxpanel-ember/adapters/status', ['exports', 'ember', 'maxpanel-ember/adapters/application'], function (exports, _ember, _maxpanelEmberAdaptersApplication) {
   exports['default'] = _maxpanelEmberAdaptersApplication['default'].extend({
      pathForType: function pathForType(type) {
         var camelized = _ember['default'].String.camelize(type);
         return _ember['default'].String.singularize(camelized);
      }
   });
});
define('maxpanel-ember/app', ['exports', 'ember', 'maxpanel-ember/resolver', 'ember-load-initializers', 'maxpanel-ember/config/environment'], function (exports, _ember, _maxpanelEmberResolver, _emberLoadInitializers, _maxpanelEmberConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _maxpanelEmberConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _maxpanelEmberConfigEnvironment['default'].podModulePrefix,
    Resolver: _maxpanelEmberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _maxpanelEmberConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('maxpanel-ember/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'maxpanel-ember/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _maxpanelEmberConfigEnvironment) {

  var name = _maxpanelEmberConfigEnvironment['default'].APP.name;
  var version = _maxpanelEmberConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('maxpanel-ember/components/high-charts', ['exports', 'ember-highcharts/components/high-charts'], function (exports, _emberHighchartsComponentsHighCharts) {
  exports['default'] = _emberHighchartsComponentsHighCharts['default'];
});
define('maxpanel-ember/components/loading-slider', ['exports', 'ember'], function (exports, _ember) {
  var Component = _ember['default'].Component;
  var run = _ember['default'].run;
  var isBlank = _ember['default'].isBlank;
  var inject = _ember['default'].inject;
  var on = _ember['default'].on;
  exports['default'] = Component.extend({
    tagName: 'div',
    classNames: ['loading-slider'],
    classNameBindings: 'expanding',

    loadingSlider: inject.service(),

    init: function init() {
      this._super.apply(this, arguments);
      run.once(this, function () {
        this.get('loadingSlider').on('startLoading', this, this._startLoading);
        this.get('loadingSlider').on('endLoading', this, this._endLoading);
        this.get('loadingSlider').on('changeAttrs', this, this._changeAttrs);
      });
    },

    setAttrsThenManage: on('didReceiveAttrs', function () {
      this.setProperties({
        isLoading: this.getAttr('isLoading'),
        duration: this.getAttr('duration'),
        expanding: this.getAttr('expanding'),
        speed: this.getAttr('speed'),
        color: this.getAttr('color')
      });

      this.manage();
    }),

    willDestroy: function willDestroy() {
      run.once(this, function () {
        this.get('loadingSlider').off('startLoading', this, this._startLoading);
        this.get('loadingSlider').off('endLoading', this, this._endLoading);
        this.get('loadingSlider').off('changeAttrs', this, this._changeAttrs);
      });
    },

    _startLoading: function _startLoading() {
      this.set('isLoading', true);
      this.manage();
    },

    _endLoading: function _endLoading() {
      this.set('isLoading', false);
    },

    _changeAttrs: function _changeAttrs(attrs) {
      this.setProperties(attrs);
      this.manage();
    },

    manage: function manage() {
      if (isBlank(this.$())) {
        return;
      }

      if (this.get('isLoading')) {
        if (this.get('expanding')) {
          this.expandingAnimate.call(this);
        } else {
          this.animate.call(this);
        }
      } else {
        this.set('isLoaded', true);
      }
    },

    animate: function animate() {
      this.set('isLoaded', false);
      var self = this,
          elapsedTime = 0,
          inner = $('<span>'),
          outer = this.$(),
          duration = this.getWithDefault('duration', 300),
          innerWidth = 0,
          outerWidth = this.$().width(),
          stepWidth = Math.round(outerWidth / 50),
          color = this.get('color');

      outer.append(inner);
      if (color) {
        inner.css('background-color', color);
      }

      var interval = window.setInterval(function () {
        elapsedTime = elapsedTime + 10;
        inner.width(innerWidth = innerWidth + stepWidth);

        // slow the animation if we used more than 75% the estimated duration
        // or 66% of the animation width
        if (elapsedTime > duration * 0.75 || innerWidth > outerWidth * 0.66) {
          // don't stop the animation completely
          if (stepWidth > 1) {
            stepWidth = stepWidth * 0.97;
          }
        }

        if (innerWidth > outerWidth) {
          run.later(function () {
            outer.empty();
            window.clearInterval(interval);
          }, 50);
        }

        // the activity has finished
        if (self.get('isLoaded')) {
          // start with a sizable pixel step
          if (stepWidth < 10) {
            stepWidth = 10;
          }
          // accelerate to completion
          stepWidth = stepWidth + stepWidth;
        }
      }, 10);
    },

    expandingAnimate: function expandingAnimate() {
      var self = this,
          outer = this.$(),
          speed = this.getWithDefault('speed', 1000),
          colorQueue = this.get('color');

      if ('object' === typeof colorQueue) {
        (function updateFn() {
          var color = colorQueue.shift();
          colorQueue.push(color);
          self.expandItem.call(self, color);
          if (!self.get('isLoading')) {
            outer.empty();
          } else {
            window.setTimeout(updateFn, speed);
          }
        })();
      } else {
        this.expandItem.call(this, colorQueue, true);
      }
    },

    expandItem: function expandItem(color, cleanUp) {
      var self = this,
          inner = $('<span>').css({ 'background-color': color }),
          outer = this.$(),
          innerWidth = 0,
          outerWidth = outer.width(),
          stepWidth = Math.round(outerWidth / 50);
      var ua = window.navigator.userAgent;
      var ie10 = ua.indexOf("MSIE "),
          ie11 = ua.indexOf('Trident/'),
          ieEdge = ua.indexOf('Edge/');

      outer.append(inner);

      var interval = window.setInterval(function () {
        var step = innerWidth = innerWidth + stepWidth;
        if (innerWidth > outerWidth) {
          window.clearInterval(interval);
          if (cleanUp) {
            outer.empty();
          }
        }
        if (ie10 > 0 || ie11 > 0 || ieEdge > 0) {
          inner.css({
            'margin': '0 auto',
            'width': step
          });
        } else {
          inner.css({
            'margin-left': '-' + step / 2 + 'px',
            'width': step
          });
        }
      }, 10);
    },

    didInsertElement: function didInsertElement() {
      this.$().html('<span>');

      var color = this.get('color');
      if (color) {
        this.$('span').css('background-color', color);
      }

      if (this.get('runManageInitially')) {
        this._startLoading();
      }
    }
  });
});
define('maxpanel-ember/components/ui-accordion', ['exports', 'semantic-ui-ember/components/ui-accordion'], function (exports, _semanticUiEmberComponentsUiAccordion) {
  exports['default'] = _semanticUiEmberComponentsUiAccordion['default'];
});
define('maxpanel-ember/components/ui-checkbox', ['exports', 'semantic-ui-ember/components/ui-checkbox'], function (exports, _semanticUiEmberComponentsUiCheckbox) {
  exports['default'] = _semanticUiEmberComponentsUiCheckbox['default'];
});
define('maxpanel-ember/components/ui-dropdown-item', ['exports', 'semantic-ui-ember/components/ui-dropdown-item'], function (exports, _semanticUiEmberComponentsUiDropdownItem) {
  exports['default'] = _semanticUiEmberComponentsUiDropdownItem['default'];
});
define('maxpanel-ember/components/ui-dropdown', ['exports', 'semantic-ui-ember/components/ui-dropdown'], function (exports, _semanticUiEmberComponentsUiDropdown) {
  exports['default'] = _semanticUiEmberComponentsUiDropdown['default'];
});
define('maxpanel-ember/components/ui-embed', ['exports', 'semantic-ui-ember/components/ui-embed'], function (exports, _semanticUiEmberComponentsUiEmbed) {
  exports['default'] = _semanticUiEmberComponentsUiEmbed['default'];
});
define('maxpanel-ember/components/ui-modal', ['exports', 'semantic-ui-ember/components/ui-modal'], function (exports, _semanticUiEmberComponentsUiModal) {
  exports['default'] = _semanticUiEmberComponentsUiModal['default'];
});
define('maxpanel-ember/components/ui-nag', ['exports', 'semantic-ui-ember/components/ui-nag'], function (exports, _semanticUiEmberComponentsUiNag) {
  exports['default'] = _semanticUiEmberComponentsUiNag['default'];
});
define('maxpanel-ember/components/ui-popup', ['exports', 'semantic-ui-ember/components/ui-popup'], function (exports, _semanticUiEmberComponentsUiPopup) {
  exports['default'] = _semanticUiEmberComponentsUiPopup['default'];
});
define('maxpanel-ember/components/ui-progress', ['exports', 'semantic-ui-ember/components/ui-progress'], function (exports, _semanticUiEmberComponentsUiProgress) {
  exports['default'] = _semanticUiEmberComponentsUiProgress['default'];
});
define('maxpanel-ember/components/ui-radio', ['exports', 'semantic-ui-ember/components/ui-radio'], function (exports, _semanticUiEmberComponentsUiRadio) {
  exports['default'] = _semanticUiEmberComponentsUiRadio['default'];
});
define('maxpanel-ember/components/ui-rating', ['exports', 'semantic-ui-ember/components/ui-rating'], function (exports, _semanticUiEmberComponentsUiRating) {
  exports['default'] = _semanticUiEmberComponentsUiRating['default'];
});
define('maxpanel-ember/components/ui-search', ['exports', 'semantic-ui-ember/components/ui-search'], function (exports, _semanticUiEmberComponentsUiSearch) {
  exports['default'] = _semanticUiEmberComponentsUiSearch['default'];
});
define('maxpanel-ember/components/ui-shape', ['exports', 'semantic-ui-ember/components/ui-shape'], function (exports, _semanticUiEmberComponentsUiShape) {
  exports['default'] = _semanticUiEmberComponentsUiShape['default'];
});
define('maxpanel-ember/components/ui-sidebar', ['exports', 'semantic-ui-ember/components/ui-sidebar'], function (exports, _semanticUiEmberComponentsUiSidebar) {
  exports['default'] = _semanticUiEmberComponentsUiSidebar['default'];
});
define('maxpanel-ember/components/ui-sticky', ['exports', 'semantic-ui-ember/components/ui-sticky'], function (exports, _semanticUiEmberComponentsUiSticky) {
  exports['default'] = _semanticUiEmberComponentsUiSticky['default'];
});
define('maxpanel-ember/controllers/events/index', ['exports', 'ember'], function (exports, _ember) {
  // import defaultTheme from '../themes/default-theme';

  exports['default'] = _ember['default'].Controller.extend({
    chartOptions: _ember['default'].computed('model', function () {
      return {
        chart: {
          type: "column"
        },
        title: {
          text: "Events"
        },
        xAxis: {
          categories: this.get('model').mapBy('duration')
        },
        yAxis: {
          title: {
            text: 'Event Count'
          }
        }
      };
    }),

    chartData: _ember['default'].computed('model.@each.queued', function () {
      return [{
        name: 'Queued',
        data: this.get('model').mapBy('queued').map(function (i) {
          return +i;
        })
      }, {
        name: 'Executed',
        data: this.get('model').mapBy('executed').map(function (i) {
          return +i;
        })
      }];
    })

  });
});
define("maxpanel-ember/helpers/cellstate", ["exports", "ember"], function (exports, _ember) {
  exports.cellstate = cellstate;

  function cellstate(params /*, hash*/) {
    var downConditions = ["Stopped", "Down"];
    var upConditions = ["Running", "Master, Running", "GA"];
    var warningConditions = ["In Development", "Alpha"];
    if (downConditions.contains(params.toString())) {
      return "cell negative";
    } else if (upConditions.contains(params.toString())) {
      return "cell positive";
    } else if (warningConditions.contains(params.toString())) {
      return "cell warning";
    } else {
      return "cell";
    }
  }

  exports["default"] = _ember["default"].Helper.helper(cellstate);
});
define("maxpanel-ember/helpers/listener-row-state", ["exports", "ember"], function (exports, _ember) {
  exports.listenerRowState = listenerRowState;

  function listenerRowState(params /*, hash*/) {
    var downConditions = ["Stopped", "Down"];
    var warningConditions = ["In Development", "Alpha"];
    if (downConditions.contains(params.toString())) {
      return "row negative";
    } else if (warningConditions.contains(params.toString())) {
      return "row warning";
    } else {
      return "cell";
    }
  }

  exports["default"] = _ember["default"].Helper.helper(listenerRowState);
});
define('maxpanel-ember/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('maxpanel-ember/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('maxpanel-ember/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'maxpanel-ember/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _maxpanelEmberConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_maxpanelEmberConfigEnvironment['default'].APP.name, _maxpanelEmberConfigEnvironment['default'].APP.version)
  };
});
define('maxpanel-ember/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('maxpanel-ember/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).

    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('maxpanel-ember/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*

    This code initializes Ember-Data onto an Ember application.

    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.

    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.

    For example, imagine an Ember.js application with the following classes:

    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });

    App.PostsController = Ember.ArrayController.extend({
      // ...
    });

    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.

    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('maxpanel-ember/initializers/export-application-global', ['exports', 'ember', 'maxpanel-ember/config/environment'], function (exports, _ember, _maxpanelEmberConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_maxpanelEmberConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _maxpanelEmberConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_maxpanelEmberConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('maxpanel-ember/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).

    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('maxpanel-ember/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).

    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('maxpanel-ember/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).

    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("maxpanel-ember/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('maxpanel-ember/mixins/loading-slider', ['exports', 'ember'], function (exports, _ember) {
  var Mixin = _ember['default'].Mixin;
  var inject = _ember['default'].inject;
  var isPresent = _ember['default'].isPresent;
  exports['default'] = Mixin.create({
    loadingSlider: inject.service(),

    actions: {
      loading: function loading() {
        var loadingSliderService = this.get('loadingSlider');
        loadingSliderService.startLoading();
        if (isPresent(this.router)) {
          this.router.one('didTransition', function () {
            loadingSliderService.endLoading();
          });
        }
        if (this.get('bubbleLoadingSlider')) {
          return true;
        }
      },

      finished: function finished() {
        this.get('loadingSlider').endLoading();
      }
    }
  });
});
define('maxpanel-ember/models/client', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    session: _emberData['default'].attr('string'),
    client: _emberData['default'].attr('string'),
    service: _emberData['default'].attr('string'),
    state: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/event', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    duration: _emberData['default'].attr('string'),
    queued: _emberData['default'].attr('string'),
    executed: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/listener', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    protocolmodule: _emberData['default'].attr('string'),
    address: _emberData['default'].attr('string'),
    port: _emberData['default'].attr('string'),
    state: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/maxscale-session', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    session: _emberData['default'].attr('string'),
    client: _emberData['default'].attr('string'),
    service: _emberData['default'].attr('string'),
    state: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/module', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    type: _emberData['default'].attr('string'),
    version: _emberData['default'].attr('string'),
    apiversion: _emberData['default'].attr('string'),
    status: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/server', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    server: _emberData['default'].attr('string'),
    address: _emberData['default'].attr('string'),
    port: _emberData['default'].attr('string'),
    connections: _emberData['default'].attr('string'),
    status: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/service', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    router: _emberData['default'].attr('string'),
    sessions: _emberData['default'].attr('string'),
    totalsessions: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/status', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    value: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/models/variable', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    value: _emberData['default'].attr('string')
  });
});
define('maxpanel-ember/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('maxpanel-ember/router', ['exports', 'ember', 'maxpanel-ember/config/environment'], function (exports, _ember, _maxpanelEmberConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _maxpanelEmberConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('variables', function () {});
    this.route('status', function () {});
    this.route('services', function () {});
    this.route('listeners', function () {});
    this.route('modules', function () {});
    this.route('sessions');
    this.route('clients', function () {});
    this.route('servers', function () {});
    this.route('events', function () {});
    this.route('welcome', function () {});
    this.route('maxscale_sessions', function () {});

    this.route('event', function () {});
    this.route('maxscale_session');
  });

  exports['default'] = Router;
});
define('maxpanel-ember/routes/application', ['exports', 'ember', 'maxpanel-ember/mixins/loading-slider'], function (exports, _ember, _maxpanelEmberMixinsLoadingSlider) {
  exports['default'] = _ember['default'].Route.extend(_maxpanelEmberMixinsLoadingSlider['default'], {});
});
define('maxpanel-ember/routes/clients/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('client');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('client');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/events/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('event');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('event');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    redirect: function redirect() {
      this.transitionTo('welcome');
    }
  });
});
define('maxpanel-ember/routes/listeners/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('listener');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('listener');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/maxscale-sessions/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('maxscale-session');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('maxscale-session');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/modules/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('module');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('module');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/servers/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('server');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('server');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/services/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('service');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('service');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/status/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('status');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('status');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/variables/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('variable');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.startRefreshing();
    },
    startRefreshing: function startRefreshing() {
      this.set('refreshing', true);
      _ember['default'].run.later(this, this.refresh, 1000);
    },
    refresh: function refresh() {
      if (!this.get('refreshing')) {
        return;
      } else {
        this.store.findAll('variable');
        _ember['default'].run.later(this, this.refresh, 1000);
      }
    },
    actions: {
      willTransition: function willTransition() {
        this.set('refreshing', false);
      }
    }
  });
});
define('maxpanel-ember/routes/welcome/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('maxpanel-ember/serializers/client', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);
        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'session': normalizedKeys.session,
            'client': normalizedKeys.client,
            'service': normalizedKeys.service,
            'state': normalizedKeys.state
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/event', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'duration': normalizedKeys.duration,
            'queued': normalizedKeys.noEventsQueued,
            'executed': normalizedKeys.noEventsExecuted
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/listener', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'name': normalizedKeys.serviceName,
            'protocolmodule': normalizedKeys.protocolModule,
            'address': normalizedKeys.address,
            'port': normalizedKeys.port,
            'state': normalizedKeys.state
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/maxscale-session', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: normalizedKeys.session,
          type: primaryModelClass.modelName,
          attributes: {
            'session': normalizedKeys.session,
            'client': normalizedKeys.client,
            'service': normalizedKeys.service,
            'state': normalizedKeys.state
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/module', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'name': normalizedKeys.moduleName,
            'type': normalizedKeys.moduleType,
            'version': normalizedKeys.version,
            'apiversion': normalizedKeys.apiVersion,
            'status': normalizedKeys.status
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/server', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'server': normalizedKeys.server,
            'address': normalizedKeys.address,
            'port': normalizedKeys.port,
            'connections': normalizedKeys.connections,
            'status': normalizedKeys.status
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/service', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'name': normalizedKeys.serviceName,
            'router': normalizedKeys.routerModule,
            'sessions': normalizedKeys.noSessions,
            'totalsessions': normalizedKeys.totalSessions
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/status', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'name': normalizedKeys.variableName,
            'value': normalizedKeys.value
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/serializers/variable', ['exports', 'ember', 'ember-data/serializers/json-api', 'npm:camelcase-keys'], function (exports, _ember, _emberDataSerializersJsonApi, _npmCamelcaseKeys) {
  exports['default'] = _emberDataSerializersJsonApi['default'].extend({
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      var clientsCollection = payload;
      var dataCollection = [];
      _ember['default'].$.map(clientsCollection, function (client, i) {
        var normalizedKeys = (0, _npmCamelcaseKeys['default'])(client);

        var entry = {
          id: i,
          type: primaryModelClass.modelName,
          attributes: {
            'name': normalizedKeys.variableName,
            'value': normalizedKeys.value
          }
        };
        dataCollection.push(entry);
      });
      var response = {
        data: dataCollection
      };
      return this._super(store, primaryModelClass, response, id, requestType);
    }
  });
});
define('maxpanel-ember/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('maxpanel-ember/services/loading-slider', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var Evented = _ember['default'].Evented;
  exports['default'] = Service.extend(Evented, {
    startLoading: function startLoading() {
      this.trigger('startLoading');
    },

    endLoading: function endLoading() {
      this.trigger('endLoading');
    },

    changeAttrs: function changeAttrs(attrs) {
      this.trigger('changeAttrs', attrs);
    }
  });
});
define("maxpanel-ember/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 4,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("b");
          var el2 = dom.createTextNode("MaxPanel");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 2
            },
            "end": {
              "line": 7,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Variables\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 2
            },
            "end": {
              "line": 10,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Status\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 2
            },
            "end": {
              "line": 13,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Services\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 2
            },
            "end": {
              "line": 16,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Listeners\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 2
            },
            "end": {
              "line": 19,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Modules\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child6 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 2
            },
            "end": {
              "line": 22,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Sessions\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child7 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 2
            },
            "end": {
              "line": 25,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Clients\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child8 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 26,
              "column": 2
            },
            "end": {
              "line": 28,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Servers\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child9 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 2
            },
            "end": {
              "line": 31,
              "column": 2
            }
          },
          "moduleName": "maxpanel-ember/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Events\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 43,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "ui top fixed  inverted blue menu");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" <div class=\"right menu\">\n    <div class=\"ui input\">\n    {{ input  placeholder=\"http://localhost:8003\"}}\n    </div>\n  </div> ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "main-content");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(fragment, [2]);
        var morphs = new Array(12);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 2, 2);
        morphs[2] = dom.createMorphAt(element0, 3, 3);
        morphs[3] = dom.createMorphAt(element0, 4, 4);
        morphs[4] = dom.createMorphAt(element0, 5, 5);
        morphs[5] = dom.createMorphAt(element0, 6, 6);
        morphs[6] = dom.createMorphAt(element0, 7, 7);
        morphs[7] = dom.createMorphAt(element0, 8, 8);
        morphs[8] = dom.createMorphAt(element0, 9, 9);
        morphs[9] = dom.createMorphAt(element0, 10, 10);
        morphs[10] = dom.createMorphAt(element1, 1, 1);
        morphs[11] = dom.createMorphAt(element1, 3, 3);
        return morphs;
      },
      statements: [["block", "link-to", ["index"], ["class", "item"], 0, null, ["loc", [null, [2, 2], [4, 14]]]], ["block", "link-to", ["variables.index"], ["class", "item"], 1, null, ["loc", [null, [5, 2], [7, 14]]]], ["block", "link-to", ["status.index"], ["class", "item"], 2, null, ["loc", [null, [8, 2], [10, 14]]]], ["block", "link-to", ["services.index"], ["class", "item"], 3, null, ["loc", [null, [11, 2], [13, 14]]]], ["block", "link-to", ["listeners.index"], ["class", "item"], 4, null, ["loc", [null, [14, 2], [16, 14]]]], ["block", "link-to", ["modules.index"], ["class", "item"], 5, null, ["loc", [null, [17, 2], [19, 14]]]], ["block", "link-to", ["maxscale_sessions.index"], ["class", "item"], 6, null, ["loc", [null, [20, 2], [22, 14]]]], ["block", "link-to", ["clients.index"], ["class", "item"], 7, null, ["loc", [null, [23, 2], [25, 14]]]], ["block", "link-to", ["servers.index"], ["class", "item"], 8, null, ["loc", [null, [26, 2], [28, 14]]]], ["block", "link-to", ["events.index"], ["class", "item"], 9, null, ["loc", [null, [29, 2], [31, 14]]]], ["content", "outlet", ["loc", [null, [40, 2], [40, 12]]]], ["inline", "loading-slider", [], ["isLoading", ["subexpr", "@mut", [["get", "loading", ["loc", [null, [41, 29], [41, 36]]]]], [], []], "duration", 250], ["loc", [null, [41, 2], [41, 51]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8, child9]
    };
  })());
});
define("maxpanel-ember/templates/clients/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 19,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/clients/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          return morphs;
        },
        statements: [["content", "client.session", ["loc", [null, [14, 12], [14, 30]]]], ["content", "client.client", ["loc", [null, [15, 12], [15, 29]]]], ["content", "client.service", ["loc", [null, [16, 12], [16, 30]]]], ["content", "client.state", ["loc", [null, [17, 12], [17, 28]]]]],
        locals: ["client"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 26,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/clients/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Clients");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Session");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Client");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Service");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("State");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [12, 12], [12, 17]]]]], [], 0, null, ["loc", [null, [12, 4], [19, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/components/high-charts", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/components/high-charts.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("maxpanel-ember/templates/components/ui-checkbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/components/ui-checkbox.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("input");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("label");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        if (this.cachedFragment) {
          dom.repairClonedNode(element0, [], true);
        }
        var morphs = new Array(6);
        morphs[0] = dom.createAttrMorph(element0, 'type');
        morphs[1] = dom.createAttrMorph(element0, 'name');
        morphs[2] = dom.createAttrMorph(element0, 'checked');
        morphs[3] = dom.createAttrMorph(element0, 'disabled');
        morphs[4] = dom.createAttrMorph(element0, 'data-id');
        morphs[5] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        return morphs;
      },
      statements: [["attribute", "type", ["get", "type", ["loc", [null, [1, 14], [1, 18]]]]], ["attribute", "name", ["get", "name", ["loc", [null, [1, 28], [1, 32]]]]], ["attribute", "checked", ["get", "checked", ["loc", [null, [1, 45], [1, 52]]]]], ["attribute", "disabled", ["get", "readonly", ["loc", [null, [1, 66], [1, 74]]]]], ["attribute", "data-id", ["get", "data-id", ["loc", [null, [1, 87], [1, 94]]]]], ["content", "label", ["loc", [null, [2, 7], [2, 16]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("maxpanel-ember/templates/components/ui-dropdown", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/components/ui-dropdown.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("maxpanel-ember/templates/components/ui-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/components/ui-modal.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("maxpanel-ember/templates/components/ui-radio", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/components/ui-radio.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("input");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("label");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        if (this.cachedFragment) {
          dom.repairClonedNode(element0, [], true);
        }
        var morphs = new Array(6);
        morphs[0] = dom.createAttrMorph(element0, 'type');
        morphs[1] = dom.createAttrMorph(element0, 'name');
        morphs[2] = dom.createAttrMorph(element0, 'checked');
        morphs[3] = dom.createAttrMorph(element0, 'disabled');
        morphs[4] = dom.createAttrMorph(element0, 'data-id');
        morphs[5] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        return morphs;
      },
      statements: [["attribute", "type", ["get", "type", ["loc", [null, [1, 14], [1, 18]]]]], ["attribute", "name", ["get", "name", ["loc", [null, [1, 28], [1, 32]]]]], ["attribute", "checked", ["get", "checked", ["loc", [null, [1, 45], [1, 52]]]]], ["attribute", "disabled", ["get", "readonly", ["loc", [null, [1, 66], [1, 74]]]]], ["attribute", "data-id", ["get", "data-id", ["loc", [null, [1, 87], [1, 94]]]]], ["content", "label", ["loc", [null, [2, 7], [2, 16]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("maxpanel-ember/templates/events/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 18,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/events/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          return morphs;
        },
        statements: [["content", "event.duration", ["loc", [null, [14, 12], [14, 30]]]], ["content", "event.queued", ["loc", [null, [15, 12], [15, 28]]]], ["content", "event.executed", ["loc", [null, [16, 12], [16, 30]]]]],
        locals: ["event"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/events/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Event Times");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Duration");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("No. Events Queued");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("No. Events Executed");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [4, 3]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "high-charts", [], ["chartOptions", ["subexpr", "@mut", [["get", "chartOptions", ["loc", [null, [1, 27], [1, 39]]]]], [], []], "content", ["subexpr", "@mut", [["get", "chartData", ["loc", [null, [1, 48], [1, 57]]]]], [], []], "theme", ["subexpr", "@mut", [["get", "theme", ["loc", [null, [1, 64], [1, 69]]]]], [], []]], ["loc", [null, [1, 0], [1, 71]]]], ["block", "each", [["get", "model", ["loc", [null, [12, 12], [12, 17]]]]], [], 0, null, ["loc", [null, [12, 4], [18, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/listeners/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 4
            },
            "end": {
              "line": 21,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/listeners/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [9]);
          var morphs = new Array(7);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          morphs[5] = dom.createAttrMorph(element1, 'class');
          morphs[6] = dom.createMorphAt(element1, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["subexpr", "listenerRowState", [["get", "listener.state", ["loc", [null, [14, 36], [14, 50]]]]], [], ["loc", [null, [14, 16], [14, 53]]]]], ["content", "listener.name", ["loc", [null, [15, 12], [15, 29]]]], ["content", "listener.protocolmodule", ["loc", [null, [16, 12], [16, 39]]]], ["content", "listener.address", ["loc", [null, [17, 12], [17, 32]]]], ["content", "listener.port", ["loc", [null, [18, 12], [18, 29]]]], ["attribute", "class", ["concat", [["subexpr", "cellstate", [["get", "listener.state", ["loc", [null, [19, 31], [19, 45]]]]], [], ["loc", [null, [19, 19], [19, 47]]]]]]], ["content", "listener.state", ["loc", [null, [19, 49], [19, 67]]]]],
        locals: ["listener"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/listeners/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Listeners");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Service Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Protocol Module");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Address");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Port");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("State");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [13, 12], [13, 17]]]]], [], 0, null, ["loc", [null, [13, 4], [21, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/maxscale-sessions/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 19,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/maxscale-sessions/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          return morphs;
        },
        statements: [["content", "session.session", ["loc", [null, [14, 12], [14, 31]]]], ["content", "session.client", ["loc", [null, [15, 12], [15, 30]]]], ["content", "session.service", ["loc", [null, [16, 12], [16, 31]]]], ["content", "session.state", ["loc", [null, [17, 12], [17, 29]]]]],
        locals: ["session"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 26,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/maxscale-sessions/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Sessions");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Session");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Client");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Service");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("State");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [12, 12], [12, 17]]]]], [], 0, null, ["loc", [null, [12, 4], [19, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/modules/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 4
            },
            "end": {
              "line": 21,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/modules/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [9]);
          var morphs = new Array(7);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          morphs[5] = dom.createAttrMorph(element1, 'class');
          morphs[6] = dom.createMorphAt(element1, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["subexpr", "listenerRowState", [["get", "module.status", ["loc", [null, [14, 36], [14, 49]]]]], [], ["loc", [null, [14, 16], [14, 52]]]]], ["content", "module.name", ["loc", [null, [15, 12], [15, 27]]]], ["content", "module.type", ["loc", [null, [16, 12], [16, 27]]]], ["content", "module.version", ["loc", [null, [17, 12], [17, 30]]]], ["content", "module.apiversion", ["loc", [null, [18, 12], [18, 33]]]], ["attribute", "class", ["subexpr", "cellstate", [["get", "module.status", ["loc", [null, [19, 31], [19, 44]]]]], [], ["loc", [null, [19, 18], [19, 47]]]]], ["content", "module.status", ["loc", [null, [19, 48], [19, 65]]]]],
        locals: ["module"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/modules/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Modules");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Module Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Module Type");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Version");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("API Version");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Status");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [13, 12], [13, 17]]]]], [], 0, null, ["loc", [null, [13, 4], [21, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/servers/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 4
            },
            "end": {
              "line": 21,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/servers/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [9]);
          var morphs = new Array(7);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          morphs[5] = dom.createAttrMorph(element1, 'class');
          morphs[6] = dom.createMorphAt(element1, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["subexpr", "listenerRowState", [["get", "server.status", ["loc", [null, [14, 36], [14, 49]]]]], [], ["loc", [null, [14, 16], [14, 51]]]]], ["content", "server.server", ["loc", [null, [15, 12], [15, 29]]]], ["content", "server.address", ["loc", [null, [16, 12], [16, 30]]]], ["content", "server.port", ["loc", [null, [17, 12], [17, 27]]]], ["content", "server.connections", ["loc", [null, [18, 12], [18, 34]]]], ["attribute", "class", ["subexpr", "cellstate", [["get", "server.status", ["loc", [null, [19, 30], [19, 43]]]]], [], ["loc", [null, [19, 18], [19, 45]]]]], ["content", "server.status", ["loc", [null, [19, 46], [19, 63]]]]],
        locals: ["server"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/servers/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Servers");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Server");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Address");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Port");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Connections");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Status");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [13, 12], [13, 17]]]]], [], 0, null, ["loc", [null, [13, 4], [21, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/services/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 19,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/services/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]), 0, 0);
          return morphs;
        },
        statements: [["content", "service.name", ["loc", [null, [14, 12], [14, 28]]]], ["content", "service.router", ["loc", [null, [15, 12], [15, 30]]]], ["content", "service.sessions", ["loc", [null, [16, 12], [16, 32]]]], ["content", "service.totalsessions", ["loc", [null, [17, 12], [17, 37]]]]],
        locals: ["service"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 26,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/services/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Services");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Service Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Value");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Num Sessions");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Total Sessions");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [12, 12], [12, 17]]]]], [], 0, null, ["loc", [null, [12, 4], [19, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/status/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 4
            },
            "end": {
              "line": 15,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/status/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          return morphs;
        },
        statements: [["content", "status.name", ["loc", [null, [12, 12], [12, 27]]]], ["content", "status.value", ["loc", [null, [13, 12], [13, 28]]]]],
        locals: ["status"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/status/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Status");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Variable Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Value");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [10, 12], [10, 17]]]]], [], 0, null, ["loc", [null, [10, 4], [15, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/variables/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.5.1",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 4
            },
            "end": {
              "line": 15,
              "column": 4
            }
          },
          "moduleName": "maxpanel-ember/templates/variables/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          return morphs;
        },
        statements: [["content", "variable.name", ["loc", [null, [12, 12], [12, 29]]]], ["content", "variable.value", ["loc", [null, [13, 12], [13, 30]]]]],
        locals: ["variable"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/variables/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Variables");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "ui celled table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Variable Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Value");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [10, 12], [10, 17]]]]], [], 0, null, ["loc", [null, [10, 4], [15, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("maxpanel-ember/templates/welcome/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.5.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "maxpanel-ember/templates/welcome/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Welcome to MaxPanel");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('maxpanel-ember/config/environment', ['ember'], function(Ember) {
  var prefix = 'maxpanel-ember';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("maxpanel-ember/app")["default"].create({"name":"maxpanel-ember","version":"0.0.0+896a8276"});
}

/* jshint ignore:end */
//# sourceMappingURL=maxpanel-ember.map
