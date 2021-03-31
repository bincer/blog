---
id: arrayMethods
title: 数组方法详解
sidebar_label: 数组方法详解
---

## Array.prototype.concat()
> concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

```javascript
  /*
  * @param valueN : 数组和/或值，将被合并到一个新的数组中。如果省略了所有 valueN 参数，则 concat 会返回调用此方法的现存数组的一个浅拷贝。详情请参阅下文描述。
  * @return : 新的 Array 实例。
  */
  var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])

  
  // Demo: 连接两个数组
  var alpha = ['a', 'b', 'c'];
  var numeric = [1, 2, 3];
  alpha.concat(numeric); // ['a', 'b', 'c', 1, 2, 3]

  // Demo: 连接三个数组
  var num1 = [1, 2, 3],
      num2 = [4, 5, 6],
      num3 = [7, 8, 9];
  var nums = num1.concat(num2, num3);
  console.log(nums); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## Array.prototype.forEach()
> forEach() 方法对数组的每个元素执行一次给定的函数。

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

  
  // Demo: 遍历输出
  const arr = ['a', 'b', 'c'];
  arr.forEach(el => console.log(el));
  // "a"
  // "b"
  // "c"
```

:::note
  除了抛出异常以外，没有办法中止或跳出 forEach() 循环。
:::

**使用 thisArg 案例**:
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
obj.count; // 3 === (1 + 1 + 1)
obj.sum;   // 16 === (2 + 5 + 9)
```

因为 `thisArg` 参数（`this`）传给了 `forEach()`，每次调用时，它都被传给 `callback` 函数，作为它的 `this` 值。

:::info
如果使用箭头函数表达式来传入函数参数， thisArg 参数会被忽略，因为箭头函数在词法上绑定了 this 值。
:::

## Array.prototype.map()
> map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

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


// Demo: 创建了一个新数组，值为原数组中对应数字的平方根。
let numbers = [1, 4, 9];
let roots = numbers.map(Math.sqrt);  // roots的值为[1, 2, 3], numbers的值仍为[1, 4, 9]
```

**map() 面试题**：
```javascript
["1", "2", "3"].map(parseInt); // 我们期望输出 [1, 2, 3], 而实际结果是 [1, NaN, NaN]
['10', '10', '10'].map(parseInt); // 输出结果为 [10, NaN, 2]
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


// 解决方案1，但注意小数的时候，parseInt会丢掉小数部分
['1', '2', '3'].map(el => parseInt(el, 10)); // [1, 2, 3]

// 解决方案2，可转化小数部分
['1', '2', '3'].map(Number); // [1, 2, 3]
```

## Array.prototype.filter()
> filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

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


// Demo: 数组大于10的项
let filtered = [12, 5, 8, 130, 44].filter((el) => el >= 10); // [12, 130, 44]

// Demo: 数组去重
let a = [];
[1, 1, 1, 2, 2, 3, 4, 4, 4, 6, 6, 6, 7].filter(el => a.indexOf(el) == -1 ? a.push(el) : "");
// [1, 2, 3, 4, 6, 7]
```

## Array.prototype.some()
> some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。

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
arr.some(callback(element[, index[, array]])[, thisArg]);


// Demo: 检测数组中的所有元素是否都大于 10。
[2, 5, 8, 1, 4].some(x => x>10);  // false
[12, 5, 8, 1, 4].some(x => x>10); // true
```

## Array.prototype.every()
> every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

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
arr.every(callback(element[, index[, array]])[, thisArg]);


// Demo: 检测数组中的所有元素是否都大于 10。
[12, 5, 8, 130, 44].every(el => el >= 10);   // false
[12, 54, 18, 130, 44].every(el => el >= 10); // true

// Demo: 是否都小于 40
const isBelowThreshold = (currentValue) => currentValue < 40;
const array1 = [1, 30, 39, 29, 10, 13];
console.log(array1.every(isBelowThreshold)); // true
```

## Array.prototype.indexOf()
> indexOf() 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

```javascript
/*
* @param searchElement: 要查找的元素。
* @param fromIndex : [可选] 开始查找的位置。
* @return number: 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1。
*/
arr.indexOf(searchElement[, fromIndex]);


// Demo:
var array = [2, 5, 9];
array.indexOf(2);     // 0
array.indexOf(7);     // -1
array.indexOf(9, 2);  // 2
array.indexOf(2, -1); // -1
array.indexOf(2, -3); // 0
```

## Array.prototype.lastIndexOf()
> lastIndexOf() 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始。

```javascript
/*
* @param searchElement: 被查找的元素。
* @param fromIndex : [可选] 从此位置开始逆向查找。默认为数组的长度减 1(arr.length - 1)，即整个数组都被查找。如果该值大于或等于数组的长度，则整个数组会被查找。如果为负值，将其视为从数组末尾向前的偏移。即使该值为负，数组仍然会被从后向前查找。如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。
* @return number: 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1。
*/
arr.lastIndexOf(searchElement[, fromIndex]);
```

## Array.prototype.reduce()
> reduce() 方法对数组中的每个元素执行一个由您提供的 reducer 函数(升序执行)，将其结果汇总为单个返回值。

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
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue]);


// Demo: 将二维数组转化为一维
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  ( acc, cur ) => acc.concat(cur),
  []
);  // [0, 1, 2, 3, 4, 5]

// Demo: 数组去重
let arr = [1,2,1,2,3,5,4,5,3,4,4,4,4];
let result = arr.sort().reduce((init, current) => {
    if(init.length === 0 || init[init.length-1] !== current) {
        init.push(current);
    }
    return init;
}, []);
console.log(result); // [1, 2, 3, 4, 5]
```

