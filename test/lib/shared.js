(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],2:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

beforeEach(function () {

  jasmine.addMatchers({

    toBeChildOf: function toBeChildOf() {
      return {
        compare: function compare(child, parent) {

          var hasChild = _underscore2["default"].any(parent.children, function (c) {
            return c == child;
          });

          var isChild = child.parent === parent;
          var pass = hasChild && isChild;
          var msg;

          if (pass) {
            msg = "Expected to not be child of parent";
          } else {
            msg = "Expected to be child of parent";
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    // Matcher that takes two object and makes sure that all the
    // keys in subset matches the same key in full. Full may have
    // extra values.
    toBeIn: function toBeIn() {
      return {
        compare: function compare(subset, full) {

          var noMatches = _underscore2["default"].filter(subset, function (v, k) {
            return !_underscore2["default"].isEqual(full[k], v);
          });

          var msg;
          var pass = noMatches.length == 0;

          if (pass) {
            msg = "Expected " + noMatches + " not to be in object";
          } else {
            msg = "Expected " + noMatches + " to be in object";
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toEqualVector: function toEqualVector() {
      return {
        compare: function compare(vec, x, y) {

          var msg;
          var pass = vec.x == x && vec.y == y;

          if (pass) {
            msg = "Expected " + vec + " not to equal vector " + new Rune.Vector(x, y);
          } else {
            msg = "Expected " + vec + " to equal vector " + new Rune.Vector(x, y);
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toBeTag: function toBeTag() {
      return {
        compare: function compare(el, tagname) {

          var msg;
          var pass = el.tagName == tagname;

          if (pass) {
            msg = "Expected not to be tag " + tagname;
          } else {
            msg = "Expected " + el.tagName + " to be tag " + tagname;
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toHaveAttr: function toHaveAttr() {
      return {
        compare: function compare(el, k, v) {
          var att = el.getAttribute(k);
          var result = {
            pass: true,
            message: "yup"
          };
          if (att != v + "") {
            result.pass = false;
            result.message = "Attribute " + k + " with value " + att + " did not match " + v;
          }
          return result;
        }
      };
    },

    toNotHaveAttr: function toNotHaveAttr() {
      return {
        compare: function compare(el, k, v) {
          var att = el.getAttribute(k);
          var result = {
            pass: _underscore2["default"].isUndefined(att) || att == null,
            message: "something"
          };
          return result;
        }
      };
    },

    toHaveAttrs: function toHaveAttrs() {
      return {
        compare: function compare(el, attrs) {
          var result = {
            message: ""
          };
          result.pass = _underscore2["default"].all(attrs, function (v, k) {
            var att = el.getAttribute(k);
            if (att != v + "") result.message = "Attribute " + k + " with value " + att + " did not match " + v;
            return att == v;
          });
          return result;
        }
      };
    },

    toHaveRotation: function toHaveRotation() {
      return {
        compare: function compare(el, rotation, rotationX, rotationY) {
          var result = {
            pass: true,
            message: "Has rotation when it shouldn't"
          };

          var attr = "rotate(" + rotation;
          if (rotationX || rotationY) attr += " " + rotationX + " " + rotationY;
          attr += ")";

          if (!el.getAttribute("transform") || el.getAttribute("transform").indexOf(attr) < 0) {
            result.pass = false;
            result.message = "Transform does not have rotation or doesnt match: " + el.getAttribute("transform");
          }
          return result;
        }
      };
    },

    toHaveTranslation: function toHaveTranslation() {
      return {
        compare: function compare(el, x, y) {
          var result = {
            pass: true,
            message: "Has translation when it shouldn't"
          };
          if (!el.getAttribute("transform") || el.getAttribute("transform").indexOf("translate(" + x + " " + y + ")") < 0) {
            result.pass = false;
            result.message = "Transform does not have translation";
          }
          return result;
        }
      };
    },

    toBeAnchorMove: function toBeAnchorMove() {
      return {
        compare: function compare(vector, x, y) {

          var a = new Rune.Anchor();
          a.command = 'move';
          a.vec1 = new Rune.Vector(x, y);

          var msg = "";
          var pass = vector.command == a.command;
          pass = pass && vector.vec1.x == a.vec1.x;
          pass = pass && vector.vec1.y == a.vec1.y;
          pass = pass && _underscore2["default"].isUndefined(vector.vec2);
          pass = pass && _underscore2["default"].isUndefined(vector.vec3);

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected " + JSON.stringify(vector) + " to match " + JSON.stringify(a);
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toBeAnchorLine: function toBeAnchorLine() {
      return {
        compare: function compare(vector, x, y) {

          var a = new Rune.Anchor();
          a.command = 'line';
          a.vec1 = new Rune.Vector(x, y);

          var msg = "";
          var pass = vector.command == a.command;
          pass = pass && vector.vec1.x == a.vec1.x;
          pass = pass && vector.vec1.y == a.vec1.y;
          pass = pass && _underscore2["default"].isUndefined(vector.vec2);
          pass = pass && _underscore2["default"].isUndefined(vector.vec3);

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected " + JSON.stringify(vector) + " to match " + JSON.stringify(a);
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    },

    toBeAnchorCubic: function toBeAnchorCubic() {
      return {
        compare: function compare(anchor, a, b, c, d, e, f) {
          var expected = new Rune.Anchor();
          expected.command = 'cubic';
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);
          expected.vec3 = new Rune.Vector(e, f);
          return {
            pass: _underscore2["default"].isEqual(anchor, expected),
            message: "Actual: " + JSON.stringify(anchor) + ", expected: " + JSON.stringify(expected)
          };
        }
      };
    },

    toBeAnchorQuad: function toBeAnchorQuad() {
      return {
        compare: function compare(anchor, a, b, c, d) {
          var expected = new Rune.Anchor();
          expected.command = 'quad';
          expected.vec1 = new Rune.Vector(a, b);
          expected.vec2 = new Rune.Vector(c, d);
          return {
            pass: _underscore2["default"].isEqual(anchor, expected),
            message: "Actual: " + JSON.stringify(anchor) + ", expected: " + JSON.stringify(expected)
          };
        }
      };
    },

    toBeAnchorClose: function toBeAnchorClose() {
      return {
        compare: function compare(vector) {

          var msg = "";
          var pass = vector.command == 'close';

          if (pass) {
            msg = "Expected not to match";
          } else {
            msg = "Expected to match";
          }

          return {
            pass: pass,
            message: msg
          };
        }
      };
    }
  });
});

},{"underscore":1}],3:[function(require,module,exports){
"use strict";

describe("Rune.Anchor", function () {

  var a1;
  var v1;

  beforeEach(function () {
    a1 = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
    v1 = new Rune.Vector(10, 15);
  });

  describe("add()", function () {
    it("adds vector to anchor vectors", function () {
      var res = a1.add(v1);
      expect(res).toBeAnchorCubic(110, 120, 210, 220, 310, 320);
      expect(res).not.toBe(a1);
    });
  });

  describe("sub()", function () {
    it("subtracts vectors", function () {
      var res = a1.sub(v1);
      expect(res).toBeAnchorCubic(90, 90, 190, 190, 290, 290);
      expect(res).not.toBe(a1);
    });
  });

  describe("copy()", function () {

    it("copies the anchor", function () {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      var b = a.copy();
      expect(a).toEqual(b);
      expect(a === b).toBe(false);
      expect(a.vec1 === b.vec1).toBe(false);
      expect(a.vec2 === b.vec2).toBe(false);
      expect(a.vec3 === b.vec3).toBe(false);
    });
  });

  describe("setMove()", function () {

    it("creates move", function () {
      var a = new Rune.Anchor().setMove(100, 105);
      expect(a).toBeAnchorMove(100, 105);
    });
  });

  describe("setLine()", function () {

    it("creates line", function () {
      var a = new Rune.Anchor().setLine(100, 105);
      expect(a).toBeAnchorLine(100, 105);
    });
  });

  describe("setCurve()", function () {

    it("creates cubic", function () {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205, 300, 305);
      expect(a).toBeAnchorCubic(100, 105, 200, 205, 300, 305);
    });

    it("creates quad", function () {
      var a = new Rune.Anchor().setCurve(100, 105, 200, 205);
      expect(a).toBeAnchorQuad(100, 105, 200, 205);
    });
  });

  describe("setClose()", function () {

    it("creates close", function () {
      var a = new Rune.Anchor().setClose();
      expect(a).toBeAnchorClose();
    });
  });

  describe("vectorAt()", function () {

    it("throws error for move", function () {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(function () {
        a.vectorAt(0.5);
      }).toThrow(new Error("Cannot compute vectorAt for this type of anchor"));
    });

    it("returns vector for line", function () {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.vectorAt(0.5)).toEqualVector(50, 50);
    });

    it("returns vector for cubic bezier", function () {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqualVector(50, 75);
    });

    it("returns vector for quad bezier", function () {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.vectorAt(0.5)).toEqualVector(50, 50);
    });
  });

  describe("length()", function () {

    it("returns length for move", function () {
      var a = new Rune.Anchor().setMove(0, 0);
      expect(a.length()).toEqual(0);
    });

    it("returns length for line", function () {
      var a = new Rune.Anchor().setLine(100, 100);
      expect(a.length()).toEqual(141.4213562373095);
    });

    it("returns length for cubic bezier", function () {
      var a = new Rune.Anchor().setCurve(0, 100, 100, 100, 100, 0);
      expect(a.length()).toEqual(200);
    });

    it("returns length for quad bezier", function () {
      var a = new Rune.Anchor().setCurve(50, 100, 100, 0);
      expect(a.length()).toEqual(147.89428575453212);
    });
  });
});

},{}],4:[function(require,module,exports){
"use strict";

describe("Rune.Color", function () {

  // ADD ALL TESTS FROM COLOR.JS

  describe("constructor", function () {

    it("works from hex", function () {
      var col1 = new Rune.Color("#FF0000");
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from hex alpha", function () {
      var col1 = new Rune.Color("#FF0000", 0.5);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      });
    });

    it("works from color", function () {
      var col1 = new Rune.Color("#FF0000");
      var col2 = new Rune.Color(col1);
      expect(col1).toEqual(col2);
    });

    it("works from grayscale", function () {
      var col1 = new Rune.Color(120);
      expect(col1.rgb()).toEqual({
        r: 120,
        g: 120,
        b: 120
      });
    });

    it("works from grayscale alpha", function () {
      var col1 = new Rune.Color(120, 0.5);
      expect(col1.rgb()).toEqual({
        r: 120,
        g: 120,
        b: 120,
        a: 0.5
      });
    });

    it("works from rgb", function () {
      var col1 = new Rune.Color(255, 0, 0);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from rgba", function () {
      var col1 = new Rune.Color(255, 0, 0, 0.5);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      });
    });

    it("works from hsb", function () {
      var col1 = new Rune.Color('hsv', 0, 100, 100);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0
      });
    });

    it("works from hsba", function () {
      var col1 = new Rune.Color('hsv', 0, 100, 100, 0.5);
      expect(col1.rgb()).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      });
    });

    it("wraps around hue", function () {
      var col1 = new Rune.Color('hsv', 480, 100, 100);
      expect(col1.rgb()).toEqual({
        r: 0,
        g: 255,
        b: 0
      });
    });
  });
});

},{}],5:[function(require,module,exports){
"use strict";

describe("Rune.Grid", function () {

  // you can add it to the stage via r.grid()

  describe("constructor", function () {

    it("has default settings", function () {
      var grid = new Rune.Grid();
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterWidth).toEqual(0);
      expect(grid.vars.gutterHeight).toEqual(0);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(1);
      expect(grid.vars.moduleWidth).toEqual(50);
      expect(grid.vars.moduleHeight).toEqual(500);
      expect(grid.vars.width).toEqual(500);
      expect(grid.vars.height).toEqual(500);
    });

    it("works with all variables", function () {
      var grid = new Rune.Grid({
        gutterWidth: 15,
        gutterHeight: 20,
        moduleWidth: 50,
        moduleHeight: 40,
        columns: 10,
        rows: 5
      });

      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterWidth).toEqual(15);
      expect(grid.vars.gutterHeight).toEqual(20);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(50);
      expect(grid.vars.moduleHeight).toEqual(40);
      expect(grid.vars.width).toEqual(635);
      expect(grid.vars.height).toEqual(280);

      expect(grid.modules.length).toBe(10);
      expect(grid.modules[0].length).toBe(5);
      expect(grid.modules[0][0].type).toEqual("group");
      expect(grid.modules[0][0].vars.x).toEqual(0);
      expect(grid.modules[0][0].vars.y).toEqual(0);
      expect(grid.modules[2][2].type).toEqual("group");
      expect(grid.modules[2][2].vars.x).toEqual(130);
      expect(grid.modules[2][2].vars.y).toEqual(120);
    });

    it("works with gutter shorthand", function () {
      var grid = new Rune.Grid({
        gutter: 15,
        width: 600,
        height: 500,
        columns: 10,
        rows: 5
      });
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterWidth).toEqual(15);
      expect(grid.vars.gutterHeight).toEqual(15);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(46.5);
      expect(grid.vars.moduleHeight).toEqual(88);
      expect(grid.vars.width).toEqual(600);
      expect(grid.vars.height).toEqual(500);
    });

    it("works with no gutter", function () {
      var grid = new Rune.Grid({
        width: 600,
        height: 500,
        columns: 10,
        rows: 5
      });
      expect(grid.vars.x).toEqual(0);
      expect(grid.vars.y).toEqual(0);
      expect(grid.vars.gutterWidth).toEqual(0);
      expect(grid.vars.gutterHeight).toEqual(0);
      expect(grid.vars.columns).toEqual(10);
      expect(grid.vars.rows).toEqual(5);
      expect(grid.vars.moduleWidth).toEqual(60);
      expect(grid.vars.moduleHeight).toEqual(100);
      expect(grid.vars.width).toEqual(600);
      expect(grid.vars.height).toEqual(500);
    });
  });

  describe("add()", function () {

    it("adds child to module and sets parent", function () {
      var g = new Rune.Grid({ columns: 10, rows: 10 });
      var s = new Rune.Ellipse();
      expect(g.modules[1][2].children.length).toBe(0);
      expect(s.parent).toBeUndefined();
      g.add(s, 2, 3);
      expect(g.modules[1][2].children[0]).toBe(s);
      expect(s.parent).toBe(g.modules[1][2]);
    });

    it("removes child from parent", function () {
      var group = new Rune.Group({ columns: 10, rows: 10 });
      var grid = new Rune.Grid({ columns: 10, rows: 10 });
      var s = new Rune.Ellipse();
      group.add(s);
      expect(s.parent).toBe(group);
      expect(group.children[0]).toBe(s);
      grid.add(s, 2, 3);
      expect(s.parent).toBe(grid.modules[1][2]);
      expect(group.children.length).toBe(0);
      expect(grid.modules[1][2].children[0]).toBe(s);
    });
  });

  // copy

  // you can add object into the modules
  // add(object, col, row)

  // TODO: you can change the grid dimensions to have all objects move
  // but if you added an object and moved it, it's going to move it
  // relative to the new position.
});

},{}],6:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Group", function () {

  describe("Group()", function () {

    it("should have optional x and y", function () {
      var g1 = new Rune.Group();
      expect(g1.vars.x).toEqual(0);
      expect(g1.vars.y).toEqual(0);

      var g2 = new Rune.Group(100, 101);
      expect(g2.vars.x).toEqual(100);
      expect(g2.vars.y).toEqual(101);
    });
  });

  describe("add()", function () {

    it("adds child to children and sets parent", function () {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      expect(s).not.toBeChildOf(g);
      g.add(s);
      expect(s).toBeChildOf(g);
    });

    it("removes child from parent", function () {
      var g1 = new Rune.Group();
      var g2 = new Rune.Group();
      var s = new Rune.Ellipse();
      g1.add(s);
      expect(s).toBeChildOf(g1);
      g2.add(s);
      expect(s).toBeChildOf(g2);
      expect(s).not.toBeChildOf(g1);
    });
  });

  describe("remove()", function () {

    it("removes child", function () {
      var g = new Rune.Group();
      var s = new Rune.Ellipse();
      g.add(s);
      g.remove(s);
      expect(s).not.toBeChildOf(g);
    });
  });

  describe("copy()", function () {

    var parent;
    var child;

    beforeEach(function () {
      parent = new Rune.Group();
      child = new Rune.Group();
      parent.add(child);
    });

    it("copies the object", function () {
      var parentEllipse = new Rune.Circle(10, 15, 300);
      var childEllipse = new Rune.Circle(10, 15, 300);
      _helpers2["default"].setMixinVars(parent);
      _helpers2["default"].setMixinVars(parentEllipse);
      _helpers2["default"].setMixinVars(child);
      _helpers2["default"].setMixinVars(childEllipse);
      parent.add(parentEllipse);
      child.add(childEllipse);

      var copy = parent.copy();
      expect(copy).toEqual(parent);
      expect(copy).not.toBe(parent);
    });

    it("adds copy to parent", function () {
      var copy = child.copy();
      expect(copy).toBeChildOf(parent);
    });

    it("does not add copy to parent", function () {
      var copy = child.copy(false);
      expect(copy).not.toBeChildOf(parent);
    });
  });
});

},{"./helpers":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var Helpers = {

  newMixin: function newMixin() {
    var Mixed = function Mixed() {};
    _underscore2["default"].each(arguments, function (mixin) {
      _underscore2["default"].extend(Mixed.prototype, mixin);
    });
    return new Mixed();
  },

  // Mixin general
  // -------------------------------------------

  // Returns an object with variables that comes from
  // all the mixins that the shape extends.
  getMixinVars: function getMixinVars(shape) {

    var keys = [];
    if (shape.moveable) {
      keys = keys.concat(_underscore2["default"].keys(Helpers.getMoveableVars()));
    }
    if (shape.sizeable) {
      keys = keys.concat(_underscore2["default"].keys(Helpers.getSizeableVars()));
    }
    if (shape.styleable) {
      keys = keys.concat(_underscore2["default"].keys(Helpers.getStyleableVars()));
    }

    var vars = {};
    _underscore2["default"].each(keys, function (key) {
      vars[key] = shape.vars[key];
    });
    return vars;
  },

  // Sets variables in object that comes from
  // all the mixins that the shape extends.
  setMixinVars: function setMixinVars(shape) {
    if (shape.moveable) {
      Helpers.setMoveableVars(shape);
    }
    if (shape.sizeable) {
      Helpers.setSizeableVars(shape);
    }
    if (shape.styleable) {
      Helpers.setStyleableVars(shape);
    }
  },

  // Mixin getters
  // -------------------------------------------

  getMoveableVars: function getMoveableVars(opts) {
    return _underscore2["default"].defaults(opts || {}, {
      x: 10,
      y: 15,
      rotation: 45,
      rotationX: 100,
      rotationY: 105
    });
  },

  getSizeableVars: function getSizeableVars(opts) {
    return _underscore2["default"].defaults(opts || {}, {
      width: 300,
      height: 305
    });
  },

  getStyleableVars: function getStyleableVars(opts) {
    return _underscore2["default"].defaults(opts || {}, {
      fill: new Rune.Color(255, 0, 0),
      stroke: new Rune.Color(0, 255, 0)
    });
  },

  // Mixin setters
  // -------------------------------------------

  setMoveableVars: function setMoveableVars(shape, opts) {
    var vars = Helpers.getMoveableVars(opts);
    _underscore2["default"].extend(shape.vars, vars);
  },

  setSizeableVars: function setSizeableVars(shape, opts) {
    var vars = Helpers.getSizeableVars(opts);
    _underscore2["default"].extend(shape.vars, vars);
  },

  setStyleableVars: function setStyleableVars(shape, opts) {
    var vars = Helpers.getStyleableVars(opts);
    _underscore2["default"].extend(shape.vars, vars);
  },

  setAllAnchors: function setAllAnchors(path) {
    path.lineTo(104, 105).moveTo(106, 107).curveTo(108, 109, 110, 111, 112, 113).curveTo(114, 115, 116, 117).closePath();
  }
};

exports["default"] = Helpers;
module.exports = exports["default"];

},{"underscore":1}],8:[function(require,module,exports){
"use strict";

require("../matchers");

require("./rune");

require("./utils");

require("./anchor");

require("./color");

require("./grid");

require("./group");

require("./render");

require("./vector");

require("./mixins/moveable");

require("./mixins/sizeable");

require("./mixins/styleable");

require("./shapes/circle");

require("./shapes/ellipse");

require("./shapes/line");

require("./shapes/path");

require("./shapes/polygon");

require("./shapes/rect");

require("./shapes/text");

},{"../matchers":2,"./anchor":3,"./color":4,"./grid":5,"./group":6,"./mixins/moveable":9,"./mixins/sizeable":10,"./mixins/styleable":11,"./render":12,"./rune":13,"./shapes/circle":14,"./shapes/ellipse":15,"./shapes/line":16,"./shapes/path":17,"./shapes/polygon":18,"./shapes/rect":19,"./shapes/text":20,"./utils":21,"./vector":22}],9:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Moveable", function () {

  var m;

  beforeEach(function () {
    m = _helpers2["default"].newMixin(Rune.Moveable);
    m.moveable();
  });

  describe("moveable()", function () {

    it("assigns default variables", function () {
      expect(typeof m.moveable).toEqual("function");
      expect(m.vars.x).toEqual(0);
      expect(m.vars.y).toEqual(0);
      expect(m.vars.rotation).toEqual(0);
    });

    it("copies variables from object", function () {
      _helpers2["default"].setMoveableVars(m);
      var m2 = _helpers2["default"].newMixin(Rune.Moveable);
      m2.moveable(m);
      expect(m2.vars.x).toEqual(10);
      expect(m2.vars.y).toEqual(15);
      expect(m2.vars.rotation).toEqual(45);
    });

    it("copies negative values from object", function () {
      _helpers2["default"].setMoveableVars(m, {
        x: -10,
        y: -15,
        rotation: -20,
        rotationX: -25,
        rotationY: -30
      });
      var m2 = _helpers2["default"].newMixin(Rune.Moveable);
      m2.moveable(m);
      expect(m2.vars.x).toEqual(-10);
      expect(m2.vars.y).toEqual(-15);
      expect(m2.vars.rotation).toEqual(-20);
      expect(m2.vars.rotationX).toEqual(-25);
      expect(m2.vars.rotationY).toEqual(-30);
    });
  });

  describe("move()", function () {

    it("moves absolute", function () {
      _helpers2["default"].setMoveableVars(m);
      m.move(200, 205);
      expect(m.vars.x).toEqual(200);
      expect(m.vars.y).toEqual(205);
    });

    it("moves relative", function () {
      _helpers2["default"].setMoveableVars(m);
      m.move(200, 205, true);
      expect(m.vars.x).toEqual(210);
      expect(m.vars.y).toEqual(220);
    });

    it("is chainable", function () {
      var res = m.move(200, 205);
      expect(m).toEqual(res);
    });
  });

  describe("rotate()", function () {

    it("rotates on degree", function () {
      m.rotate(45);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(0);
      expect(m.vars.rotationY).toEqual(0);
    });

    it("rotates on degree and xy", function () {
      m.rotate(45, 100, 105);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(100);
      expect(m.vars.rotationY).toEqual(105);
    });

    it("rotates relative to own xy", function () {
      m.move(10, 15);
      m.rotate(45, 100, 105, true);
      expect(m.vars.rotation).toEqual(45);
      expect(m.vars.rotationX).toEqual(110);
      expect(m.vars.rotationY).toEqual(120);
    });

    it("is chainable", function () {
      var res = m.rotate(45);
      expect(m).toEqual(res);
    });
  });
});

},{"../helpers":7}],10:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Sizeable", function () {

  var m;

  beforeEach(function () {
    m = _helpers2["default"].newMixin(Rune.Sizeable);
    m.sizeable();
  });

  describe("sizeable()", function () {

    it("assigns default variables", function () {
      expect(typeof m.sizeable).toEqual("function");
      expect(m.vars.width).toEqual(0);
      expect(m.vars.height).toEqual(0);
    });

    it("copies variables from object", function () {
      _helpers2["default"].setSizeableVars(m);
      var m2 = _helpers2["default"].newMixin(Rune.Sizeable);
      m2.sizeable(m);
      expect(m2.vars.width).toEqual(300);
      expect(m2.vars.height).toEqual(305);
    });
  });
});

},{"../helpers":7}],11:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Styleable", function () {

  var m;

  beforeEach(function () {
    m = _helpers2["default"].newMixin(Rune.Styleable);
    m.styleable();
  });

  describe("styleable()", function () {

    it("assigns default variable", function () {
      expect(typeof m.styleable).toEqual("function");
      expect(m.vars.fill.rgbArray()).toEqual([128, 128, 128]);
      expect(m.vars.stroke.rgbArray()).toEqual([0, 0, 0]);
    });

    it("copies variables from object", function () {
      _helpers2["default"].setStyleableVars(m);
      var m2 = _helpers2["default"].newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toEqual(m.vars.fill);
      expect(m2.vars.stroke).toEqual(m.vars.stroke);
    });

    it("copies false variables from object", function () {
      m.fill(false);
      m.stroke(false);
      var m2 = _helpers2["default"].newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toBe(false);
      expect(m2.vars.stroke).toBe(false);
    });

    it("copies zero colors", function () {
      var m2 = _helpers2["default"].newMixin(Rune.Styleable);
      m2.styleable(m);
      expect(m2.vars.fill).toEqual(m.vars.fill);
      expect(m2.vars.stroke).toEqual(m.vars.stroke);
    });
  });

  describe("fill()", function () {

    it("sets fill to color", function () {
      var res = m.fill("#ff0000");
      expect(m.vars.fill.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it("sets fill to false", function () {
      m.fill(false);
      expect(m.vars.fill).toEqual(false);
    });
  });

  describe("stroke()", function () {

    it("sets stroke to color", function () {
      var res = m.stroke("#ff0000");
      expect(m.vars.stroke.rgbArray()).toEqual([255, 0, 0]);
      expect(m).toEqual(res);
    });

    it("sets stroke to false", function () {
      m.stroke(false);
      expect(m.vars.stroke).toEqual(false);
    });
  });

  describe("Basic setters", function () {

    it("sets the var value", function () {
      var funcs = ["strokeWidth", "strokeCap", "strokeJoin", "strokeMiterlimit", "strokeDash", "strokeDashOffset"];
      _underscore2["default"].each(funcs, function (func) {
        var res = m[func](5);
        expect(m.vars[func]).toEqual(5);
        expect(m).toEqual(res);
      });
    });
  });
});

},{"../helpers":7,"underscore":1}],12:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function drawShared(shape) {
  shape.rotate(45, 100, 105).fill(255, 0, 0, 0.5).stroke(0, 255, 0, 0.6).strokeWidth(5).strokeCap('round').strokeJoin('miter').strokeMiterlimit(7).strokeDash("3,4,5").strokeDashOffset(10);
}

