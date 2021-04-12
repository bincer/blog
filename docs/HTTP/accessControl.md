---
id: accessControl
title: Access control CORS
sidebar_label: Access control CORS
---

## 跨源HTTP请求

当资源请求来自不同域，协议或端口的资源时，资源会发出跨源HTTP请求。例如：

+ 请求不同域（URL）的**图片** `<img src="https://xxx.xom"> `；
+ 加载不同域的**CSS样式表**；
+ 加载不同域的**脚本**；

:::note
出于安全原因，浏览器限制从脚本内发起的跨源HTTP请求。
:::

例如，` XMLHttpRequest ` 或 `Fetch` 遵循**同源策略**。因此，使用 ` XMLHttpRequest ` 或 `Fetch` 的Web应用程序只能向自己的域发出HTTP请求。为了改进Web应用程序，开发人员要求浏览器供应商允许跨域请求。

跨源资源共享（CORS）机制为Web服务器提供**跨域访问控制**，从而实现安全的跨域数据传输。现代浏览器在API容器中使用CORS（例如XMLHttpRequest或Fetch）来缓解跨源HTTP请求的风险。

这种[跨源共享标准](https://fetch.spec.whatwg.org/#http-cors-protocol)用于为以下项目启用跨站点HTTP请求：
+ 如上所述，以跨站点的方式调用 `XMLHttpRequest 、 Fetch ` API；
+ Web字体（用于@font-faceCSS内的跨域字体使用）；
+ WebGL纹理；
+ 使用绘制到画布的图像/视频帧 drawImage ；
+ 样式表（用于CSSOM访问）；
+ 脚本（用于非静音例外）；

## 总览
跨源资源共享标准的工作原理是 ***添加新的HTTP标头***，允许服务器 **描述允许使用Web浏览器读取该信息的一组原点** 。此外，对于可能对服务器数据产生副作用的HTTP请求方法（特别是针对除特定MIME类型之外的HTTP方法GET或针对POST某些MIME类型使用的HTTP方法）。

规范要求浏览器 ***预检请求***，请求来自服务器与 ` HTTP OPTIONS请求方法 ` ，在从服务器获得“批准”后，使用实际的HTTP请求方法发送实际请求。服务器还可以通知客户端“凭证”（包括Cookie和HTTP认证数据）是否应该随请求一起发送。

### 简单请求
有些请求不会触发CORS预检。不会触发CORS预检的请求是满足以下所有条件的请求：
+ 唯一允许的方法是：
  * GET
  * HEAD
  * POST
+ 除了由用户代理自动设置的标头(Connection、User-Agent)，其允许被手动设置仅标头是[那些Fetch规范将其定义为“CORS安全列表请求标头”](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)，它们是：
  * Accept
  * Accept-Language
  * Content-Language
  * Content-Type（但请注意下面的附加要求）
  * Last-Event-ID
  * DPR
  * Downlink
  * Save-Data
  * Viewport-Width
  * Width
+ Content-Type标题的**唯一允许值**是：
  * application/x-www-form-urlencoded
  * multipart/form-data
  * text/plain
+ 没有事件侦听器 `XMLHttpRequestUpload` 在请求中使用的任何对象上注册。
+ `ReadableStream`请求中没有使用对象。

### 预先请求的请求
与上面讨论的“简单请求”不同，“preflighted”请求首先通过 `OPTIONS方法` 向另一个域上的资源发送HTTP请求，以确定实际请求是否安全发送。跨站请求是这样预检的，因为它们可能会影响用户数据。

特别是，如果满足以下任一条件，则会请求一个请求：
+ 如果请求使用以下任何一种方法：
  * PUT
  * DELETE
  * CONNECT
  * OPTIONS
  * TRACE
  * PATCH
+ **或者，如果**，除了由用户代理自动设置的标头（Connection，User-Agent，或任何与所述抓取规格为“禁止的标题名称”中定义的名称其它头的），该请求包括比其他任何头那些Fetch规范将其定义为“CORS安全列表请求标头”，它们是：
  * Accept
  * Accept-Language
  * Content-Language
  * Content-Type（但请注意下面的附加要求）
  * Last-Event-ID
  * DPR
  * Downlink
  * Save-Data
  * Viewport-Width
  * Width
+ **或者，如果**该Content-Type头具有比其他如下的值：
  * application/x-www-form-urlencoded
  * multipart/form-data
  * text/plain
+ **或者，如果** `XMLHttpRequestUpload` 在请求中使用的对象上注册了一个或多个事件侦听器。
+ **或者如果** `ReadableStream` 请求中使用了对象。