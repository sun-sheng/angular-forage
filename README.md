#angular-forage
A Javascript library extend localforage with angular. You can set expire time when store data.  

## INSTALL
    bower install https://github.com/sun-sheng/angular-forage
## USE
Reference the file in your index.html (or where you include angular.js) after you include angular.js   
```html
<script src="path/to/bower_components/localforage/dist/localforage.nopromises.min.js"></script>
<script src="path/to/bower_components/angular/angular.min.js"></script>
<script src="path/to/bower_components/angular-forage/dist/angular-forage.min.js"></script>
```    
Include the module as a dependency in your angular.module
```javascript
angular.module('yourApp', ['ngForage']);
```    
Finally, using it:
```javascript
angular.module('yourApp').controller('YourCtrl', function( $scope, $forage ) {
  $forage.set('key', 'value');
  $forage.get('key').then(function (data) {
    //console.log(data);  
  }, function (err) {
    //console.log(err.message);
  });
});
```
## API
### $forage.set(key, data, expire_at)
### $forage.get(key)
### $forage.remove(key)
### $forage.clear()
### $forage.config(options)