function expectShared(el) {
  expect(el).toHaveRotation(45, 100, 105);
  expect(el).toHaveAttr("fill", "rgb(255, 0, 0)");
  expect(el).toHaveAttr("fill-opacity", "0.5");
  expect(el).toHaveAttr("stroke", "rgb(0, 255, 0)");
  expect(el).toHaveAttr("stroke-opacity", "0.6");
  expect(el).toHaveAttr("stroke-width", "5");
  expect(el).toHaveAttr("stroke-linecap", "round");
  expect(el).toHaveAttr("stroke-linejoin", "miter");
  expect(el).toHaveAttr("stroke-miterlimit", "7");
  expect(el).toHaveAttr("stroke-dasharray", "3,4,5");
  expect(el).toHaveAttr("stroke-dashoffset", "10");
}

describe("Rune.Render", function () {

  var r;
  var el;

  beforeEach(function () {
    r = new Rune({ width: 200, height: 300 });
    el = r.getEl();
  });

  it("should create SVG element", function () {
    expect(el.tagName).toEqual('svg');
    expect(el).toHaveAttr('width', "200");
    expect(el).toHaveAttr('height', "300");
  });

  describe("All shapes", function () {

    it("should handle false vars", function () {
      r.rect(0, 0, 0, 0).fill(false).stroke(false).strokeWidth(false).strokeCap(false).strokeJoin(false).strokeMiterlimit(false).strokeDash(false).strokeDashOffset(false);
      r.draw();
      var rect = el.childNodes[0];
      expect(rect).toBeTag("rect");
      expect(rect).toHaveAttr('fill', "none");
      expect(rect).toHaveAttr('stroke', "none");
      expect(rect).toNotHaveAttr('stroke-width');
      expect(rect).toNotHaveAttr('stroke-linecap');
      expect(rect).toNotHaveAttr('stroke-linejoin');
      expect(rect).toNotHaveAttr('stroke-miterlimit');
      expect(rect).toNotHaveAttr('stroke-dasharray');
      expect(rect).toNotHaveAttr('stroke-dashoffset');
    });

    it("renders rotation with 0", function () {
      r.rect(0, 0, 0, 0).rotate(45, 0, 10);
      r.draw();
      var rect = el.childNodes[0];
      expect(rect).toHaveRotation(45, 0, 10);
    });
  });

  describe("Rune.Rectangle", function () {

    it("should render rectangle", function () {
      var s = r.rect(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var rect = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(rect).toBeTag("rect");
      expect(rect).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y,
        width: s.vars.width,
        height: s.vars.height
      });
      expect(rect).not.toHaveTranslation(100, 105);
      expectShared(rect);
    });
  });

  describe("Rune.Ellipse", function () {

    it("should render ellipse", function () {
      var s = r.ellipse(100, 105, 300, 400);
      drawShared(s);
      r.draw();
      var ellipse = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(ellipse).toBeTag("ellipse");
      expect(ellipse).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        rx: s.vars.width / 2,
        ry: s.vars.height / 2
      });
      expect(ellipse).not.toHaveTranslation(100, 105);
      expectShared(ellipse);
    });
  });

  describe("Rune.Circle", function () {

    it("should render circle", function () {
      var s = r.circle(100, 105, 300);
      drawShared(s);
      r.draw();
      var circle = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(circle).toBeTag("circle");
      expect(circle).toHaveAttrs({
        cx: s.vars.x,
        cy: s.vars.y,
        r: s.vars.radius
      });
      expect(circle).not.toHaveTranslation(100, 105);
      expectShared(circle);
    });
  });

  describe("Rune.Line", function () {

    it("should render line", function () {
      var s = r.line(100, 105, 200, 205);
      drawShared(s);
      r.draw();
      var line = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(line).toBeTag("line");
      expect(line).toHaveAttrs({
        x1: s.vars.x,
        y1: s.vars.y,
        x2: s.vars.x2,
        y2: s.vars.y2
      });
      expect(line).not.toHaveTranslation(100, 105);
      expectShared(line);
    });
  });

  describe("Rune.Triangle", function () {

    it("should render triangle polygon", function () {
      var s = r.triangle(10, 15, 200, 205, 20, 220);
      drawShared(s);
      r.draw();
      var triangle = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(triangle).toBeTag("polygon");
      expect(triangle).toHaveAttr("points", "10 15 200 205 20 220");
      expect(triangle).not.toHaveTranslation(0, 0);
      expectShared(triangle);
    });
  });

  describe("Rune.Polygon", function () {

    it("should render polygon", function () {
      var s = r.polygon(10, 15).lineTo(100, 101).lineTo(200, 201).lineTo(300, 301);
      drawShared(s);
      r.draw();
      var polygon = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(polygon).toBeTag("polygon");
      expect(polygon).toHaveAttr("points", "100 101 200 201 300 301");
      expect(polygon).toHaveTranslation(10, 15);
      expectShared(polygon);
    });
  });

  describe("Rune.Path", function () {

    it("should render path", function () {
      var s = r.path(10, 15);
      drawShared(s);
      _helpers2['default'].setAllAnchors(s);
      r.draw();
      var path = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(path).toBeTag("path");
      expect(path).toHaveAttr("d", "M 0 0 L 104 105 M 106 107 C 108 109 110 111 112 113 Q 114 115 116 117 Z");
      expect(path).toHaveTranslation(10, 15);
      expectShared(path);
    });

    it("should render optional vars", function () {

      var optionals = {
        fillRule: ["fill-rule", "evenodd"]
      };

      _underscore2['default'].each(optionals, function (val, func) {
        var shape = r.path(10, 15);
        r.draw();
        expect(el.childNodes[0].getAttribute(val[0])).toBeNull();
        shape[func](val[1]);
        r.draw();
        expect(el.childNodes[0].getAttribute(val[0])).toEqual(val[1] + "");
      });
    });
  });

  describe("Rune.Text", function () {

    var s;

    beforeEach(function () {
      s = r.text("Hello", 10, 15);
    });

    it("should render text", function () {
      drawShared(s);
      r.draw();
      var text = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(text).toBeTag("text");
      expect(text).toHaveAttrs({
        x: s.vars.x,
        y: s.vars.y
      });
      expect(text).not.toHaveTranslation(10, 15);
      expect(text.childNodes[0].data).toEqual("Hello");
      expectShared(text);
    });

    it("should render optional vars", function () {

      var optionals = {
        fontFamily: ["font-family", "Georgia"],
        fontWeight: ["font-weight", "bold"],
        fontSize: ["font-size", 32],
        letterSpacing: ["letter-spacing", 0.5],
        textDecoration: ["text-decoration", "underline"]
      };

      _underscore2['default'].each(optionals, function (v, k) {
        r.draw();
        expect(el.childNodes[0].getAttribute(v[0])).toBeNull();
        s[k](v[1]);
        r.draw();
        expect(el.childNodes[0].getAttribute(v[0])).toEqual(v[1] + "");
      });
    });

    describe("textAlign()", function () {

      it("should render proper attributes", function () {
        var aligns = [["left", "start"], ["center", "middle"], ["right", "end"]];
        _underscore2['default'].each(aligns, function (align) {
          s.textAlign(align[0]);
          r.draw();
          var jshape = el.childNodes[0];
          expect(jshape).toHaveAttr("text-anchor", align[1]);
        });
      });
    });
  });

  describe("Rune.Group", function () {

    it("should render group", function () {
      var g = r.group(10, 15).rotate(45);
      var e = new Rune.Circle(10, 15, 100);
      g.add(e);
      r.draw();

      var jgroup = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(jgroup).toBeTag("g");
      expect(jgroup).toHaveTranslation(10, 15);
      expect(jgroup).toHaveRotation(g.vars.rotation);

      var jellipse = jgroup.childNodes[0];
      expect(jellipse).toBeTag("circle");
      expect(jellipse).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });
    });

    it("should not render if empty", function () {
      var g = r.group(10, 15);
      r.draw();
      expect(el.childNodes.length).toEqual(0);
    });
  });

  describe("Rune.Grid", function () {

    it("should render grid", function () {
      var g = r.grid({
        x: 10,
        y: 15,
        gutterWidth: 20,
        gutterHeight: 30,
        moduleWidth: 40,
        moduleHeight: 50,
        columns: 4,
        rows: 3
      }).rotate(45);
      var ellipse = new Rune.Circle(10, 15, 100);
      g.add(ellipse, 2, 3);
      r.draw();

      var jgrid = el.childNodes[0];
      expect(el.childNodes.length).toEqual(1);
      expect(jgrid).toBeTag("g");
      expect(jgrid).toHaveTranslation(10, 15);
      expect(jgrid).toHaveRotation(45);

      var jmodule = jgrid.childNodes[0];
      expect(jmodule).toBeTag("g");
      expect(jmodule).toHaveTranslation(60, 160);

      var ellip = jmodule.childNodes[0];
      expect(ellip).toBeTag("circle");
      expect(ellip).toHaveAttrs({
        cx: 10,
        cy: 15,
        r: 100
      });
    });
  });

  describe("Debug mode", function () {

    it("should not render if debug false", function () {
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(el.childNodes.length).toBe(1);
    });

    it("should render cubic curve helpers", function () {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(100, 105, 200, 205, 300, 305).closePath();
      r.draw();
      expect(el.childNodes[1]).toBeTag('line');
      expect(el.childNodes[2]).toBeTag('line');
      expect(el.childNodes[3]).toBeTag('circle');
      expect(el.childNodes[4]).toBeTag('circle');
      expect(el.childNodes[5]).toBeTag('circle');

      expect(el.childNodes[1]).toHaveAttrs({ x1: 110, y1: 115, x2: 310, y2: 315 });
      expect(el.childNodes[2]).toHaveAttrs({ x1: 210, y1: 215, x2: 310, y2: 315 });
      expect(el.childNodes[3]).toHaveAttrs({ cx: 110, cy: 115 });
      expect(el.childNodes[4]).toHaveAttrs({ cx: 210, cy: 215 });
      expect(el.childNodes[5]).toHaveAttrs({ cx: 310, cy: 315 });
    });

    it("should render quad curve helpers", function () {
      r.debug = true;
      var p = r.path(10, 10);
      p.curveTo(200, 205, 300, 305).closePath();
      r.draw();
      expect(el.childNodes[1]).toBeTag('line');
      expect(el.childNodes[2]).toBeTag('circle');
      expect(el.childNodes[3]).toBeTag('circle');
      expect(el.childNodes[1]).toHaveAttrs({ x1: 210, y1: 215, x2: 310, y2: 315 });
      expect(el.childNodes[2]).toHaveAttrs({ cx: 210, cy: 215 });
      expect(el.childNodes[3]).toHaveAttrs({ cx: 310, cy: 315 });
    });

    it("should render grid helpers", function () {
      r.debug = true;
      var grid = r.grid({
        x: 10,
        y: 15,
        gutter: 20,
        moduleWidth: 25,
        moduleHeight: 30,
        columns: 3,
        rows: 3
      });
      r.draw();

      var child = el.childNodes[0];
      expect(child).toBeTag("g");
      expect(child).toHaveTranslation(10, 15);

      expect(child.childNodes[0]).toBeTag('rect');
      _underscore2['default'].times(8, function (i) {
        expect(child.childNodes[i + 1]).toBeTag('line');
      });

      expect(child.childNodes[0]).toHaveAttrs({ x: 0, y: 0, width: 115, height: 130 });
      expect(child.childNodes[1]).toHaveAttrs({ x1: 25, y1: 0, x2: 25, y2: grid.vars.height });
      expect(child.childNodes[2]).toHaveAttrs({ x1: 45, y1: 0, x2: 45, y2: grid.vars.height });
      expect(child.childNodes[3]).toHaveAttrs({ x1: 70, y1: 0, x2: 70, y2: grid.vars.height });
      expect(child.childNodes[4]).toHaveAttrs({ x1: 90, y1: 0, x2: 90, y2: grid.vars.height });
      expect(child.childNodes[5]).toHaveAttrs({ x1: 0, y1: 30, x2: grid.vars.width, y2: 30 });
      expect(child.childNodes[6]).toHaveAttrs({ x1: 0, y1: 50, x2: grid.vars.width, y2: 50 });
      expect(child.childNodes[7]).toHaveAttrs({ x1: 0, y1: 80, x2: grid.vars.width, y2: 80 });
      expect(child.childNodes[8]).toHaveAttrs({ x1: 0, y1: 100, x2: grid.vars.width, y2: 100 });
    });
  });
});

},{"./helpers":7,"underscore":1}],13:[function(require,module,exports){
"use strict";

describe("Rune", function () {

  var r;

  beforeEach(function () {
    r = new Rune();
  });

  describe("instantiation", function () {

    it("should save width and height", function () {
      var r = new Rune({ width: 100, height: 105 });
      expect(r.width).toEqual(100);
      expect(r.height).toEqual(105);
    });
  });

  describe(".group()", function () {

    it("should create group", function () {
      var group = r.group(10, 15);
      expect(group.type).toEqual("group");
      expect(group.vars.x).toEqual(10);
      expect(group.vars.y).toEqual(15);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.group(0, 0, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.group(0, 0);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.group(0, 0, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".rect()", function () {

    it("should create rect", function () {
      var rectangle = r.rect(10, 15, 200, 100);
      expect(rectangle.type).toEqual("rectangle");
      expect(rectangle.vars.x).toEqual(10);
      expect(rectangle.vars.y).toEqual(15);
      expect(rectangle.vars.width).toEqual(200);
      expect(rectangle.vars.height).toEqual(100);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.rect(0, 0, 0, 0, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.rect(0, 0, 0, 0);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.rect(0, 0, 0, 0, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".ellipse()", function () {

    it("should create ellipse", function () {
      var ellipse = r.ellipse(10, 15, 200, 100);
      expect(ellipse.type).toEqual("ellipse");
      expect(ellipse.vars.x).toEqual(10);
      expect(ellipse.vars.y).toEqual(15);
      expect(ellipse.vars.width).toEqual(200);
      expect(ellipse.vars.height).toEqual(100);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.ellipse(10, 15, 200, 100, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.ellipse(10, 15, 200, 100);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.ellipse(10, 15, 200, 100, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".circle()", function () {

    it("should create circle", function () {
      var circ = r.circle(10, 15, 200);
      expect(circ.type).toEqual("circle");
      expect(circ.vars.x).toEqual(10);
      expect(circ.vars.y).toEqual(15);
      expect(circ.vars.radius).toEqual(200);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.circle(10, 15, 200, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.circle(10, 15, 200);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.circle(10, 15, 200, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".line()", function () {

    it("should create line", function () {
      var line = r.line(10, 15, 100, 105);
      expect(line.type).toEqual("line");
      expect(line.vars.x).toEqual(10);
      expect(line.vars.y).toEqual(15);
      expect(line.vars.x2).toEqual(100);
      expect(line.vars.y2).toEqual(105);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.line(10, 15, 100, 105, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.line(10, 15, 100, 105);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.line(10, 15, 100, 105, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".triangle()", function () {

    it("should create triangle", function () {
      var tri = r.triangle(10, 15, 100, 105, 20, 120);
      expect(tri.type).toEqual("triangle");
      expect(tri.vars.x).toEqual(10);
      expect(tri.vars.y).toEqual(15);
      expect(tri.vars.x2).toEqual(100);
      expect(tri.vars.y2).toEqual(105);
      expect(tri.vars.x3).toEqual(20);
      expect(tri.vars.y3).toEqual(120);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.line(10, 15, 100, 105, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.line(10, 15, 100, 105);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.line(10, 15, 100, 105, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".polygon()", function () {

    it("should create polygon", function () {
      var polygon = r.polygon(10, 15);
      expect(polygon.vars.x).toEqual(10);
      expect(polygon.vars.y).toEqual(15);
      expect(polygon.type).toEqual("polygon");
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.polygon(10, 15, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.polygon(10, 15);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.polygon(10, 15, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".path()", function () {

    it("should create path", function () {
      var path = r.path(10, 15);
      expect(path.vars.x).toEqual(10);
      expect(path.vars.y).toEqual(15);
      expect(path.type).toEqual("path");
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.path(10, 15, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.path(10, 15);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.path(10, 15, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".text()", function () {

    it("should create text", function () {
      var text = r.text("Hello", 10, 15);
      expect(text.vars.x).toEqual(10);
      expect(text.vars.y).toEqual(15);
      expect(text.vars.text).toEqual("Hello");
      expect(text.type).toEqual("text");
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.text("Hello", 10, 15, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.text("Hello", 10, 15);
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.text("Hello", 10, 15, false);
      expect(child.parent).toBeUndefined();
    });
  });

  describe(".grid()", function () {

    it("should create group", function () {
      var grid = r.grid({ x: 10, y: 15 });
      expect(grid.type).toEqual("grid");
      expect(grid.vars.x).toEqual(10);
      expect(grid.vars.y).toEqual(15);
    });

    it("should add to group", function () {
      var group = new Rune.Group();
      var child = r.grid({}, group);
      expect(child).toBeChildOf(group);
    });

    it("should add to fallback", function () {
      var child = r.grid({});
      expect(child).toBeChildOf(r.stage);
    });

    it("should not add", function () {
      var child = r.grid({}, false);
      expect(child.parent).toBeUndefined();
    });
  });
});

},{}],14:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Circle", function () {

  var s;
  var g;

  beforeEach(function () {
    s = new Rune.Circle(10, 15, 300);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function () {

    it("defaults to 16 vectors", function () {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(16);
    });

    it("returns polygon with even spaced vectors", function () {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(76);
    });

    it("adds polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function () {
      _helpers2["default"].setMixinVars(s);
      var p = s.toPolygon();
      expect(_helpers2["default"].getMixinVars(p)).toBeIn(_helpers2["default"].getMixinVars(s));
    });
  });

  describe("copy()", function () {

    it("copies the object", function () {
      _helpers2["default"].setMixinVars(s);
      var copy = s.copy();
      expect(copy).toEqual(s);
      expect(copy).not.toBe(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7}],15:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Ellipse", function () {

  var s;
  var g;

  beforeEach(function () {
    s = new Rune.Ellipse(10, 15, 300, 305);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function () {

    it("defaults to 16 vectors", function () {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(16);
    });

    it("returns polygon with even spaced vectors", function () {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(39);
    });

    it("adds polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function () {
      _helpers2["default"].setMixinVars(s);
      var p = s.toPolygon();
      expect(_helpers2["default"].getMixinVars(p)).toBeIn(_helpers2["default"].getMixinVars(s));
    });
  });

  describe("copy()", function () {

    it("copies the object", function () {
      _helpers2["default"].setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7}],16:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Line", function () {

  var s;
  var g;

  beforeEach(function () {
    s = new Rune.Line(10, 15, 20, 25);
    g = new Rune.Group();
    g.add(s);
  });

  describe("copy()", function () {

    it("copies the object", function () {
      _helpers2["default"].setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7}],17:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Path", function () {

  var g;
  var s;

  beforeEach(function () {
    g = new Rune.Group();
    s = new Rune.Path(10, 15).lineTo(100, 100).curveTo(100, 200, -100, 200, -100, 100).curveTo(-100, 0, 0, 0).moveTo(0, 25).lineTo(75, 75).lineTo(-75, 75).closePath();
    g.add(s);
  });

  describe("Path()", function () {

    it("should have optional x and y", function () {
      var p1 = new Rune.Path();
      expect(p1.vars.x).toEqual(0);
      expect(p1.vars.y).toEqual(0);

      var p2 = new Rune.Path(100, 101);
      expect(p2.vars.x).toEqual(100);
      expect(p2.vars.y).toEqual(101);
    });
  });

  describe("anchors", function () {

    it("should create anchors", function () {
      var p = new Rune.Path();
      _helpers2['default'].setAllAnchors(p);
      expect(p.vars.anchors[0]).toBeAnchorMove(0, 0);
      expect(p.vars.anchors[1]).toBeAnchorLine(104, 105);
      expect(p.vars.anchors[2]).toBeAnchorMove(106, 107);
      expect(p.vars.anchors[3]).toBeAnchorCubic(108, 109, 110, 111, 112, 113);
      expect(p.vars.anchors[4]).toBeAnchorQuad(114, 115, 116, 117);
    });
  });

  describe("Basic setters", function () {

    it("sets the var value", function () {
      var funcs = ["fillRule"];
      _underscore2['default'].each(funcs, function (func) {
        var p = new Rune.Path();
        var res = p[func](5);
        expect(p.vars[func]).toEqual(5);
        expect(p).toEqual(res);
      });
    });
  });

  describe("startVector()", function () {
    it("should return 0,0 if first command is not move", function () {
      var p = new Rune.Path(10, 15).lineTo(100, 100);
      expect(p.startVector()).toEqualVector(0, 0);
    });

    it("should return move location if first command is move", function () {
      var p = new Rune.Path(10, 15).moveTo(100, 100);
      expect(p.startVector()).toEqualVector(100, 100);
    });
  });

  describe("length()", function () {
    it("should return length of all subpaths", function () {
      expect(s.length()).toEqual(912.9528291563602);
    });
  });

  describe("vectorAt()", function () {

    it("should return vector at scalar", function () {
      var res = s.vectorAt(0.5);
      expect(res).toEqualVector(-95.04748002984878, 60.44400406520909);
    });

    it("should return vector if scalar is 0", function () {
      var res = s.vectorAt(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if scalar is 1", function () {
      var res = s.vectorAt(1);
      expect(res).toEqualVector(0, 0);
    });
  });

  describe("vectorAtLength()", function () {

    it("should return vector at length", function () {
      var res = s.vectorAtLength(70);
      expect(res).toEqualVector(49.49747468305832, 49.49747468305832);
    });

    it("should return vector if length is 0", function () {
      var res = s.vectorAtLength(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if length is more length", function () {
      var res = s.vectorAtLength(999999);
      expect(res).toEqualVector(0, 0);
    });
  });

  describe("subpaths()", function () {

    it("returns subpaths separated by moveTo", function () {
      var paths = s.subpaths();

      expect(paths.length).toEqual(2);
      var p1 = paths[0];
      var p2 = paths[1];

      expect(p1.vars.x).toEqual(10);
      expect(p1.vars.y).toEqual(15);
      expect(p1.vars.anchors.length).toEqual(4);
      expect(p1.vars.anchors[0]).toBeAnchorMove(0, 0);
      expect(p1.vars.anchors[1]).toBeAnchorLine(100, 100);
      expect(p1.vars.anchors[2]).toBeAnchorCubic(100, 200, -100, 200, -100, 100);
      expect(p1.vars.anchors[3]).toBeAnchorQuad(-100, 0, 0, 0);

      expect(p2.vars.x).toEqual(10);
      expect(p2.vars.y).toEqual(15);
      expect(p2.vars.anchors.length).toEqual(4);
      expect(p2.vars.anchors[0]).toBeAnchorMove(0, 25);
      expect(p2.vars.anchors[1]).toBeAnchorLine(75, 75);
      expect(p2.vars.anchors[2]).toBeAnchorLine(-75, 75);
      expect(p2.vars.anchors[3]).toBeAnchorClose();
    });

    it("returns subpaths separated by closeShape", function () {

      var triangles = new Rune.Path(10, 15).lineTo(100, 100).lineTo(0, 100).closePath().lineTo(-100, 100).lineTo(0, 100).closePath();

      var paths = triangles.subpaths();

      expect(paths.length).toEqual(2);
      var p1 = paths[0];
      var p2 = paths[1];

      expect(p1.vars.x).toEqual(10);
      expect(p1.vars.y).toEqual(15);
      expect(p1.vars.anchors.length).toEqual(4);
      expect(p1.vars.anchors[0]).toBeAnchorMove(0, 0);
      expect(p1.vars.anchors[1]).toBeAnchorLine(100, 100);
      expect(p1.vars.anchors[2]).toBeAnchorLine(0, 100);
      expect(p1.vars.anchors[3]).toBeAnchorClose();

      expect(p2.vars.x).toEqual(10);
      expect(p2.vars.y).toEqual(15);
      expect(p2.vars.anchors.length).toEqual(3);
      expect(p2.vars.anchors[0]).toBeAnchorLine(-100, 100);
      expect(p2.vars.anchors[1]).toBeAnchorLine(0, 100);
      expect(p2.vars.anchors[2]).toBeAnchorClose();
    });

    it("adds subpaths to parent", function () {
      expect(g.children.length).toEqual(1);
      s.subpaths();
      expect(g.children.length).toEqual(3);
    });

    it("does not add subpaths to parent", function () {
      expect(g.children.length).toEqual(1);
      s.subpaths(false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function () {
      _helpers2['default'].setMixinVars(s);
      var paths = s.subpaths();
      expect(_helpers2['default'].getMixinVars(paths[0])).toBeIn(_helpers2['default'].getMixinVars(s));
      expect(_helpers2['default'].getMixinVars(paths[1])).toBeIn(_helpers2['default'].getMixinVars(s));
    });
  });

  describe("toPolygons()", function () {

    it("should return array of polygons and vectors with spacing", function () {
      var res = s.toPolygons({ spacing: 25 });
      expect(res.length).toEqual(2);

      var poly1 = res[0];
      expect(poly1.vars.x).toEqual(10);
      expect(poly1.vars.y).toEqual(15);
      expect(poly1.vars.vectors.length).toEqual(24);

      var poly2 = res[1];
      expect(poly2.vars.x).toEqual(10);
      expect(poly2.vars.y).toEqual(15);
      expect(poly2.vars.vectors.length).toEqual(14);
    });

    it("adds polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygons({ spacing: 25 });
      expect(g.children.length).toEqual(3);
    });

    it("does not add polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygons({ spacing: 25 }, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function () {
      _helpers2['default'].setMixinVars(s);
      var p = s.toPolygons({ spacing: 25 });
      expect(_helpers2['default'].getMixinVars(p)).toBeIn(_helpers2['default'].getMixinVars(s));
    });
  });

  describe("copy()", function () {

    it("copies the object", function () {
      _helpers2['default'].setMixinVars(s);
      _helpers2['default'].setAllAnchors(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy.vars.anchors).not.toBe(s.vars.anchors);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7,"underscore":1}],18:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Polygon", function () {

  var g;
  var s;

  beforeEach(function () {
    g = new Rune.Group();
    s = new Rune.Polygon(10, 15).lineTo(0, 0).lineTo(60, 0).lineTo(80, 60).lineTo(20, 60);
    g.add(s);
  });

  describe("Polygon()", function () {

    it("should have optional x and y", function () {
      var p1 = new Rune.Polygon();
      expect(p1.vars.x).toEqual(0);
      expect(p1.vars.y).toEqual(0);

      var p2 = new Rune.Polygon(100, 101);
      expect(p2.vars.x).toEqual(100);
      expect(p2.vars.y).toEqual(101);
    });
  });

  describe("vectors", function () {

    it("should create vectors with start at 0,0", function () {
      var p = new Rune.Polygon().lineTo(100, 101).lineTo(200, 201).lineTo(300, 301);
      expect(p.vars.vectors[0]).toEqualVector(100, 101);
      expect(p.vars.vectors[1]).toEqualVector(200, 201);
      expect(p.vars.vectors[2]).toEqualVector(300, 301);
    });
  });

  describe("centroid()", function () {
    it("should return internal centroid vector", function () {
      var vec = s.centroid();
      expect(vec).toEqualVector(40, 30);
    });
  });

  describe("bounds()", function () {

    it("should return internal bounds", function () {
      expect(s.bounds()).toEqual({
        x: 0,
        y: 0,
        width: 80,
        height: 60
      });
    });

    it("should work with minus values", function () {
      var circle = new Rune.Polygon(10, 10).lineTo(-100, -100).lineTo(100, -100).lineTo(100, 100).lineTo(-100, 100);
      expect(circle.bounds()).toEqual({
        x: -100,
        y: -100,
        width: 200,
        height: 200
      });
    });
  });

  describe("length()", function () {

    it("should return length of polygon", function () {
      var res = s.length();
      expect(res).toEqual(246.49110640673518);
    });
  });

  describe("vectorAt()", function () {

    it("should return vector at scalar", function () {
      var res = s.vectorAt(0.5);
      expect(res).toEqualVector(80, 60);
    });

    it("should return vector if scalar is 0", function () {
      var res = s.vectorAt(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if scalar is 1", function () {
      var res = s.vectorAt(1);
      expect(res).toEqualVector(0, 0);
    });
  });

  describe("vectorAtLength()", function () {

    it("should return vector at length", function () {
      var res = s.vectorAtLength(70);
      expect(res).toEqualVector(63.16227766016838, 9.486832980505138);
    });

    it("should return vector if length is 0", function () {
      var res = s.vectorAtLength(0);
      expect(res).toEqualVector(0, 0);
    });

    it("should return vector if length is more length", function () {
      var res = s.vectorAtLength(999999);
      expect(res).toEqualVector(0, 0);
    });
  });

  describe("toPolygon()", function () {

    it("should return self if no segmentor", function () {
      var res = s.toPolygon();
      expect(res).toBe(res);
    });

    it("should return vectors with spacing", function () {
      var res = s.toPolygon({ spacing: 25 });
      expect(res.vars.x).toEqual(10);
      expect(res.vars.y).toEqual(15);
      expect(res.vars.vectors.length).toEqual(10);
      expect(res.vars.vectors[0]).toEqualVector(0, 0);
      expect(res.vars.vectors[1]).toEqualVector(25, 0);
      expect(res.vars.vectors[2]).toEqualVector(50, 0);
      expect(res.vars.vectors[3]).toEqualVector(64.74341649025257, 14.230249470757707);
      expect(res.vars.vectors[4]).toEqualVector(72.64911064067351, 37.94733192202055);
      expect(res.vars.vectors[5]).toEqualVector(78.24555320336759, 60);
      expect(res.vars.vectors[6]).toEqualVector(53.24555320336759, 60);
      expect(res.vars.vectors[7]).toEqualVector(28.245553203367592, 60);
      expect(res.vars.vectors[8]).toEqualVector(14.701778718652967, 44.1053361559589);
      expect(res.vars.vectors[9]).toEqualVector(6.796084568232018, 20.388253704696055);
    });

    it("adds polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon({ spacing: 25 });
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon({ spacing: 25 }, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function () {
      _helpers2["default"].setMixinVars(s);
      var p = s.toPolygon({ spacing: 25 });
      expect(_helpers2["default"].getMixinVars(p)).toBeIn(_helpers2["default"].getMixinVars(s));
    });
  });

  describe("copy()", function () {

    var s;
    var g;

    beforeEach(function () {
      s = new Rune.Polygon().lineTo(100, 101).lineTo(200, 201).lineTo(300, 301);
      g = new Rune.Group();
      g.add(s);
    });

    it("copies the object", function () {
      _helpers2["default"].setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy.vars.vectors).not.toBe(s.vars.vectors);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7}],19:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Rectangle", function () {

  var s;
  var g;

  beforeEach(function () {
    s = new Rune.Rectangle(10, 15, 300, 305);
    g = new Rune.Group();
    g.add(s);
  });

  describe("toPolygon()", function () {

    it("defaults to corner vectors", function () {
      var poly = s.toPolygon();
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(4);
      expect(poly.vars.vectors[0]).toEqualVector(0, 0);
      expect(poly.vars.vectors[1]).toEqualVector(300, 0);
      expect(poly.vars.vectors[2]).toEqualVector(300, 305);
      expect(poly.vars.vectors[3]).toEqualVector(0, 305);
    });

    it("returns polygon with even spaced vectors", function () {
      var poly = s.toPolygon({ spacing: 50 });
      expect(poly.vars.x).toEqual(10);
      expect(poly.vars.y).toEqual(15);
      expect(poly.vars.vectors.length).toEqual(25);
    });

    it("adds polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon();
      expect(g.children.length).toEqual(2);
    });

    it("does not add polygon to parent", function () {
      expect(g.children.length).toEqual(1);
      s.toPolygon({}, false);
      expect(g.children.length).toEqual(1);
    });

    it("copies the mixin vars", function () {
      _helpers2["default"].setMixinVars(s);
      var p = s.toPolygon();
      expect(_helpers2["default"].getMixinVars(p)).toBeIn(_helpers2["default"].getMixinVars(s));
    });
  });

  describe("copy()", function () {

    it("copies the object", function () {
      _helpers2["default"].setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7}],20:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

describe("Rune.Text", function () {

  var s;

  beforeEach(function () {
    s = new Rune.Text("Hello", 10, 15);
  });

  describe("Common setters", function () {

    var setters = {
      "textAlign": "center",
      "fontFamily": "Georgia",
      "fontStyle": "italic",
      "fontWeight": "bold",
      "fontSize": 32,
      "letterSpacing": 0.5,
      "textDecoration": "underline"
    };

    it("sets var", function () {
      _underscore2['default'].each(setters, function (v, k) {
        s[k](v);
        expect(s.vars[k]).toEqual(v);
      });
    });

    it("is chainable", function () {
      _underscore2['default'].each(setters, function (v, k) {
        var res = s[k](v);
        expect(res).toBe(res);
      });
    });
  });

  describe("toPolygon", function () {

    it("throws error if Rune.Font is not present", function () {
      expect(function () {
        s.toPolygon();
      }).toThrow(new Error("You need the Rune.Font plugin to convert text to polygon"));
    });
  });

  describe("copy()", function () {

    var g;

    beforeEach(function () {
      g = new Rune.Group();
      g.add(s);
    });

    it("copies the object", function () {
      _helpers2['default'].setMixinVars(s);
      var copy = s.copy();
      expect(copy).not.toBe(s);
      expect(copy).toEqual(s);
    });

    it("adds copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy();
      expect(g.children.length).toEqual(2);
    });

    it("does not add copy to parent", function () {
      expect(g.children.length).toEqual(1);
      s.copy(false);
      expect(g.children.length).toEqual(1);
    });
  });
});

},{"../helpers":7,"underscore":1}],21:[function(require,module,exports){
"use strict";

describe("Utils", function () {

  describe("groupLogic()", function () {

    var child;
    var fallback;
    var group;

    beforeEach(function () {
      child = new Rune.Rectangle(10, 20, 30, 40);
      fallback = new Rune.Group();
      group = new Rune.Group();
    });

    it("should add to group", function () {
      Rune.groupLogic(child, fallback, group);
      expect(group.children[0]).toBe(child);
      expect(fallback.children.length).toEqual(0);
    });

    it("should add to fallback", function () {
      Rune.groupLogic(child, fallback);
      expect(group.children.length).toEqual(0);
      expect(fallback.children[0]).toBe(child);
    });

    it("should not add", function () {
      Rune.groupLogic(child, fallback, false);
      expect(group.children.length).toEqual(0);
      expect(fallback.children.length).toEqual(0);
    });
  });

  describe("random()", function () {

    it("works with only high", function () {
      var ran = Rune.random(500);
      expect(ran >= 0).toBe(true);
      expect(ran <= 500).toBe(true);
    });

    it("works with low and high", function () {
      var ran = Rune.random(500, 1000);
      expect(ran >= 500).toBe(true);
      expect(ran <= 1000).toBe(true);
    });
  });
});

},{}],22:[function(require,module,exports){
"use strict";

describe("Rune.Vector", function () {

  var v1;
  var v2;

  beforeEach(function () {
    v1 = new Rune.Vector(10, 15);
    v2 = new Rune.Vector(20, 25);
  });

  describe("add()", function () {
    it("adds vectors", function () {
      var res = v1.add(v2);
      expect(res).toEqualVector(30, 40);
      expect(res).not.toBe(v1);
    });
  });

  describe("sub()", function () {
    it("subtracts vectors", function () {
      var res = v1.sub(v2);
      expect(res).toEqualVector(-10, -10);
      expect(res).not.toBe(v1);
    });
  });

  describe("multiply()", function () {
    it("multiplies vector", function () {
      var res = v1.multiply(3);
      expect(res).toEqualVector(30, 45);
      expect(res).not.toBe(v1);
    });
  });

  describe("divide()", function () {
    it("divides vector", function () {
      var res = v1.divide(3);
      expect(res).toEqualVector(10 / 3, 5);
      expect(res).not.toBe(v1);
    });
  });

  describe("distance()", function () {
    it("finds distance", function () {
      var res = v1.distance(v2);
      expect(res).toEqual(14.142135623730951);
    });
  });

  describe("lerp()", function () {
    it("finds lerp", function () {
      var res = v1.lerp(v2, 0.5);
      expect(res).toEqualVector(15, 20);
      expect(res).not.toBe(v1);
    });
  });

  describe("dot()", function () {
    it("finds dot product", function () {
      var res = v1.dot(v2);
      expect(res).toEqual(575);
    });
  });

  describe("length()", function () {
    it("finds length", function () {
      var res = v1.length();
      expect(res).toEqual(18.027756377319946);
    });
  });

  describe("normalize()", function () {
    it("normalizes vector", function () {
      var res = v1.normalize();
      expect(res).toEqualVector(0.5547001962252291, 0.8320502943378437);
      expect(res).not.toBe(v1);
    });
  });

  describe("rotation()", function () {
    it("finds rotation of vector", function () {
      var res = v1.rotation();
      expect(res).toBe(56.309932474020215);
    });
  });

  describe("rotate()", function () {
    it("rotates vector", function () {
      var res = v1.rotate(90);
      expect(res).toEqualVector(-15, 10);
      expect(res).not.toBe(v1);
    });
  });

  describe("copy()", function () {
    it("creates a new vector", function () {
      var v3 = v1.copy();
      expect(v1).toEqual(v3);
      expect(v3).not.toBe(v1);
    });
  });
});

},{}]},{},[8])


//# sourceMappingURL=shared.js.map