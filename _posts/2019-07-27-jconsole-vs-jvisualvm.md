---
layout: post
title:  "jmap、jconsole 和 jvisualvm介绍"
categories: jvm
tag: 教程
---

在项目开发时遇到一个查询将使后台服务重启的情况，重启原因是OOM，所以想看看是vm的资源分配，看看哪些对象占用了很多内存，导致了OOM。

这里可以使用三种工具来查看jvm的内存情况，jmap、jconsole、jvisualvm等。