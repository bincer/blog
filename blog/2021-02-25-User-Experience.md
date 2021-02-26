---
slug: User-Experience
title: Web 用户体验设计提升
author: Bincer
description: 所谓的用户体验设计，其实是一个比较虚的概念，是秉承着以用户为中心的思想的一种设计手段，以用户需求为目标而进行的设计。
image: /static/img/210225/21022501.png
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
<div class="container">

  <!-- ...... -->
</div>
<style>
  .container{
    width: 1200px;
    margin: 0 auto;
  }
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
利用了 flex 布局下的 flex-grow: 1，让 .main 进行伸缩，占满剩余空间，利用 min-width 保证了整个容器的最小宽度。

当然，这是最基本的自适应布局。对于现代布局，我们应该尽可能的考虑更多的场景。
+ 可伸缩的内容区块
+ 可自由排版的内容区块
+ 适应页面尺寸的边距
+ 能够适应比例变化的图片
+ 能够自动隐藏/部分内容
+ 能自动折叠的导航和菜单
+ ……

### 底部footer
**内容高度 &lt; 视窗高度**，footer固定在视窗底部； **内容高度 &gt; 视窗高度**，footer 正常流排版。

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
按钮文字：如果是动态的，就需要给定一个边界，即 padding。
```css
.btn {
  ...
  min-width: 88px;
  padding: 0 16px
}
```
<img alt="" src={useBaseUrl('img/210225/k3u1fbpfcp-zoom-1.png')} />

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

在移动端或者一些高清的 PC 屏幕（苹果的 MAC Book），屏幕的 dpr 可能大于 1。这种时候，我们可能还需要考虑利用多倍图去适配不同 dpr 的屏幕。

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
我们利用伪元素 before ，加载默认错误兜底图，利用伪元素 after，展示图片的 alt 信息：
