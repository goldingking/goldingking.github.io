---
layout: post
title:  "对象的序列化"
category: java
---

序列化对象是指要么将对象序列化成二进制文件，也可以通过json的类库将一个对象序列化成json字符串；如果要使用jdk的方式序列化成二进制文件，类必须是实现serializable接口，声明自己可以被序列化；如果要序列化成字符串则需要依赖于一些类库比如jackson等的支持；jdk的序列化和反序列化过程可以通过覆写readObject、writeObject来复写影响默认的序列化行为；默认的序列化不能序列化静态对象，可以给变量加transeint来阻止序列化某个字段。