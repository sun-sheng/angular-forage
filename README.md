#angular-forage
**toastr** is a Javascript library extend localforage with angular. You can set expire time when store data.  

### USE
    angular.module('app', ['ngForage']).run(function($forage){//use $forage});
### API
#### $forage.set(key, data, expire_at);
#### $forage.get(key);
#### $forage.remove(key);
#### $forage.clear();
#### $forage.config(options);