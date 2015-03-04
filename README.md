# ServiceRegistry
A library to manage service registry and discover over etcd.

## Expose a service
    var Registry = require('etcd-service-registry')
    var registry = new Registry()

    registry.Register( 'MyServiceName',      // Name that will be used by your clients
                       '10.244.1.105',       // IP that the service is bound to
                       '8080',               // Port that the service is bound to
                       ['Testing', 'V1.1'])  // Some metadata tags
    .then(...);
