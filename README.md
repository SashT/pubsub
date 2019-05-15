# PUBSUB
Custom js event manager.

```javascript

import PubSub from 'hub';

const Hub = new PubSub(debug);

Hub.subscribe('my.event.name',function(data){ console.log(data); });

Hub.subscribeOnce('my.event.name',function(data){ console.log(data); });

Hub.publish('my.event.name',{someData:true});

```
