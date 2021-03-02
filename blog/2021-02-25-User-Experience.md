---
slug: User-Experience
title: Web 用户体验设计提升
author: Bincer
description: 所谓的用户体验设计，其实是一个比较虚的概念，是秉承着以用户为中心的思想的一种设计手段，以用户需求为目标而进行的设计。
image: /static/img/210225/21022501.png
author_image_url: /static/img/headImg.gif
tags: [exprience]
---
import useBaseUrl from '@docusaurus/useBaseUrl';

<img alt="web用户体验设计提升图片" src={useBaseUrl('img/210225/21022501.png')} />
[超长文章] 本文从页面展示、交互细节、可访问性三个大方面入手，总结归纳实际的开发过程中一些有益的经验。本文来源于掘进博客文章，为多篇文章总结。

<!--truncate-->

## 一、页面展示
无论是PC端，还是移动端，页面都各有不同。这时候，我们要做的就是，在合适的尺寸下做相应的展示。

### PC宽屏
通常对于PC端官网类型而言，大多数设计稿中间的宽度为1200px，两边留白自适应即可。

```html
<div class="container"> <!-- ...... --> </div>
<style>
  .container{ width: 1200px; margin: 0 auto; }
</style>
```

对于PC后台类型而言，更多的用的是全屏，全屏能够显示更多的信息。左右两栏，左侧定宽，右侧自适应剩余宽度，当然，会有一个最小的宽度。那么，它的布局应该是这样：

```html
<div class="container">
  <div class="sidebar"> sidebar(250px) </div>
  <div class="main"> main(flex-grow: 1) </div>
</div>

<style>
  .container {
    display: flex;
    min-width: 1200px;
  }
  .sidebar {
    flex-basis: 250px;
    margin-right: 10px;
  }
  .main {
    flex-grow: 1;
  }
</style>
```
利用了 `flex` 布局下的 `flex-grow: 1`，让 `.main` 进行伸缩，占满剩余空间，利用 `min-width` 保证了整个容器的最小宽度。

当然，这是最基本的自适应布局。对于现代布局，我们应该尽可能的考虑更多的场景。
+ 可伸缩的内容区块
+ 可自由排版的内容区块
+ 适应页面尺寸的边距
+ 能够适应比例变化的图片
+ 能够自动隐藏/部分内容
+ 能自动折叠的导航和菜单
+ ……

### 底部footer
**内容高度 &lt; 视窗高度**，`footer` 固定在视窗底部； **内容高度 &gt; 视窗高度**，`footer` 正常流排版。

