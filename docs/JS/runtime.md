---
id: runtime
title: 解读 JavaScript 之引擎、运行时和堆栈调用
sidebar_label: JavaScript 之引擎
---
import useBaseUrl from '@docusaurus/useBaseUrl';

## JavaScript 引擎
`Google V8` 引擎是一个比较流行的 `JavaScript` 引擎示例。V8 引擎是在诸如 `Chrome` 和 `Node.js` 等内部使用的。下面是对其机制的一个简化视图：

<img alt="V8 引擎" src={useBaseUrl('img/210319/104028_Z7p2_2896879.png')} />

该引擎包括两个主要组件：
* `Memory Heap` 内存堆 ——  这是内存分配发生的地方
* `Call Stack` 调用堆栈 ——  这是在你代码执行时栈帧存放的位置

## Runtime 运行时
几乎所有的 `JavaScript` 开发者都使用过浏览器中的 `API`（例如“setTimeout”）。 但是，这些 `API` 不是由引擎提供的。那么，它们从哪里来呢？

事实证明，实际情况有点复杂。

<img alt="引擎与Web API" src={useBaseUrl('img/210319/104047_yNc9_2896879.png')} />

所以，我们有引擎，但实际上还有更多。我们有那些由浏览器所提供的称为 `Web API` 的东西，比如 `DOM、AJAX、setTimeout` 等等。然后，我们还有非常流行的事件循环和回调队列。

## Call Stack 调用堆栈
`JavaScript` 是一种单线程编程语言，这意味着它只有一个 `Call Stack` 。因此，它一次仅能做一件事。

`Call Stack` 是一个数据结构，它基本上记录了我们在程序中的所处的位置。如果我们进入一个函数，我们把它放在堆栈的顶部。如果我们从一个函数中返回，我们弹出堆栈的顶部。这是所有的堆栈可以做的东西。

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

<img alt="stack trace" src={useBaseUrl('img/210319/104326_4B9u_2896879.png')} />

然而，在某些情况下，调用堆栈中函数调用的数量超出了调用堆栈的实际大小，浏览器通过抛出一个错误（如下所示）来决定采取行动：

<img alt="stack trace" src={useBaseUrl('img/210319/104350_JCtB_2896879.png')} />

在单线程上运行代码可能非常容易，因为你不必处理多线程环境中出现的复杂场景，例如死锁。但是在单线程上运行也是非常有限的。由于JavaScript只有一个调用堆栈，所以当事情很慢时会发生什么？

