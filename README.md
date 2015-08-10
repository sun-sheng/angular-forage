#angular-forage
A Javascript library extend localforage with angular. You can set expire time when store data.  

## INSTALL
    bower install https://github.com/sun-sheng/angular-forage
## USE
Reference these files in your index.html  
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
### $forage.set(key, data, \[expire\_at\])
<table>
    <thead>
    <tr>
        <th>Param</th>
        <th>Type</th>
        <th>Detail</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>key</td>
        <td>string</td>
        <td></td>
    </tr>
    <tr>
        <td>data</td>
        <td>object</td>
        <td></td>
    </tr>
    <tr>
        <td>expire\_at</td>
        <td>number</td>
        <td>expire timestamp;optional parameter,if not set will use the forage default option (Date.now() + defaultExpireTimeout)</td>
    </tr>
    </tbody>
</table>
### $forage.get(key)
### $forage.remove(key)
### $forage.clear()
### $forage.config(options)
<table>
    <thead>
    <tr>
        <th>Param</th>
        <th>Type</th>
        <th>Detail</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>prefix</td>
        <td>string</td>
        <td></td>
    </tr>
    <tr>
        <td>defaultExpireTimeout</td>
        <td>number</td>
        <td></td>
    </tr>
    <tr>
        <td>driver</td>
        <td>array</td>
        <td>for localforage</td>
    </tr>
    <tr>
        <td>errorHandler</td>
        <td>function</td>
        <td>set custom error handler</td>
    </tr>
    </tbody>
</table>
