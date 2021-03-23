---
id: runtime
title: 解读 JS 之引擎、堆栈调用和事件循环
sidebar_label: JavaScript 之引擎
---
import useBaseUrl from '@docusaurus/useBaseUrl';

## 基本概念

> + **栈（Stack）**: 用来保存简单的数据字段。
> + **堆（Heap）**：用来保存栈中简单的数据字段堆指针的引用。
> + **队列**：是一种先进先出的线性数据结构。函数的调用的进栈和出栈的顺序，遵循 **先进后出** 的原则。

1. 空间分配：
    * **堆**：一般由程序员释放，如果程序员不释放就会在结束时由OS回收；
    * **栈**：一般由操作系统自动分配释放。
2. 缓存方式：
    * **堆**：存放在二级缓存中，生命周期一般是由虚拟机的垃圾回收算法决定的；
    * **栈**：存放在一级缓存中，被调用时处于存储空间，调用完立即释放。
3. 操作数据：
    * **堆栈**：先进后出
    * **队列**：先进先出

**扩展**：JS 数据类型分为：基本数据类型（Number 、 String 、 Boolean、 Undefined、Null）与引用类型（Object、 Array）。基本类型、引用类型数据以及 堆栈的关系如下图：

<img alt="V8 引擎" src={useBaseUrl('img/210319/20181216174831539.png')} />

如上图所示，栈内存中 关于 引用类型的数据的是通过指针(地址)来引用的，指针和地址指向堆内存中的数据。为啥为导致上述区别，是因为：
* 基本类型的数据简单，所占用空间比较小，内存由系统自动分配
* 引用类型数据比较复杂，复杂程度是动态的，计算机为了较少反复的创建和回收引用类型数据所带来的损耗，就先为其开辟另外一部分空间——及堆内存，以便于这些占用空间较大的数据重复利用。堆内存中的数据不会随着方法的结束立即销毁，有可能该对象会被其它方法所引用，直到系统的垃圾回收机制检索到该对象没有被任何方法所引用的时候才会对其进行回收

## JavaScript 引擎
Google V8 引擎是一个比较流行的 JavaScript 引擎示例。V8 引擎是在诸如 Chrome 和 Node.js 等内部使用的。下面是对其机制的一个简化视图：

<img alt="V8 引擎" src={useBaseUrl('img/210319/104028_Z7p2_2896879.png')} />

该引擎包括两个主要组件：
* `Memory Heap` 内存堆 ——  这是内存分配发生的地方
* `Call Stack` 调用堆栈 ——  这是在你代码执行时栈帧存放的位置

## Runtime 运行时
几乎所有的 JavaScript 开发者都使用过浏览器中的 API（例如“setTimeout”）。 但是，这些 API 不是由引擎提供的。那么，它们从哪里来呢？事实证明，实际情况有点复杂。

<img alt="引擎与Web API" src={useBaseUrl('img/210319/104047_yNc9_2896879.png')} />

所以，我们有引擎，但实际上还有更多。我们有那些由浏览器所提供的称为 `Web API` 的东西，比如 `DOM、AJAX、setTimeout` 等等。然后，我们还有非常流行的事件循环和回调队列。

:::note

请区分开来 *JavaScript 引擎* 与 *Web API* ，这样方便理解调用栈与事件循环！

:::

## Call Stack 调用堆栈
`Call Stack` 是一个数据结构，一种栈结构,它用来存储计算机程序执行时候其活跃子程序的信息。它是一种 **LIFO的数据结构** ，将记录代码运行时的执行上下文。当遇到某个函数的调用语句时，它将会记录当前的执行上下文，将函数入栈，并为其创建一个新的执行上下文。（比如什么函数正在执行，什么函数正在被这个函数调用等等信息）。调用栈是解析器的一种机制。

`JavaScript` 是一种单线程编程语言，这意味着它只有一个 *Call Stack* 。主线程在同一时间只能处理一件事。那javascript是如何处理处理函数的调用关系的？答案是——调用栈。

我们来看一个例子。看看下面的代码：

```javascript
function multiply(x, y){
  return x *y;
}
function printSquare(){
  var s = multiply(x, x);
  console.log(s);
}
printSquare(5);
```

当引擎开始执行这个代码时，`Call Stack` 将会变成空的。之后，执行的步骤如下：

<img alt="call stack 运行步骤" src={useBaseUrl('img/210319/104147_KJwy_2896879.png')} />

