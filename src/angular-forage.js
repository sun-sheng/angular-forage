;angular.module('ngForage', []).provider('$forage', function ()
{

    var forage_config = {
        prefix: '_ng_',
        defaultExpireTime: 9999999999999,
        transformError: function (err)
        {
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
        TIME_EXPIRE: {
            code: 'forage_time_expire_exception',
            message: '数据缓存时间过期'
        }
    };

    var _mem_forage = {};

    var get_from_forage = function (key, now)
    {
        return $q(function (resolve, reject)
        {
            localforage.getItem(forage_config.prefix + key, function (err, value)
            {
                if (err || ! value)
                {
                    reject(forage_config.transformError(FORAGE_ERROR.GET));
                    return false;
                }
                var expire_at = Number(value.expire_at);
                if (! isNaN(expire_at) && expire_at > now)
                {
                    _mem_forage[key] = {
                        expire_at: expire_at,
                        data: value.data
                    };
                    resolve(value.data);
                }
                else
                {
                    $forage.remove(key).then(function ()
                    {
                        reject(forage_config.transformError(FORAGE_ERROR.TIME_EXPIRE));
                    }, function ()
                    {
                        reject(forage_config.transformError(FORAGE_ERROR.UNKNOWN));
                    });
                }
            });
        });
    };



    this.config = function (options)
    {
        forage_config = angular.extend(forage_config, options);
        localforage.config({
            driver: forage_config.driver
        });
    };

    this.$get = ['$q', function ($q)
    {
        var $forage = {

            get: function (key)
            {
                var now = Date.now();
                var mem_obj = _mem_forage[key];
                if (mem_obj)
                {
                    if (mem_obj.expire_at > now)
                    {
                        return $q.when(mem_obj.data);
                    }
                    else
                    {
                        return $forage.remove(key).then(function ()
                        {
                            return $q.reject(forage_config.transformError(FORAGE_ERROR.TIME_EXPIRE));
                        }, function ()
                        {
                            return $q.reject(forage_config.transformError(FORAGE_ERROR.UNKNOWN));
                        });
                    }
                }
                return get_from_forage(key, now);
            },
            set: function (key, data, expire_at)
            {
                return $q(function (resolve, reject)
                {
                    if (! angular.isString(key) || ! angular.isObject(data))
                    {
                        reject(forage_config.transformError(FORAGE_ERROR.SET));
                        return false;
                    }
                    expire_at = (angular.isNumber(expire_at) && expire_at > 0) ? expire_at : forage_config.defaultExpireTime;
                    _mem_forage[key] = {
                        expire_at: expire_at,
                        data: data
                    };
                    localforage.setItem(forage_config.prefix + key, {
                        expire_at: expire_at,
                        data: data
                    }, function (err)
                    {
                        if (err)
                        {
                            reject(forage_config.transformError(FORAGE_ERROR.SET));
                        }
                        else
                        {
                            resolve(data);
                        }
                    });
                });
            },
            remove: function (key)
            {
                return $q(function (resolve, reject)
                {
                    _mem_forage[key] = undefined;
                    localforage.removeItem(forage_config.prefix + key, function (err)
                    {
                        if (err)
                        {
                            reject(forage_config.transformError(FORAGE_ERROR.REMOVE));
                            return false;
                        }
                        resolve();
                    });
                });
            },
            clear: function ()
            {
                return $q(function (resolve, reject)
                {
                    _mem_forage = {};
                    localforage.clear(function (err)
                    {
                        if (err)
                        {
                            reject(forage_config.transformError(FORAGE_ERROR.CLEAR));
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