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

var createUser = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('todo.User', toCreate);
};

var createTodo = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.description = values.description || "description-value";
    toCreate.details = values.details || "details-value";
    return createInstance('todo.Todo', toCreate);
};

suite('Todo CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('User', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('todo.User').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "todo.User");
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
            createUser().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Todo', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('todo.Todo').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "todo.Todo");
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
            createTodo().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
});    
