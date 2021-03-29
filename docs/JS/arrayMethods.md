---
id: arrayMethods
title: JS 数组方法详解
sidebar_label: JS 数组方法详解
---

## Array.prototype.forEach()
`forEach()` 方法对数组的每个元素执行一次给定的函数。

```javascript
  /*
  * @param callback :为数组中每个元素执行的函数，该函数接收一至三个参数：
  * --------------- currentValue :数组中正在处理的当前元素。
  * --------------- index :[可选]数组中正在处理的当前元素的索引。
  * --------------- array :[可选]forEach() 方法正在操作的数组。
  * @param thisArg :[可选]当执行回调函数 callback 时，用作 this 的值。
  * @return undefined
  */
  arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```

DEMO:
```javascript
const array1 = ['a', 'b', 'c'];

array1.forEach(element => console.log(element));

// expected output: "a"
// expected output: "b"
// expected output: "c"
```

### 中止 forEach
除了抛出异常以外，没有办法中止或跳出 forEach() 循环。

### 使用 thisArg 案例
```javascript
function Counter() {
  this.sum = 0;
  this.count = 0;
}
Counter.prototype.add = function(array) {
  array.forEach(function(entry) {
    this.sum += entry;
    ++this.count;
  }, this);
  // ^---- Note
};

const obj = new Counter();
obj.add([2, 5, 9]);
obj.count;
// 3 === (1 + 1 + 1)
obj.sum;
// 16 === (2 + 5 + 9)
```

因为 `thisArg` 参数（`this`）传给了 `forEach()`，每次调用时，它都被传给 `callback` 函数，作为它的 `this` 值。

:::caution
如果使用箭头函数表达式来传入函数参数， thisArg 参数会被忽略，因为箭头函数在词法上绑定了 this 值。
:::

### 扁平化数组
将嵌套多层的数组“拉平”，变成一维的数组的方式，实现方式很多，挑其中几个最优方式即可。

#### (1) Array​.prototype​.flat()
`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```javascript
/*
* @param depth :[可选]指定要提取嵌套数组的结构深度，默认值为 1。
*/
var newArray = arr.flat([depth]);
```

DEMO:
```javascript
const arr1 = [0, 1, 2, [3, 4]];

console.log(arr1.flat());
// expected output: [0, 1, 2, 3, 4]

const arr2 = [0, 1, 2, [[[3, 4]]]];

console.log(arr2.flat(2));
// expected output: [0, 1, 2, [3, 4]]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

#### (2) forEach 递归调用
```javascript
/**
 * Flattens passed array in one dimensional array
 *
 * @params {array} arr
 * @returns {array}
 */
function flatten(arr) {
  const result = [];

  arr.forEach((i) => {
    if (Array.isArray(i))
      result.push(...flatten(i));
    else
      result.push(i);
  })

  return result;
}

// Usage
const problem = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
flatten(problem); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### (3) 使用 reduce 与 concat
```javascript
var arr = [1, 2, [3, 4]];

// 展开一层数组 arr.flat()
arr.reduce((acc, val) => acc.concat(val), []); // [1, 2, 3, 4]

// 使用扩展运算符 ...
const flattened = arr => [].concat(...arr); // [1, 2, 3, 4]
```

#### (4) reduce + concat + isArray + recursivity
```javascript
// 使用 reduce、concat 和递归展开无限多层嵌套的数组
var arr1 = [1,2,3,[1,2,3,4, [2,3,4]]];

function flatDeep(arr, d = 1) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};

flatDeep(arr1, Infinity);
// [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

#### (5) forEach + isArray + push + recursivity
```javascript
// forEach 遍历数组会自动跳过空元素
const eachFlat = (arr = [], depth = 1) => {
  const result = []; // 缓存递归结果
  // 开始递归
  (function flat(arr, depth) {
    // forEach 会自动去除数组空位
    arr.forEach((item) => {
      // 控制递归深度
      if (Array.isArray(item) && depth > 0) {
        // 递归数组
        flat(item, depth - 1)
      } else {
        // 缓存元素
        result.push(item)
      }
    })
  })(arr, depth)
  // 返回递归结果
  return result;
}

// for of 循环不能去除数组空位，需要手动去除
const forFlat = (arr = [], depth = 1) => {
  const result = [];
  (function flat(arr, depth) {
    for (let item of arr) {
      if (Array.isArray(item) && depth > 0) {
        flat(item, depth - 1)
      } else {
        // 去除空元素，添加非undefined元素
        item !== void 0 && result.push(item);
      }
    }
  })(arr, depth)
  return result;
}
```

