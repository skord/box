define('maxpanel-ember/tests/adapters/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | adapters/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/adapters/status.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | adapters/status.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/status.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/controllers/events/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | controllers/events/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/events/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('maxpanel-ember/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'maxpanel-ember/tests/helpers/start-app', 'maxpanel-ember/tests/helpers/destroy-app'], function (exports, _qunit, _maxpanelEmberTestsHelpersStartApp, _maxpanelEmberTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _maxpanelEmberTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }

        (0, _maxpanelEmberTestsHelpersDestroyApp['default'])(this.application);
      }
    });
  };
});
define('maxpanel-ember/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/helpers/resolver', ['exports', 'maxpanel-ember/resolver', 'maxpanel-ember/config/environment'], function (exports, _maxpanelEmberResolver, _maxpanelEmberConfigEnvironment) {

  var resolver = _maxpanelEmberResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _maxpanelEmberConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _maxpanelEmberConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('maxpanel-ember/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/helpers/start-app', ['exports', 'ember', 'maxpanel-ember/app', 'maxpanel-ember/config/environment'], function (exports, _ember, _maxpanelEmberApp, _maxpanelEmberConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _maxpanelEmberConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _maxpanelEmberApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('maxpanel-ember/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/client.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/client.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/client.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/event.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/event.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/event.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/listener.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/listener.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/listener.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/maxscale-session.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/maxscale-session.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/maxscale-session.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/module.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/module.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/module.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/server.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/server.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/server.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/service.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/service.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/service.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/status.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/status.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/status.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/models/variable.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/variable.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/variable.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/clients/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/clients/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/clients/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/events/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/events/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/events/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/listeners/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/listeners/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/listeners/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/maxscale-sessions/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/maxscale-sessions/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/maxscale-sessions/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/modules/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/modules/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/modules/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/servers/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/servers/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/servers/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/services/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/services/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/services/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/status/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/status/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/status/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/variables/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/variables/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/variables/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/routes/welcome/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/welcome/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/welcome/index.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/client.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/client.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/client.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/event.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/event.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/event.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/listener.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/listener.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/listener.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/maxscale-session.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/maxscale-session.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'serializers/maxscale-session.js should pass jshint.\nserializers/maxscale-session.js: line 9, col 53, \'i\' is defined but never used.\n\n1 error');
  });
});
define('maxpanel-ember/tests/serializers/module.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/module.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/module.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/server.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/server.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/server.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/service.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/service.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/service.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/status.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/status.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/status.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/serializers/variable.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | serializers/variable.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/variable.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/test-helper', ['exports', 'maxpanel-ember/tests/helpers/resolver', 'ember-qunit'], function (exports, _maxpanelEmberTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_maxpanelEmberTestsHelpersResolver['default']);
});
define('maxpanel-ember/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/adapters/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('maxpanel-ember/tests/unit/adapters/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/adapters/application-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/adapters/status-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('adapter:status', 'Unit | Adapter | status', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('maxpanel-ember/tests/unit/adapters/status-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/adapters/status-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/status-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/controllers/events/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:events/index', 'Unit | Controller | events/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('maxpanel-ember/tests/unit/controllers/events/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/events/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/events/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/client-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('client', 'Unit | Model | client', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/client-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/client-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/client-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/clients-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('clients', 'Unit | Model | clients', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/clients-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/clients-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/clients-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/event-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('event', 'Unit | Model | event', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/event-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/event-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/event-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/listener-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('listener', 'Unit | Model | listener', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/listener-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/listener-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/listener-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/maxscale-session-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('maxscale-session', 'Unit | Model | maxscale session', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/maxscale-session-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/maxscale-session-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/maxscale-session-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/module-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('module', 'Unit | Model | module', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/module-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/module-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/module-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/server-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('server', 'Unit | Model | server', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/server-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/server-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/server-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/service-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('service', 'Unit | Model | service', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/service-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/service-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/service-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/status-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('status', 'Unit | Model | status', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/status-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/status-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/status-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/models/variable-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('variable', 'Unit | Model | variable', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('maxpanel-ember/tests/unit/models/variable-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/variable-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/variable-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/client-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:client', 'Unit | Route | client', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/client-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/client-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/client-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/clients/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:clients/index', 'Unit | Route | clients/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/clients/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/clients/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/clients/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/events/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:events/index', 'Unit | Route | events/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/events/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/events/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/events/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/listeners/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:listeners/index', 'Unit | Route | listeners/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/listeners/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/listeners/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/listeners/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/maxscale-sessions/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:maxscale-sessions/index', 'Unit | Route | maxscale sessions/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/maxscale-sessions/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/maxscale-sessions/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/maxscale-sessions/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/modules/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:modules/index', 'Unit | Route | modules/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/modules/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/modules/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/modules/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/servers/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:servers/index', 'Unit | Route | servers/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/servers/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/servers/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/servers/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/services/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:services/index', 'Unit | Route | services/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/services/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/services/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/services/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/status/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:status/index', 'Unit | Route | status/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/status/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/status/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/status/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/variables/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:variables/index', 'Unit | Route | variables/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/variables/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/variables/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/variables/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/routes/welcome/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:welcome/index', 'Unit | Route | welcome/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('maxpanel-ember/tests/unit/routes/welcome/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/welcome/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/welcome/index-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('application', 'Unit | Serializer | application', {
    // Specify the other units that are required for this test.
    needs: ['serializer:application']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/application-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/application-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/clients-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('clients', 'Unit | Serializer | clients', {
    // Specify the other units that are required for this test.
    needs: ['serializer:clients']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/clients-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/clients-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/clients-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/event-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('event', 'Unit | Serializer | event', {
    // Specify the other units that are required for this test.
    needs: ['serializer:event']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/event-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/event-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/event-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/listener-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('listener', 'Unit | Serializer | listener', {
    // Specify the other units that are required for this test.
    needs: ['serializer:listener']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/listener-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/listener-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/listener-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/maxscale-session-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('maxscale-session', 'Unit | Serializer | maxscale session', {
    // Specify the other units that are required for this test.
    needs: ['serializer:maxscale-session']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/maxscale-session-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/maxscale-session-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/maxscale-session-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/module-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('module', 'Unit | Serializer | module', {
    // Specify the other units that are required for this test.
    needs: ['serializer:module']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/module-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/module-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/module-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/server-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('server', 'Unit | Serializer | server', {
    // Specify the other units that are required for this test.
    needs: ['serializer:server']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/server-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/server-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/server-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/service-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('service', 'Unit | Serializer | service', {
    // Specify the other units that are required for this test.
    needs: ['serializer:service']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/service-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/service-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/service-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/status-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('status', 'Unit | Serializer | status', {
    // Specify the other units that are required for this test.
    needs: ['serializer:status']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/status-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/status-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/status-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/serializers/variable-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('variable', 'Unit | Serializer | variable', {
    // Specify the other units that are required for this test.
    needs: ['serializer:variable']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('maxpanel-ember/tests/unit/serializers/variable-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/serializers/variable-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/variable-test.js should pass jshint.');
  });
});
define('maxpanel-ember/tests/unit/services/ajax-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:ajax', 'Unit | Service | ajax', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('maxpanel-ember/tests/unit/services/ajax-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/services/ajax-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/ajax-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('maxpanel-ember/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map