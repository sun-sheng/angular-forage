;
angular.module('ngForage', []).provider('$forage', function () {

  var forage_config = {
    defaultExpireTime: 9999999999999,
    transformError: function (err) {
      return err;
    },
    driver: [
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE
    ]
  };

  var FORAGE_ERROR = {
    UNKNOWN: {
      code: 'forage_unknown_exception',
      message: '数据缓存未知异常'
    },
    SET: {
      code: 'forage_set_exception',
      message: '添加数据缓存失败'
    },
    GET: {
      code: 'forage_get_exception',
      message: '获取数据缓存失败'
    },
    REMOVE: {
      code: 'forage_remove_exception',
      message: '删除数据缓存失败'
    },
    CLEAR: {
      code: 'forage_clear_exception',
      message: '清除数据缓存失败'
    },
    LENGTH: {
      code: 'forage_length_exception',
      message: '获取缓存条目数量失败'
    },
    KEY: {
      code: 'forage_key_exception',
      message: '获取缓存标识失败'
    },
    KEYS: {
      code: 'forage_keys_exception',
      message: '获取所有缓存标识失败'
    },
    ITERATE: {
      code: 'forage_iterate_exception',
      message: '迭代所有缓存数据失败'
    },
    TIME_EXPIRE: {
      code: 'forage_time_expire_exception',
      message: '数据缓存时间过期'
    }
  };

  this.config = function (options) {
    forage_config = angular.extend(forage_config, options);
    localforage.config({
      driver: forage_config.driver
    });
  };

  this.$get = ['$q', function ($q) {
    var _mem_forage = {};

    var get_from_forage = function (key, now) {
      return $q(function (resolve, reject) {
        localforage.getItem(key, function (err, value) {
          if (err || !value) {
            reject(forage_config.transformError(FORAGE_ERROR.GET));
            return false;
          }
          var expire_at = Number(value.expire_at);
          if (!isNaN(expire_at) && expire_at > now) {
            _mem_forage[key] = {
              expire_at: expire_at,
              data: value.data
            };
            resolve(value.data);
          }
          else {
            $forage.remove(key).then(function () {
              reject(forage_config.transformError(FORAGE_ERROR.TIME_EXPIRE));
            }, function () {
              reject(forage_config.transformError(FORAGE_ERROR.UNKNOWN));
            });
          }
        });
      });
    };

    var $forage = {

      get: function (key) {
        var now     = Date.now();
        var mem_obj = _mem_forage[key];
        if (mem_obj) {
          if (mem_obj.expire_at > now) {
            return $q.when(mem_obj.data);
          }
          else {
            return $forage.remove(key).then(function () {
              return $q.reject(forage_config.transformError(FORAGE_ERROR.TIME_EXPIRE));
            }, function () {
              return $q.reject(forage_config.transformError(FORAGE_ERROR.UNKNOWN));
            });
          }
        }
        return get_from_forage(key, now);
      },
      set: function (key, data, expire_at) {
        return $q(function (resolve, reject) {
          if (!angular.isString(key) || !angular.isObject(data)) {
            reject(forage_config.transformError(FORAGE_ERROR.SET));
            return false;
          }
          expire_at        = (angular.isNumber(expire_at) && expire_at > 0) ? expire_at : forage_config.defaultExpireTime;
          _mem_forage[key] = {
            expire_at: expire_at,
            data: data
          };
          localforage.setItem(key, {
            expire_at: expire_at,
            data: data
          }, function (err) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.SET));
            }
            else {
              resolve(data);
            }
          });
        });
      },
      remove: function (key) {
        return $q(function (resolve, reject) {
          _mem_forage[key] = undefined;
          localforage.removeItem(key, function (err) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.REMOVE));
              return false;
            }
            resolve();
          });
        });
      },
      clear: function () {
        return $q(function (resolve, reject) {
          _mem_forage = {};
          localforage.clear(function (err) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.CLEAR));
              return false;
            }
            resolve();
          });
        });
      },
      length: function () {
        return $q(function (resolve, reject) {
          localforage.length(function (err, length) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.LENGTH));
              return false;
            }
            resolve(length);
          });
        });
      },
      key: function (index) {
        return $q(function (resolve, reject) {
          localforage.key(index, function (err, key) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.KEY));
              return false;
            }
            resolve(key);
          });
        });
      },
      keys: function () {
        return $q(function (resolve, reject) {
          localforage.keys(function (err, keys) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.KEYS));
              return false;
            }
            resolve(keys);
          });
        });
      },
      iterate: function (cb) {
        return $q(function (resolve, reject) {
          localforage.iterate(function (value, key, index) {
            cb(value.data, key, index);
            _mem_forage[key] = undefined;
          }, function (err) {
            if (err) {
              reject(forage_config.transformError(FORAGE_ERROR.ITERATE));
              return false;
            }
            resolve();
          });
        });
      }
    };
    return $forage;
  }];
});