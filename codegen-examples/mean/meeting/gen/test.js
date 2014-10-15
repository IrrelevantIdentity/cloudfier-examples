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
    return createInstance('meeting.User', toCreate);
};

var createMeeting = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.title = values.title || "title-value";
    toCreate.description = values.description || "description-value";
    toCreate.date = values.date || new Date();
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createUser().then(function(requiredInstance) {
            toCreate.organizer = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('meeting.Meeting', toCreate);
    });
    return promise;
};

var createPresentation = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.title = values.title || "title-value";
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createUser().then(function(requiredInstance) {
            toCreate.author = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createMeeting().then(function(requiredInstance) {
            toCreate.meeting = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('meeting.Presentation', toCreate);
    });
    return promise;
};

suite('Meeting CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('User', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('meeting.User').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "meeting.User");
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
    
    
    suite('Meeting', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('meeting.Meeting').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "meeting.Meeting");
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
            createMeeting().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Presentation', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('meeting.Presentation').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "meeting.Presentation");
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
            createPresentation().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
});    