`Call Stack` 的每个入口被称为 `Stack Frame`（栈帧）。这正是在抛出异常时如何构建 `stack trace` 的方法 - 这基本上是在异常发生时的 `Call Stack` 的状态。看看下面的代码：

```javascript
function foo() {
  throw new Error('SessionStack will help you resolve crashes :)');
}
function bar() {
  foo();
}
function start() {
  bar();
}
start();
```

如果这是在 `Chrome` 中执行的，那么会产生下面的 `stack trace`：

<img alt="stack trace" src={useBaseUrl('img/210319/929CE9B86591.png')} />

**“Blowing the stack”**—当达到最大调用堆栈大小时，会发生这种情况。这可能会很容易发生，特别是如果你使用递归，而不是非常广泛地测试你的代码。看看这个示例代码：

```javascript
function foo() {
  foo();
}
foo();
```

当引擎开始执行这个代码时，它首先调用函数“foo”。然而，这个函数是递归的，并且开始调用自己而没有任何终止条件。所以在执行的每个步骤中，同一个函数会一次又一次地添加到调用堆栈中。它看起来像这样：

<img alt="loop" src={useBaseUrl('img/210319/104326_4B9u_2896879.png')} />

然而，在某些情况下，调用堆栈中函数调用的数量超出了调用堆栈的实际大小，浏览器通过抛出一个错误（如下所示）来决定采取行动：

<img alt="max stack" src={useBaseUrl('img/210319/104350_JCtB_2896879.png')} />

在单线程上运行代码可能非常容易，因为你不必处理多线程环境中出现的复杂场景，例如死锁。但是在单线程上运行也是非常有限的。

由于JavaScript只有一个调用堆栈，所以当事情很慢时会发生什么？浏览器实际上不能做任何事情 - 它被阻塞了。这意味着浏览器无法渲染，它不能运行任何其他代码，它就是被卡住了。如果你想在你的应用程序中使用流畅的 UI ，这就会产生问题。

而且这并不是唯一的问题。一旦你的浏览器开始在 Call Stack 中处理过多的任务，它可能会停止响应相当长的时间。大多数浏览器会通过触发错误来采取行动，询问你是否要终止网页。

<img alt="time out Image" src={useBaseUrl('img/210319/104412_G1jc_2896879.png')} />

## Event Loop 事件循环
JavaScript是一个单线程，它执行的所有代码都放在下面这个Call Stack里面，当Call Stack执行完毕之后，就会再右侧的队列里面找任务，如果有微任务，就会先执行微任务，再去执行宏任务。

<img alt="event loop" src={useBaseUrl('img/210319/e22d7cc116_r.jpg')} />

事件循环：就是同步任务进入主线程，异步任务加入到任务队列中。等主线程的任务执行完就去执行任务队列中的任务，这个过程会不断重复。

1. **所有同步任务都在主线程上执行，形成一个执行栈。**
2. **主线程之外, 存在一个任务队列(task queue), 异步任务有了运行结果会在任务队列之中放置一个任务。**
3. **执行栈中的所有同步任务执行完毕后，读取任务队列(先读取微任务、宏任务)。**

不断重复上面的第三步。js既然是单线程，那么肯定是排队执行代码，怎么去排这个队就是 `Event Loop` ，虽然js是单线程，但是浏览器不是单线程。

```javascript
console.log('script start');
​
setTimeout(function() {
  console.log('timeout1');
}, 10);
​
new Promise(resolve => {
  console.log('promise1');
  resolve();
  setTimeout(() => console.log('timeout2'), 10);
}).then(function() {
  console.log('then1')
})
​
console.log('script end');
​
/*
* script start
* promise1
* script end
* then1
* timeout1
* timeout2
*/
```

## 宏任务 Macro-Task
* setTimeout
* setInterval
* setImmediate
* I/O

特点：由JavaScript线程外的宿主线程执行，比如，定时器触发线程setTimeout、setInterval，异步http请求线程。JavaScript线程不空闲宏任务永远没有执行机会。

```javascript
for(let i=0; i<100000000; i++) {}
​
setTimeout(() => { console.log('setTimeout1'); }, 1000);
​
setTimeout(() => { console.log('setTimeout2'); }, 2000);
```

## 微任务 Micro-Task
* promise
* process.nextTick

特点：由JavaScript线程维护，它的执行时机是在主线程所有可执行代码执行完成后执行，浏览器渲染DOM前会全部执行。

## 扩展与练习题
* [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.cn/post/6844903512845860872)
* [80% 应聘者都不及格的 JS 面试题](https://juejin.cn/post/6844903470466629640)
