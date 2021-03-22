---
id: primitive
title: 解读 JS 原始数据
sidebar_label: JavaScript 之原始数据
---
import useBaseUrl from '@docusaurus/useBaseUrl';

基本类型（基本数值、基本数据类型）是一种既非对象也无方法的数据。在 JavaScript 中，共有7种基本类型：string，number，bigint，boolean，null，undefined，symbol (ECMAScript 2016新增)。

多数情况下，基本类型直接代表了最底层的语言实现。

所有基本类型的值都是不可改变的。但需要注意的是，基本类型本身和一个赋值为基本类型的变量的区别。变量会被赋予一个新值，而原值不能像数组、对象以及函数那样被改变。