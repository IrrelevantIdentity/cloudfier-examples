
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - InvoiceScenarios', function() {
    this.timeout(10000);

    test('issueInvoice', function(done) {
        var behavior = function() {
            var invoice;
            var work;
            var client;
            return q().then(function() {
                return q().then(function() {
                    return q().then(function() {
                        return Examples.client();
                    }).then(function(call_client) {
                        client = call_client;
                    });
                }).then(function() {
                    return q().then(function() {
                        return client.newTask("Some task");
                    }).then(function(call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(call_addWork) {
                        work = call_addWork;
                    });
                }).then(function() {
                    return q().then(function() {
                        return client.startInvoice();
                    }).then(function(call_startInvoice) {
                        invoice = call_startInvoice;
                    });
                }).then(function() {
                    return q().then(function() {
                        work.submit(invoice);
                    });
                }).then(function() {
                    return q().then(function() {
                        assert.equal("Preparation", invoice['status']);
                    });
                }).then(function() {
                    return q().then(function() {
                        invoice.issue();
                    });
                });
            }).then(function() {
                return q().then(function() {
                    assert.equal("Invoiced", invoice['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('invoicePaid', function(done) {
        var behavior = function() {
            var invoice;
            return q().then(function() {
                return q().then(function() {
                    return q().then(function() {
                        return Examples.client();
                    }).then(function(call_client) {
                        return call_client.startInvoice();
                    }).then(function(call_startInvoice) {
                        invoice = call_startInvoice;
                    });
                }).then(function() {
                    return q().then(function() {
                        return Client.find({ _id : invoice.client }).exec();
                    }).then(function(read_client) {
                        return read_client.newTask("Some task");
                    }).then(function(call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(call_addWork) {
                        call_addWork.submit(invoice);
                    });
                }).then(function() {
                    return q().then(function() {
                        invoice.issue();
                    });
                }).then(function() {
                    return q().then(function() {
                        invoice.invoicePaid();
                    });
                });
            }).then(function() {
                return q().then(function() {
                    assert.equal("Received", invoice['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        try {
            var behavior = function() {
                var task;
                var invoice;
                var work;
                return q().then(function() {
                    return q().then(function() {
                        return q().then(function() {
                            return Examples.task();
                        }).then(function(call_task) {
                            task = call_task;
                        });
                    }).then(function() {
                        return q().then(function() {
                            return Client.find({ _id : task.client }).exec();
                        }).then(function(read_client) {
                            return read_client.startInvoice();
                        }).then(function(call_startInvoice) {
                            invoice = call_startInvoice;
                        });
                    }).then(function() {
                        return q().then(function() {
                            return task.addWork(1);
                        }).then(function(call_addWork) {
                            call_addWork.submit(invoice);
                        });
                    }).then(function() {
                        return q().then(function() {
                            invoice.issue();
                        });
                    });
                }).then(function() {
                    return q().then(function() {
                        return task.addWork(2);
                    }).then(function(call_addWork) {
                        call_addWork.submit(invoice);
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        try {
            var behavior = function() {
                return q().then(function() {
                    return Examples.client();
                }).then(function(call_client) {
                    return call_client.startInvoice();
                }).then(function(call_startInvoice) {
                    call_startInvoice.issue();
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