#### (6) 使用堆栈stack
```javascript
// 无递归数组扁平化，使用堆栈
// 注意：深度的控制比较低效，因为需要检查每一个值的深度
// 也可能在 shift / unshift 上进行 w/o 反转，但是末端的数组 OPs 更快
var arr1 = [1,2,3,[1,2,3,4, [2,3,4]]];
function flatten(input) {
  const stack = [...input];
  const res = [];
  while (stack.length) {
    // 使用 pop 从 stack 中取出并移除值
    const next = stack.pop();
    if (Array.isArray(next)) {
      // 使用 push 送回内层数组中的元素，不会改动原始输入
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // 反转恢复原数组的顺序
  return res.reverse();
}
flatten(arr1);// [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]


// 递归版本的反嵌套
function flatten(array) {
  var flattend = [];
  (function flat(array) {
    array.forEach(function(el) {
      if (Array.isArray(el)) flat(el);
      else flattend.push(el);
    });
  })(array);
  return flattend;
}
```

#### (7) Use Generator function
```javascript
function* flatten(array) {
    for (const item of array) {
        if (Array.isArray(item)) {
            yield* flatten(item);
        } else {
            yield item;
        }
    }
}

var arr = [1, 2, [3, 4, [5, 6]]];
const flattened = [...flatten(arr)];
// [1, 2, 3, 4, 5, 6]
```

## Array.prototype.map()
`map()` 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

```javascript
/*
* @param callback: 生成新数组元素的函数， 使用三个参数：
* --------------- currentValue：callback 数组中正在处理的当前元素。
* --------------- index: [可选] 数组中正在处理的当前元素的索引。
* --------------- array: [可选] map 方法调用的数组。
* @param thisArg: [可选] 执行 callback 函数时值被用作 this 。
* @return array: 一个由原数组每个元素执行回调函数的结果组成的新数组。
*/
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array 
}[, thisArg]);
```

DEMO: 
```javascript
// 下面的代码创建了一个新数组，值为原数组中对应数字的平方根。
let numbers = [1, 4, 9];
let roots = numbers.map(Math.sqrt);  // roots的值为[1, 2, 3], numbers的值仍为[1, 4, 9]
```

### map() 面试题
```javascript
["1", "2", "3"].map(parseInt); // 我们期望输出 [1, 2, 3], 而实际结果是 [1, NaN, NaN].

['10', '10', '10'].map(parseInt); // 输出结果为 [10, NaN, 2].
```

parseInt 经常被带着一个参数使用, 但是这里接受两个。第一个参数是一个表达式而第二个是callback function的基, Array.prototype.map 传递3个参数:

* the element
* the index
* the array

第三个参数被parseInt忽视了, but not the second one, 但不是第二个。因此可能出现混淆。下面是迭代步骤的简明示例：
```javascript
//  parseInt(string, radix) -> map(parseInt(value, index))
/*  first iteration (index is 0): */  parseInt("1", 0); // 1
/*  second iteration (index is 1): */ parseInt("2", 1); // NaN
/*  third iteration (index is 2): */  parseInt("3", 2); // NaN
```

**解决方案**:
```javascript
function returnInt(element) {
  return parseInt(element, 10);
}

['1', '2', '3'].map(returnInt); // [1, 2, 3]
// Actual result is an array of numbers (as expected)

// Same as above, but using the concise arrow function syntax
['1', '2', '3'].map( str => parseInt(str) );

// A simpler way to achieve the above, while avoiding the "gotcha":
['1', '2', '3'].map(Number); // [1, 2, 3]

// But unlike parseInt(), Number() will also return a float or (resolved) exponential notation:
['1.1', '2.2e2', '3e300'].map(Number); // [1.1, 220, 3e+300]
// For comparison, if we use parseInt() on the array above:
['1.1', '2.2e2', '3e300'].map( str => parseInt(str) ); // [1, 2, 3]
```

## Array.prototype.filter()
`filter()` 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

```javascript
/*
* @param callback: 用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。它接受以下三个参数：
* --------------- element：数组中当前正在处理的元素。
* --------------- index: [可选] 正在处理的元素在数组中的索引。
* --------------- array: [可选] map 方法调用的数组。
* @param thisArg: [可选] 执行 callback 时，用于 this 的值。
* @return array: 一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。
*/
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg]);
```

