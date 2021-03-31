---
id: rmduplicate
title: 数组去重方法整理
sidebar_label: 数组去重方法整理
---

## 利用ES6 Set去重
```javascript
const unique = (arr) => Array.from(new Set(arr));

let arr = [1,1,'true','true',true,true,15,15,false,false, undefined,null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr)); 
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```
不考虑兼容性，这种去重的方法代码最少。这种方法还**无法去掉“{}”空对象**，后面的高阶方法会添加去掉重复“{}”的方法。

## 利用for嵌套for，再splice去重
```javascript
function unique(arr){
  for(let i = 0; i < arr.length; i++){
    for(let j=i+1; j< arr.length; j++){
      if(arr[i] == arr[j]){
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}

let arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
// [1, "true", 15, false, undefined, NaN, NaN, "NaN", "a", {…}, {…}]
// NaN和{}没有去重，两个null直接消失了
```
双层循环，外层循环元素，内层循环时比较值。值相同时，则删去这个值。

## 利用indexOf去重
```javascript
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array = [];
  for (var i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i]);
    }
  }
  return array;
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr));
// [1, "true", true, 15, false, undefined, null, NaN, NaN, "NaN", 0, "a", {…}, {…}]  
// NaN、{}没有去重
```

新建一个空的结果数组，for 循环原数组，判断结果数组是否存在当前元素，如果有相同的值则跳过，不相同则push进数组。

## 利用sort()
```javascript
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return;
    }
    arr = arr.sort()
    var arrry= [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1]) {
            arrry.push(arr[i]);
        }
    }
    return arrry;
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
// [0, 1, 15, "NaN", NaN, NaN, {…}, {…}, "a", false, null, true, "true", undefined]      //NaN、{}没有去重
```

利用sort()排序方法，然后根据排序后的结果进行遍历及相邻元素比对。

## 遍历使用includes
```javascript
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array =[];
  for(var i = 0; i < arr.length; i++) {
    if( !array.includes( arr[i]) ) { // includes 检测数组是否有某个值
      array.push(arr[i]);
    }
  }
  return array;
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr)); // [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}]     //{} 没有去重
```
