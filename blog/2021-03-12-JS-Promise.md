---
slug: JS-Promise
title: Promise总结与练习
author: Bincer
description: Promise是ES6中的特性，现在很多前端框架像AngularJS，Vue等在HTTP请求之后都是返回的Promise处理，因此Promise是必须要掌握的一个知识点。
image: /static/img/210312/21031201.png
author_image_url: /static/img/headImg1.gif
tags: [Promise]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img alt="promise 插图" src={useBaseUrl('img/210312/21031201.png')} />
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。Promise 是 ES6 中的特性，现在很多前端框架像 AngularJS，Vue 等在 HTTP 请求之后都是返回的 Promise 处理，因此 Promise 是必须要掌握的一个知识点。

<!--truncate-->

## Promise 定义

所谓 Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

**Promise 新建后就会立即执行。**

### 三种状态

- `pending`（进行中）
- `fulfilled`（已成功）
- `rejected`（已失败）

### 特点

1. 对象的状态不受外界影响。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

### 缺点

1. 无法取消 `Promise` ，一旦新建它就会立即执行，无法中途取消。
2. 如果不设置回调函数，`Promise` 内部抛出的错误，不会反应到外部。
3. 当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

## Promise.prototype.then()
`Promise` 实例具有 `then` 方法，也就是说，`then` 方法是定义在原型对象 `Promise.prototype` 上的。它的作用是为 `Promise` 实例添加状态改变时的回调函数。`then` 方法的第一个参数是 `resolved` 状态的回调函数，第二个参数是 `rejected` 状态的回调函数，它们都是可选的。`then` 方法返回的是一个新的 `Promise` 实例。

## Promise.prototype.catch()
`Promise.prototype.catch()` 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于指定发生错误时的回调函数。


## 练习题

### 交替重复亮灯

> 红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何使用Promise让三个灯不断交替重复亮灯？（海康威视笔试题）

```js
function red() {
  console.log('red');
}

function green() {
  console.log('green');
}

function yellow() {
  console.log('yellow');
}
```

**解析：** 
红灯亮起时，承诺2s秒后亮绿灯，绿灯亮起时承诺1s后亮黄灯，黄灯亮起时，承诺3s后亮红灯......这显然是一个Promise链式调用。我们需要将我们的每一个亮灯动作写在then()方法中，同时返回一个新的Promise，并将其状态由pending设置为fulfilled，允许下一盏灯亮起。

```js
function red() {
  conslo.log('red');
}

function green(){
  console.log('green');
}

function yellow(){
  console.log('yellow');
}

let myLight = (timer, cb) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb();
      resolve();
    }, timer);
  });
};

let myStep = () => {
  Promise.resolve().then(() => {
    return myLight(3000, red);
  }).then(() => {
    return myLight(2000, green);
  }).then(() => {
    return myLight(1000, yellow);
  }).then(() => {
    myStep();
  });
};

myStep();
```

