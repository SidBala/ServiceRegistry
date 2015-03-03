var Config = require('..');
var log = require('log-colors');
var should = require('chai').should();

describe('Basic', function() {
	it('Register a service', function(done) {
		var config = new Config();

		// Some dummy service
		var serviceName = 'MyService';
		var serviceIp = '192.168.1.1';
		var servicePort = '80';
		var serviceTags = ['Production', 'Version-1.12.3'];

		config.Register(serviceName, serviceIp, servicePort, serviceTags)
			.then(function() {
					// Read directly from etcd the set key
					config.client.getAsync('MyService')
					.then(function(mesg) {
						var value = JSON.parse(mesg[0].node.value);

						value.name.should.equal(serviceName);
						value.ip.should.equal(serviceIp);
						value.port.should.equal(servicePort);
						value.tags.should.deep.equal(serviceTags);
					});
				})
			.then(done.bind(this,null));
	});

	it('Discover a service', function(done) {
		var config = new Config();
		config.Discover('MyService')
			.then(function(service) {
			})
			.then(done.bind(this, null));
	});
});