## Array.prototype.reduceRight()
> reduceRight() 方法接受一个函数作为累加器（accumulator）和数组的每个值（从右到左）将其减少为单个值。

```javascript
/*
* @param callback: 一个回调函数，用于操作数组中的每个元素，它可接受四个参数：
* --------------- accumulator：累加器：上一次调用回调函数时，回调函数返回的值。首次调用回调函数时，如果 initialValue 存在，累加器即为 initialValue，否则须为数组中的最后一个元素（详见下方 initialValue 处相关说明）。
* --------------- currentValue: 当前元素：当前被处理的元素。
* --------------- index: [可选] 数组中正在处理的当前元素的索引。 如果提供了initialValue，则起始索引号为0，否则从索引1起始。
* --------------- array: [可选] 数组中当前被处理的元素的索引。
* @param initialValue: [可选] 首次调用 callback 函数时，累加器 accumulator 的值。如果未提供该初始值，则将使用数组中的最后一个元素，并跳过该元素。如果不给出初始值，则需保证数组不为空。
* @return any: 执行之后的返回值。
*/
arr.reduceRight(callback(accumulator, currentValue[, index[, array]])[, initialValue]);


// Demo: 求一个数组中所有值的和
var sum = [0, 1, 2, 3].reduceRight(function(a, b) {
  return a + b;
}); // 6

// Demo: 扁平化（flatten）一个二维数组
var flattened = [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
    return a.concat(b);
}, []); 
// [4, 5, 2, 3, 0, 1]

```

## Array.prototype.join()
> join() 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。

```javascript
/*
* @param separator: 指定一个字符串来分隔数组的每个元素。如果需要，将分隔符转换为字符串。如果缺省该值，数组元素用逗号（,）分隔。如果separator是空字符串("")，则所有元素之间都没有任何字符。
* @return: 一个所有数组元素连接的字符串。如果 arr.length 为0，则返回空字符串。
*/
arr.join([separator]);


// Demo:
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join()); // "Fire,Air,Water"
console.log(elements.join('')); // "FireAirWater"
console.log(elements.join('-')); // "Fire-Air-Water"
```

## Array.prototype.pop()
> pop()方法从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度。

```javascript
/*
* @return: 当前删除元素的值 ，改变数组的长度。
*/
arr.pop();


// Demo:
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];

console.log(plants.pop()); // "tomato"

console.log(plants); // ["broccoli", "cauliflower", "cabbage", "kale"]

plants.pop();
console.log(plants); // ["broccoli", "cauliflower", "cabbage"]
```

## Array.prototype.push()
> push() 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度。

```javascript
/*
* @param elementN:  被添加到数组末尾的元素。
* @return : 当调用该方法时，新的 length 属性值将被返回。
*/
arr.push(element1, ..., elementN);


// Demo：
const animals = ['pigs', 'goats', 'sheep'];

const count = animals.push('cows');
console.log(count); // 4

console.log(animals); // ["pigs", "goats", "sheep", "cows"]

animals.push('chickens', 'cats', 'dogs');
console.log(animals); // ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```

## Array.prototype.shift()
> shift() 方法从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。

```javascript
/*
* @return :从数组中删除的元素; 如果数组为空则返回undefined 。 
*/
arr.shift();


// Demo:
const array1 = [1, 2, 3];

const firstElement = array1.shift();

console.log(array1); // [2, 3]
console.log(firstElement); // 1
```

## Array.prototype.slice()
> slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。

```javascript
/*
* @param begin：[可选]提取起始处的索引（从 0 开始），从该索引开始提取原数组元素。如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取，slice(-2) 表示提取原数组中的倒数第二个元素到最后一个元素（包含最后一个元素）。
* @param end: 提取终止处的索引（从 0 开始），在该索引处结束提取原数组元素。slice 会提取原数组中索引从 begin 到 end 的所有元素（包含 begin，但不包含 end）。
* @return 一个含有被提取元素的新数组。
*/
arr.slice([begin[, end]]);



// Demo:
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2)); // ["camel", "duck", "elephant"]
console.log(animals.slice(2, 4)); // ["camel", "duck"]
console.log(animals.slice(1, 5)); // ["bison", "camel", "duck", "elephant"]
```

## Array.prototype.splice()
> splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。

```javascript
/*
* @param start​: 指定修改的开始位置（从0计数）。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位（从-1计数，这意味着-n是倒数第n个元素并且等价于array.length-n）；如果负数的绝对值大于数组的长度，则表示开始位置为第0位。
* @param deleteCount: [可选]整数，表示要移除的数组元素的个数。
* @param item1, item2, ...: [可选]要添加进数组的元素,从start 位置开始。如果不指定，则 splice() 将只删除数组元素。
* @return :由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。
*/
array.splice(start[, deleteCount[, item1[, item2[, ...]]]]);

const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb'); // inserts at index 1
console.log(months); // ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May'); // replaces 1 element at index 4
console.log(months); // ["Jan", "Feb", "March", "April", "May"]
```

## Array.prototype.unshift()
> unshift() 方法将一个或多个元素添加到数组的开头，并返回该数组的新长度(该方法修改原有数组)。

```javascript
/*
* @param elementN: 要添加到数组开头的元素或多个元素。
* @return : 当一个对象调用该方法时，返回其 length 属性值。
*/
arr.unshift(element1, ..., elementN);


// Demo:
const array1 = [1, 2, 3];

console.log(array1.unshift(4, 5)); // 5
console.log(array1); // [4, 5, 1, 2, 3]
```

## 扩展阅读
+ [扁平化数组 - 方法与思路整理](./flattened)
+ [一张图看懂JavaScript中数组的迭代方法](/img/210330/953f456d7290649.png)
+ [数组去重方法整理](./rmduplicate)