DEMO:
```javascript
function isBigEnough(element) {
  return element >= 10;
}
var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
// filtered is [12, 130, 44]
```

数组去重：
```javascript
let a = [];
[1, 1, 1, 2, 2, 3, 4, 4, 4, 6, 6, 6, 7].filter(el => a.indexOf(el) == -1 ? a.push(el) : '');
// [1, 2, 3, 4, 6, 7]
```

## Array.prototype.some()
`some()` 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个 `Boolean` 类型的值。

:::info
注意：如果用一个空数组进行测试，在任何情况下它返回的都是false。
:::

```javascript
/*
* @param callback: 用来测试每个元素的函数，接受三个参数：
* --------------- element：数组中正在处理的元素。
* --------------- index: [可选] 数组中正在处理的元素的索引值。
* --------------- array: [可选] some()被调用的数组。
* @param thisArg: [可选] 执行 callback 时使用的 this 值。
* @return boolean: 数组中有至少一个元素通过回调函数的测试就会返回true；所有元素都没有通过回调函数的测试返回值才会为false。
*/
arr.some(callback(element[, index[, array]])[, thisArg])
```

DEMO:
```javascript
// 下例检测数组中的所有元素是否都大于 10。
[2, 5, 8, 1, 4].some(x => x>10);  // false
[12, 5, 8, 1, 4].some(x => x>10); // true
```

## Array.prototype.every()
`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

:::info
注意：若收到一个空数组，此方法在一切情况下都会返回 true。
:::

```javascript
/*
* @param callback: 用来测试每个元素的函数，它可以接收三个参数：
* --------------- element：用于测试的当前值。
* --------------- index: [可选] 用于测试的当前值的索引。
* --------------- array: [可选] 调用 every 的当前数组。
* @param thisArg: [可选] 执行 callback 时使用的 this 值。
* @return boolean: 如果回调函数的每一次返回都为 truthy 值，返回 true ，否则返回 false。
*/
arr.every(callback(element[, index[, array]])[, thisArg])
```

DEMO:
```javascript
// 下例检测数组中的所有元素是否都大于 10。
[12, 5, 8, 130, 44].every(el => el >= 10);   // false
[12, 54, 18, 130, 44].every(el => el >= 10); // true


// 是否都小于 40
const isBelowThreshold = (currentValue) => currentValue < 40;
const array1 = [1, 30, 39, 29, 10, 13];
console.log(array1.every(isBelowThreshold)); // expected output: true
```

## Array.prototype.indexOf()
`indexOf()` 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

```javascript
/*
* @param searchElement: 要查找的元素。
* @param fromIndex : [可选] 开始查找的位置。
* @return number: 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1。
*/
arr.indexOf(searchElement[, fromIndex])
```

DEMO:
```javascript
var array = [2, 5, 9];
array.indexOf(2);     // 0
array.indexOf(7);     // -1
array.indexOf(9, 2);  // 2
array.indexOf(2, -1); // -1
array.indexOf(2, -3); // 0
```

## Array.prototype.lastIndexOf()
`lastIndexOf()` 方法返回指定元素（也即有效的 `JavaScript` 值或变量）在数组中的最后一个的索引，如果不存在则返回 `-1`。从数组的后面向前查找，从 `fromIndex` 处开始。

```javascript
/*
* @param searchElement: 被查找的元素。
* @param fromIndex : [可选] 从此位置开始逆向查找。默认为数组的长度减 1(arr.length - 1)，即整个数组都被查找。如果该值大于或等于数组的长度，则整个数组会被查找。如果为负值，将其视为从数组末尾向前的偏移。即使该值为负，数组仍然会被从后向前查找。如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。
* @return number: 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1。
*/
arr.lastIndexOf(searchElement[, fromIndex])
```

## Array.prototype.reduce()
`reduce()` 方法对数组中的每个元素执行一个由您提供的`reducer`函数(升序执行)，将其结果汇总为单个返回值。

```javascript
/*
* @param callback: 执行数组中每个值 (如果没有提供 initialValue则第一个值除外)的函数，包含四个参数：
* --------------- accumulator：累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue（见于下方）。
* --------------- currentValue: 数组中正在处理的元素。
* --------------- index: 数组中正在处理的当前元素的索引。 如果提供了initialValue，则起始索引号为0，否则从索引1起始。
* --------------- array: [可选] 调用reduce()的数组
* @param initialValue: [可选] 作为第一次调用 callback函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。
* @return any: 函数累计处理的结果。
*/
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```