var Kirra = require("./kirra-client.js");
var helpers = require('./helpers.js');
var util = require('util');
var q = require('q');

var assert = require("assert");
var user = process.env.KIRRA_USER || 'test';
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
var kirra = new Kirra(kirraApiUrl);

var createInstance = function(entityName, values) {
    var entity;
    return kirra.getExactEntity(entityName).then(function(fetchedEntity) {
        entity = fetchedEntity;
        return kirra.performRequestOnURL(entity.templateUri, null, 200);
    }).then(function(template) {
        var toCreate = helpers.merge(template, values);
        return kirra.performRequestOnURL(entity.extentUri, 'POST', 201, toCreate);
    });
};

var createShift = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.description = values.description || "description-value";
    toCreate.price = values.price || 0;
    return createInstance('taxi_fleet.Shift', toCreate);
};

var createTaxi = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createShift().then(function(requiredInstance) {
            toCreate.shift = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('taxi_fleet.Taxi', toCreate);
    });
    return promise;
};

var createDriver = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('taxi_fleet.Driver', toCreate);
};

var createCharge = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    return createInstance('taxi_fleet.Charge', toCreate);
};

suite('Taxi fleet CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('Shift', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('taxi_fleet.Shift').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "taxi_fleet.Shift");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createShift().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Taxi', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('taxi_fleet.Taxi').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "taxi_fleet.Taxi");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createTaxi().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Driver', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('taxi_fleet.Driver').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "taxi_fleet.Driver");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createDriver().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Charge', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('taxi_fleet.Charge').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "taxi_fleet.Charge");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createCharge().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
});    
