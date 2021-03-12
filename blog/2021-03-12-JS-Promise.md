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
Promise 是 ES6 中的特性，现在很多前端框架像 AngularJS，Vue 等在 HTTP 请求之后都是返回的 Promise 处理，因此 Promise 是必须要掌握的一个知识点。

<!--truncate-->

## Promise 定义

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

所谓 Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

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

## 练习题

### 交替重复亮灯

> 红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何使用Promise让三个灯不断交替重复亮灯？（海康威视笔试题）
```javascript
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
红灯亮起时，承诺2s秒后亮绿灯，绿灯亮起时承诺1s后亮黄灯，黄灯亮起时，承诺3s后亮红灯......这显然是一个Promise链式调用。
