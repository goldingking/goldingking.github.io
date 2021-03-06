---
layout: post
title:  "享元模式"
category: java
tag: design patterns
---

享元及共享元素，有些场景下对象的创建可能非常多，大大消耗内存的使用，这个时候就该考虑对象的复用，也是享元模式出场的时机。

在设计模式书中使用编辑器中字符对象来举例子，如果一个文档中每个字符都创建一个对象的话，一个文档会创建特别多的字符对象，这时候可以优化成每个类型的字符创建一个对象，同类型的字符共享使用这个对象，将对象的外部属性，这里感觉是对象的公共属性，比如字符的大小，位置等抽成外部状态，非公共属性作为字符对象的内部对象，比如字符编码，在渲染对象时将公共属性传递给字符对象进行渲染。