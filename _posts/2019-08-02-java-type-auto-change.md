---
layout: post
title:  "java变量自动转化"
categories: java
---

多个类型在一起操作时，会有类型自动转化过程，转化规则为精度低的类型转为精度高的类型，这样不会损失精度

1. byte 1字节
2. char 2字节
3. int 4字节
4. long 8字节
5. float 4字节
6. double 8字节

| 操作数1类型                         | 操作数2类型 | 转换后的类型 |
| ----------------------------------- | ----------- | ------------ |
| byte、short、char                   | int         | int          |
| byte、short、char、int              | long        | long         |
| byte、short、char、int、long        | float       | float        |
| byte、short、char、int、long、float | double      | double       |

