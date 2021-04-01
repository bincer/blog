---
id: flattened
title: 扁平化数组 - 方法与思路整理
sidebar_label: 扁平化数组
---

>扁平化管理是企业为解决层级结构的组织形式在现代环境下面临的难题而实施的一种管理模式。当企业规模扩大时，原来的有效办法是增加管理层次，而现在的有效办法是增加管理幅度。当管理层次减少而管理幅度增加时，金字塔状的组织形式就被“压缩”成扁平状的组织形式。

## 数组扁平化
> 用于将嵌套多层的数组“拉平”，变成一维的数组。<br/>
> [1, [2]] => [1,2]<br/>
> [[1, 2], [3, 4]] => [1, 2, 3, 4]<br/>
> [1, 2, [3, 4, [5, 6]]] => [1, 2, 3, 4, 5, 6]

## (1) Array​.prototype​.flat()
`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```javascript
/*
* @param depth :[可选]指定要提取嵌套数组的结构深度，默认值为 1。
*/
var newArray = arr.flat([depth]);


/*
* 下方是 flat() 方法使用去重方式：
*/
const arr1 = [0, 1, 2, [3, 4]];
console.log(arr1.flat()); // [0, 1, 2, 3, 4]

const arr2 = [0, 1, 2, [[[3, 4]]]];
console.log(arr2.flat(2)); // [0, 1, 2, [3, 4]]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## (2) forEach 递归调用
核心思想就是:
+ **遍历**每个元素，**判断**元素是不是**数组**：
  * 是 => 放入数组中，再进行**递归调用**，直到没有数组。返回结果，再使用**扩展运算**。
  * 否 => 放入数组中。

```javascript
/**
 * Flattens passed array in one dimensional array
 * @params {array} arr
 * @returns {array}
 */
const flatten = (arr) => {
  const result = [];
  arr.forEach((i) => {
    Array.isArray(i) ? result.push(...flatten(i)) : result.push(i);
  });
  return result;
}

// Usage
const problem = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
flatten(problem); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## (3) 【一层】使用 reduce 与 concat 
`concat()` 方法：参数(**数组和/或值**)，将被合并到一个新的数组中。

```javascript
var arr = [1, 2, [3, 4]];

// 展开一层数组 arr.flat()
arr.reduce((acc, val) => acc.concat(val), []); // [1, 2, 3, 4]

// 使用扩展运算符 ...
const flattened = arr => [].concat(...arr); // [1, 2, 3, 4]
```

## (4) reduce + concat + isArray + recursivity
:::caution
reduce(函数，初始值) ------- 一定不要忘记初始值，要不然会报 concat方法未定义！！！
:::

```javascript
// 使用 reduce、concat 和递归展开无限多层嵌套的数组：
var arr1 = [1,2,3,[1,2,3,4, [2,3,4]]];

function flatDeep(arr, d = 1) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};

flatDeep(arr1, Infinity); // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

## (5) forEach + isArray + push + recursivity
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

## (6) 使用堆栈stack
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

## (7) 使用 Generator 函数
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

## (8) toString()
> toString()方法有很大局限性，只适用于数组元素全部为数字的情况下

```javascript
  // toString && Json.parase
  let arr = [[1, 2, [3, 4], 5], [6, 7, 8], [[9, 10], 11]];
  function flat(arr) {
    var str = arr.toString();
    return JSON.parse('[' + str + ']');
  }
  console.log(flat(arr)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  // toString && split
  let arr = [[1, 2, [3, 4], 5], [6, 7, 8], [[9, 10], 11]];
  function flat(arr) {
    return arr.toString().split(',').map(item => {
      return Number(item)
    })
  }
  console.log(flat(arr)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  // join && split
  let arr = [[1, 2, [3, 4], 5], [6, 7, 8], [[9, 10], 11]];
  function flat(arr) {
    return arr.join(',').split(',').map(item => {
      return Number(item);
    })
  }
  console.log(flat(arr)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

## (9) 迭代 some()
`some()` 方法用于检测数组中的元素是否满足指定条件（函数提供）。`some()` 方法会依次执行数组的每个元素：
+ 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
+ 如果没有满足条件的元素，则返回false。
  注意： `some()` 不会对空数组进行检测，不会改变原始数组。
  语法：`array.some(function(currentValue,index,arr),thisValue)`
+ 参数：
  * function(currentValue, index,arr) 必须。函数，数组中的每个元素都会执行这个函数
  * -------- currentValue 必须。当前元素的值。
  * -------- index 可选。当前元素的索引值。
  * -------- arr 可选。当前元素属于的数组对象。
  * thisValue 可选。对象作为该执行回调时使用，传递给函数，用作 “this” 的值。
    如果省略了 thisValue ，“this” 的值为 “undefined”

```javascript
while(arr.some(Array.isArray)){
  arr = [].concat(...arr);
}
```