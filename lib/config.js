var Etcd = require('node-etcd');
var Promise = require('bluebird');
var log = require('log-colors');

function Config(options) {
    this.Initialize(options);
}

Config.prototype.Initialize = function (options) {
    this.client = Promise.promisifyAll(new Etcd(options));
}

Config.prototype.Register = function (name, ip, port, tags) {
    var self = this;
    var key = name;
    
    // We want the tags to be always an array object (even if single valued or null)
    // TODO: Make this neater - maybe underscore has something for this?
    // null         => []
    // 'tag'        => ['tag']
    // ['tag1',...] => ['tag1',...]
    tags = tags
            ? Array.isArray(tags)
                ? [].concat(tags)
                : [tags]
            : [];

    var value = {
                    'name'    : name    || 'NamelessService',
                    'ip'      : ip      || '127.0.0.1',
                    'port'    : port    || '8080',
                    'tags'    : tags
                };

    log.info('Registering service: ' + value.name + ' @ ' + value.ip + ':' + value.port);
    value = JSON.stringify(value);

    return self.client.setAsync(name, value, {ttl: 10});
}

Config.prototype.Discover = function (name, tags) {
    var self = this;
    return self.client.getAsync(name)
           .then(self._parseMessage)
           .error(function(err){
                log.warn('Key does not exist. Watching for key');
                // Let's wait and watch for the key to show up.
                // This can happen in a complex cluster where service spin up ordering is not enforceable
                // TODO: Add timeout and recovery logic
                return self.client.watchAsync(name)
                    .then(self._parseMessage);
            });
}

Config.prototype._parseMessage = function(message) {
    var value = message[0].node.value;
    try {
        return JSON.parse(value);
    } catch(e) {
        return value;
    }
}

module.exports = Config;