实现方式：
```html
<div class="container">
  <div class="content"> Content </div>
  <div class="footer"> Footer </div>
</div>
<style>
  .container{
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
```
[CodePen -- flex 底部实现](https://codepen.io/Aventury/pen/qBqxNzV)

### 动态文本超长处理
对于后端动态返回的数据，有可能会变的很长，所以要考略超长文本情况。
```css
/* 单行文本省略 */
.singleLineText{
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 两行文本省略 */
.twoLinesText{
  width: 200px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

### 动态内容边界处理
按钮文字：如果是动态的，就需要给定一个边界，即 `padding`。
```css
.btn {
  ...
  min-width: 88px;
  padding: 0 16px
}
```
<img alt="Padding边框示意图" src={useBaseUrl('img/210225/k3u1fbpfcp-zoom-1.png')} />

### 0内容展示
页面经常会有列表搜索，列表展示。那么，既然存在有数据的正常情况，当然也会存在搜索不到结果或者列表无内容可展示的情形。
对于这种情况，一定要注意 0 结果页面的设计，同时也要知道，这也是引导用户的好地方。对于 0 结果页面，分清楚：

+ 数据为空：其中又可能包括了用户无权限、搜索无结果、筛选无结果、页面无数据
+ 异常状态：其中又可能包括了网络异常、服务器异常、加载失败等待

不同的情况可能对应不同的 0 结果页面，附带不同的操作引导。

关于 0 结果页面设计，可以详细看看这篇文章：[如何设计产品的空白页面](http://www.woshipm.com/pd/3742114.html)

### 图片相关
图片列表类型的页面，虽然前端和设计约定好了尺寸，可是，运行却不会去遵循这些规则，往往图片要么太大，要么就是太小，模糊掉了，所以，前端在写代码的时候，可以使用 `object-fit: cover` ：
```css
ul li img {
  width: 150px;
  height: 100px;
  object-fit: cover;
}
```
利用 `object-fit: cover`，使图片内容在保持其宽高比的同时填充元素的整个内容框。

`object-fit` 还有一个配套属性 `object-position`，它可以控制图片在其内容框中的位置。（类似于 `background-position`），m默认是 `object-position: 50% 50%`，如果你不希望图片居中展示，可以使用它去改变图片实际展示的 `position` 。

### 考虑屏幕 dpr 响应式
正常情况下，图片的展示应该没有什么问题了。但是对于有图片可展示的情况下，我们还可以做的更好。

在移动端或者一些高清的 PC 屏幕（苹果的 MAC Book），屏幕的 `dpr` 可能大于 1。这种时候，我们可能还需要考虑利用多倍图去适配不同 `dpr` 的屏幕。

正好，`<img>` 标签是有提供相应的属性 `srcset` 让我们进行操作的。
```html
<!-- 旧写法 -->
<img src="photo@1x.png" srcset='photo@1x.png 1x, photo@2x.png 2x, photo@3x.png 3x' />

<!-- 新写法 -->
<img src = "photo.png" 
  sizes = "(min-width: 600px) 600px, 300px" 
  srcset = "photo@1x.png 300w, photo@2x.png 600w, photo@3x.png 1200w"
/>
```
有关于 serset 请参考：[MDN img图像嵌入文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-sizes)


### 图像丢失
当图片链接没问题时，已经处理好了。接下来还需要考虑，当图片链接挂了，应该如何处理。

处理的方式有很多种。最好的处理方式，是我最近在张鑫旭老师的这篇文章中 -- [图片加载失败后CSS样式处理最佳实践](https://www.zhangxinxu.com/wordpress/2020/10/css-style-image-load-fail/) 看到的。这里简单讲下：

1. 利用图片加载失败，触发 `<img>` 元素的 `onerror` 事件，给加载失败的 `<img>` 元素新增一个样式类。
2. 利用新增的样式类，配合 `<img>` 元素的伪元素，展示默认兜底图的同时，还能一起展示 `<img>` 元素的 `alt` 信息。

```html
<img src="test.png" alt="图片内容描述" onerror="this.classList('error');">
```
```css
img.error{
  position: relative;
  display: inline-block;
}

img.error::before{
  content: "";
  /** 定位代码 **/
  background: url(error-default.png);
}

img.error::after{
  content: attr(alt);
  /** 定位代码 **/
}
```
我们利用伪元素 `before` ，加载默认错误兜底图，利用伪元素 `after`，展示图片的 `alt` 信息：
<img alt="图片错误demo" src={useBaseUrl('img/210225/21022816.png')} />

[CodePen -- 图片错误demo](https://codepen.io/Aventury/pen/eYBVvrG)

## 交互设计优化
接下来一个大环节是关于一些交互的细节。对于交互设计，一些比较通用的准则：
+ Don’t make me think
+ 符合用户的习惯与预期
+ 操作便利
+ 做适当的提醒
+ 不强迫用户

### 过渡与动画
在我们的交互过程中，适当的增加过渡与动画，能够很好的让用户感知到页面的变化。譬如我们页面上随处可见 `loading` 效果，其实就是这样一种作用，让用户感知页面正在加载，或者正在处理某些事务。
<img alt="加载动画GIF" src={useBaseUrl('img/210225/21022801.gif')} />

### 滚动优化
滚动也是操作网页中非常重要的一环。看看有哪些可以优化的点：

**滚动平滑：使用 `scroll-behavior: smooth` 让滚动丝滑**，使用 `scroll-behavior: smooth`，可以让滚动框实现平稳的滚动，而不是突兀的跳动。看看效果，假设如下结构：
```html
<div class="g-container">
  <nav>
    <a href="#1">1</a>
    <a href="#2">2</a>
    <a href="#3">3</a>
  </nav>
  <div class="scrolling-box">
    <section id="1">First section</section>
    <section id="2">Second section</section>
    <section id="3">Third section</section>
  </div>
</div>
```

### 控制滚动层级，避免页面大量重排
控制滚动层级的意思是**尽量让需要进行 CSS 动画（可以是元素的动画，也可以是容器的滚动）的元素的 `z-index` 保持在页面最上方，避免浏览器创建不必要的图形层（GraphicsLayer），能够很好的提升渲染性能**。
这一点怎么理解呢，一个元素触发创建一个 Graphics Layer 层的其中一个因素是：

* 元素有一个 `z-index` 较低且包含一个复合层的兄弟元素

根据上述这点，我们对滚动性能进行优化的时候，需要注意两点：
1. 通过生成独立的 `GraphicsLayer`，利用 `GPU` 加速，提升滚动的性能
2. 如果本身滚动没有性能问题，不需要独立的 `GraphicsLayer`，也要注意滚动容器的层级，避免因为层级过高而被其他创建了 `GraphicsLayer` 的元素合并，被动的生成一个 `Graphics Layer` ，影响页面整体的渲染性能。

参考资料连接：[你所不知道的CSS动画技巧与细节](https://github.com/chokcoco/iCSS/issues/27)

### 点击交互优化
在用户点击交互方面，也有一些有意思的小细节。对于不同的内容，最好给与不同的 `cursor` 样式，CSS 原生提供非常多种常用的手势。在不同的场景使用不同的鼠标手势，**符合用户的习惯与预期**，可以很好的提升用户的交互体验。

首先对于按钮，就至少会有 3 种不同的 `cursor`，分别是可点击，不可点击，等待中：
```css
.btn{
  cursor: pointer;    /* 可点击 */
  cursor: not-allowed;    /* 不可点击 */
  cursor: wait;    /* loading */
}
```

<img alt="按钮手势提示" src={useBaseUrl('img/210225/21022802.png')} />

除此之外，还有一些常见的，对于一些可输入的 `Input` 框，使用 `cursor: text`，对于提示 `Tips` 类使用 `cursor: help`，放大缩小图片 `zoom-in、zoom-out` 等等：

<img alt="输入框手势提示" src={useBaseUrl('img/210225/21022803.png')} />

更多详细手势图标：[请参考MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)

### 点击区域优化
按钮是我们网页设计中十分重要的一环，而按钮的设计也与用户体验息息相关。考虑这样一个场景，在摇晃的车厢上或者是单手操作着屏幕，有的时候一个按钮，死活也点不到。
让用户更容易的点击到按钮无疑能很好的增加用户体验及可提升页面的访问性，尤其是在移动端，按钮通常都很小，但是受限于设计稿或者整体 UI 风格，我们不能直接去改变按钮元素的高宽。那么这个时候有什么办法在不改变按钮原本大小的情况下去增加他的点击热区呢？
这里，伪元素也是可以代表其宿主元素来响应的鼠标交互事件的。借助伪元素可以轻松帮我们实现，我们可以这样写：
```css
.btn::befoer{
  content:"";
  position:absolute;
  top:-10px;
  right:-10px;
  bottom:-10px;
  left:-10px;
}
```

### 快速选择优化
操作系统或者浏览器通常会提供一些快速选取文本的功能，看看下面的示意图：
<img alt="快速选择" src={useBaseUrl('img/210225/21022804.gif')} />

[CodePen -- CSS select all demo](https://codepen.io/Aventury/pen/xxRWabg)

### 添加禁止选择
有快速选择，也就会有它的对立面 -- 禁止选择。对于一些可能频繁操作的按钮，可能出现如下尴尬的场景：
+ 文本按钮的快速点击，触发了浏览器的双击快速选择，导致文本被选中：
+ 翻页按钮的快速点击，触发了浏览器的双击快速选择：
对于这种场景，我们需要把不可被选中元素设置为不可被选中，利用 CSS 可以快速的实现这一点：
```css
{
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
```

### 跳转优化
现阶段，单页应用（Single Page Application）的应用非常广泛，`Vue 、React` 等框架大行其道。但是一些常见的写法，也容易衍生一些小问题。
譬如，点击按钮、文本进行路由跳转。譬如，经常会出现这种代码：
```
<template>
  ...
  <button @click="gotoDetail"> Detail </button>
  ...
<template>
...
gotoDetail() {
  this.$router.push({ name: 'xxxxx' });
}
```
大致逻辑就是给按钮添加一个事件，点击之后，跳转到另外一个路由。当然，本身这个功能是没有任何问题的，但是没有考虑到用户实际使用的场景。

实际使用的时候，由于是一个页面跳转，很多时候，用户希望能够保留当前页面的内容，同时打开一个新的窗口，这个时候，他会尝试下的鼠标右键，选择在新标签页中打开页面，遗憾的是，上述的写法是不支持鼠标右键打开新页面的。

原因在于浏览器是通过读取 `<a>` 标签的 `href` 属性，来展示类似在新标签页中打开页面这种选项，对于上述的写法，浏览器是无法识别它是一个可以跳转的链接。简单的示意图如下：

<img alt="A标签跳转示意图" src={useBaseUrl('img/210225/21030102.png')} />

所以，对于所有路由跳转按钮，建议都使用 `<a>` 标签，并且内置 `href` 属性，填写跳转的路由地址。实际渲染出来的 DOM 可能是需要类似这样：
```html
<a href="/xx/detail">Detail</a>
```

### 易用性
易用性也是交互设计中需要考虑的一个非常重要的环节，能做的有非常多。简单的罗列一下：
+ 注意界面元素的一致性，降低用户学习成本
+ 延续用户日常的使用习惯，而不是重新创造
+ 给下拉框增加一些预设值，降低用户填写成本
+ 同类的操作合并在一起，降低用户的认知成本
+ 任何操作之后都要给出反馈，让用户知道操作已经生效

### 先探索，后表态
这一点非常的有意思，什么叫先探索后表态呢？就是我们不要一上来就强迫用户去做一些事情，譬如登录。想一想一些常用网站的例子：
+ 类似虎牙、Bilibili 等视频网站，可以先观看体验，一定观看时间后才会要求登录（登录享受蓝光）
+ 电商网站，只有到付款的时候，才需要登录

更多详细文章请查看：[75 ideas based on intuition](https://goodui.org/)

### 字体优化
字体的选择与使用其实是非常有讲究的。如果网站没有强制必须使用某些字体。最新的规范建议我们更多的去使用系统默认字体。也就是：[CSS Fonts Module Level 4 - Generic font families](https://www.w3.org/TR/css-fonts-4/#generic-font-families)中新增的 `font-family: system-ui` 关键字。

`font-family: system-ui` 能够自动选择本操作系统下的默认系统字体。默认使用特定操作系统的系统字体可以提高性能，因为浏览器或者 `webview` 不必去下载任何字体文件，而是使用已有的字体文件。举两个例子，天猫的字体定义与 Github 的字体定义：
+ 天猫：`font-family: "PingFang SC",miui,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,sans-serif;`
+ Github：`font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;`

简单而言，它们总体遵循了这样一个基本原则：
1. 尽量使用系统默认字体
2. 兼顾中西，西文在前，中文在后
3. 兼顾多操作系统
4. 兼顾旧操作系统，以字体族系列 `serif` 和 `sans-serif` 结尾

## 可访问性（A11Y）
### 色彩对比度
颜色对比度，简单地说，描述就是两种颜色在亮度（Brightness）上的差别。运用到我们的页面上，大多数的情况就是背景色（background-color）与内容颜色（color）的对比差异。所有重要内容的色彩对比度需要达到 4.5:1 或以上（字号大于18号时达到 3:1 或以上），才算拥有较好的可读性。

**检查色彩对比度的工具**：Chrome 浏览器从很早开始，就已经支持检查元素的色彩对比度了。
<img alt="色彩对比" src={useBaseUrl('img/210225/21030201.png')} />

可以看到，绿底白字按钮的色彩对比度是没有达到标准的，也被用黄色的叹号标识了出来。

### 焦点响应
类似百度、谷歌的翻译，进入页面后会默认让输入框获得焦点：
<img alt="百度翻译" src={useBaseUrl('img/210225/21030202.png')} />

并非所有的有输入框的页面，都需要进入页面后进行聚焦，但是焦点能够让用户非常明确的知道，当前自己在哪，需要做些什么。尤其是对于无法操作鼠标的用户。

页面上可以聚焦的元素，称为可聚焦元素，获得焦点的元素，则会触发该元素的 focus 事件，对应的，也就会触发该元素的 :focus 伪类。
浏览器通常会使用元素的 :focus 伪类，给元素添加一层边框，告诉用户，当前的获焦元素在哪里。

我们可以通过键盘的 Tab 键，进行焦点的切换，而获焦元素则可以通过元素的 :focus 伪类的样式，告诉用户当前焦点位置。