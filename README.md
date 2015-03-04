# ServiceRegistry
A library to manage service registry and discover over etcd.

## Connect to etcd
```js
var Registry = require('etcd-service-registry')

var registry = new Registry()
var registry = new Registry('127.0.0.1', '4001')
```

## Register a service

```js
registry.Register('MyServiceName',      // Name that will be used by your clients
                  '10.244.1.105',       // IP that the service is bound to
                  '8080',               // Port that the service is bound to
                  ['Testing', 'V1.1'])  // Some metadata tags
.then(...);
```

## Discover a service

A call to Discover will not fulfill until the required service has been registered into etcd. You will need a connection to etcd and the ip of your bound host.

In the common use case where your service is a docker container on top of CoreOS/Fleet, you will need to connect to the etcd endpoint at 172.17.42.1. You will determine your own ip/port by passing them as parameters in your fleet service definition.

```js
var Registry = require('etcd-service-registry')
var registry = new Registry()

registry.Discover('MyServiceName')
.then(function(service) {
        console.log(util.inspect(service));
    });

// {
//    name: 'MyServiceName',
//    ip: '10.244.1.105',
//    port: '8080'
//    tags: ['Testing', 'V1.1']
// }
```

## Discover several services at once

A call to DiscoverAll will not fulfill until all the services specified have been registered into etcd.

```js
var Registry = require('etcd-service-registry')
var registry = new Registry()

registry.DiscoverAll(['ServiceA', 'ServiceB'])
.then(function(services) {
        console.log(util.inspect(services));
    });

// { 
//     ServiceA:
//     { 
//        name: 'ServiceA',
//        ip: '192.168.1.1',
//        port: '80',
//        tags: [ 'Production', 'Version-1.12.3' ]
//     },
//     ServiceB:
//     {
//        name: 'ServiceB',
//        ip: '192.168.1.2',
//        port: '81',
//        tags: [ 'Production', 'Version-1.12.4' ]
//     }
// }
```
